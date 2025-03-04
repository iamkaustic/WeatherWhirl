import React from 'react';
import { AirQualityData } from '@/types/weatherTypes';
import { Wind } from 'lucide-react';

interface AirQualityIndexProps {
  airQuality: AirQualityData;
  isLoading?: boolean;
}

export const AirQualityIndex: React.FC<AirQualityIndexProps> = ({ airQuality, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
        <div className="p-3 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800 flex items-center">
          <Wind size={16} className="mr-2 text-blue-600 dark:text-blue-300" />
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Air Quality</h3>
        </div>
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!airQuality) {
    return null;
  }

  // Calculate overall AQI based on the highest pollutant value
  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', textColor: 'text-green-700' };
    if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-400', textColor: 'text-yellow-700' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-400', textColor: 'text-orange-700' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-700' };
    return { label: 'Hazardous', color: 'bg-red-800', textColor: 'text-red-900' };
  };

  const aqiCategory = getAQICategory(airQuality.aqi);

  const pollutants = [
    { name: 'CO', value: airQuality.co, unit: 'μg/m³' },
    { name: 'NO', value: airQuality.no, unit: 'μg/m³' },
    { name: 'NO₂', value: airQuality.no2, unit: 'μg/m³' },
    { name: 'O₃', value: airQuality.o3, unit: 'μg/m³' },
    { name: 'SO₂', value: airQuality.so2, unit: 'μg/m³' },
    { name: 'PM2.5', value: airQuality.pm2_5, unit: 'μg/m³' },
    { name: 'PM10', value: airQuality.pm10, unit: 'μg/m³' },
    { name: 'NH₃', value: airQuality.nh3, unit: 'μg/m³' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
      <div className="p-3 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800 flex items-center">
        <Wind size={16} className="mr-2 text-blue-600 dark:text-blue-300" />
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Air Quality</h3>
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Air Quality Index</div>
            <div className="text-lg font-bold">{airQuality.aqi}</div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${aqiCategory.color} ${aqiCategory.textColor.replace('text-', 'text-white dark:')}`}>
            {aqiCategory.label}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full ${aqiCategory.color}`} 
            style={{ width: `${Math.min(100, (airQuality.aqi / 300) * 100)}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          {pollutants.map(pollutant => (
            <div key={pollutant.name} className="flex justify-between p-1.5 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-600 dark:text-gray-300">{pollutant.name}</span>
              <span className="font-medium">
                {pollutant.value !== undefined ? pollutant.value.toFixed(1) : 'N/A'} {pollutant.unit}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <p>Last updated: {new Date(airQuality.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityIndex;
