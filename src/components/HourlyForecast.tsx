import React from "react";
import { useTheme } from "next-themes";
import { WeatherUnits } from "@/types/weatherTypes";

interface HourlyForecastProps {
  data: {
    dt: number;
    temp: number;
    weather: string;
    weather_description: string;
    weather_icon: string;
    pop?: number;
  }[];
  isLoading?: boolean;
  units?: WeatherUnits;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, isLoading = false, units }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Get temperature unit symbol
  const getTempUnit = (): string => {
    if (!units) return '°C';
    return units.temperature === 'fahrenheit' ? '°F' : '°C';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Hourly Forecast
        </h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Format time from timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  // Weather condition color mapping
  const getWeatherColor = (weather: string): string => {
    if (weather === 'Thunderstorm') {
      return isDark ? '#a090fb' : '#6c5ce7';
    }
    if (weather === 'Rain' || weather === 'Drizzle') {
      return isDark ? '#73c0ff' : '#0984e3';
    }
    if (weather === 'Snow') {
      return isDark ? '#b8e9ff' : '#81ecec';
    }
    if (['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'].includes(weather)) {
      return isDark ? '#b2bec3' : '#636e72';
    }
    if (weather === 'Clear') {
      return isDark ? '#ffeaa7' : '#fdcb6e';
    }
    if (weather === 'Clouds') {
      return isDark ? '#dfe6e9' : '#74b9ff';
    }
    
    return isDark ? '#dfe6e9' : '#2d3436';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Hourly Forecast
      </h3>
      <div className="flex overflow-x-auto pb-2 space-x-4">
        {data.map((hour) => (
          <div 
            key={hour.dt} 
            className="flex flex-col items-center min-w-[80px]"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {formatTime(hour.dt)}
            </p>
            <img 
              src={`https://openweathermap.org/img/wn/${hour.weather_icon}.png`}
              alt={hour.weather_description}
              className="w-10 h-10 my-1"
            />
            <p 
              className="text-sm font-medium"
              style={{ color: getWeatherColor(hour.weather) }}
            >
              {Math.round(hour.temp)}{getTempUnit()}
            </p>
            {hour.pop !== undefined && hour.pop > 0.1 && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {Math.round(hour.pop * 100)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
