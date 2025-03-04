import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherByCoordinates } from "@/utils/openWeatherMapApi";
import CurrentWeather from "@/components/CurrentWeather";
import DailyForecast from "@/components/DailyForecast"; 
import HourlyForecast from "@/components/HourlyForecast";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherAlerts from "@/components/WeatherAlerts";
import AirQualityIndex from "@/components/AirQualityIndex"; 
import PreferencesPanel from "@/components/PreferencesPanel"; 
import TimeDisplay from "@/components/TimeDisplay";
import LocationInfo from "@/components/LocationInfo";
import { useTheme } from "next-themes";
import { useUserPreferences } from "@/components/UserPreferencesProvider";
import { processWeatherAlerts, checkCustomAlerts } from "@/utils/alertService";
import { convertWeatherDataToUserUnits } from "@/utils/unitConversion";
import { WeatherAlert, AirQualityData, WeatherLocation } from "@/types/weatherTypes";
import { 
  Loader, 
  MapPin, 
  Search, 
  Settings, 
  Clock, 
  X,
  RefreshCw,
  Wind
} from "lucide-react"; 
import { toast } from "sonner";

// Define the combined weather data interface
interface CombinedWeatherData {
  current: any;
  hourly: any[];
  daily: any[];
  location: {
    name: string;
    country: string;
    lat?: number;
    lon?: number;
  };
}

// API key for OpenWeatherMap
const API_KEY = "6648586b2ef719174cf86f64362cdd7a";

const WeatherDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    name: string;
    country?: string;
    state?: string;
  } | null>(null);
  const [weatherData, setWeatherData] = useState<CombinedWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState<boolean>(false);
  const [locationTimeout, setLocationTimeout] = useState<number>(15);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[] | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [isPreferencesPanelOpen, setIsPreferencesPanelOpen] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { preferences } = useUserPreferences();
  const { resolvedTheme } = useTheme();
  const locationTimeoutRef = useRef<number | null>(null);

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

  // Location timeout countdown
  useEffect(() => {
    if (permissionDialogOpen && locationTimeout > 0) {
      const timer = setTimeout(() => {
        setLocationTimeout(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (permissionDialogOpen && locationTimeout === 0) {
      cancelLocationRequest();
    }
  }, [permissionDialogOpen, locationTimeout]);

  // Monitor isLoading state changes
  useEffect(() => {
    console.log("isLoading state changed:", isLoading);
  }, [isLoading]);

  // Monitor weatherData state changes
  useEffect(() => {
    console.log("weatherData state changed:", weatherData ? "Data available" : "No data");
  }, [weatherData]);

  // Fetch weather data when location changes
  useEffect(() => {
    if (!location) return;
    
    console.log("Fetching weather data for location:", location);
    setIsLoading(true);
    
    // Fetch weather data from OpenWeatherMap API
    const fetchData = async () => {
      try {
        // Fetch current weather data
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!currentResponse.ok) {
          throw new Error(`Weather API error: ${currentResponse.status}`);
        }
        
        const currentData = await currentResponse.json();
        console.log("Current weather data:", currentData);
        
        // Fetch forecast data
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        console.log("Forecast data:", forecastData);
        
        // Fetch air quality data
        const airQualityResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`
        );
        
        if (!airQualityResponse.ok) {
          throw new Error(`Air quality API error: ${airQualityResponse.status}`);
        }
        
        const airQualityData = await airQualityResponse.json();
        console.log("Air quality data:", airQualityData);
        
        // Process the data
        const processedCurrentData = {
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          temp_min: currentData.main.temp_min,
          temp_max: currentData.main.temp_max,
          humidity: currentData.main.humidity,
          pressure: currentData.main.pressure,
          wind_speed: currentData.wind.speed,
          wind_deg: currentData.wind.deg,
          weather: currentData.weather[0].main,
          weather_description: currentData.weather[0].description,
          weather_icon: currentData.weather[0].icon,
          clouds: currentData.clouds.all,
          visibility: currentData.visibility,
          dt: currentData.dt,
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset,
        };
        
        // Process hourly forecast data (next 24 hours)
        const hourlyForecast = forecastData.list.slice(0, 8).map((item: any) => ({
          dt: item.dt,
          temp: item.main.temp,
          weather: item.weather[0].main,
          weather_description: item.weather[0].description,
          weather_icon: item.weather[0].icon,
          pop: item.pop, // Probability of precipitation
        }));
        
        // Process daily forecast data (next 5 days)
        const dailyForecast = [];
        const processedDays = new Set();
        
        for (const item of forecastData.list) {
          const date = new Date(item.dt * 1000);
          const day = date.toISOString().split('T')[0];
          
          if (!processedDays.has(day) && processedDays.size < 5) {
            processedDays.add(day);
            
            // Find the max and min temps for the day
            const dayItems = forecastData.list.filter((i: any) => {
              const itemDate = new Date(i.dt * 1000);
              const itemDay = itemDate.toISOString().split('T')[0];
              return itemDay === day;
            });
            
            const temps = dayItems.map((i: any) => i.main.temp);
            const maxTemp = Math.max(...temps);
            const minTemp = Math.min(...temps);
            
            // Use the noon forecast for the day's weather (or the first available)
            const noonForecast = dayItems.find((i: any) => {
              const itemDate = new Date(i.dt * 1000);
              return itemDate.getHours() >= 12 && itemDate.getHours() < 15;
            }) || dayItems[0];
            
            dailyForecast.push({
              dt: noonForecast.dt,
              day: day,
              temp_max: maxTemp,
              temp_min: minTemp,
              weather: noonForecast.weather[0].main,
              weather_description: noonForecast.weather[0].description,
              weather_icon: noonForecast.weather[0].icon,
              pop: noonForecast.pop,
            });
          }
        }
        
        // Process air quality data
        const processedAirQuality = {
          aqi: airQualityData.list[0].main.aqi,
          co: airQualityData.list[0].components.co,
          no: airQualityData.list[0].components.no,
          no2: airQualityData.list[0].components.no2,
          o3: airQualityData.list[0].components.o3,
          so2: airQualityData.list[0].components.so2,
          pm2_5: airQualityData.list[0].components.pm2_5,
          pm10: airQualityData.list[0].components.pm10,
          nh3: airQualityData.list[0].components.nh3,
          timestamp: airQualityData.list[0].dt * 1000 // Convert to milliseconds for JavaScript Date
        };
        
        // Set the processed data
        setWeatherData({
          location: {
            name: location.name || currentData.name,
            country: location.country || currentData.sys.country,
            lat: location.lat,
            lon: location.lon,
          },
          current: processedCurrentData,
          hourly: hourlyForecast,
          daily: dailyForecast,
        });
        
        setAirQualityData(processedAirQuality);
        
        // Check for weather alerts
        const alerts = [];
        
        // Add any official weather alerts if available
        if (currentData.alerts) {
          alerts.push(...currentData.alerts.map((alert: any) => ({
            type: 'official',
            title: alert.event,
            description: alert.description,
            start: alert.start,
            end: alert.end,
          })));
        }
        
        // Add custom alerts based on weather conditions
        if (preferences?.alertSettings) {
          const customAlerts = checkCustomAlerts(processedCurrentData, preferences);
          if (customAlerts.length > 0) {
            alerts.push(...customAlerts);
          }
        }
        
        setWeatherAlerts(alerts);
        
        setIsLoading(false);
        console.log("Weather data processing complete");
        
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setIsLoading(false);
        setError(error instanceof Error ? error : new Error("Failed to fetch weather data"));
        toast.error("Error loading weather data. Please try again.");
      }
    };
    
    fetchData();
  }, [location, preferences]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a location to search");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Use OpenWeatherMap Geocoding API to get coordinates
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=1&appid=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Geocoding API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Geocoding API response:", data);
        
        if (!data || data.length === 0) {
          throw new Error(`Location "${searchQuery}" not found. Please try a different search term.`);
        }
        
        const { lat, lon, name, country, state } = data[0];
        setLocation({ lat, lon, name, country, state });
        // Don't set isLoading to false here, let the useEffect handle it
      })
      .catch(err => {
        console.error("Error fetching location:", err);
        setIsLoading(false);
        setError(err);
        toast.error(err.message || "Failed to find location");
      });
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

  // Open location in Google Maps
  const openInGoogleMaps = () => {
    if (location && weatherData?.location) {
      const { name } = weatherData.location;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&ll=${location.lat},${location.lon}`;
      window.open(url, '_blank');
    }
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

      {/* Time and date display */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div>
          <TimeDisplay />
        </div>
      </div>

      {/* Header with search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0 flex items-center">
          <div className="rounded-full bg-primary/10 p-3 mr-3">
            <Wind className="h-8 w-8 text-primary animate-pulse" />
          </div>
          WeatherWhirl
        </h1>
        
        {/* Search form */}
        <div className="w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city..."
                className="w-full p-2 pl-8 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
            </div>
            <button
              type="submit"
              className={`p-2 ml-2 rounded-full ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* User Preferences Panel */}
      <PreferencesPanel 
        isOpen={isPreferencesPanelOpen} 
        onClose={() => setIsPreferencesPanelOpen(false)} 
      />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather content */}
        <div className="lg:col-span-12">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
              <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">Error</h3>
              <p className="text-red-700 dark:text-red-300">{error.message}</p>
              <button
                onClick={() => setError(null)}
                className="mt-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-4 py-2 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800"
              >
                Dismiss
              </button>
            </div>
          ) : weatherData ? (
            <>
              {/* Location header */}
              <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400 font-normal mr-1">You are currently in</span>
                    {weatherData.location.name}
                    {weatherData.location.country && `, ${weatherData.location.country}`}
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({location?.lat?.toFixed(4)}°, {location?.lon?.toFixed(4)}°)
                    </span>
                  </h2>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${location?.lat || 0},${location?.lon || 0}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                    aria-label="View on map"
                  >
                    <MapPin size={16} />
                  </a>
                </div>
                <button
                  onClick={() => {
                    if (location) {
                      setIsLoading(true);
                      setLocation({ ...location });
                    }
                  }}
                  className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  aria-label="Refresh weather data"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Weather widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Current Weather */}
                <div className="col-span-1">
                  <CurrentWeather data={weatherData.current} isLoading={isLoading} units={preferences.units} />
                </div>

                {/* Location Information */}
                <div className="col-span-1">
                  <LocationInfo 
                    name={weatherData.location.name}
                    country={weatherData.location.country || ''}
                    lat={location?.lat}
                    lon={location?.lon}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* 2x2 Grid for Hourly Forecast, 5-Day Forecast, Weather Details, and Air Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Hourly Forecast */}
                <div className="col-span-1">
                  <HourlyForecast data={weatherData.hourly} isLoading={isLoading} units={preferences.units} />
                </div>

                {/* 5-Day Forecast */}
                <div className="col-span-1">
                  <DailyForecast data={weatherData.daily} isLoading={isLoading} units={preferences.units} />
                </div>

                {/* Weather Details */}
                <div className="col-span-1">
                  <WeatherDetails data={weatherData.current} units={preferences.units} isLoading={isLoading} />
                </div>

                {/* Air Quality */}
                <div className="col-span-1">
                  {airQualityData && <AirQualityIndex airQuality={airQualityData} isLoading={isLoading} />}
                </div>
              </div>

              {/* Weather Alerts */}
              {weatherAlerts && weatherAlerts.length > 0 && (
                <div className="mb-6">
                  <WeatherAlerts alerts={weatherAlerts} isLoading={isLoading} />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Welcome to WeatherWhirl
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Search for a location to get started
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => {
                    setSearchQuery("London");
                    handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
                  }}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Try London
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("New York");
                    handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
                  }}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Try New York
                </button>
                <button
                  onClick={() => {
                    setSearchQuery("Tokyo");
                    handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
                  }}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Try Tokyo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
