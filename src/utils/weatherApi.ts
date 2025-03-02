import { toast } from "sonner";

// Types
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    is_day: number;
    precip_mm: number;
    pressure_mb: number;
    vis_km: number;
    cloud: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    daily_chance_of_rain: number;
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: {
    time: string;
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    chance_of_rain: number;
    is_day: number;
  }[];
}

const API_KEY = "6648586b2ef719174cf86f64362cdd7a"; // OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Get weather data for a specific location by coordinates
 */
export const getWeatherByCoordinates = async (
  lat: number,
  lon: number,
  days: number = 7
): Promise<WeatherData> => {
  try {
    // Get current weather
    const currentWeatherUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(errorData.message || "Failed to fetch current weather data");
    }
    
    const currentData = await currentResponse.json();
    
    // Get forecast data
    const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      throw new Error(errorData.message || "Failed to fetch forecast data");
    }
    
    const forecastData = await forecastResponse.json();
    
    // Map the data to our expected format
    return mapOpenWeatherDataToAppFormat(currentData, forecastData, days);
    
  } catch (error) {
    let message = "Failed to fetch weather data";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Weather API Error:", error);
    toast.error(message);
    throw error;
  }
};

/**
 * Get weather data for a specific location
 */
export const getWeatherData = async (
  query: string = "",
  days: number = 7
): Promise<WeatherData | null> => {
  try {
    // Parse coordinates from query if in format "lat,lon"
    let lat: string | null = null;
    let lon: string | null = null;
    
    if (query.includes(",")) {
      const parts = query.split(",");
      if (parts.length === 2) {
        lat = parts[0].trim();
        lon = parts[1].trim();
      }
    }
    
    // First, get current weather
    const currentWeatherUrl = lat && lon 
      ? `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      : query 
        ? `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`
        : `${BASE_URL}/weather?q=London&appid=${API_KEY}&units=metric`; // Default to London if no query
    
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();
      throw new Error(errorData.message || "Failed to fetch current weather data");
    }
    
    const currentData = await currentResponse.json();
    
    // Next, get forecast data using coordinates from current weather
    const forecastUrl = `${BASE_URL}/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      throw new Error(errorData.message || "Failed to fetch forecast data");
    }
    
    const forecastData = await forecastResponse.json();
    
    // Map the data to our expected format
    return mapOpenWeatherDataToAppFormat(currentData, forecastData, days);
    
  } catch (error) {
    let message = "Failed to fetch weather data";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("Weather API Error:", error);
    toast.error(message);
    return null;
  }
};

/**
 * Maps OpenWeatherMap API data to our app's data format
 */
const mapOpenWeatherDataToAppFormat = (currentData: any, forecastData: any, days: number): WeatherData => {
  // Get country name
  const country = currentData.sys.country;
  
  // Convert visibility from meters to km
  const visibilityKm = currentData.visibility / 1000;
  
  // Map OpenWeatherMap condition codes to our condition codes
  const conditionCode = mapConditionCode(currentData.weather[0].id);
  
  // Process forecast data into daily format
  const forecastDays = processOpenWeatherForecast(forecastData, days);
  
  // Create the final data structure
  return {
    location: {
      name: currentData.name,
      country: country,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon
    },
    current: {
      temp_c: currentData.main.temp,
      temp_f: celsiusToFahrenheit(currentData.main.temp),
      condition: {
        text: currentData.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        code: conditionCode
      },
      wind_kph: msToKph(currentData.wind.speed),
      wind_dir: degreesToDirection(currentData.wind.deg),
      humidity: currentData.main.humidity,
      feelslike_c: currentData.main.feels_like,
      feelslike_f: celsiusToFahrenheit(currentData.main.feels_like),
      uv: currentData.uvi || 0, // OpenWeatherMap might not always include UV
      is_day: isDay(currentData.dt, currentData.sys.sunrise, currentData.sys.sunset),
      precip_mm: currentData.rain ? currentData.rain["1h"] || 0 : 0,
      pressure_mb: currentData.main.pressure,
      vis_km: visibilityKm,
      cloud: currentData.clouds ? currentData.clouds.all : 0
    },
    forecast: {
      forecastday: forecastDays
    }
  };
};

