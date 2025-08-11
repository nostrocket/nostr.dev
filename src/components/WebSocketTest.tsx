'use client';

import { useState } from 'react';

interface NostrEvent {
  id: string;
  kind: number;
  pubkey: string;
  created_at: number;
  content: string;
  tags: string[][];
  sig: string;
}

export function WebSocketTest() {
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [relayUrl, setRelayUrl] = useState('wss://pyramid.fiatjaf.com');

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const fetchEventsSimple = async () => {
    setIsConnecting(true);
    setEvents([]);
    setLogs([]);
    addLog(`🔍 Connecting to ${relayUrl}...`);
    
    const ws = new WebSocket(relayUrl);
    const receivedEvents: NostrEvent[] = [];
    
    return new Promise<NostrEvent[]>((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        addLog(`⏰ Timeout after 30 seconds`);
        setIsConnecting(false);
        resolve(receivedEvents);
      }, 30000);
      
      ws.onopen = () => {
        addLog('✅ WebSocket connected');
        
        // Send a simple REQ message to get recent events
        const reqMessage = [
          "REQ",
          "test-sub", 
          { "limit": 10 }
        ];
        
        addLog(`📤 Sending request: ${JSON.stringify(reqMessage)}`);
        ws.send(JSON.stringify(reqMessage));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          addLog(`📥 Received: ${message[0]}`);
          
          if (message[0] === 'EVENT') {
            const nostrEvent = message[2] as NostrEvent;
            addLog(`📩 Event: kind ${nostrEvent.kind}, id ${nostrEvent.id.substring(0, 8)}...`);
            receivedEvents.push(nostrEvent);
            setEvents([...receivedEvents]);
          } else if (message[0] === 'EOSE') {
            addLog('🏁 End of stored events');
            clearTimeout(timeout);
            ws.close();
            setIsConnecting(false);
            resolve(receivedEvents);
          }
        } catch (error) {
          addLog(`❌ Error parsing message: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      
      ws.onerror = (error) => {
        addLog(`❌ WebSocket error: ${error}`);
        clearTimeout(timeout);
        setIsConnecting(false);
        reject(error);
      };
      
      ws.onclose = () => {
        addLog('🔌 WebSocket closed');
        clearTimeout(timeout);
        setIsConnecting(false);
        resolve(receivedEvents);
      };
    });
  };

  const handleTest = async () => {
    try {
      const fetchedEvents = await fetchEventsSimple();
      addLog(`🎉 Successfully fetched ${fetchedEvents.length} events`);
    } catch (error) {
      addLog(`❌ Script failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          WebSocket Test
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Test basic WebSocket connection to Nostr relays without any libraries.
        </p>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={relayUrl}
            onChange={(e) => setRelayUrl(e.target.value)}
            placeholder="Relay URL"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleTest}
            disabled={isConnecting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Test Connection'}
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Connection Log
        </h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">Click &quot;Test Connection&quot; to start...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Events */}
      {events.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Received Events ({events.length})
          </h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={event.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Kind {event.kind}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {event.id.substring(0, 16)}...
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Content:</strong> {event.content ? event.content.substring(0, 200) + (event.content.length > 200 ? '...' : '') : '(empty)'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Created:</strong> {new Date(event.created_at * 1000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}