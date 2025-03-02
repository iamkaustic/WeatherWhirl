import React from "react";
import { useTheme } from "./ThemeProvider";

interface HourlyForecastProps {
  data: {
    dt: number;
    temp: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  isLoading: boolean;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, isLoading }) => {
  const { resolvedTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-6 min-w-max">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`flex flex-col items-center border p-4 min-w-[80px] ${
              resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
            } animate-pulse`}>
              <span className={`text-sm uppercase tracking-wider font-medium ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
              }`}>
                &nbsp;
              </span>
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full my-2"></div>
              <span className={`text-lg font-medium ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
              }`}>
                &nbsp;
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 text-gray-400 dark:text-gray-300 mb-4"></div>
          <h3 className="text-lg font-medium">Hourly forecast unavailable</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  // Format hour
  const formatHour = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }).toUpperCase();
  };

  return (
    <div 
      className={`border overflow-x-auto ${
        resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
      }`}
    >
      <div className="flex p-4 min-w-max">
        {data.map((hour) => (
          <div 
            key={hour.dt} 
            className={`flex flex-col items-center mx-4 min-w-[60px] ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
            }`}
          >
            <div className="text-sm font-medium uppercase">{formatHour(hour.dt)}</div>
            <img 
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
              alt={hour.weather[0].description}
              className="w-10 h-10 my-2"
            />
            <div className="text-base font-medium">{Math.round(hour.temp)}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
