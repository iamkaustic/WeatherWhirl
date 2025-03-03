import React from 'react';
import { X } from 'lucide-react';
import { useUserPreferences } from './UserPreferencesProvider';
import { WeatherUnits } from '@/types/weatherTypes';

interface PreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ isOpen, onClose }) => {
  const { preferences, updateUnits, updateTheme, updateNotificationSettings } = useUserPreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Preferences</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Units Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Units</h3>
            
            {/* Temperature */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="temperature"
                    checked={preferences.units.temperature === 'celsius'}
                    onChange={() => updateUnits({ temperature: 'celsius' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Celsius (°C)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="temperature"
                    checked={preferences.units.temperature === 'fahrenheit'}
                    onChange={() => updateUnits({ temperature: 'fahrenheit' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Fahrenheit (°F)</span>
                </label>
              </div>
            </div>
            
            {/* Wind Speed */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wind Speed
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="wind"
                    checked={preferences.units.wind === 'ms'}
                    onChange={() => updateUnits({ wind: 'ms' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">m/s</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="wind"
                    checked={preferences.units.wind === 'kmh'}
                    onChange={() => updateUnits({ wind: 'kmh' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">km/h</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="wind"
                    checked={preferences.units.wind === 'mph'}
                    onChange={() => updateUnits({ wind: 'mph' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">mph</span>
                </label>
              </div>
            </div>
            
            {/* Pressure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pressure
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="pressure"
                    checked={preferences.units.pressure === 'hPa'}
                    onChange={() => updateUnits({ pressure: 'hPa' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">hPa</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="pressure"
                    checked={preferences.units.pressure === 'inHg'}
                    onChange={() => updateUnits({ pressure: 'inHg' })}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">inHg</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Theme Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Theme</h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="theme"
                  checked={preferences.theme === 'light'}
                  onChange={() => updateTheme('light')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Light</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="theme"
                  checked={preferences.theme === 'dark'}
                  onChange={() => updateTheme('dark')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Dark</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="theme"
                  checked={preferences.theme === 'auto'}
                  onChange={() => updateTheme('auto')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Auto (System)</span>
              </label>
            </div>
          </div>
          
          {/* Notifications Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Notifications</h3>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={preferences.notificationSettings.enableAlerts}
                  onChange={(e) => updateNotificationSettings({ enableAlerts: e.target.checked })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Enable Weather Alerts</span>
              </label>
            </div>
            
            {preferences.notificationSettings.enableAlerts && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Alert Severity
                  </label>
                  <select
                    className="form-select block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={preferences.notificationSettings.minSeverity}
                    onChange={(e) => updateNotificationSettings({ minSeverity: e.target.value as any })}
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Alerts
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300 w-32">High Temperature</span>
                      <input
                        type="number"
                        className="form-input w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={preferences.notificationSettings.customAlerts.highTemp}
                        onChange={(e) => updateNotificationSettings({
                          customAlerts: {
                            ...preferences.notificationSettings.customAlerts,
                            highTemp: parseInt(e.target.value)
                          }
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">°C</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300 w-32">Low Temperature</span>
                      <input
                        type="number"
                        className="form-input w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={preferences.notificationSettings.customAlerts.lowTemp}
                        onChange={(e) => updateNotificationSettings({
                          customAlerts: {
                            ...preferences.notificationSettings.customAlerts,
                            lowTemp: parseInt(e.target.value)
                          }
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">°C</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300 w-32">Strong Wind</span>
                      <input
                        type="number"
                        className="form-input w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={preferences.notificationSettings.customAlerts.wind}
                        onChange={(e) => updateNotificationSettings({
                          customAlerts: {
                            ...preferences.notificationSettings.customAlerts,
                            wind: parseInt(e.target.value)
                          }
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;