/**
 * Process the OpenWeatherMap forecast data to daily forecasts
 */
const processOpenWeatherForecast = (forecastData: any, days: number): ForecastDay[] => {
  // Group forecast by day
  const dailyForecasts = new Map<string, any[]>();
  
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyForecasts.has(date)) {
      dailyForecasts.set(date, []);
    }
    dailyForecasts.get(date)?.push(item);
  });
  
  // Process each day's data
  const result: ForecastDay[] = [];
  let processedDays = 0;
  
  dailyForecasts.forEach((items, date) => {
    if (processedDays >= days) return;
    
    // Find min and max temps for the day
    let minTemp = Number.MAX_VALUE;
    let maxTemp = Number.MIN_VALUE;
    let totalTemp = 0;
    let conditionCounts: Record<string, number> = {};
    let maxConditionCount = 0;
    let mostCommonCondition = items[0].weather[0];
    
    // Extract hourly data
    const hourlyData = items.map((item: any) => {
      const temp = item.main.temp;
      minTemp = Math.min(minTemp, temp);
      maxTemp = Math.max(maxTemp, temp);
      totalTemp += temp;
      
      // Count occurrences of each condition
      const conditionId = item.weather[0].id;
      conditionCounts[conditionId] = (conditionCounts[conditionId] || 0) + 1;
      
      if (conditionCounts[conditionId] > maxConditionCount) {
        maxConditionCount = conditionCounts[conditionId];
        mostCommonCondition = item.weather[0];
      }
      
      return {
        time: new Date(item.dt * 1000).toISOString(),
        temp_c: temp,
        temp_f: celsiusToFahrenheit(temp),
        condition: {
          text: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          code: mapConditionCode(item.weather[0].id)
        },
        chance_of_rain: item.pop ? Math.round(item.pop * 100) : 0,
        is_day: isDay(item.dt, forecastData.city.sunrise, forecastData.city.sunset)
      };
    });
    
    // Calculate daily chance of rain (average of hourly chances)
    const dailyChanceOfRain = hourlyData.reduce((sum, hour) => sum + hour.chance_of_rain, 0) / hourlyData.length;
    
    // Create the day forecast
    const dayForecast: ForecastDay = {
      date,
      day: {
        maxtemp_c: maxTemp,
        maxtemp_f: celsiusToFahrenheit(maxTemp),
        mintemp_c: minTemp,
        mintemp_f: celsiusToFahrenheit(minTemp),
        avgtemp_c: totalTemp / items.length,
        avgtemp_f: celsiusToFahrenheit(totalTemp / items.length),
        condition: {
          text: mostCommonCondition.description,
          icon: `https://openweathermap.org/img/wn/${mostCommonCondition.icon}@2x.png`,
          code: mapConditionCode(mostCommonCondition.id)
        },
        daily_chance_of_rain: Math.round(dailyChanceOfRain),
        uv: 0 // OpenWeatherMap doesn't provide UV in the forecast
      },
      astro: {
        sunrise: "", // Need to get from additional API call or use different approach
        sunset: ""  // Need to get from additional API call or use different approach
      },
      hour: hourlyData
    };
    
    result.push(dayForecast);
    processedDays++;
  });
  
  return result;
};

// Utility functions
const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

const msToKph = (metersPerSecond: number): number => {
  return metersPerSecond * 3.6;
};

const degreesToDirection = (degrees: number): string => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const isDay = (currentTime: number, sunrise: number, sunset: number): number => {
  return (currentTime > sunrise && currentTime < sunset) ? 1 : 0;
};

/**
 * Map OpenWeatherMap condition codes to our internal codes
 */
