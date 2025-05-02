import React from 'react'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import { formatPopulation, capitalizeFirstLetter } from '@/lib/utils'
import { type Country } from '@/lib/api/countryService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'

interface CountryDetailProps {
  country: Country
}

export function CountryDetail({ country }: CountryDetailProps) {
  // Calculate population density (people per sq km)
  const populationDensity = country.area ? Math.round(country.population / country.area) : 0
  
  // Get languages as array of strings
  const languages = country.languages 
    ? Object.values(country.languages) 
    : []
  
  // Get currencies as array of objects
  const currencies = country.currencies 
    ? Object.entries(country.currencies).map(([code, currency]) => ({
        code,
        name: currency.name,
        symbol: currency.symbol
      }))
    : []

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="geography">Geography</TabsTrigger>
        <TabsTrigger value="culture">Culture</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <InfoItem label="Official Name" value={country.name.official} />
          {country.capital && country.capital.length > 0 && (
            <InfoItem label="Capital" value={country.capital.join(', ')} />
          )}
          <InfoItem label="Region" value={country.region} />
          <InfoItem label="Population" value={formatPopulation(country.population)} />
          
          <div className="flex flex-wrap gap-2 mt-2">
            <RegionBadge region={country.region} />
            {country.population > 100000000 && (
              <Badge variant="info">Large Population</Badge>
            )}
            {country.population < 1000000 && (
              <Badge variant="warning">Small Population</Badge>
            )}
            {country.landlocked && (
              <Badge variant="outline">Landlocked</Badge>
            )}
            {country.unMember && (
              <Badge variant="secondary">UN Member</Badge>
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="geography" className="mt-4 space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Geographic Information</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Population Density</span>
                <span className="text-sm font-semibold">{populationDensity} people/km²</span>
              </div>
              <Progress value={Math.min(populationDensity / 10, 100)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Land Area</span>
                <span className="text-sm font-semibold">
                  {country.area ? Number(country.area).toLocaleString() : 'N/A'} km²
                </span>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="borders">
                <AccordionTrigger>Borders</AccordionTrigger>
                <AccordionContent>
                  {country.borders && country.borders.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {country.borders.map(border => (
                        <Badge key={border} variant="outline" className="mr-1">
                          {border}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No bordering countries</p>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="location">
                <AccordionTrigger>Location</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Latitude</p>
                      <p>{country.latlng ? country.latlng[0] : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Longitude</p>
                      <p>{country.latlng ? country.latlng[1] : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Subregion</p>
                      <p>{country.subregion || 'N/A'}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="culture" className="mt-4 space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">Cultural Information</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="languages">
              <AccordionTrigger>Languages</AccordionTrigger>
              <AccordionContent>
                {languages.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {languages.map((language, index) => (
                      <li key={index}>{language}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No language data available</p>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="currencies">
              <AccordionTrigger>Currencies</AccordionTrigger>
              <AccordionContent>
                {currencies.length > 0 ? (
                  <ul className="space-y-2">
                    {currencies.map((currency, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-sm font-medium">{currency.code}</span>
                        <span className="mx-2 text-border">•</span>
                        <span className="text-sm">{currency.name}</span>
                        {currency.symbol && (
                          <>
                            <span className="mx-2 text-border">•</span>
                            <span className="text-sm">{currency.symbol}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No currency data available</p>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="timezones">
              <AccordionTrigger>Timezones</AccordionTrigger>
              <AccordionContent>
                {country.timezones && country.timezones.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                    {country.timezones.map((timezone, index) => (
                      <Badge key={index} variant="secondary" className="justify-center mb-1">
                        {timezone}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No timezone data available</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Helper component for displaying information
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1 bg-background p-4 rounded-lg shadow-sm border border-border/50">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
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