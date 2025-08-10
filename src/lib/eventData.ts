import { EventKind, NostrEvent } from '@/types';
import { eventKinds } from '@/data/eventKinds';
import { eventsData } from '@/data/eventsData';

export function getAllEventKinds(): EventKind[] {
  return eventKinds.map(kind => ({
    ...kind,
    examples: (eventsData[kind.kind.toString() as keyof typeof eventsData] || []) as NostrEvent[]
  }));
}

export function getEventKind(kind: number): EventKind | null {
  const eventKind = eventKinds.find(k => k.kind === kind);
  if (!eventKind) return null;
  
  return {
    ...eventKind,
    examples: (eventsData[kind.toString() as keyof typeof eventsData] || []) as NostrEvent[]
  };
}

export function searchEventKinds(query: string): EventKind[] {
  const allKinds = getAllEventKinds();
  
  if (!query.trim()) return allKinds;
  
  const searchTerm = query.toLowerCase();
  
  return allKinds.filter(kind => 
    kind.name.toLowerCase().includes(searchTerm) ||
    kind.description.toLowerCase().includes(searchTerm) ||
    kind.kind.toString().includes(searchTerm) ||
    (kind.nip && kind.nip.toLowerCase().includes(searchTerm))
  );
}