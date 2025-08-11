import { useEffect, useState } from 'react';
import { EventKind } from '@/types';
import { searchEventKinds } from '@/lib/eventData';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  selectedKind: number | null;
  onKindSelect: (kind: number) => void;
  searchQuery: string;
}

export function Sidebar({ selectedKind, onKindSelect, searchQuery }: SidebarProps) {
  const [eventKinds, setEventKinds] = useState<EventKind[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const kinds = searchEventKinds(searchQuery);
    setEventKinds(kinds);
    setLoading(false);
  }, [searchQuery]);

  const getCategoryColor = (category: EventKind['category']) => {
    switch (category) {
      case 'regular': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'replaceable': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'ephemeral': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'addressable': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Report Menu Item */}
        <div className="p-3 border-b-2 border-gray-300 dark:border-gray-600">
          <a
            href="https://github.com/nostrocket/nostr.dev/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Report an issue or suggest a feature
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-500 text-white">
                new
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
        </div>

        {/* Access AI Reference Button */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/ai-reference"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded transition-colors font-semibold text-sm"
          >
            Access AI Reference
          </Link>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 animate-pulse">
            <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-blue-400 border-t-transparent animate-spin align-middle"></span>
            Loading event kinds...
          </div>
        )}

        {/* Event Kinds List */}
        {!loading && eventKinds.map((kind) => (
          <div
            key={kind.kind}
            className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedKind === kind.kind ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
            }`}
            onClick={() => onKindSelect(kind.kind)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                    {kind.kind}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(kind.category)}`}>
                    {kind.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {kind.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {kind.description}
                </p>
                {kind.nip && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {kind.nip}
                  </p>
                )}
              </div>
            </div>
            {kind.examples && kind.examples.length > 0 && (
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {kind.examples.length} example{kind.examples.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}

        {/* No Results Message */}
        {!loading && eventKinds.length === 0 && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p>No event kinds found</p>
            <p className="text-xs mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}