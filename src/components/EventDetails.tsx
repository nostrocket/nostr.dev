import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { EventKind } from '@/types';
import { getLibraryExamples } from '@/data/libraryExamples';
import { useNostrEvents } from '@/hooks/useNostrEvents';
import { CodeBlock } from './CodeBlock';

interface EventDetailsProps {
  eventKind: EventKind;
}

export function EventDetails({ eventKind }: EventDetailsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const libraryExamples = getLibraryExamples(eventKind.kind);
  const { events: liveEvents, isLoading, error, fetchEvents } = useNostrEvents();

  useEffect(() => {
    // Fetch events for this kind when component mounts
    fetchEvents(eventKind.kind);
  }, [eventKind.kind, fetchEvents]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getCategoryColor = (category: EventKind['category']) => {
    switch (category) {
      case 'regular': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'replaceable': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'ephemeral': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      case 'addressable': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="p-4 lg:p-6 w-full max-w-full min-w-0">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 break-words">
                Kind {eventKind.kind}: {eventKind.name}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border self-start ${getCategoryColor(eventKind.category)}`}>
                {eventKind.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg break-words">
              {eventKind.description}
            </p>
          </div>
        </div>
        
        {eventKind.nip && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Specification:</span>
            <a 
              href={`https://github.com/nostr-protocol/nips/blob/master/${eventKind.nip.toLowerCase().replace('nip-', '').padStart(2, '0')}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline break-words"
            >
              {eventKind.nip}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Tags */}
      {eventKind.tags && eventKind.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Tags</h3>
          <div className="space-y-2">
            {eventKind.tags.map((tag, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <code className="bg-white px-2 py-1 rounded text-sm font-mono border">
                  {tag.name}
                </code>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{tag.description}</p>
                  {tag.required && (
                    <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Examples */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Live Examples from Nostr Relays
          </h3>
          <button
            onClick={() => fetchEvents(eventKind.kind)}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded px-3 py-1.5 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Fetching...' : 'Refresh'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Fetching live events from relays...
            </div>
          </div>
        ) : error ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <div className="text-4xl text-gray-300 dark:text-gray-600 mb-3">⚠️</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {error}
            </p>
            <button
              onClick={() => fetchEvents(eventKind.kind)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : liveEvents.length > 0 ? (
          <div className="space-y-4">
            {liveEvents.map((event, index) => (
              <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Live Example {index + 1}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(event.created_at * 1000).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(event, null, 2), `live-event-${event.id}`)}
                    className="inline-flex items-center gap-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copiedId === `live-event-${event.id}` ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy JSON
                      </>
                    )}
                  </button>
                </div>
                <div className="overflow-hidden min-w-0">
                  <CodeBlock 
                    code={JSON.stringify(event, null, 2)} 
                    language="json"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <div className="text-4xl text-gray-300 dark:text-gray-600 mb-3">📡</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              No recent events of kind {eventKind.kind} found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
              This event kind may be rare or not currently active on the relays
            </p>
            <button
              onClick={() => fetchEvents(eventKind.kind)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Try fetching again
            </button>
          </div>
        )}
      </div>

      {/* Library Examples */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Library Usage Examples
        </h3>
        <div className="space-y-4">
          {libraryExamples.map((example, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {example.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {example.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {example.library}
                    </span>
                    <button
                      onClick={() => handleCopy(example.code, `lib-${index}`)}
                      className="inline-flex items-center gap-1 text-xs bg-white border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
                    >
                      {copiedId === `lib-${index}` ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden min-w-0">
                <CodeBlock 
                  code={example.code} 
                  language="javascript"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          💡 This reference uses real event examples and provides practical code snippets 
          for building Nostr applications. All examples are anonymized for privacy.
        </p>
      </div>
    </div>
  );
}