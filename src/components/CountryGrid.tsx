import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CountryCard } from './CountryCard'
import { SearchBar } from './SearchBar'
import { RegionFilter } from './RegionFilter'
import { countryService, type Country } from '@/lib/api/countryService'

const ITEMS_PER_PAGE = 20

export function CountryGrid() {
  const [allCountries, setAllCountries] = useState<Country[]>([]) // Store all fetched countries
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]) // Store filtered countries
  const [visibleCountries, setVisibleCountries] = useState<Country[]>([]) // Store currently visible countries
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [page, setPage] = useState(1) // Track current page for infinite scroll
  const [hasMore, setHasMore] = useState(true) // Track if more countries can be loaded
  const [isLoadingMore, setIsLoadingMore] = useState(false) // Track loading state for infinite scroll

  const observer = useRef<IntersectionObserver | null>(null)

  // Callback ref for the last element to trigger loading more
  const lastCountryElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || isLoadingMore) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, isLoadingMore, hasMore])

  // Initial fetch of all countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await countryService.getAllCountries()
        setAllCountries(data)
      } catch (err) {
        setError('Failed to load countries. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Filter countries based on search term and region
  useEffect(() => {
    let result = allCountries

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(country => 
        country.name.common.toLowerCase().includes(term) ||
        country.name.official.toLowerCase().includes(term) ||
        (country.capital && country.capital.some(cap => cap.toLowerCase().includes(term)))
      )
    }

    if (selectedRegion && selectedRegion !== 'All') {
      result = result.filter(country => country.region === selectedRegion)
    }

    setFilteredCountries(result)
    setPage(1) // Reset page count on filter change
    setVisibleCountries(result.slice(0, ITEMS_PER_PAGE))
    setHasMore(result.length > ITEMS_PER_PAGE)
  }, [allCountries, searchTerm, selectedRegion])

  // Load more countries when page changes (due to scroll trigger)
  useEffect(() => {
    if (page === 1 || loading) return // Don't load more on initial load or if already loading
    
    setIsLoadingMore(true)
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const newCountries = filteredCountries.slice(start, end)
    
    // Simulate network delay for loading indicator visibility (optional)
    setTimeout(() => {
      setVisibleCountries(prev => [...prev, ...newCountries])
      setHasMore(filteredCountries.length > end)
      setIsLoadingMore(false)
    }, 300) // Adjust delay as needed

  }, [page, filteredCountries, loading])

  // Render initial loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading countries...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-4 my-4">
        <p>{error}</p>
      </div>
    )
  }

  // Render grid and filters
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      </div>

      {filteredCountries.length === 0 && !loading ? (
        <div className="bg-secondary border border-border text-muted-foreground rounded-md p-8 my-4 text-center">
          <p>No countries found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleCountries.map((country, index) => (
            <div 
              key={country.cca3} 
              ref={index === visibleCountries.length - 1 ? lastCountryElementRef : null}
            >
              <CountryCard country={country} />
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-3 text-muted-foreground">Loading more countries...</p>
        </div>
      )}
      
      {!hasMore && filteredCountries.length > 0 && (
         <div className="text-center py-10 text-muted-foreground">
           <p>You've reached the end of the list!</p>
         </div>
      )}
    </div>
  )
} 