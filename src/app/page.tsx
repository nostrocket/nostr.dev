'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { MainContent } from '@/components/MainContent'
import { SearchBar } from '@/components/SearchBar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ExternalLink } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [selectedKind, setSelectedKind] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        flex flex-col w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        lg:relative lg:translate-x-0
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Nostr Event Kinds
            </h1>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/nostrocket/nostr.dev/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Report
                <ExternalLink className="h-3 w-3" />
                <span className="ml-1 px-1 py-0.5 text-xs bg-green-500 text-white rounded">new</span>
              </a>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-gray-500 dark:text-gray-400">✕</span>
              </button>
            </div>
          </div>
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>
        <Sidebar 
          selectedKind={selectedKind}
          onKindSelect={(kind) => {
            // Navigate to the specific kind URL
            router.push(`/${kind}`)
            setSidebarOpen(false) // Close sidebar on mobile after selection
          }}
          searchQuery={searchQuery}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="text-gray-700 dark:text-gray-300">☰</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedKind !== null ? `Kind ${selectedKind}` : 'Nostr Reference'}
          </h2>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/nostrocket/nostr.dev/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Report
              <ExternalLink className="h-3 w-3" />
              <span className="ml-1 px-1 py-0.5 text-xs bg-green-500 text-white rounded">new</span>
            </a>
            <div className="block lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        <MainContent selectedKind={selectedKind} />
      </div>
    </div>
  )
}