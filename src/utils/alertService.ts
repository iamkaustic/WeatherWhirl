import { WeatherAlert, UserPreferences } from '@/types/weatherTypes';

// Check if browser supports notifications
export const checkNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Send a notification
export const sendNotification = (title: string, options: NotificationOptions): void => {
  if (!('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

// Process weather alerts based on user preferences
export const processWeatherAlerts = (
  alerts: WeatherAlert[],
  preferences: UserPreferences
): WeatherAlert[] => {
  if (!preferences || !preferences.notificationSettings || !preferences.notificationSettings.enableAlerts) {
    return [];
  }

  const { minSeverity, alertTypes } = preferences.notificationSettings;
  const severityLevels = ['minor', 'moderate', 'severe', 'extreme'];
  const minSeverityIndex = severityLevels.indexOf(minSeverity);

  return alerts.filter((alert) => {
    const alertSeverityIndex = severityLevels.indexOf(alert.severity);
    // Filter by minimum severity level
    if (alertSeverityIndex < minSeverityIndex) {
      return false;
    }
    // Filter by alert types if specified
    if (alertTypes.length > 0 && !alertTypes.includes(alert.type)) {
      return false;
    }
    return true;
  });
};

// Check for custom alerts based on weather data
export const checkCustomAlerts = (
  currentWeather: any,
  preferences: UserPreferences
): WeatherAlert[] => {
  if (!preferences || !preferences.notificationSettings) {
    return [];
  }

  const customAlerts: WeatherAlert[] = [];
  const { customAlerts: settings } = preferences.notificationSettings;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // High temperature alert
  if (settings.highTemp && currentWeather.temp >= settings.highTemp) {
    customAlerts.push({
      id: `high-temp-${now}`,
      type: 'temperature',
      severity: 'moderate',
      title: 'High Temperature Alert',
      description: `Current temperature (${currentWeather.temp}°) exceeds your high temperature threshold (${settings.highTemp}°)`,
      start: now,
      end: now + oneDay,
    });
  }

  // Low temperature alert
  if (settings.lowTemp && currentWeather.temp <= settings.lowTemp) {
    customAlerts.push({
      id: `low-temp-${now}`,
      type: 'temperature',
      severity: 'moderate',
      title: 'Low Temperature Alert',
      description: `Current temperature (${currentWeather.temp}°) is below your low temperature threshold (${settings.lowTemp}°)`,
      start: now,
      end: now + oneDay,
    });
  }

  // Rain alert (check next 12 hours)
  if (settings.rain && currentWeather.hourly) {
    const nextTwelveHours = currentWeather.hourly.slice(0, 12);
    const willRain = nextTwelveHours.some((hour: any) => 
      hour.weather[0].main.toLowerCase().includes('rain') || 
      (hour.pop && hour.pop > 0.5)
    );
    
    if (willRain) {
      customAlerts.push({
        id: `rain-${now}`,
        type: 'precipitation',
        severity: 'minor',
        title: 'Rain Expected',
        description: 'Rain is expected in the next 12 hours',
        start: now,
        end: now + oneDay,
      });
    }
  }

  // Snow alert (check next 12 hours)
  if (settings.snow && currentWeather.hourly) {
    const nextTwelveHours = currentWeather.hourly.slice(0, 12);
    const willSnow = nextTwelveHours.some((hour: any) => 
      hour.weather[0].main.toLowerCase().includes('snow')
    );
    
    if (willSnow) {
      customAlerts.push({
        id: `snow-${now}`,
        type: 'precipitation',
        severity: 'minor',
        title: 'Snow Expected',
        description: 'Snow is expected in the next 12 hours',
        start: now,
        end: now + oneDay,
      });
    }
  }

  // Wind alert
  if (settings.wind && currentWeather.wind_speed >= settings.wind) {
    customAlerts.push({
      id: `wind-${now}`,
      type: 'wind',
      severity: 'moderate',
      title: 'High Wind Alert',
      description: `Current wind speed (${currentWeather.wind_speed} m/s) exceeds your wind threshold (${settings.wind} m/s)`,
      start: now,
      end: now + oneDay,
    });
  }

  return customAlerts;
};

// Register for push notifications (simplified version)
export const registerForPushNotifications = async (): Promise<boolean> => {
  try {
    const permission = await checkNotificationPermission();
    if (!permission) {
      return false;
    }
    
    // In a real implementation, you would register with a push service here
    // This is a simplified version
    console.log('Registered for push notifications');
    return true;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return false;
  }
};
