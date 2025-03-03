import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences, WeatherUnits } from '@/types/weatherTypes';

// Default user preferences
const defaultPreferences: UserPreferences = {
  units: {
    temperature: 'celsius',
    wind: 'ms',
    pressure: 'hPa',
    distance: 'km',
    precipitation: 'mm',
  },
  theme: 'auto',
  notificationSettings: {
    enableAlerts: true,
    alertTypes: ['severe', 'extreme'],
    minSeverity: 'moderate',
    customAlerts: {
      highTemp: 35,
      lowTemp: 0,
      rain: true,
      snow: true,
      wind: 20,
    },
  },
  dashboardLayout: {
    visibleWidgets: [
      'current-weather',
      'hourly-forecast',
      'daily-forecast',
      'weather-details',
      'alerts',
      'air-quality',
    ],
    widgetOrder: [
      'current-weather',
      'hourly-forecast',
      'daily-forecast',
      'weather-details',
      'alerts',
      'air-quality',
    ],
  },
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateUnits: (units: Partial<WeatherUnits>) => void;
  updateTheme: (theme: 'light' | 'dark' | 'auto') => void;
  updateNotificationSettings: (settings: Partial<UserPreferences['notificationSettings']>) => void;
  updateDashboardLayout: (layout: Partial<UserPreferences['dashboardLayout']>) => void;
  resetPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Load preferences from localStorage if available
    const savedPreferences = localStorage.getItem('weatherwhirl_preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weatherwhirl_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updateUnits = (units: Partial<WeatherUnits>) => {
    setPreferences((prev) => ({
      ...prev,
      units: { ...prev.units, ...units },
    }));
  };

  const updateTheme = (theme: 'light' | 'dark' | 'auto') => {
    setPreferences((prev) => ({
      ...prev,
      theme,
    }));
  };

  const updateNotificationSettings = (settings: Partial<UserPreferences['notificationSettings']>) => {
    setPreferences((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        ...settings,
        customAlerts: {
          ...prev.notificationSettings.customAlerts,
          ...settings.customAlerts,
        },
      },
    }));
  };

  const updateDashboardLayout = (layout: Partial<UserPreferences['dashboardLayout']>) => {
    setPreferences((prev) => ({
      ...prev,
      dashboardLayout: {
        ...prev.dashboardLayout,
        ...layout,
      },
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updateUnits,
        updateTheme,
        updateNotificationSettings,
        updateDashboardLayout,
        resetPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
