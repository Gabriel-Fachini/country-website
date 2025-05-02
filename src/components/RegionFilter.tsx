import React from 'react'

interface RegionFilterProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
}

// Common regions in the Countries API
const regions = [
  'All',
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania'
]

export function RegionFilter({ selectedRegion, onRegionChange }: RegionFilterProps) {
  return (
    <div className="w-full max-w-xs mb-8">
      <select
        className="block w-full py-2.5 px-3 border border-border bg-input rounded-lg text-foreground focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value)}
      >
        <option value="">Filter by Region</option>
        {regions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  )
} 