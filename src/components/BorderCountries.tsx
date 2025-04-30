import React, { useState, useEffect } from 'react'
import { countryService, type Country } from '@/lib/api/countryService'

interface BorderCountriesProps {
  borders?: string[]
}

export function BorderCountries({ borders }: BorderCountriesProps) {
  const [loading, setLoading] = useState(true)
  const [neighborCountries, setNeighborCountries] = useState<Country[]>([])
  
  useEffect(() => {
    const fetchNeighbors = async () => {
      if (!borders || borders.length === 0) {
        setNeighborCountries([])
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const neighbors = await countryService.getNeighborCountries(borders)
        setNeighborCountries(neighbors)
      } catch (error) {
        console.error('Error fetching neighbor countries:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNeighbors()
  }, [borders])
  
  if (!borders || borders.length === 0) {
    return (
      <div className="text-gray-500 italic">
        This country has no neighboring countries.
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading neighbors...</span>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {neighborCountries.map(country => (
        <a 
          key={country.cca3} 
          href={`/country/${country.cca3}`}
          className="group"
        >
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div className="h-16 overflow-hidden">
              <img 
                src={country.flags.png} 
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2 text-center">
              <h4 className="text-sm font-medium truncate">{country.name.common}</h4>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
} 