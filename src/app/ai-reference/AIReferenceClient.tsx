'use client'

import { aiEventReference, getAllImplementationNotes, getCommonGotchas } from '@/data/ai-event-reference'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function AIReferenceClient() {
  const allNotes = getAllImplementationNotes()
  const allGotchas = getCommonGotchas()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event Kinds
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            AI Reference - Nostr Event Kinds
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Machine-readable documentation for AI agents to understand and implement Nostr event kinds.
          </p>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              JSON Data Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download complete event reference as JSON
            </p>
            <button 
              onClick={() => {
                const dataStr = JSON.stringify(aiEventReference, null, 2)
                const dataBlob = new Blob([dataStr], {type: 'application/json'})
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'nostr-event-reference.json'
                link.click()
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Download JSON
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Statistics
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>Total Event Kinds: {aiEventReference.length}</div>
              <div>Regular Events: {aiEventReference.filter(e => e.category === 'regular').length}</div>
              <div>Replaceable Events: {aiEventReference.filter(e => e.category === 'replaceable').length}</div>
              <div>Addressable Events: {aiEventReference.filter(e => e.category === 'addressable').length}</div>
              <div>Ephemeral Events: {aiEventReference.filter(e => e.category === 'ephemeral').length}</div>
            </div>
          </div>
        </div>

        {/* Event Reference Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Complete Event Reference
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kind
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    NIP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {aiEventReference.map((event) => (
                  <tr key={event.kind} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-100">
                      {event.kind}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.category === 'regular' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        event.category === 'replaceable' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        event.category === 'ephemeral' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-md">
                      {event.summary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                      {event.nip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Implementation Notes
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allNotes.slice(0, 10).map((note) => (
                <div key={note.kind} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Kind {note.kind}: {note.name}
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {note.notes.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Common Gotchas
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allGotchas.slice(0, 10).map((gotcha) => (
                <div key={gotcha.kind} className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Kind {gotcha.kind}: {gotcha.name}
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {gotcha.gotchas.map((item, index) => (
                      <li key={index}>⚠️ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
