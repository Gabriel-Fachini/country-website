import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format population numbers (e.g., 1000000 -> 1,000,000)
export function formatPopulation(population: number): string {
  return new Intl.NumberFormat().format(population)
}

// Format first letter uppercase
export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
