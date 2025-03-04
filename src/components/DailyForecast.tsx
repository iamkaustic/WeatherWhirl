import React from "react";
import { useTheme } from "next-themes";
import { WeatherUnits } from "@/types/weatherTypes";
import { Calendar } from "lucide-react";

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
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    
    return `${weekday}, ${month} ${day}`;
  };

  // Check if day is today
  const isToday = (timestamp: number): boolean => {
    const today = new Date();
    const dayDate = new Date(timestamp * 1000);
    return today.getDate() === dayDate.getDate() && 
           today.getMonth() === dayDate.getMonth() && 
           today.getFullYear() === dayDate.getFullYear();
  };

  // Get temperature unit symbol
  const getTempUnit = (): string => {
    if (!units) return '°C';
    return units.temperature === 'fahrenheit' ? '°F' : '°C';
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl shadow-md p-6 h-full overflow-hidden relative">
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
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 relative z-10">
          5-Day Forecast
        </h3>
        <div className="flex justify-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl shadow-md p-6 h-full overflow-hidden relative">
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
      
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 relative z-10">
        5-Day Forecast
      </h3>
      <div className="space-y-2 relative z-10">
        {data.map((day, index) => (
          <div 
            key={day.dt} 
            className={`flex items-center justify-between py-2 ${
              index < data.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
          >
            <div className="w-24">
              <div className={`flex items-center gap-1 ${
                isToday(day.dt) 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {isToday(day.dt) && <Calendar className="h-3 w-3" />}
                <p className={`text-sm font-medium ${
                  isToday(day.dt) 
                    ? 'font-semibold' 
                    : ''
                }`}>
                  {day.day ? day.day : formatDate(day.dt)}
                </p>
              </div>
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
