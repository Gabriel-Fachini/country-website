import React from 'react'
import { type Country } from '@/lib/api/countryService'
import { formatPopulation } from '@/lib/utils'

interface CountryCardProps {
  country: Country
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <a 
      href={`/country/${country.cca3}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer block"
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={country.flags.png} 
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 truncate">{country.name.common}</h3>
        
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-medium">Region:</span> {country.region}
          </p>
          {country.capital && country.capital.length > 0 && (
            <p>
              <span className="font-medium">Capital:</span> {country.capital[0]}
            </p>
          )}
          <p>
            <span className="font-medium">Population:</span> {formatPopulation(country.population)}
          </p>
        </div>
      </div>
    </a>
  )
} 