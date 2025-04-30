// Types for country data
export interface Country {
  name: {
    common: string
    official: string
  }
  cca3: string
  flags: {
    png: string
    svg: string
    alt?: string
  }
  capital?: string[]
  region: string
  population: number
  borders?: string[] // Country codes of bordering countries
}

// API service for fetching countries data
export const countryService = {
  // Get all countries with basic information
  async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,cca3,borders')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching countries:', error)
      return []
    }
  },
  
  // Get country details by code
  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,capital,region,population,cca3,borders`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch country: ${response.status}`)
      }
      
      const data = await response.json()
      return data || null
    } catch (error) {
      console.error(`Error fetching country by code ${code}:`, error)
      return null
    }
  },
  
  // Get neighboring countries
  async getNeighborCountries(codes: string[]): Promise<Country[]> {
    if (!codes || codes.length === 0) return []
    
    try {
      const codeList = codes.join(',')
      const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codeList}&fields=name,flags,cca3`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch neighboring countries: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching neighboring countries:', error)
      return []
    }
  }
} 