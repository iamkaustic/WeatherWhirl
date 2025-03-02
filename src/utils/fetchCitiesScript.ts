/**
 * Script to fetch city data from Wikipedia
 * 
 * This script is meant to be run once to populate the cityData.ts file
 * with a comprehensive list of cities from Wikipedia.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface CityData {
  name: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  population?: number;
}

// List of countries to fetch (can be expanded)
const countriesToFetch = [
  { name: 'Afghanistan', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Afghanistan' },
  { name: 'Albania', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Albania' },
  { name: 'Algeria', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Algeria' },
  { name: 'Argentina', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Argentina' },
  { name: 'Australia', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Australia_by_population' },
  { name: 'Brazil', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Brazil' },
  { name: 'Canada', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Canada' },
  { name: 'China', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_China' },
  { name: 'France', url: 'https://en.wikipedia.org/wiki/List_of_communes_in_France_with_over_20,000_inhabitants' },
  { name: 'Germany', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Germany_by_population' },
  { name: 'India', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_India_by_population' },
  { name: 'Italy', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Italy' },
  { name: 'Japan', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Japan' },
  { name: 'Mexico', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Mexico' },
  { name: 'Russia', url: 'https://en.wikipedia.org/wiki/List_of_cities_and_towns_in_Russia_by_population' },
  { name: 'South Africa', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_South_Africa' },
  { name: 'Spain', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_Spain' },
  { name: 'United Kingdom', url: 'https://en.wikipedia.org/wiki/List_of_cities_in_the_United_Kingdom' },
  { name: 'United States', url: 'https://en.wikipedia.org/wiki/List_of_United_States_cities_by_population' },
];

// Geocoding API (you'll need to replace this with a real API key)
const GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const API_KEY = '6648586b2ef719174cf86f64362cdd7a'; // Using the existing OpenWeatherMap API key

/**
 * Fetch city coordinates using OpenWeatherMap Geocoding API
 */
async function getCityCoordinates(cityName: string, countryName: string): Promise<[number, number] | null> {
  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        q: `${cityName},${countryName}`,
        limit: 1,
        appid: API_KEY
      }
    });
    
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return [lat, lon];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching coordinates for ${cityName}, ${countryName}:`, error);
    return null;
  }
}

/**
 * Parse Wikipedia page to extract city names
 */
async function parseCitiesFromWikipedia(url: string, countryName: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const cities: string[] = [];
    
    // This is a simplified approach - actual parsing logic would need to be 
    // customized for each country's Wikipedia page format
    $('table.wikitable tbody tr').each((_, element) => {
      const cityCell = $(element).find('td:first-child, th:first-child');
      if (cityCell.length) {
        const cityName = cityCell.text().trim().split('[')[0].trim();
        if (cityName && !cityName.includes('City') && !cityName.includes('Rank')) {
          cities.push(cityName);
        }
      }
    });
    
    return cities;
  } catch (error) {
    console.error(`Error parsing cities from ${url}:`, error);
    return [];
  }
}

/**
 * Main function to fetch all cities and their coordinates
 */
async function fetchAllCities(): Promise<CityData[]> {
  const allCities: CityData[] = [];
  
  for (const country of countriesToFetch) {
    console.log(`Fetching cities for ${country.name}...`);
    const cityNames = await parseCitiesFromWikipedia(country.url, country.name);
    
    // Limit to top 10 cities per country to avoid rate limiting
    const topCities = cityNames.slice(0, 10);
    
    for (const cityName of topCities) {
      console.log(`  Getting coordinates for ${cityName}, ${country.name}...`);
      const coordinates = await getCityCoordinates(cityName, country.name);
      
      if (coordinates) {
        allCities.push({
          name: cityName,
          country: country.name,
          coordinates
        });
      }
      
      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return allCities;
}

/**
 * Run the script
 */
async function main() {
  try {
    const cities = await fetchAllCities();
    
    // Generate the TypeScript file content
    const fileContent = `// Generated city data from Wikipedia
export interface CityData {
  name: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  population?: number;
}

// List of cities around the world
export const majorCities: CityData[] = ${JSON.stringify(cities, null, 2)};

// Get cities for a specific region (can be filtered by country or continent)
export const getCitiesByRegion = (region: string): CityData[] => {
  return majorCities.filter(city => 
    city.country.toLowerCase() === region.toLowerCase() ||
    (region.toLowerCase() === 'all')
  );
};

// Get a specific city by name
export const getCityByName = (name: string): CityData | undefined => {
  return majorCities.find(city => city.name.toLowerCase() === name.toLowerCase());
};
`;
    
    // Write to file
    fs.writeFileSync(path.join(__dirname, 'generatedCityData.ts'), fileContent);
    console.log('City data has been generated successfully!');
  } catch (error) {
    console.error('Error generating city data:', error);
  }
}

// Uncomment to run the script
// main();
