import React from 'react'
import { Badge } from './ui/badge'
import { formatPopulation, capitalizeFirstLetter } from '@/lib/utils'
import { type Country } from '@/lib/api/countryService'

interface CountryDetailProps {
  country: Country
}

export function CountryDetail({ country }: CountryDetailProps) {
  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Official Name" value={country.name.official} />
          {country.capital && country.capital.length > 0 && (
            <InfoItem label="Capital" value={country.capital.join(', ')} />
          )}
          <InfoItem label="Region" value={country.region} />
          <InfoItem label="Population" value={formatPopulation(country.population)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <RegionBadge region={country.region} />
        {country.population > 100000000 && (
          <Badge variant="info">Large Population</Badge>
        )}
        {country.population < 1000000 && (
          <Badge variant="warning">Small Population</Badge>
        )}
      </div>
    </div>
  )
}

// Helper component for displaying information
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1 bg-white p-4 rounded-lg shadow-sm">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

// Helper component for displaying region badge
function RegionBadge({ region }: { region: string }) {
  const getVariant = () => {
    switch (region) {
      case 'Africa':
        return 'default'
      case 'Americas':
        return 'warning'
      case 'Asia':
        return 'success'
      case 'Europe':
        return 'info'
      case 'Oceania':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Badge variant={getVariant() as any}>
      {region}
    </Badge>
  )
} 