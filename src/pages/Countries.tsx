import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TabNavigation from "@/components/TabNavigation";
import { getWeatherData } from "@/utils/weatherApi";
import { getAllCountries, getCitiesByCountry } from "@/utils/expandedCityData";

// Get countries from expanded city data
const countries = getAllCountries().map(name => {
  // Get the capital or first city for each country
  const cities = getCitiesByCountry(name);
  const capital = cities.length > 0 ? cities[0].name : "Unknown";
  
  // Generate a simple country code (first 2 letters)
  const code = name.substring(0, 2).toUpperCase();
  
  return { name, code, capital };
});

const Countries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Fetch weather data for selected country's capital
  const {
    data: weatherData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["weather", selectedCountry],
    queryFn: () => {
      const country = countries.find(c => c.name === selectedCountry);
      return country ? getWeatherData(country.capital) : null;
    },
    enabled: !!selectedCountry,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const tabs = [
    { label: "Current Weather", path: "/" },
    { label: "Countries / Cities", path: "/countries" },
    { label: "World Weather Map", path: "/world-weather-map" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">WeatherWhirl</h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="self-end sm:self-auto"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <TabNavigation tabs={tabs} />

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredCountries.map((country) => (
            <Card 
              key={country.code}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedCountry === country.name ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleCountrySelect(country.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{country.name}</h3>
                    <p className="text-sm text-gray-500">Capital: {country.capital}</p>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                    {country.code}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCountry && weatherData && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">
              Weather in {weatherData.location.name}, {weatherData.location.country}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="glass-card bg-white/40 p-4">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="mb-2">
                    <img 
                      src={weatherData.current.condition.icon} 
                      alt={weatherData.current.condition.text}
                      className="w-16 h-16"
                    />
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-1">
                    {Math.round(weatherData.current.temp_c)}°C
                  </h3>
                  
                  <p className="mb-4">{weatherData.current.condition.text}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-semibold">{weatherData.current.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p className="font-semibold">{Math.round(weatherData.current.wind_kph)} km/h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card bg-white/40">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">7-Day Forecast</h3>
                  <div className="space-y-3">
                    {weatherData.forecast.forecastday.map((day) => (
                      <div key={day.date} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={day.day.condition.icon} 
                            alt={day.day.condition.text}
                            className="w-10 h-10 mr-2"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                            <p className="text-xs text-gray-500">{day.day.condition.text}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{Math.round(day.day.maxtemp_c)}°</p>
                          <p className="text-xs text-gray-500">{Math.round(day.day.mintemp_c)}°</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Countries;
