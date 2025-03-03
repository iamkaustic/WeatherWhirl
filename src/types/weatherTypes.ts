// Weather data types
export interface WeatherLocation {
  id?: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  isFavorite: boolean;
  label?: string;
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  start: number;
  end: number;
  source?: string;
}

export interface AirQuality {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
  timestamp?: number;
}

// Alias for AirQuality to match component usage
export type AirQualityData = AirQuality;

export interface WeatherUnits {
  temperature: 'celsius' | 'fahrenheit';
  wind: 'ms' | 'kmh' | 'mph';
  pressure: 'hPa' | 'inHg';
  distance: 'km' | 'mi';
  precipitation: 'mm' | 'in';
}

export interface UserPreferences {
  units: WeatherUnits;
  theme: 'light' | 'dark' | 'auto';
  notificationSettings: {
    enableAlerts: boolean;
    alertTypes: string[];
    minSeverity: 'minor' | 'moderate' | 'severe' | 'extreme';
    customAlerts: {
      highTemp?: number;
      lowTemp?: number;
      rain?: boolean;
      snow?: boolean;
      wind?: number;
    };
  };
  dashboardLayout: {
    visibleWidgets: string[];
    widgetOrder: string[];
  };
}

export interface HistoricalWeatherData {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  precipitation: number;
  condition: string;
}

export interface OutdoorActivity {
  name: string;
  score: number;
  recommendation: string;
}

export interface WeatherImpact {
  activities: OutdoorActivity[];
  clothing: string[];
  healthWarnings: string[];
  travelImpact: string;
}

// Enhanced weather data interface
export interface EnhancedWeatherData extends CombinedWeatherData {
  alerts?: WeatherAlert[];
  airQuality?: AirQuality;
  historical?: HistoricalWeatherData[];
  impact?: WeatherImpact;
}

// Existing interface from the app
export interface CombinedWeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_direction?: number;
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
    pop?: number; // Probability of precipitation
    rain?: number;
    snow?: number;
    uvi?: number;
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
    pop?: number; // Probability of precipitation
  }[];
  location: {
    name: string;
    country: string;
    lat?: number;
    lon?: number;
  };
}
