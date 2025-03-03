import React from "react";
import { useTheme } from "next-themes";
import { WeatherUnits } from "@/types/weatherTypes";

interface DailyForecastProps {
  data: {
    dt: number;
    day?: string;
    temp_max: number;
    temp_min: number;
    weather: string;
    weather_description: string;
    weather_icon: string;
    pop?: number;
  }[];
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

const DailyForecast: React.FC<DailyForecastProps> = ({ data, isLoading = false, units }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get temperature unit symbol
  const getTempUnit = (): string => {
    if (!units) return '°C';
    return units.temperature === 'fahrenheit' ? '°F' : '°C';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          5-Day Forecast
        </h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        5-Day Forecast
      </h3>
      <div className="space-y-2">
        {data.map((day, index) => (
          <div 
            key={day.dt} 
            className={`flex items-center justify-between py-2 ${
              index < data.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
          >
            <div className="w-24">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {day.day ? day.day : formatDate(day.dt)}
              </p>
            </div>
            
            <div className="flex items-center">
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather_icon}.png`} 
                alt={day.weather_description}
                className="w-8 h-8"
              />
              <span 
                className="ml-1 text-sm font-medium"
                style={{ color: getWeatherColor(day.weather, isDark) }}
              >
                {day.weather}
              </span>
            </div>
            
            {day.pop !== undefined && day.pop > 0.1 && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {Math.round(day.pop * 100)}%
              </div>
            )}
            
            <div className="flex space-x-2 text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(day.temp_max)}{getTempUnit()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(day.temp_min)}{getTempUnit()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
