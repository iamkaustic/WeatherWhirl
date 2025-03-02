import React from "react";
import { useTheme } from "./ThemeProvider";

interface WeatherDetailsProps {
  data: {
    humidity: number;
    pressure: number;
    wind_speed: number;
    visibility: number;
    uvi: number;
    sunrise?: number;
    sunset?: number;
  };
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  const { resolvedTheme } = useTheme();
  
  // Format time from timestamp
  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return "N/A";
    
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    }).toUpperCase();
  };
  
  // Convert visibility from meters to kilometers
  const visibilityInKm = data.visibility ? (data.visibility / 1000).toFixed(1) : "N/A";
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-sm uppercase tracking-wider mb-1 opacity-70">HUMIDITY</div>
        <div className="text-xl font-medium">{data.humidity}%</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-sm uppercase tracking-wider mb-1 opacity-70">PRESSURE</div>
        <div className="text-xl font-medium">{data.pressure} hPa</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-sm uppercase tracking-wider mb-1 opacity-70">WIND SPEED</div>
        <div className="text-xl font-medium">{Math.round(data.wind_speed)} m/s</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-sm uppercase tracking-wider mb-1 opacity-70">VISIBILITY</div>
        <div className="text-xl font-medium">{visibilityInKm} km</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-sm uppercase tracking-wider mb-1 opacity-70">UV INDEX</div>
        <div className="text-xl font-medium">{Math.round(data.uvi)}</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-sm uppercase tracking-wider mb-1 opacity-70">SUNRISE / SUNSET</div>
        <div className="text-xl font-medium">
          {formatTime(data.sunrise)} / {formatTime(data.sunset)}
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
