import React from "react";
import { useTheme } from "./ThemeProvider";

interface ForecastWeatherProps {
  data: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
}

// Weather condition color mapping
const getWeatherColor = (weatherId: number, isDark: boolean): string => {
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return isDark ? '#a090fb' : '#6c5ce7';
  }
  // Rain or Drizzle
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return isDark ? '#73c0ff' : '#0984e3';
  }
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return isDark ? '#b8e9ff' : '#81ecec';
  }
  // Atmosphere (fog, mist, etc.)
  if (weatherId >= 700 && weatherId < 800) {
    return isDark ? '#b2bec3' : '#636e72';
  }
  // Clear
  if (weatherId === 800) {
    return isDark ? '#ffeaa7' : '#fdcb6e';
  }
  // Clouds
  if (weatherId > 800 && weatherId < 900) {
    return isDark ? '#dfe6e9' : '#74b9ff';
  }
  
  return isDark ? '#dfe6e9' : '#2d3436';
};

const ForecastWeather: React.FC<ForecastWeatherProps> = ({ data }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Format day name
  const getDayName = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };
  
  return (
    <div className="space-y-1">
      {data.map((day, index) => {
        const weatherColor = getWeatherColor(day.weather[0].id, isDark);
        
        return (
          <div 
            key={day.dt} 
            className={`flex items-center justify-between py-1.5 px-1.5 rounded-lg transition-all duration-200 hover:bg-opacity-10 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } ${
              index < data.length - 1 ? 
                isDark ? 'border-b border-[#222]' : 'border-b border-[#e5e5e5]' 
                : ''
            }`}
          >
            <div 
              className={`w-12 font-medium uppercase text-xs ${
                index === 0 ? 'font-bold' : ''
              }`}
              style={{ color: weatherColor }}
            >
              {index === 0 ? "TODAY" : getDayName(day.dt)}
            </div>
            
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ 
                background: `radial-gradient(circle, ${weatherColor}30 0%, transparent 70%)`
              }}
            >
              <img 
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
                className="w-8 h-8"
                style={{ filter: 'saturate(1.5) contrast(1.1)' }}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span 
                className="font-medium text-sm"
                style={{ color: weatherColor }}
              >
                {Math.round(day.temp.max)}°
              </span>
              <span className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {Math.round(day.temp.min)}°
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ForecastWeather;
