import React from "react";
import { useTheme } from "next-themes";
import { WeatherUnits } from "@/types/weatherTypes";

interface WeatherDetailsProps {
  data: {
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg?: number;
    visibility: number;
    uvi?: number;
    sunrise?: number;
    sunset?: number;
  };
  units?: WeatherUnits;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, units }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Format time from timestamp
  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  // Convert wind speed based on units
  const formatWindSpeed = (speed: number): string => {
    if (!units) return `${speed} m/s`;
    
    switch (units.wind) {
      case 'kmh':
        return `${Math.round(speed * 3.6)} km/h`;
      case 'mph':
        return `${Math.round(speed * 2.237)} mph`;
      default:
        return `${speed} m/s`;
    }
  };
  
  // Convert pressure based on units
  const formatPressure = (pressure: number): string => {
    if (!units) return `${pressure} hPa`;
    
    return units.pressure === 'inHg' 
      ? `${(pressure * 0.02953).toFixed(2)} inHg`
      : `${pressure} hPa`;
  };
  
  // Convert visibility based on units
  const formatVisibility = (visibility: number): string => {
    if (!units) return `${(visibility / 1000).toFixed(1)} km`;
    
    return units.distance === 'mi'
      ? `${(visibility / 1609).toFixed(1)} mi`
      : `${(visibility / 1000).toFixed(1)} km`;
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-xs uppercase tracking-wider mb-0.5 opacity-70">HUMIDITY</div>
        <div className="text-sm font-medium">{data.humidity}%</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-xs uppercase tracking-wider mb-0.5 opacity-70">PRESSURE</div>
        <div className="text-sm font-medium">{formatPressure(data.pressure)}</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-xs uppercase tracking-wider mb-0.5 opacity-70">WIND SPEED</div>
        <div className="text-sm font-medium">{formatWindSpeed(data.wind_speed)}</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-xs uppercase tracking-wider mb-0.5 opacity-70">VISIBILITY</div>
        <div className="text-sm font-medium">{formatVisibility(data.visibility)}</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-xs uppercase tracking-wider mb-0.5 opacity-70">UV INDEX</div>
        <div className="text-sm font-medium">{data.uvi}</div>
      </div>
      
      <div className={`${
        resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
      }`}>
        <div className="text-xs uppercase tracking-wider mb-0.5 opacity-70">SUNRISE / SUNSET</div>
        <div className="text-sm font-medium">
          {formatTime(data.sunrise)} / {formatTime(data.sunset)}
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
