'use client';

import { useState, useEffect, useCallback } from 'react';

interface NostrEvent {
  id: string;
  kind: number;
  pubkey: string;
  created_at: number;
  content: string;
  tags: string[][];
  sig: string;
}

interface UseNostrEventsResult {
  events: NostrEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: (kind: number) => void;
  clearEvents: () => void;
}

const DEFAULT_RELAYS = [
  'wss://pyramid.fiatjaf.com',
  'wss://relay.damus.io',
  'wss://nos.lol'
];

export function useNostrEvents(): UseNostrEventsResult {
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setError(null);
  }, []);

  const fetchEventsFromRelay = useCallback(async (relayUrl: string, kind: number): Promise<NostrEvent[]> => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(relayUrl);
      const receivedEvents: NostrEvent[] = [];
      
      const timeout = setTimeout(() => {
        ws.close();
        resolve(receivedEvents);
      }, 15000); // 15 second timeout per relay
      
      ws.onopen = () => {
        // Request recent events of the specific kind
        const reqMessage = [
          "REQ",
          `kind-${kind}-${Date.now()}`,
          {
            kinds: [kind],
            limit: 3,
            since: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60) // Last 7 days
          }
        ];
        
        ws.send(JSON.stringify(reqMessage));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message[0] === 'EVENT') {
            const nostrEvent = message[2] as NostrEvent;
            if (nostrEvent.kind === kind) {
              receivedEvents.push(nostrEvent);
            }
          } else if (message[0] === 'EOSE') {
            clearTimeout(timeout);
            ws.close();
            resolve(receivedEvents);
          }
        } catch (error) {
          // Ignore parsing errors
        }
      };
      
      ws.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to connect to ${relayUrl}`));
      };
      
      ws.onclose = () => {
        clearTimeout(timeout);
        resolve(receivedEvents);
      };
    });
  }, []);

  const fetchEvents = useCallback(async (kind: number) => {
    setIsLoading(true);
    setError(null);
    setEvents([]);
    
    try {
      // Try to fetch from multiple relays concurrently
      const relayPromises = DEFAULT_RELAYS.map(relay => 
        fetchEventsFromRelay(relay, kind).catch(() => [])
      );
      
      const results = await Promise.all(relayPromises);
      const allEvents = results.flat();
      
      if (allEvents.length === 0) {
        setError(`No recent events of kind ${kind} found on relays`);
      } else {
        // Remove duplicates and sort by created_at (newest first)
        const uniqueEvents = allEvents
          .filter((event, index, self) => 
            self.findIndex(e => e.id === event.id) === index
          )
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 3); // Keep only top 3
        
        setEvents(uniqueEvents);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  }, [fetchEventsFromRelay]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    clearEvents
  };
}