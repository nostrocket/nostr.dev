'use client';

import { useState, useEffect } from 'react';
import { aiEventReference, getEventByKind, searchEventsByUsage, getEventsByCategory } from '@/data/ai-event-reference';
import { getEventImplementationGuide, getAllImplementationNotes, getAllCommonGotchas } from '@/lib/eventData';

export default function AIReferencePage() {
  const [selectedKind, setSelectedKind] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchEventsByUsage(searchQuery);
      setSearchResults(results);
    }
  };

  const eventRef = getEventByKind(selectedKind);
  const guide = getEventImplementationGuide(selectedKind);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">AI-Accessible Nostr Event Reference</h1>
        <p className="text-gray-600 mt-2">Machine-readable Nostr protocol documentation for AI agents and developers</p>
      </div>

      {/* AI Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">🤖 For AI Agents</h2>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>This page provides comprehensive, machine-readable Nostr event documentation.</strong></p>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div>
              <h3 className="font-medium">📁 Direct File Access:</h3>
              <ul className="text-xs space-y-1 mt-1">
                <li>• <code>src/data/ai-documentation.json</code> - Complete JSON reference</li>
                <li>• <code>src/data/ai-event-reference.ts</code> - TypeScript with examples</li>
                <li>• <code>src/lib/eventData.ts</code> - Query and validation functions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">🔧 Key Functions:</h3>
              <ul className="text-xs space-y-1 mt-1">
                <li>• <code>getEventByKind(kind)</code> - Get event specification</li>
                <li>• <code>searchEventsByUsage(query)</code> - Find by use case</li>
                <li>• <code>validateEventStructure(event)</code> - Validate before publishing</li>
                <li>• <code>getEventImplementationGuide(kind)</code> - Complete guide</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-100 p-2 rounded mt-3">
            <strong>Quick Start for AI:</strong> Use the search below to find events by use case (e.g., "profile", "messaging", "social media"), then view implementation details with working code examples.
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{aiEventReference.length}</div>
            <div className="text-sm text-gray-600">AI Event Types</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{getEventsByCategory('replaceable').length}</div>
            <div className="text-sm text-gray-600">Replaceable</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{getEventsByCategory('addressable').length}</div>
            <div className="text-sm text-gray-600">Addressable</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{getAllImplementationNotes().length}</div>
            <div className="text-sm text-gray-600">Implementation Guides</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Search Events by Use Case</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g., profile, messaging, social media..."
            className="flex-1 px-3 py-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Search Results:</h3>
            {searchResults.map((result) => (
              <div key={result.kind} className="p-2 bg-gray-50 rounded">
                <strong>Kind {result.kind}: {result.name}</strong>
                <p className="text-sm text-gray-600">{result.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Kind Selector */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Explore Event Kinds</h2>
        <select
          value={selectedKind}
          onChange={(e) => setSelectedKind(parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded mb-4"
        >
          {aiEventReference.map((ref) => (
            <option key={ref.kind} value={ref.kind}>
              Kind {ref.kind}: {ref.name}
            </option>
          ))}
        </select>

        {eventRef && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{eventRef.name} (Kind {eventRef.kind})</h3>
              <p className="text-gray-600 mb-2">{eventRef.summary}</p>
              <div className="text-sm text-blue-600">NIP: {eventRef.nip} | Category: {eventRef.category}</div>
            </div>

            <div>
              <h4 className="font-medium">Use Cases:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {eventRef.useCases.map((useCase, i) => (
                  <li key={i}>{useCase}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Implementation Notes:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {eventRef.implementationNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Common Gotchas:</h4>
              <ul className="list-disc list-inside text-sm text-red-600">
                {eventRef.commonGotchas.map((gotcha, i) => (
                  <li key={i}>{gotcha}</li>
                ))}
              </ul>
            </div>

            {eventRef.requiredTags?.length > 0 && (
              <div>
                <h4 className="font-medium">Required Tags:</h4>
                {eventRef.requiredTags.map((tag, i) => (
                  <div key={i} className="bg-red-50 p-2 rounded mt-1">
                    <strong>{tag.name}</strong>: {tag.description}
                    {tag.examples && (
                      <div className="text-xs text-gray-600 mt-1">
                        Examples: {tag.examples.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {eventRef.optionalTags?.length > 0 && (
              <div>
                <h4 className="font-medium">Optional Tags:</h4>
                {eventRef.optionalTags.map((tag, i) => (
                  <div key={i} className="bg-blue-50 p-2 rounded mt-1">
                    <strong>{tag.name}</strong>: {tag.description}
                    {tag.examples && (
                      <div className="text-xs text-gray-600 mt-1">
                        Examples: {tag.examples.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {eventRef.basicExample && (
              <div>
                <h4 className="font-medium">Code Example ({eventRef.basicExample.library}):</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
                  <code>{eventRef.basicExample.code}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Machine-Readable Access Guide */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">🤖 AI Agent Access Guide</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-green-700 mb-2">📋 Quick Reference Data</h3>
            <div className="bg-green-50 p-3 rounded text-sm">
              <div><strong>JSON Documentation:</strong></div>
              <code className="text-xs bg-white p-1 rounded">src/data/ai-documentation.json</code>
              <div className="mt-2 text-xs text-green-600">
                Contains complete machine-readable reference with event schemas, implementation guides, 
                troubleshooting, and best practices.
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-purple-700 mb-2">⚡ Live Functions</h3>
            <div className="bg-purple-50 p-3 rounded text-sm">
              <div><strong>TypeScript Imports:</strong></div>
              <code className="text-xs bg-white p-1 rounded block mb-1">
                import &#123; getEventByKind, searchEventsByUsage &#125; from '@/data/ai-event-reference'
              </code>
              <div className="text-xs text-purple-600">
                Use these functions for dynamic queries, validation, and implementation guidance.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-3">🎯 AI Implementation Workflow</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border-l-4 border-blue-400">
              <div className="font-medium text-blue-700">1. Discover</div>
              <div className="text-xs text-gray-600 mt-1">
                Use <code>searchEventsByUsage("social media")</code> to find relevant event kinds
              </div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-yellow-400">
              <div className="font-medium text-yellow-700">2. Learn</div>
              <div className="text-xs text-gray-600 mt-1">
                Get complete specs with <code>getEventByKind(1)</code> including gotchas and examples
              </div>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-green-400">
              <div className="font-medium text-green-700">3. Validate</div>
              <div className="text-xs text-gray-600 mt-1">
                Use <code>validateEventStructure(event)</code> before publishing to catch errors
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
          <div className="text-sm">
            <strong className="text-yellow-800">💡 Pro Tip for AI Agents:</strong>
            <div className="text-yellow-700 text-xs mt-1">
              Always check the <code>commonGotchas</code> and <code>implementationNotes</code> fields 
              before implementing any event kind. This prevents common mistakes and ensures proper Nostr compliance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}