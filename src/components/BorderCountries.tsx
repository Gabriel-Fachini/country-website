import React, { useState, useEffect } from 'react'
import { countryService, type Country } from '@/lib/api/countryService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
      <div className="text-muted-foreground italic p-4 text-center bg-secondary rounded-lg">
        This country has no neighboring countries.
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading neighbors...</span>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {neighborCountries.map(country => (
        <a 
          key={country.cca3} 
          href={`/country/${country.cca3}`}
          className="block"
        >
          <Card className="overflow-hidden h-full transition-all hover:shadow-md text-card-foreground bg-card">
            <div className="h-24 overflow-hidden">
              <img 
                src={country.flags.png} 
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium text-sm truncate mb-1">{country.name.common}</h4>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {country.region}
                </Badge>
                {country.capital && country.capital.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {country.capital[0]}
                  </Badge>
                )}
              </div>
              <Button 
                variant="link"
                size="sm" 
                className="w-full mt-2 h-7 text-xs justify-start px-0"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  )
} 