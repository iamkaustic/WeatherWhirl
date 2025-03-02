import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { MapPin, X, Thermometer, Droplets, Wind, Gauge } from "lucide-react";
import { getWeatherByCoordinates } from "@/utils/openWeatherMapApi";
import { WEATHER_LAYERS, getOpenWeatherMapTileUrl } from "@/utils/openWeatherMapApi";
import LeafletMap from "@/components/LeafletMap";

// Types
interface CityData {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
  };
}

export default function WorldWeatherMap() {
  // State for map and weather layers
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [layerInstance, setLayerInstance] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState(WEATHER_LAYERS.TEMPERATURE);
  const [opacity, setOpacity] = useState(0.8);
  const [showCities, setShowCities] = useState(true);
  const [cities, setCities] = useState<CityData[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [selectedCityWeather, setSelectedCityWeather] = useState<WeatherData | null>(null);
  
  // Major world cities data
  const majorCities = [
    { id: 1, name: "New York", country: "US", lat: 40.7128, lng: -74.0060 },
    { id: 2, name: "London", country: "GB", lat: 51.5074, lng: -0.1278 },
    { id: 3, name: "Tokyo", country: "JP", lat: 35.6762, lng: 139.6503 },
    { id: 4, name: "Sydney", country: "AU", lat: -33.8688, lng: 151.2093 },
    { id: 5, name: "Rio de Janeiro", country: "BR", lat: -22.9068, lng: -43.1729 },
    { id: 6, name: "Cape Town", country: "ZA", lat: -33.9249, lng: 18.4241 },
    { id: 7, name: "Moscow", country: "RU", lat: 55.7558, lng: 37.6173 },
    { id: 8, name: "Beijing", country: "CN", lat: 39.9042, lng: 116.4074 },
    { id: 9, name: "Mumbai", country: "IN", lat: 19.0760, lng: 72.8777 },
    { id: 10, name: "Cairo", country: "EG", lat: 30.0444, lng: 31.2357 },
  ];

  // Function to fetch weather data for major cities
  const fetchCitiesWeatherData = useCallback(async () => {
    if (!mapInstance || !showCities) return;
    
    setIsLoadingCities(true);
    setCities(majorCities);
    
    try {
      // Add markers for each city
      majorCities.forEach(city => {
        const marker = window.L.marker([city.lat, city.lng], {
          title: `${city.name}, ${city.country}`
        }).addTo(mapInstance);
        
        marker.on('click', () => {
          setSelectedCity(city);
          
          // Fetch weather data for the selected city
          getWeatherByCoordinates(city.lat, city.lng)
            .then(data => {
              if (data) {
                setSelectedCityWeather(data);
              }
            })
            .catch(error => {
              console.error(`Error fetching weather for ${city.name}:`, error);
              toast.error(`Failed to fetch weather for ${city.name}`);
            });
        });
      });
      
      setIsLoadingCities(false);
    } catch (error) {
      console.error("Error adding city markers:", error);
      setIsLoadingCities(false);
      toast.error("Failed to add city markers to the map");
    }
  }, [mapInstance, showCities]);

  // Update weather layer when active layer or opacity changes
  useEffect(() => {
    if (mapInstance) {
      updateWeatherLayer();
    }
  }, [activeLayer, opacity, mapInstance]);

  // Handle layer change
  const handleLayerChange = (layer: string) => {
    setActiveLayer(layer);
  };

  // Handle city toggle
  const handleCityToggle = (show: boolean) => {
    setShowCities(show);
    
    if (show && mapInstance) {
      fetchCitiesWeatherData();
    } else if (!show && mapInstance) {
      // Remove city markers
      mapInstance.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker) {
          mapInstance.removeLayer(layer);
        }
      });
    }
  };

  // Handle map initialization
  const handleMapInitialized = useCallback((map: any) => {
    console.log("Map initialized, setting up weather layer");
    setMapInstance(map);
    
    // Add the weather layer
    updateWeatherLayer(map);
    
    // Add click handler to show weather at clicked location
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      console.log(`Map clicked at: ${lat}, ${lng}`);
      
      // Fetch weather for clicked location
      getWeatherByCoordinates(lat, lng)
        .then(data => {
          if (data) {
            setSelectedCity({
              id: Date.now(), // Use timestamp as temporary ID
              name: data.name || 'Unknown Location',
              country: data.sys?.country || '',
              lat,
              lng
            });
            setSelectedCityWeather(data);
          }
        })
        .catch(error => {
          console.error("Error fetching weather for clicked location:", error);
          toast.error("Failed to fetch weather for this location");
        });
    });
    
    // Add cities to the map if showCities is enabled
    if (showCities) {
      fetchCitiesWeatherData();
    }
  }, [activeLayer, opacity, showCities, fetchCitiesWeatherData]);

  // Handle "My Location" button click
  const handleMyLocationClick = () => {
    if (navigator.geolocation) {
      toast.info("Getting your location...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User location: ${latitude}, ${longitude}`);
          
          // Update map center and zoom
          setMapCenter({ lat: latitude, lng: longitude });
          setMapZoom(10); // Zoom in to user's location
          
          // If map is already initialized, set view directly
          if (mapInstance) {
            mapInstance.setView([latitude, longitude], 10);
          }
          
          // Fetch weather for user's location
          getWeatherByCoordinates(latitude, longitude)
            .then(data => {
              if (data) {
                setSelectedCity({
                  id: Date.now(),
                  name: data.name || 'Your Location',
                  country: data.sys?.country || '',
                  lat: latitude,
                  lng: longitude
                });
                setSelectedCityWeather(data);
                
                toast.success("Found your location!");
              }
            })
            .catch(error => {
              console.error("Error fetching weather for user location:", error);
              toast.error("Failed to fetch weather for your location");
            });
        },
        (error) => {
          console.error("Geolocation error:", error);
          
          let errorMessage = "Failed to get your location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const updateWeatherLayer = (map = mapInstance) => {
    if (!map || typeof window === 'undefined' || !window.L) return;

    try {
      // Remove existing layer if it exists
      if (layerInstance) {
        map.removeLayer(layerInstance);
      }

      // Add the selected weather layer
      const tileUrl = getOpenWeatherMapTileUrl(activeLayer, '{z}', '{x}', '{y}');
      console.log("Using tile URL:", tileUrl);
      
      const layer = window.L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
        opacity: opacity,
        maxZoom: 18,
        tileSize: 256,
        zoomOffset: 0,
      });

      layer.addTo(map);
      setLayerInstance(layer);
      
      // Add event handlers for tile loading errors
      layer.on('tileerror', (error) => {
        console.error("Tile loading error:", error);
        if (!document.getElementById('map-error-message')) {
          toast.error("Some weather map tiles failed to load. This may be due to API usage limits.");
          
          // Add a small error indicator to the map
          const errorDiv = document.createElement('div');
          errorDiv.id = 'map-error-message';
          errorDiv.innerHTML = 'Some weather layers may not display correctly due to API limitations.';
          errorDiv.style.position = 'absolute';
          errorDiv.style.bottom = '10px';
          errorDiv.style.left = '10px';
          errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
          errorDiv.style.color = 'white';
          errorDiv.style.padding = '5px 10px';
          errorDiv.style.borderRadius = '4px';
          errorDiv.style.fontSize = '12px';
          errorDiv.style.zIndex = '1000';
          
          const mapContainer = map.getContainer();
          mapContainer.appendChild(errorDiv);
          
          // Remove the error message after 5 seconds
          setTimeout(() => {
            if (errorDiv.parentNode) {
              errorDiv.parentNode.removeChild(errorDiv);
            }
          }, 5000);
        }
      });
    } catch (error) {
      console.error("Error updating weather layer:", error);
      toast.error("Failed to update weather layer");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <h1 className="text-xl font-bold uppercase">World Weather Map</h1>
        <div className="flex space-x-4">
          <select
            value={activeLayer}
            onChange={(e) => setActiveLayer(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded uppercase text-sm"
          >
            <option value={WEATHER_LAYERS.TEMPERATURE}>Temperature</option>
            <option value={WEATHER_LAYERS.PRECIPITATION}>Precipitation</option>
            <option value={WEATHER_LAYERS.WIND}>Wind</option>
            <option value={WEATHER_LAYERS.CLOUDS}>Clouds</option>
            <option value={WEATHER_LAYERS.PRESSURE}>Pressure</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase">Opacity</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-24"
            />
          </div>
          
          <button
            onClick={handleMyLocationClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded uppercase text-sm flex items-center"
          >
            <MapPin size={16} className="mr-1" /> My Location
          </button>
        </div>
      </div>
      
      <div className="relative flex-grow">
        <LeafletMap
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={mapZoom}
          className="w-full h-full"
          onMapInitialized={handleMapInitialized}
        />
        
        {isLoadingCities && (
          <div className="absolute top-4 right-4 bg-white p-2 rounded shadow z-[1000]">
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-xs">Loading cities...</span>
            </div>
          </div>
        )}
        
        {selectedCity && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-lg z-[1000] max-w-md">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold">{selectedCity.name}, {selectedCity.country}</h2>
              <button 
                onClick={() => setSelectedCity(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            
            {selectedCityWeather ? (
              <div className="mt-2">
                <div className="flex items-center">
                  <img 
                    src={`https://openweathermap.org/img/wn/${selectedCityWeather.weather[0].icon}@2x.png`} 
                    alt={selectedCityWeather.weather[0].description}
                    className="w-16 h-16 -ml-4 -my-2"
                  />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(selectedCityWeather.main.temp)}°C</p>
                    <p className="text-gray-600 capitalize">{selectedCityWeather.weather[0].description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center">
                    <Thermometer size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">Feels like: {Math.round(selectedCityWeather.main.feels_like)}°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">Humidity: {selectedCityWeather.main.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <Wind size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">Wind: {Math.round(selectedCityWeather.wind.speed)} m/s</span>
                  </div>
                  <div className="flex items-center">
                    <Gauge size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">Pressure: {selectedCityWeather.main.pressure} hPa</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center">
                <div className="w-4 h-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm">Loading weather data...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
