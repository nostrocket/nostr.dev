import { useEffect, useState } from 'react';
import Link from 'next/link';
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
        <div className="text-center max-w-2xl px-4">
          <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Nostr Event Kinds Reference
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Select an event kind from the sidebar to view detailed information, 
            real-world examples, and library usage code.
          </p>

          {/* AI Instructions Alert */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🤖</span>
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">For AI Agents</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              <strong>This application provides machine-readable Nostr protocol documentation.</strong>
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div>📁 <strong>AI Reference:</strong> <code>/ai-reference</code> page with complete documentation</div>
              <div>📋 <strong>JSON Data:</strong> <code>src/data/ai-documentation.json</code></div>
              <div>⚡ <strong>Functions:</strong> <code>getEventByKind()</code>, <code>searchEventsByUsage()</code>, <code>validateEventStructure()</code></div>
            </div>
            <div className="mt-3">
              <Link 
                href="/ai-reference" 
                className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Access AI Reference →
              </Link>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 space-y-1">
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