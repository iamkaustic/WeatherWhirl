import { WeatherUnits } from '@/types/weatherTypes';

// Temperature conversions
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

// Wind speed conversions
export const msToKmh = (ms: number): number => {
  return ms * 3.6;
};

export const msToMph = (ms: number): number => {
  return ms * 2.237;
};

export const kmhToMs = (kmh: number): number => {
  return kmh / 3.6;
};

export const mphToMs = (mph: number): number => {
  return mph / 2.237;
};

// Pressure conversions
export const hPaToInHg = (hPa: number): number => {
  return hPa * 0.02953;
};

export const inHgToHPa = (inHg: number): number => {
  return inHg / 0.02953;
};

// Distance conversions
export const kmToMiles = (km: number): number => {
  return km * 0.621371;
};

export const milesToKm = (miles: number): number => {
  return miles / 0.621371;
};

// Precipitation conversions
export const mmToInches = (mm: number): number => {
  return mm * 0.0393701;
};

export const inchesToMm = (inches: number): number => {
  return inches / 0.0393701;
};

// Format temperature based on user preferences
export const formatTemperature = (temp: number, units: WeatherUnits): string => {
  if (units.temperature === 'fahrenheit') {
    return `${Math.round(celsiusToFahrenheit(temp))}°F`;
  }
  return `${Math.round(temp)}°C`;
};

// Format wind speed based on user preferences
export const formatWindSpeed = (speed: number, units: WeatherUnits): string => {
  if (units.wind === 'kmh') {
    return `${Math.round(msToKmh(speed))} km/h`;
  } else if (units.wind === 'mph') {
    return `${Math.round(msToMph(speed))} mph`;
  }
  return `${Math.round(speed)} m/s`;
};

// Format pressure based on user preferences
export const formatPressure = (pressure: number, units: WeatherUnits): string => {
  if (units.pressure === 'inHg') {
    return `${hPaToInHg(pressure).toFixed(2)} inHg`;
  }
  return `${pressure} hPa`;
};

// Format distance based on user preferences
export const formatDistance = (distance: number, units: WeatherUnits): string => {
  if (units.distance === 'mi') {
    return `${kmToMiles(distance).toFixed(1)} mi`;
  }
  return `${distance.toFixed(1)} km`;
};

// Format precipitation based on user preferences
export const formatPrecipitation = (amount: number, units: WeatherUnits): string => {
  if (units.precipitation === 'in') {
    return `${mmToInches(amount).toFixed(2)} in`;
  }
  return `${amount.toFixed(1)} mm`;
};

// Convert all weather data to user's preferred units
export const convertWeatherDataToUserUnits = (data: any, units: WeatherUnits): any => {
  if (!data) return data;
  
  const convertedData = { ...data };
  
  // Convert current weather data
  if (convertedData.current) {
    const current = { ...convertedData.current };
    
    if (units.temperature === 'fahrenheit' && current.temp !== undefined) {
      current.temp = celsiusToFahrenheit(current.temp);
      if (current.feels_like !== undefined) {
        current.feels_like = celsiusToFahrenheit(current.feels_like);
      }
    }
    
    convertedData.current = current;
  }
  
  // Convert daily forecast data
  if (convertedData.daily && Array.isArray(convertedData.daily)) {
    convertedData.daily = convertedData.daily.map((day: any) => {
      const convertedDay = { ...day };
      
      if (units.temperature === 'fahrenheit' && convertedDay.temp) {
        convertedDay.temp = {
          min: celsiusToFahrenheit(convertedDay.temp.min),
          max: celsiusToFahrenheit(convertedDay.temp.max)
        };
      }
      
      return convertedDay;
    });
  }
  
  // Convert hourly forecast data
  if (convertedData.hourly && Array.isArray(convertedData.hourly)) {
    convertedData.hourly = convertedData.hourly.map((hour: any) => {
      const convertedHour = { ...hour };
      
      if (units.temperature === 'fahrenheit' && convertedHour.temp !== undefined) {
        convertedHour.temp = celsiusToFahrenheit(convertedHour.temp);
      }
      
      return convertedHour;
    });
  }
  
  return convertedData;
};
