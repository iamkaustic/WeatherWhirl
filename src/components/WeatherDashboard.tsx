import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherByCoordinates } from "@/utils/openWeatherMapApi";
import CurrentWeather from "./CurrentWeather";
import ForecastWeather from "./ForecastWeather";
import HourlyForecast from "./HourlyForecast";
import WeatherDetails from "./WeatherDetails";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "./ThemeProvider";

// Define the combined weather data interface
interface CombinedWeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    visibility: number;
    uvi: number;
    sunrise?: number;
    sunset?: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt: number;
  };
  daily: {
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
  hourly: {
    dt: number;
    temp: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
  location: {
    name: string;
    country: string;
  };
}

const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const locationTimeoutRef = useRef<number | null>(null);
  const [weatherData, setWeatherData] = useState<CombinedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get user's location on component mount if not already set
  useEffect(() => {
    if (!location) {
      getUserLocation();
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (locationTimeoutRef.current) {
        window.clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  // Function to get user's location
  const getUserLocation = () => {
    if (isGettingLocation) return; // Prevent multiple simultaneous requests
    
    setIsGettingLocation(true);
    
    // Create a visible UI element before requesting permissions
    // This helps prevent the black screen issue
    setPermissionDialogOpen(true);
    
    // Set a timeout to handle cases where the permission dialog might be stuck
    locationTimeoutRef.current = window.setTimeout(() => {
      setIsGettingLocation(false);
      setPermissionDialogOpen(false);
      toast.error("Location request timed out. Please try again or search for a location instead.");
    }, 15000);
    
    // Delay the actual geolocation request slightly to ensure the UI renders first
    setTimeout(() => {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Clear the timeout since we got a response
              if (locationTimeoutRef.current) {
                window.clearTimeout(locationTimeoutRef.current);
                locationTimeoutRef.current = null;
              }
              
              setLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
              setIsGettingLocation(false);
              setPermissionDialogOpen(false);
            },
            (error) => {
              // Clear the timeout since we got a response
              if (locationTimeoutRef.current) {
                window.clearTimeout(locationTimeoutRef.current);
                locationTimeoutRef.current = null;
              }
              
              console.error("Error getting location:", error);
              
              // Different error messages based on error code
              if (error.code === 1) {
                toast.error("Location access was denied. Please search for a location instead.");
              } else if (error.code === 2) {
                toast.error("Your location is unavailable. Please search for a location instead.");
              } else {
                toast.error("Could not get your location. Please search for a location instead.");
              }
              
              setIsGettingLocation(false);
              setPermissionDialogOpen(false);
            },
            { 
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } catch (e) {
          // Handle any unexpected errors
          console.error("Unexpected error in geolocation:", e);
          if (locationTimeoutRef.current) {
            window.clearTimeout(locationTimeoutRef.current);
            locationTimeoutRef.current = null;
          }
          setIsGettingLocation(false);
          setPermissionDialogOpen(false);
          toast.error("An error occurred while getting your location. Please search for a location instead.");
        }
      } else {
        if (locationTimeoutRef.current) {
          window.clearTimeout(locationTimeoutRef.current);
          locationTimeoutRef.current = null;
        }
        toast.error("Geolocation is not supported by your browser. Please search for a location instead.");
        setIsGettingLocation(false);
        setPermissionDialogOpen(false);
      }
    }, 100); // Small delay to ensure UI renders first
  };

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!location) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch current weather
        const currentWeatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=6648586b2ef719174cf86f64362cdd7a&units=metric`
        );
        
        if (!currentWeatherResponse.ok) {
          throw new Error(`Weather API error: ${currentWeatherResponse.status}`);
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Fetch 5-day forecast (free tier)
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=6648586b2ef719174cf86f64362cdd7a&units=metric`
        );
        
        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Process the forecast data to get daily and hourly forecasts
        const hourlyData = forecastData.list.slice(0, 24).map((item: any) => ({
          dt: item.dt,
          temp: item.main.temp,
          weather: item.weather
        }));
        
        // Group forecast by day and get min/max temps
        const dailyMap = new Map();
        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toDateString();
          
          if (!dailyMap.has(date)) {
            dailyMap.set(date, {
              dt: item.dt,
              temp: {
                min: item.main.temp,
                max: item.main.temp
              },
              weather: item.weather
            });
          } else {
            const existing = dailyMap.get(date);
            existing.temp.min = Math.min(existing.temp.min, item.main.temp);
            existing.temp.max = Math.max(existing.temp.max, item.main.temp);
            // Keep the weather from the middle of the day if possible
            const itemHour = new Date(item.dt * 1000).getHours();
            if (itemHour >= 12 && itemHour <= 15) {
              existing.weather = item.weather;
            }
          }
        });
        
        const dailyData = Array.from(dailyMap.values()).slice(0, 7);
        
        // Combine the data
        const combined: CombinedWeatherData = {
          current: {
            temp: currentWeatherData.main.temp,
            feels_like: currentWeatherData.main.feels_like,
            humidity: currentWeatherData.main.humidity,
            pressure: currentWeatherData.main.pressure,
            wind_speed: currentWeatherData.wind.speed,
            visibility: currentWeatherData.visibility,
            uvi: 0, // Not available in free tier
            sunrise: currentWeatherData.sys.sunrise,
            sunset: currentWeatherData.sys.sunset,
            weather: currentWeatherData.weather,
            dt: currentWeatherData.dt
          },
          daily: dailyData,
          hourly: hourlyData,
          location: {
            name: currentWeatherData.name,
            country: currentWeatherData.sys.country
          }
        };
        
        setWeatherData(combined);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch weather data"));
        toast.error("Failed to fetch weather data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeatherData();
  }, [location]);

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Use the OpenWeatherMap Geocoding API to get coordinates from location name
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          searchQuery
        )}&limit=1&appid=6648586b2ef719174cf86f64362cdd7a`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setLocation({
          lat: data[0].lat,
          lon: data[0].lon,
        });
        
        // Clear search query
        setSearchQuery("");
      } else {
        toast.error("Location not found. Please try another search term.");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      toast.error("Error searching for location. Please try again.");
    }
  };

  // Cancel location request
  const cancelLocationRequest = () => {
    if (locationTimeoutRef.current) {
      window.clearTimeout(locationTimeoutRef.current);
      locationTimeoutRef.current = null;
    }
    setIsGettingLocation(false);
    setPermissionDialogOpen(false);
    toast.info("Location request cancelled.");
  };

  return (
    <div className="w-full">
      {/* Location permission dialog */}
      {permissionDialogOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className={`p-6 max-w-md w-full mx-4 border ${
            resolvedTheme === 'dark' 
              ? 'bg-[#111] text-white border-[#222]' 
              : 'bg-white text-[#111] border-[#e5e5e5]'
          }`}>
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-medium uppercase tracking-wider">Location Access</h3>
              <p className="text-center">
                Please allow location access to show weather for your area.
              </p>
              <button 
                onClick={cancelLocationRequest}
                className="px-4 py-2 mt-2 border uppercase text-sm tracking-wider font-medium"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-2 pl-10 border ${
                resolvedTheme === 'dark' ? 'bg-[#222] border-[#333] text-white' : 'bg-white border-gray-200 text-[#111]'
              }`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button 
              type="submit" 
              disabled={!searchQuery.trim()}
              className={`flex-1 px-4 py-2 uppercase text-sm tracking-wider font-medium ${
                resolvedTheme === 'dark'
                  ? 'bg-white text-[#111]'
                  : 'bg-[#111] text-white'
              }`}
            >
              SEARCH
            </button>
            <button 
              type="button" 
              onClick={getUserLocation}
              disabled={isGettingLocation}
              className={`flex-1 border px-4 py-2 uppercase text-sm tracking-wider font-medium ${
                resolvedTheme === 'dark'
                  ? 'border-white text-white'
                  : 'border-[#111] text-[#111]'
              }`}
            >
              {isGettingLocation ? "LOCATING..." : "MY LOCATION"}
            </button>
          </div>
        </div>
      </form>

      {/* Weather data display */}
      {isLoading ? (
        <div className={`flex flex-col justify-center items-center py-20 border ${
          resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
        }`}>
          <Loader2 className="h-12 w-12 text-[#111] dark:text-white mb-4" />
          <span className="text-lg uppercase tracking-wider">Loading weather data...</span>
        </div>
      ) : weatherData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`md:col-span-2 border p-8 ${
            resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
          }`}>
            <CurrentWeather 
              data={weatherData.current} 
              location={weatherData.location} 
              coordinates={location}
            />
            <div className="mt-8">
              <h3 className={`text-xl font-medium mb-4 uppercase tracking-wider ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
              }`}>
                HOURLY FORECAST
              </h3>
              <HourlyForecast data={weatherData.hourly} isLoading={isLoading} />
            </div>
          </div>
          <div>
            <div className={`border p-4 mb-6 ${
              resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
            }`}>
              <h3 className={`text-sm font-medium mb-2 uppercase tracking-wider ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
              }`}>
                7-DAY FORECAST
              </h3>
              <ForecastWeather data={weatherData.daily} />
            </div>
            <div className={`border p-4 ${
              resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
            }`}>
              <h3 className={`text-sm font-medium mb-2 uppercase tracking-wider ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-[#111]'
              }`}>
                WEATHER DETAILS
              </h3>
              <WeatherDetails data={weatherData.current} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-center py-20 border ${
          resolvedTheme === 'dark' ? 'border-[#222] text-gray-300' : 'border-[#e5e5e5] text-gray-600'
        }`}>
          {location ? (
            <p className="text-lg">Failed to load weather data. Please try again.</p>
          ) : (
            <p className="text-lg">Please search for a location or allow location access to see weather data.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
