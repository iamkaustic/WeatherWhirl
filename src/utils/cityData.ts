// Major cities data for the world map
export interface CityData {
  name: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  population?: number;
}

// List of major cities around the world
export const majorCities: CityData[] = [
  // Asia
  { name: "Tokyo", country: "Japan", coordinates: [35.6762, 139.6503], population: 37400000 },
  { name: "Delhi", country: "India", coordinates: [28.6139, 77.2090], population: 31200000 },
  { name: "Shanghai", country: "China", coordinates: [31.2304, 121.4737], population: 27100000 },
  { name: "Mumbai", country: "India", coordinates: [19.0760, 72.8777], population: 20700000 },
  { name: "Beijing", country: "China", coordinates: [39.9042, 116.4074], population: 20400000 },
  { name: "Dhaka", country: "Bangladesh", coordinates: [23.8103, 90.4125], population: 20300000 },
  { name: "Kolkata", country: "India", coordinates: [22.5726, 88.3639], population: 14900000 },
  { name: "Karachi", country: "Pakistan", coordinates: [24.8607, 67.0011], population: 16100000 },
  { name: "Chennai", country: "India", coordinates: [13.0827, 80.2707], population: 10900000 },
  { name: "Bangkok", country: "Thailand", coordinates: [13.7563, 100.5018], population: 10500000 },
  { name: "Bangalore", country: "India", coordinates: [12.9716, 77.5946], population: 12300000 },
  { name: "Hyderabad", country: "India", coordinates: [17.3850, 78.4867], population: 10000000 },
  
  // North America
  { name: "New York", country: "USA", coordinates: [40.7128, -74.0060], population: 18800000 },
  { name: "Los Angeles", country: "USA", coordinates: [34.0522, -118.2437], population: 12500000 },
  { name: "Chicago", country: "USA", coordinates: [41.8781, -87.6298], population: 8600000 },
  { name: "Toronto", country: "Canada", coordinates: [43.6532, -79.3832], population: 6200000 },
  { name: "Mexico City", country: "Mexico", coordinates: [19.4326, -99.1332], population: 21800000 },
  
  // Europe
  { name: "London", country: "UK", coordinates: [51.5074, -0.1278], population: 9500000 },
  { name: "Paris", country: "France", coordinates: [48.8566, 2.3522], population: 11000000 },
  { name: "Madrid", country: "Spain", coordinates: [40.4168, -3.7038], population: 6600000 },
  { name: "Moscow", country: "Russia", coordinates: [55.7558, 37.6173], population: 12500000 },
  { name: "Berlin", country: "Germany", coordinates: [52.5200, 13.4050], population: 3700000 },
  { name: "Rome", country: "Italy", coordinates: [41.9028, 12.4964], population: 4300000 },
  
  // South America
  { name: "São Paulo", country: "Brazil", coordinates: [-23.5505, -46.6333], population: 22000000 },
  { name: "Rio de Janeiro", country: "Brazil", coordinates: [-22.9068, -43.1729], population: 13500000 },
  { name: "Buenos Aires", country: "Argentina", coordinates: [-34.6037, -58.3816], population: 15200000 },
  { name: "Lima", country: "Peru", coordinates: [-12.0464, -77.0428], population: 10700000 },
  
  // Africa
  { name: "Cairo", country: "Egypt", coordinates: [30.0444, 31.2357], population: 20900000 },
  { name: "Lagos", country: "Nigeria", coordinates: [6.5244, 3.3792], population: 14800000 },
  { name: "Kinshasa", country: "DR Congo", coordinates: [-4.4419, 15.2663], population: 14300000 },
  { name: "Johannesburg", country: "South Africa", coordinates: [-26.2041, 28.0473], population: 5700000 },
  
  // Oceania
  { name: "Sydney", country: "Australia", coordinates: [-33.8688, 151.2093], population: 5300000 },
  { name: "Melbourne", country: "Australia", coordinates: [-37.8136, 144.9631], population: 5000000 },
  { name: "Auckland", country: "New Zealand", coordinates: [-36.8509, 174.7645], population: 1600000 },
];

// Get major cities for a specific region (can be filtered by country or continent)
export const getCitiesByRegion = (region: string): CityData[] => {
  return majorCities.filter(city => 
    city.country.toLowerCase() === region.toLowerCase() || 
    (region.toLowerCase() === 'asia' && ['japan', 'india', 'china', 'bangladesh', 'pakistan', 'thailand'].includes(city.country.toLowerCase())) ||
    (region.toLowerCase() === 'europe' && ['uk', 'france', 'spain', 'russia', 'germany', 'italy'].includes(city.country.toLowerCase())) ||
    (region.toLowerCase() === 'north america' && ['usa', 'canada', 'mexico'].includes(city.country.toLowerCase())) ||
    (region.toLowerCase() === 'south america' && ['brazil', 'argentina', 'peru'].includes(city.country.toLowerCase())) ||
    (region.toLowerCase() === 'africa' && ['egypt', 'nigeria', 'dr congo', 'south africa'].includes(city.country.toLowerCase())) ||
    (region.toLowerCase() === 'oceania' && ['australia', 'new zealand'].includes(city.country.toLowerCase()))
  );
};

// Get a specific city by name
export const getCityByName = (name: string): CityData | undefined => {
  return majorCities.find(city => city.name.toLowerCase() === name.toLowerCase());
};
