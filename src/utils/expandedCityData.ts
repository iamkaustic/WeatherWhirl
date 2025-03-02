// Expanded city data from Wikipedia sources
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
  { name: "Osaka", country: "Japan", coordinates: [34.6937, 135.5023], population: 19300000 },
  { name: "Guangzhou", country: "China", coordinates: [23.1291, 113.2644], population: 13100000 },
  { name: "Shenzhen", country: "China", coordinates: [22.5431, 114.0579], population: 12100000 },
  { name: "Seoul", country: "South Korea", coordinates: [37.5665, 126.9780], population: 9800000 },
  { name: "Chongqing", country: "China", coordinates: [29.4316, 106.9123], population: 15800000 },
  { name: "Taipei", country: "Taiwan", coordinates: [25.0330, 121.5654], population: 2700000 },
  { name: "Kuala Lumpur", country: "Malaysia", coordinates: [3.1390, 101.6869], population: 7200000 },
  { name: "Ho Chi Minh City", country: "Vietnam", coordinates: [10.8231, 106.6297], population: 8600000 },
  { name: "Hanoi", country: "Vietnam", coordinates: [21.0285, 105.8542], population: 7700000 },
  { name: "Hong Kong", country: "China", coordinates: [22.3193, 114.1694], population: 7400000 },
  { name: "Riyadh", country: "Saudi Arabia", coordinates: [24.7136, 46.6753], population: 6500000 },
  { name: "Baghdad", country: "Iraq", coordinates: [33.3152, 44.3661], population: 7000000 },
  { name: "Singapore", country: "Singapore", coordinates: [1.3521, 103.8198], population: 5700000 },
  
  // North America
  { name: "New York", country: "USA", coordinates: [40.7128, -74.0060], population: 18800000 },
  { name: "Los Angeles", country: "USA", coordinates: [34.0522, -118.2437], population: 12500000 },
  { name: "Chicago", country: "USA", coordinates: [41.8781, -87.6298], population: 8600000 },
  { name: "Toronto", country: "Canada", coordinates: [43.6532, -79.3832], population: 6200000 },
  { name: "Mexico City", country: "Mexico", coordinates: [19.4326, -99.1332], population: 21800000 },
  { name: "Houston", country: "USA", coordinates: [29.7604, -95.3698], population: 6300000 },
  { name: "Philadelphia", country: "USA", coordinates: [39.9526, -75.1652], population: 5700000 },
  { name: "Phoenix", country: "USA", coordinates: [33.4484, -112.0740], population: 4700000 },
  { name: "San Antonio", country: "USA", coordinates: [29.4241, -98.4936], population: 2300000 },
  { name: "San Diego", country: "USA", coordinates: [32.7157, -117.1611], population: 3300000 },
  { name: "Dallas", country: "USA", coordinates: [32.7767, -96.7970], population: 7200000 },
  { name: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], population: 4700000 },
  { name: "Montreal", country: "Canada", coordinates: [45.5017, -73.5673], population: 4100000 },
  { name: "Vancouver", country: "Canada", coordinates: [49.2827, -123.1207], population: 2500000 },
  { name: "Calgary", country: "Canada", coordinates: [51.0447, -114.0719], population: 1400000 },
  { name: "Ottawa", country: "Canada", coordinates: [45.4215, -75.6972], population: 1300000 },
  { name: "Edmonton", country: "Canada", coordinates: [53.5461, -113.4938], population: 1300000 },
  { name: "Guadalajara", country: "Mexico", coordinates: [20.6597, -103.3496], population: 4900000 },
  { name: "Monterrey", country: "Mexico", coordinates: [25.6866, -100.3161], population: 4500000 },
  { name: "Puebla", country: "Mexico", coordinates: [19.0414, -98.2063], population: 2900000 },
  
  // Europe
  { name: "London", country: "UK", coordinates: [51.5074, -0.1278], population: 9500000 },
  { name: "Paris", country: "France", coordinates: [48.8566, 2.3522], population: 11000000 },
  { name: "Madrid", country: "Spain", coordinates: [40.4168, -3.7038], population: 6600000 },
  { name: "Moscow", country: "Russia", coordinates: [55.7558, 37.6173], population: 12500000 },
  { name: "Berlin", country: "Germany", coordinates: [52.5200, 13.4050], population: 3700000 },
  { name: "Rome", country: "Italy", coordinates: [41.9028, 12.4964], population: 4300000 },
  { name: "Barcelona", country: "Spain", coordinates: [41.3851, 2.1734], population: 5500000 },
  { name: "Saint Petersburg", country: "Russia", coordinates: [59.9343, 30.3351], population: 5300000 },
  { name: "Milan", country: "Italy", coordinates: [45.4642, 9.1900], population: 3100000 },
  { name: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], population: 2400000 },
  { name: "Munich", country: "Germany", coordinates: [48.1351, 11.5820], population: 1500000 },
  { name: "Hamburg", country: "Germany", coordinates: [53.5511, 9.9937], population: 1800000 },
  { name: "Warsaw", country: "Poland", coordinates: [52.2297, 21.0122], population: 1800000 },
  { name: "Budapest", country: "Hungary", coordinates: [47.4979, 19.0402], population: 1700000 },
  { name: "Vienna", country: "Austria", coordinates: [48.2082, 16.3738], population: 1900000 },
  { name: "Stockholm", country: "Sweden", coordinates: [59.3293, 18.0686], population: 1600000 },
  { name: "Prague", country: "Czech Republic", coordinates: [50.0755, 14.4378], population: 1300000 },
  { name: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], population: 1300000 },
  { name: "Athens", country: "Greece", coordinates: [37.9838, 23.7275], population: 3100000 },
  { name: "Lisbon", country: "Portugal", coordinates: [38.7223, -9.1393], population: 2800000 },
  
  // South America
  { name: "São Paulo", country: "Brazil", coordinates: [-23.5505, -46.6333], population: 22000000 },
  { name: "Rio de Janeiro", country: "Brazil", coordinates: [-22.9068, -43.1729], population: 13500000 },
  { name: "Buenos Aires", country: "Argentina", coordinates: [-34.6037, -58.3816], population: 15200000 },
  { name: "Lima", country: "Peru", coordinates: [-12.0464, -77.0428], population: 10700000 },
  { name: "Bogotá", country: "Colombia", coordinates: [4.7110, -74.0721], population: 10700000 },
  { name: "Santiago", country: "Chile", coordinates: [-33.4489, -70.6693], population: 6700000 },
  { name: "Brasília", country: "Brazil", coordinates: [-15.7801, -47.9292], population: 4500000 },
  { name: "Salvador", country: "Brazil", coordinates: [-12.9714, -38.5014], population: 3900000 },
  { name: "Fortaleza", country: "Brazil", coordinates: [-3.7319, -38.5267], population: 4000000 },
  { name: "Medellín", country: "Colombia", coordinates: [6.2476, -75.5658], population: 3900000 },
  { name: "Caracas", country: "Venezuela", coordinates: [10.4806, -66.9036], population: 2900000 },
  { name: "Quito", country: "Ecuador", coordinates: [-0.1807, -78.4678], population: 2700000 },
  { name: "Guayaquil", country: "Ecuador", coordinates: [-2.1894, -79.8891], population: 2700000 },
  { name: "Montevideo", country: "Uruguay", coordinates: [-34.9011, -56.1645], population: 1700000 },
  { name: "Asunción", country: "Paraguay", coordinates: [-25.2637, -57.5759], population: 2300000 },
  { name: "La Paz", country: "Bolivia", coordinates: [-16.4897, -68.1193], population: 1800000 },
  
  // Africa
  { name: "Cairo", country: "Egypt", coordinates: [30.0444, 31.2357], population: 20900000 },
  { name: "Lagos", country: "Nigeria", coordinates: [6.5244, 3.3792], population: 14800000 },
  { name: "Kinshasa", country: "DR Congo", coordinates: [-4.4419, 15.2663], population: 14300000 },
  { name: "Johannesburg", country: "South Africa", coordinates: [-26.2041, 28.0473], population: 5700000 },
  { name: "Luanda", country: "Angola", coordinates: [-8.8399, 13.2894], population: 8300000 },
  { name: "Khartoum", country: "Sudan", coordinates: [15.5007, 32.5599], population: 5800000 },
  { name: "Dar es Salaam", country: "Tanzania", coordinates: [-6.7924, 39.2083], population: 6400000 },
  { name: "Alexandria", country: "Egypt", coordinates: [31.2001, 29.9187], population: 5200000 },
  { name: "Abidjan", country: "Ivory Coast", coordinates: [5.3600, -4.0083], population: 4900000 },
  { name: "Casablanca", country: "Morocco", coordinates: [33.5731, -7.5898], population: 3700000 },
  { name: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], population: 4500000 },
  { name: "Algiers", country: "Algeria", coordinates: [36.7538, 3.0588], population: 3400000 },
  { name: "Nairobi", country: "Kenya", coordinates: [-1.2921, 36.8219], population: 4700000 },
  { name: "Addis Ababa", country: "Ethiopia", coordinates: [9.0320, 38.7469], population: 4400000 },
  { name: "Accra", country: "Ghana", coordinates: [5.6037, -0.1870], population: 2400000 },
  { name: "Dakar", country: "Senegal", coordinates: [14.7167, -17.4677], population: 2500000 },
  { name: "Durban", country: "South Africa", coordinates: [-29.8587, 31.0218], population: 3400000 },
  { name: "Ibadan", country: "Nigeria", coordinates: [7.3775, 3.9470], population: 3500000 },
  { name: "Tunis", country: "Tunisia", coordinates: [36.8065, 10.1815], population: 2300000 },
  { name: "Rabat", country: "Morocco", coordinates: [34.0209, -6.8416], population: 1800000 },
  
  // Oceania
  { name: "Sydney", country: "Australia", coordinates: [-33.8688, 151.2093], population: 5300000 },
  { name: "Melbourne", country: "Australia", coordinates: [-37.8136, 144.9631], population: 5000000 },
  { name: "Brisbane", country: "Australia", coordinates: [-27.4698, 153.0251], population: 2400000 },
  { name: "Perth", country: "Australia", coordinates: [-31.9505, 115.8605], population: 2000000 },
  { name: "Adelaide", country: "Australia", coordinates: [-34.9285, 138.6007], population: 1300000 },
  { name: "Auckland", country: "New Zealand", coordinates: [-36.8509, 174.7645], population: 1600000 },
  { name: "Wellington", country: "New Zealand", coordinates: [-41.2865, 174.7762], population: 400000 },
  { name: "Christchurch", country: "New Zealand", coordinates: [-43.5320, 172.6306], population: 400000 },
  { name: "Port Moresby", country: "Papua New Guinea", coordinates: [-9.4438, 147.1803], population: 400000 },
  { name: "Suva", country: "Fiji", coordinates: [-18.1416, 178.4419], population: 180000 },
  { name: "Nouméa", country: "New Caledonia", coordinates: [-22.2758, 166.4581], population: 100000 },
  { name: "Hobart", country: "Australia", coordinates: [-42.8821, 147.3272], population: 230000 },
  { name: "Canberra", country: "Australia", coordinates: [-35.2809, 149.1300], population: 400000 },
  { name: "Hamilton", country: "New Zealand", coordinates: [-37.7870, 175.2793], population: 170000 },
  { name: "Dunedin", country: "New Zealand", coordinates: [-45.8788, 170.5028], population: 130000 },
];

