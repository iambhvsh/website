'use client'

import React, { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import { SearchResult } from '../../lib/projects'
import Spinner from '../components/Spinner'

type FilterType = 'all' | 'page' | 'post' | 'project' | 'link'

export default function Search() {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)
  const [allResults, setAllResults] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch('/api/search')
      const data = await res.json()
      setAllResults(data.results)
      setFilteredResults(data.results)
      setIsLoading(false)
    }
    fetchResults()
  }, [])

  useEffect(() => {
    let results = allResults
    
    // Apply type filter
    if (activeFilter !== 'all') {
      results = results.filter(result => {
        switch (activeFilter) {
          case 'post': return result.type === 'blog'
          case 'link': return result.type === 'social'
          default: return result.type === activeFilter
        }
      })
    }

    // Apply search filter
    if (debouncedQuery) {
      const searchTerms = debouncedQuery.toLowerCase().split(' ')
      results = results.filter(result => {
        const searchString = `${result.title} ${result.description || ''} ${result.tags?.join(' ') || ''}`
          .toLowerCase()
        return searchTerms.every(term => searchString.includes(term))
      })
    }

    setFilteredResults(results)
  }, [debouncedQuery, allResults, activeFilter])

  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'All' },
    { type: 'page', label: 'Pages' },
    { type: 'post', label: 'Posts' },
    { type: 'project', label: 'Projects' }
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
      <div className="mb-12">
        <h1 className="text-4xl text-white font-bold my-8">Search</h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across posts, projects and links..."
            className="w-full px-4 py-3 pl-12 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-all whitespace-nowrap ${
              activeFilter === type
                ? 'border-blue-500/50 text-blue-400 font-medium'
                : 'border-zinc-800 text-gray-400 hover:border-zinc-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {filteredResults.map((result) => (
            <Link
              key={result.id}
              href={result.url}
              className="block group py-6 first:pt-0 last:pb-0"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {result.type === 'blog' ? 'Post' : result.type}
                  </span>
                </div>
                <h3 className="text-lg text-white font-medium group-hover:text-blue-400 transition-colors">
                  {result.title}
                </h3>
                {result.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {result.description}
                  </p>
                )}
                {result.tags && result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.tags.map(tag => (
                      <span key={tag} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}

          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

