
import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Droplets,
  Thermometer,
} from "lucide-react";
import { ForecastDay, getWeatherIconName } from "@/utils/weatherApi";

interface WeatherForecastProps {
  forecast: ForecastDay[] | undefined;
  isLoading: boolean;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {[...Array(7)].map((_, i) => (
          <Card key={i} className="weather-card animate-pulse bg-gray-100 h-40">
            <CardContent className="flex flex-col items-center justify-center p-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return (
      <Card className="weather-card bg-gray-50">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No forecast data available</p>
        </CardContent>
      </Card>
    );
  }

  // Get day name from date
  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Get dynamic weather icon
  const WeatherIcon = ({ conditionCode }: { conditionCode: number }) => {
    const iconName = getWeatherIconName(conditionCode, 1); // Assuming day time for forecast

    switch (iconName) {
      case "Sun":
        return <Sun className="h-5 w-5 text-amber-500" />;
      case "Cloud":
        return <Cloud className="h-5 w-5 text-gray-400" />;
      case "CloudSun":
        return <Sun className="h-5 w-5 text-amber-500" />;
      case "CloudRain":
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case "CloudSnow":
        return <CloudSnow className="h-5 w-5 text-blue-200" />;
      case "CloudLightning":
        return <CloudLightning className="h-5 w-5 text-yellow-400" />;
      case "CloudFog":
        return <CloudFog className="h-5 w-5 text-gray-400" />;
      default:
        return <Cloud className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
      {forecast.map((day, index) => (
        <Card 
          key={day.date} 
          className="weather-card glass-card bg-white/60 animate-slide-up"
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <CardContent className="p-4 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {getDayName(day.date)}
            </p>
            
            <div className="mb-2">
              <WeatherIcon conditionCode={day.day.condition.code} />
            </div>
            
            <p className="text-lg font-semibold mb-1">
              {Math.round(day.day.maxtemp_c)}°
            </p>
            
            <p className="text-xs text-gray-500 mb-3">
              {Math.round(day.day.mintemp_c)}°
            </p>
            
            <div className="flex items-center justify-between w-full text-xs">
              <div className="flex items-center">
                <Droplets className="h-3 w-3 mr-1 text-blue-500 opacity-70" />
                <span>{day.day.daily_chance_of_rain}%</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-3 w-3 mr-1 text-orange-500 opacity-70" />
                <span>UV {Math.round(day.day.uv)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeatherForecast;
