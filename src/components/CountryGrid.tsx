import React, { useState, useEffect } from 'react'
import { CountryCard } from './CountryCard'
import { SearchBar } from './SearchBar'
import { RegionFilter } from './RegionFilter'
import { countryService, type Country } from '@/lib/api/countryService'

export function CountryGrid() {
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const data = await countryService.getAllCountries()
        setCountries(data)
        setFilteredCountries(data)
        setError(null)
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
    let result = countries

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(country => 
        country.name.common.toLowerCase().includes(term) ||
        country.name.official.toLowerCase().includes(term) ||
        (country.capital && country.capital.some(cap => cap.toLowerCase().includes(term)))
      )
    }

    // Filter by region
    if (selectedRegion && selectedRegion !== 'All') {
      result = result.filter(country => country.region === selectedRegion)
    }

    setFilteredCountries(result)
  }, [countries, searchTerm, selectedRegion])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading countries...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
      </div>

      {filteredCountries.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-md p-8 my-4 text-center">
          <p>No countries found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.cca3}
              country={country}
            />
          ))}
        </div>
      )}
    </div>
  )
} 