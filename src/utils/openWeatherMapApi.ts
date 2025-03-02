// OpenWeatherMap API utilities

const API_KEY = "6648586b2ef719174cf86f64362cdd7a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Available weather map layers
 * Based on https://openweathermap.org/api/weathermaps
 */
export const WEATHER_LAYERS = {
  TEMPERATURE: "temp",
  PRECIPITATION: "precipitation",
  WIND: "wind",
  CLOUDS: "clouds",
  PRESSURE: "pressure",
};

/**
 * Weather data interface
 */
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/**
 * Get the URL for OpenWeatherMap tile layer
 * @param layer The weather map layer (e.g., 'temp_new', 'precipitation_new')
 * @param z The zoom level (0-18, where 0 is the entire world and 18 is the most detailed view)
 * @param x The x coordinate (0-2^z-1, from west to east)
 * @param y The y coordinate (0-2^z-1, from north to south)
 * @returns The URL for the weather map tile
 * 
 * Sample values:
 * - layer: "temp_new" (temperature), "precipitation_new", "wind_new", "clouds_new", "pressure_new"
 * - z: 5 (continent level), 10 (city level), 15 (street level)
 * - x,y: For New York at z=10: x≈300, y≈384
 * - x,y: For London at z=10: x≈512, y≈340
 * - x,y: For Tokyo at z=10: x≈882, y≈400
 * 
 * India cities (at z=10):
 * - New Delhi: x≈676, y≈384
 * - Mumbai: x≈667, y≈408
 * - Kolkata: x≈702, y≈392
 * - Chennai: x≈686, y≈424
 * - Bangalore: x≈680, y≈420
 * - Hyderabad: x≈678, y≈414
 * 
 * Example: https://tile.openweathermap.org/map/temp_new/10/300/384.png?appid=API_KEY
 */
export const getOpenWeatherMapTileUrl = (layer: string, z: string | number, x: string | number, y: string | number) => {
  try {
    if (!layer || !WEATHER_LAYERS[layer as keyof typeof WEATHER_LAYERS]) {
      console.warn(`Invalid layer: ${layer}, using default TEMPERATURE layer`);
      layer = WEATHER_LAYERS.TEMPERATURE;
    }
    
    // Updated URL format for OpenWeatherMap 2.0 tile service
    return `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`;
  } catch (error) {
    console.error("Error generating OpenWeatherMap tile URL:", error);
    // Return a fallback URL to avoid breaking the application
    return `https://tile.openweathermap.org/map/temp/${z}/${x}/${y}.png?appid=${API_KEY}`;
  }
};

/**
 * Get current weather data by coordinates
 * @param lat Latitude
 * @param lon Longitude
 * @returns Weather data
 */
export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
    
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Weather API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Weather data fetched successfully");
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Get weather forecast by coordinates
 * @param lat Latitude
 * @param lon Longitude
 * @returns Forecast data
 */
export const getWeatherForecastByCoordinates = async (lat: number, lon: number) => {
  try {
    console.log(`Fetching weather forecast for coordinates: ${lat}, ${lon}`);
    
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Forecast API error (${response.status}): ${errorText}`);
      throw new Error(`Failed to fetch forecast data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Weather forecast fetched successfully");
    return data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};

/**
 * Format temperature value
 * @param temp Temperature in Celsius
 * @returns Formatted temperature string
 */
export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

/**
 * Format wind speed and direction
 * @param speed Wind speed in m/s
 * @param deg Wind direction in degrees
 * @returns Formatted wind string
 */
export const formatWind = (speed: number, deg: number): string => {
  const direction = getWindDirection(deg);
  const speedKmh = Math.round(speed * 3.6); // Convert m/s to km/h
  return `${speedKmh} km/h ${direction}`;
};

/**
 * Get wind direction from degrees
 * @param deg Wind direction in degrees
 * @returns Wind direction as string (N, NE, E, etc.)
 */
export const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

/**
 * Format precipitation value
 * @param rain Rain amount in mm
 * @returns Formatted precipitation string
 */
export const formatPrecipitation = (rain?: { '1h'?: number, '3h'?: number }): string => {
  if (!rain) return '0 mm';
  const amount = rain['1h'] || rain['3h'] || 0;
  return `${amount.toFixed(1)} mm`;
};

/**
 * Format cloud coverage
 * @param clouds Cloud coverage percentage
 * @returns Formatted cloud coverage string
 */
export const formatClouds = (clouds: number): string => {
  return `${clouds}%`;
};

/**
 * Format pressure value
 * @param pressure Pressure in hPa
 * @returns Formatted pressure string
 */
export const formatPressure = (pressure: number): string => {
  return `${pressure} hPa`;
};

/**
 * Get tooltip content for a specific location based on the active layer
 * @param weather Weather data
 * @param activeLayer Current active layer
 * @returns HTML string for tooltip content
 */
export const getTooltipContent = (weather: WeatherData, activeLayer: string): string => {
  const layer = activeLayer as keyof typeof WEATHER_LAYERS;
  let content = `<div style="font-size: 14px;"><strong>${weather.name}, ${weather.sys.country}</strong><br/>`;
  
  switch (layer) {
    case 'TEMPERATURE':
      content += `Temperature: <strong>${formatTemperature(weather.main.temp)}</strong><br/>`;
      content += `Feels like: ${formatTemperature(weather.main.feels_like)}<br/>`;
      content += `Min/Max: ${formatTemperature(weather.main.temp_min)}/${formatTemperature(weather.main.temp_max)}<br/>`;
      break;
    case 'PRECIPITATION':
      content += `Precipitation: <strong>${formatPrecipitation(weather.rain)}</strong><br/>`;
      content += `Humidity: ${weather.main.humidity}%<br/>`;
      break;
    case 'WIND':
      content += `Wind: <strong>${formatWind(weather.wind.speed, weather.wind.deg)}</strong><br/>`;
      if (weather.wind.gust) {
        content += `Gusts: ${Math.round(weather.wind.gust * 3.6)} km/h<br/>`;
      }
      break;
    case 'CLOUDS':
      content += `Cloud coverage: <strong>${formatClouds(weather.clouds.all)}</strong><br/>`;
      content += `Visibility: ${(weather.visibility / 1000).toFixed(1)} km<br/>`;
      break;
    case 'PRESSURE':
      content += `Pressure: <strong>${formatPressure(weather.main.pressure)}</strong><br/>`;
      if (weather.main.sea_level) {
        content += `Sea level: ${formatPressure(weather.main.sea_level)}<br/>`;
      }
      if (weather.main.grnd_level) {
        content += `Ground level: ${formatPressure(weather.main.grnd_level)}<br/>`;
      }
      break;
    default:
      // Show all info if layer is not recognized
      content += `Temperature: <strong>${formatTemperature(weather.main.temp)}</strong><br/>`;
      content += `Wind: ${formatWind(weather.wind.speed, weather.wind.deg)}<br/>`;
      content += `Humidity: ${weather.main.humidity}%<br/>`;
      content += `Pressure: ${formatPressure(weather.main.pressure)}<br/>`;
  }
  
  content += `<em>Updated: ${new Date(weather.dt * 1000).toLocaleTimeString()}</em></div>`;
  return content;
};