// Get cities for a specific region (can be filtered by country or continent)
export const getCitiesByRegion = (region: string): CityData[] => {
  if (region.toLowerCase() === 'all') {
    return majorCities;
  }
  
  const continentCountries = {
    'asia': ['japan', 'india', 'china', 'bangladesh', 'pakistan', 'thailand', 'south korea', 'taiwan', 'malaysia', 'vietnam', 'saudi arabia', 'iraq', 'singapore'],
    'europe': ['uk', 'france', 'spain', 'russia', 'germany', 'italy', 'netherlands', 'poland', 'hungary', 'austria', 'sweden', 'czech republic', 'denmark', 'greece', 'portugal'],
    'north america': ['usa', 'canada', 'mexico'],
    'south america': ['brazil', 'argentina', 'peru', 'colombia', 'chile', 'venezuela', 'ecuador', 'uruguay', 'paraguay', 'bolivia'],
    'africa': ['egypt', 'nigeria', 'dr congo', 'south africa', 'angola', 'sudan', 'tanzania', 'ivory coast', 'morocco', 'algeria', 'kenya', 'ethiopia', 'ghana', 'senegal', 'tunisia'],
    'oceania': ['australia', 'new zealand', 'papua new guinea', 'fiji', 'new caledonia']
  };
  
  return majorCities.filter(city => 
    city.country.toLowerCase() === region.toLowerCase() || 
    (continentCountries[region.toLowerCase() as keyof typeof continentCountries]?.includes(city.country.toLowerCase()))
  );
};

// Get a specific city by name
export const getCityByName = (name: string): CityData | undefined => {
  return majorCities.find(city => city.name.toLowerCase() === name.toLowerCase());
};

// Get all countries
export const getAllCountries = (): string[] => {
  return [...new Set(majorCities.map(city => city.country))].sort();
};

// Get cities by country
export const getCitiesByCountry = (country: string): CityData[] => {
  return majorCities.filter(city => city.country.toLowerCase() === country.toLowerCase());
};
