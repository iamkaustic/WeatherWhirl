import React from "react";
import { useTheme } from "./ThemeProvider";
import WeatherAnimation from "./WeatherAnimation";

interface CurrentWeatherProps {
  data: {
    temp: number;
    feels_like: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt: number;
  };
  location: {
    name: string;
    country: string;
  };
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

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, location }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Format date
  const date = new Date(data.dt * 1000);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  // Get weather icon URL - use colored version
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  
  // Get weather-specific color
  const weatherColor = getWeatherColor(data.weather[0].id, isDark);
  
  return (
    <div className="relative">
      {/* Weather animation */}
      <WeatherAnimation 
        weatherId={data.weather[0].id} 
        weatherMain={data.weather[0].main} 
      />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
          <div>
            <h2 className={`text-2xl md:text-3xl font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-[#111]'
            }`}>
              {location.name}, {location.country}
            </h2>
            <p className={`text-base md:text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {formattedDate}
            </p>
          </div>
          <div 
            className="mt-1 md:mt-0 text-base md:text-lg uppercase font-semibold px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: isDark ? `${weatherColor}30` : `${weatherColor}20`,
              color: weatherColor
            }}
          >
            {data.weather[0].main}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex items-center mr-0 sm:mr-8 mb-2 sm:mb-0">
            <div 
              className="relative flex items-center justify-center"
              style={{ 
                width: '80px', 
                height: '80px',
                background: `radial-gradient(circle, ${weatherColor}40 0%, transparent 70%)`,
                borderRadius: '50%'
              }}
            >
              <img 
                src={iconUrl} 
                alt={data.weather[0].description} 
                className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg"
                style={{ filter: 'saturate(1.5) contrast(1.1)' }}
              />
            </div>
            <div 
              className="text-5xl md:text-7xl font-bold ml-2"
              style={{ color: weatherColor }}
            >
              {Math.round(data.temp)}°
            </div>
          </div>
          <div className={`text-base md:text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Feels like <span style={{ color: weatherColor }}>{Math.round(data.feels_like)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
