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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-full">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
          Hourly Forecast
        </h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Format time from timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  // Check if hour is current hour
  const isCurrentHour = (timestamp: number): boolean => {
    const now = new Date();
    const hourDate = new Date(timestamp * 1000);
    return now.getHours() === hourDate.getHours() && 
           now.getDate() === hourDate.getDate() && 
           now.getMonth() === hourDate.getMonth();
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

  // Limit the number of hours shown to fit without scrolling
  const visibleHours = data.slice(0, 8);

  return (
    <div className="glass-card rounded-xl shadow-md p-4 h-full overflow-hidden relative">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30 z-0"
        style={{
          background: `linear-gradient(-45deg, 
            ${isDark ? '#4c4177' : '#74b9ff'}, 
            ${isDark ? '#6c5ce7' : '#a5d8ff'}, 
            ${isDark ? '#6c5ce7' : '#a5d8ff'}, 
            ${isDark ? '#4c4177' : '#74b9ff'})`,
          backgroundSize: '400% 400%',
          animation: 'gradient-animation 15s ease infinite'
        }}
      />
      
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 relative z-10">
        Hourly Forecast
      </h3>
      <div className="grid grid-cols-4 gap-2 relative z-10">
        {visibleHours.map((hour) => (
          <div 
            key={hour.dt} 
            className="flex flex-col items-center"
          >
            <p className={`text-xs font-medium rounded-full px-2 py-0.5 ${
              isCurrentHour(hour.dt) 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {formatTime(hour.dt)}
            </p>
            <img 
              src={`https://openweathermap.org/img/wn/${hour.weather_icon}.png`}
              alt={hour.weather_description}
              className="w-8 h-8 my-0.5"
            />
            <p 
              className="text-xs font-medium"
              style={{ color: getWeatherColor(hour.weather) }}
            >
              {Math.round(hour.temp)}{getTempUnit()}
            </p>
            {hour.pop !== undefined && hour.pop > 0.1 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
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
