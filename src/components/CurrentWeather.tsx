import React from "react";
import { useTheme } from "next-themes";
import { MapPin } from "lucide-react";
import { WeatherUnits } from "@/types/weatherTypes";

interface CurrentWeatherProps {
  data: {
    temp: number;
    feels_like: number;
    weather: string;
    weather_description: string;
    weather_icon: string;
    dt: number;
  };
  location?: {
    name: string;
    country: string;
  };
  coordinates?: {
    lat: number;
    lon: number;
  };
  onOpenGoogleMaps?: () => void;
  isLoading?: boolean;
  units?: WeatherUnits;
}

// Weather condition color mapping
const getWeatherColor = (weather: string, isDark: boolean): string => {
  // Thunderstorm
  if (weather === 'Thunderstorm') {
    return isDark ? '#a090fb' : '#6c5ce7';
  }
  // Rain or Drizzle
  if (weather === 'Rain' || weather === 'Drizzle') {
    return isDark ? '#73c0ff' : '#0984e3';
  }
  // Snow
  if (weather === 'Snow') {
    return isDark ? '#b8e9ff' : '#81ecec';
  }
  // Atmosphere (fog, mist, etc.)
  if (['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'].includes(weather)) {
    return isDark ? '#b2bec3' : '#636e72';
  }
  // Clear
  if (weather === 'Clear') {
    return isDark ? '#ffeaa7' : '#fdcb6e';
  }
  // Clouds
  if (weather === 'Clouds') {
    return isDark ? '#dfe6e9' : '#74b9ff';
  }
  
  return isDark ? '#dfe6e9' : '#2d3436';
};

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  data, 
  location, 
  coordinates, 
  onOpenGoogleMaps,
  isLoading = false,
  units
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get temperature unit symbol
  const getTempUnit = (): string => {
    if (!units) return '°C';
    return units.temperature === 'fahrenheit' ? '°F' : '°C';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading current weather...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="flex items-center mb-2">
          <img 
            src={`https://openweathermap.org/img/wn/${data.weather_icon}@2x.png`}
            alt={data.weather_description}
            className="w-20 h-20"
          />
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          {Math.round(data.temp)}{getTempUnit()}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
          Feels like {Math.round(data.feels_like)}{getTempUnit()}
        </p>
        
        <p 
          className="text-lg font-medium mt-1"
          style={{ color: getWeatherColor(data.weather, isDark) }}
        >
          {data.weather_description.charAt(0).toUpperCase() + data.weather_description.slice(1)}
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {formatDate(data.dt)}
        </p>
      </div>
    </div>
  );
};

export default CurrentWeather;
