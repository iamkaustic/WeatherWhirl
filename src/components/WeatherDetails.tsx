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
  isLoading?: boolean;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, units, isLoading = false }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-200">Weather Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-0.5 text-gray-500 dark:text-gray-300">HUMIDITY</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{data.humidity}%</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-0.5 text-gray-500 dark:text-gray-300">PRESSURE</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatPressure(data.pressure)}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-0.5 text-gray-500 dark:text-gray-300">WIND SPEED</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatWindSpeed(data.wind_speed)}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-0.5 text-gray-500 dark:text-gray-300">VISIBILITY</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatVisibility(data.visibility)}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-0.5 text-gray-500 dark:text-gray-300">UV INDEX</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{data.uvi}</div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
          <div className="text-xs uppercase tracking-wider mb-0.5 text-gray-500 dark:text-gray-300">SUNRISE / SUNSET</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatTime(data.sunrise)} / {formatTime(data.sunset)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
