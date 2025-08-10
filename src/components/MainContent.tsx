import { useEffect, useState } from 'react';
import { EventKind } from '@/types';
import { getEventKind } from '@/lib/eventData';
import { EventDetails } from './EventDetails';

interface MainContentProps {
  selectedKind: number | null;
}

export function MainContent({ selectedKind }: MainContentProps) {
  const [eventKind, setEventKind] = useState<EventKind | null>(null);

  useEffect(() => {
    if (selectedKind !== null) {
      const kind = getEventKind(selectedKind);
      setEventKind(kind);
    } else {
      setEventKind(null);
    }
  }, [selectedKind]);

  if (!eventKind) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Nostr Event Kinds Reference
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Select an event kind from the sidebar to view detailed information, 
            real-world examples, and library usage code.
          </p>
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>✨ Real examples from nostr relays</p>
            <p>🔍 Searchable by kind number, name, or description</p>
            <p>📚 Code examples for nostr-tools and NDK</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <EventDetails eventKind={eventKind} />
    </div>
  );
}