const mapConditionCode = (openWeatherCode: number): number => {
  // Weather condition mapping (simplified)
  // Clear
  if (openWeatherCode === 800) {
    return 1000; // Clear/Sunny
  }
  
  // Clouds
  if (openWeatherCode >= 801 && openWeatherCode <= 804) {
    const cloudCodes = [1003, 1006, 1009, 1009]; // From partly cloudy to overcast
    return cloudCodes[openWeatherCode - 801] || 1006;
  }
  
  // Rain
  if ((openWeatherCode >= 300 && openWeatherCode <= 321) || 
      (openWeatherCode >= 500 && openWeatherCode <= 531)) {
    return [1063, 1180, 1183, 1186, 1189, 1192, 1195][Math.min(6, Math.floor((openWeatherCode % 100) / 10))] || 1183;
  }
  
  // Snow
  if (openWeatherCode >= 600 && openWeatherCode <= 622) {
    return [1066, 1210, 1213, 1216, 1219, 1222, 1225][Math.min(6, openWeatherCode % 10)] || 1213;
  }
  
  // Thunderstorm
  if (openWeatherCode >= 200 && openWeatherCode <= 232) {
    return 1087;
  }
  
  // Mist, Fog, etc.
  if (openWeatherCode >= 700 && openWeatherCode <= 781) {
    return 1030;
  }
  
  return 1006; // Default to cloudy
};

// Keep the existing weather gradient and animation functions
export const getWeatherGradientClass = (conditionCode: number): string => {
  // Condition codes from WeatherAPI.com
  // 1000 (Clear/Sunny)
  if (conditionCode === 1000) {
    return "weather-gradient-sunny";
  }
  // 1003, 1006, 1009, 1030, 1135, 1147 (Cloudy conditions)
  if ([1003, 1006, 1009, 1030, 1135, 1147].includes(conditionCode)) {
    return "weather-gradient-cloudy";
  }
  // 1063, 1072, 1150, 1153, 1168, 1171, 1180-1201, 1240-1246 (Rainy conditions)
  if (
    [1063, 1072, 1150, 1153, 1168, 1171].includes(conditionCode) ||
    (conditionCode >= 1180 && conditionCode <= 1201) ||
    (conditionCode >= 1240 && conditionCode <= 1246)
  ) {
    return "weather-gradient-rainy";
  }
  // 1066, 1069, 1114, 1117, 1204-1237, 1249-1264 (Snowy conditions)
  if (
    [1066, 1069, 1114, 1117].includes(conditionCode) ||
    (conditionCode >= 1204 && conditionCode <= 1237) ||
    (conditionCode >= 1249 && conditionCode <= 1264)
  ) {
    return "weather-gradient-snowy";
  }
  // 1087, 1273-1282 (Stormy conditions)
  if (
    conditionCode === 1087 ||
    (conditionCode >= 1273 && conditionCode <= 1282)
  ) {
    return "weather-gradient-stormy";
  }

  // Default
  return "weather-gradient-cloudy";
};

export const getWeatherAnimationClass = (conditionCode: number): string => {
  // Sunny
  if (conditionCode === 1000) {
    return "animate-sun";
  }
  // Cloudy
  if ([1003, 1006, 1009, 1030].includes(conditionCode)) {
    return "animate-cloud";
  }
  // Rainy
  if (
    [1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)
  ) {
    return "animate-rain";
  }
  // Snowy
  if (
    [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)
  ) {
    return "animate-snow";
  }
  
  // Default
  return "";
};

export const getWeatherIconName = (conditionCode: number, isDay: number): string => {
  const day = isDay === 1;
  
  // Clear/Sunny
  if (conditionCode === 1000) {
    return day ? "Sun" : "Moon";
  }
  
  // Partly cloudy
  if (conditionCode === 1003) {
    return day ? "CloudSun" : "CloudMoon";
  }
  
  // Cloudy
  if ([1006, 1009].includes(conditionCode)) {
    return "Cloud";
  }
  
  // Mist/Fog
  if ([1030, 1135, 1147].includes(conditionCode)) {
    return "CloudFog";
  }
  
  // Rain
  if (
    [1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)
  ) {
    return "CloudRain";
  }
  
  // Heavy rain
  if ([1201, 1202].includes(conditionCode)) {
    return "CloudDownpour";
  }
  
  // Snow
  if (
    [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)
  ) {
    return "CloudSnow";
  }
  
  // Thunderstorm
  if (
    conditionCode === 1087 ||
    (conditionCode >= 1273 && conditionCode <= 1282)
  ) {
    return "CloudLightning";
  }
  
  // Default - cloud
  return "Cloud";
};
