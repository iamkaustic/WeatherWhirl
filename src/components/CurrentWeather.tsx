import React, { useMemo } from "react";
import { useTheme } from "next-themes";
import { MapPin, Calendar } from "lucide-react";
import { WeatherUnits } from "@/types/weatherTypes";

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

// Get gradient colors based on weather condition
const getGradientColors = (weather: string, isDark: boolean): { from: string, to: string } => {
  // Thunderstorm
  if (weather === 'Thunderstorm') {
    return isDark 
      ? { from: '#4c4177', to: '#6c5ce7' } 
      : { from: '#6c5ce7', to: '#a090fb' };
  }
  // Rain or Drizzle
  if (weather === 'Rain' || weather === 'Drizzle') {
    return isDark 
      ? { from: '#0984e3', to: '#73c0ff' } 
      : { from: '#0984e3', to: '#74b9ff' };
  }
  // Snow
  if (weather === 'Snow') {
    return isDark 
      ? { from: '#81ecec', to: '#b8e9ff' } 
      : { from: '#81ecec', to: '#dfe6e9' };
  }
  // Atmosphere (fog, mist, etc.)
  if (['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'].includes(weather)) {
    return isDark 
      ? { from: '#636e72', to: '#b2bec3' } 
      : { from: '#b2bec3', to: '#dfe6e9' };
  }
  // Clear
  if (weather === 'Clear') {
    return isDark 
      ? { from: '#fdcb6e', to: '#ffeaa7' } 
      : { from: '#f9ca24', to: '#fdcb6e' };
  }
  // Clouds
  if (weather === 'Clouds') {
    return isDark 
      ? { from: '#74b9ff', to: '#dfe6e9' } 
      : { from: '#74b9ff', to: '#a5d8ff' };
  }
  
  return isDark 
    ? { from: '#2d3436', to: '#636e72' } 
    : { from: '#dfe6e9', to: '#f5f6fa' };
};

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
  
  // Get gradient colors based on weather condition
  const gradientColors = useMemo(() => 
    getGradientColors(data?.weather || 'Clear', isDark),
  [data?.weather, isDark]);
  
  // Create CSS for the animated gradient
  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(-45deg, ${gradientColors.from}, ${gradientColors.to}, ${gradientColors.to}, ${gradientColors.from})`,
    backgroundSize: '400% 400%',
    animation: 'gradient-animation 15s ease infinite',
  }), [gradientColors]);
  
  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    return `${weekday}, ${month} ${day} • ${time}`;
  };

  // Get temperature unit symbol
  const getTempUnit = (): string => {
    if (!units) return '°C';
    return units.temperature === 'fahrenheit' ? '°F' : '°C';
  };

  // Get funny quote based on temperature
  const getFunnyQuote = (temp: number): string => {
    const tempC = units?.temperature === 'fahrenheit' ? (temp - 32) * 5/9 : temp;
    
    if (tempC >= 35) {
      return "It's so hot the birds are using oven mitts to pull worms out of the ground! 🔥";
    } else if (tempC >= 30) {
      return "Hot enough to make a snowman book a vacation! ☀️";
    } else if (tempC >= 25) {
      return "Perfect weather for telling winter jokes... because summer coming! 😎";
    } else if (tempC >= 20) {
      return "Not too hot, not too cold... all you need is a light jacket! 👌";
    } else if (tempC >= 15) {
      return "Sweater weather: when fashion meets function! 🧶";
    } else if (tempC >= 10) {
      return "Cold enough to make you walk faster to your destination! 🚶‍♂️💨";
    } else if (tempC >= 5) {
      return "The kind of cold that makes your refrigerator feel inadequate! ❄️";
    } else if (tempC >= 0) {
      return "It's freezing! Time to wear everything in your closet at once! 🧣";
    } else if (tempC >= -10) {
      return "So cold even polar bears are wearing jackets! 🐻‍❄️";
    } else {
      return "It's so cold that penguins are migrating here for vacation! 🐧";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
        <div className="flex flex-col items-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading current weather...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md p-6 h-full overflow-hidden relative">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30 z-0"
        style={gradientStyle}
      />
      
      {/* Content with higher z-index */}
      <div className="relative z-10 flex flex-col items-center text-center mb-4">
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
        
        <div className="flex items-center justify-center gap-1 mt-3">
          <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(data.dt)}
          </p>
        </div>
        
        {/* Funny quote based on temperature */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm italic text-gray-600 dark:text-gray-300">
          {getFunnyQuote(data.temp)}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
