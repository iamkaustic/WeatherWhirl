import React, { useState } from 'react';
import { useUserPreferences } from './UserPreferencesProvider';
import { Settings, X, Sun, Moon, AlertTriangle, Thermometer, Wind, Droplets, Ruler } from 'lucide-react';

interface UserPreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserPreferencesPanel: React.FC<UserPreferencesPanelProps> = ({ isOpen, onClose }) => {
  const { preferences, updateUnits, updateTheme, updateNotificationSettings, updateDashboardLayout, resetPreferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState('units');

  if (!isOpen) return null;

  const tabs = [
    { id: 'units', label: 'Units', icon: <Ruler size={16} /> },
    { id: 'theme', label: 'Theme', icon: <Sun size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <AlertTriangle size={16} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Settings size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">Preferences</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center justify-center p-3 text-sm flex-1 ${
                activeTab === tab.id 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {activeTab === 'units' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Temperature</h3>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.temperature === 'celsius'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ temperature: 'celsius' })}
                >
                  <Thermometer size={16} className="inline mr-1" />
                  Celsius (°C)
                </button>
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.temperature === 'fahrenheit'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ temperature: 'fahrenheit' })}
                >
                  <Thermometer size={16} className="inline mr-1" />
                  Fahrenheit (°F)
                </button>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Wind Speed</h3>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.wind === 'ms'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ wind: 'ms' })}
                >
                  <Wind size={16} className="inline mr-1" />
                  m/s
                </button>
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.wind === 'kmh'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ wind: 'kmh' })}
                >
                  <Wind size={16} className="inline mr-1" />
                  km/h
                </button>
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.wind === 'mph'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ wind: 'mph' })}
                >
                  <Wind size={16} className="inline mr-1" />
                  mph
                </button>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Precipitation</h3>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.precipitation === 'mm'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ precipitation: 'mm' })}
                >
                  <Droplets size={16} className="inline mr-1" />
                  Millimeters (mm)
                </button>
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.units.precipitation === 'in'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateUnits({ precipitation: 'in' })}
                >
                  <Droplets size={16} className="inline mr-1" />
                  Inches (in)
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">App Theme</h3>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.theme === 'light'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateTheme('light')}
                >
                  <Sun size={16} className="inline mr-1" />
                  Light
                </button>
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.theme === 'dark'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateTheme('dark')}
                >
                  <Moon size={16} className="inline mr-1" />
                  Dark
                </button>
                <button
                  className={`flex-1 p-2 text-sm rounded-md ${
                    preferences.theme === 'auto'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => updateTheme('auto')}
                >
                  <Sun size={16} className="inline mr-1" />
                  Auto
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Enable Weather Alerts</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.notificationSettings.enableAlerts}
                    onChange={(e) => updateNotificationSettings({ enableAlerts: e.target.checked })}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Minimum Alert Severity</h3>
              <select
                className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
                value={preferences.notificationSettings.minSeverity}
                onChange={(e) => updateNotificationSettings({ minSeverity: e.target.value as any })}
              >
                <option value="minor">Minor (All Alerts)</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="extreme">Extreme Only</option>
              </select>
              
              <h3 className="text-sm font-medium mb-2">Custom Alert Thresholds</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">High Temperature Alert (°C)</label>
                  <input 
                    type="number" 
                    className="w-20 p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
                    value={preferences.notificationSettings.customAlerts.highTemp}
                    onChange={(e) => updateNotificationSettings({ 
                      customAlerts: { 
                        ...preferences.notificationSettings.customAlerts,
                        highTemp: parseInt(e.target.value) 
                      } 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Low Temperature Alert (°C)</label>
                  <input 
                    type="number" 
                    className="w-20 p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
                    value={preferences.notificationSettings.customAlerts.lowTemp}
                    onChange={(e) => updateNotificationSettings({ 
                      customAlerts: { 
                        ...preferences.notificationSettings.customAlerts,
                        lowTemp: parseInt(e.target.value) 
                      } 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Wind Speed Alert (m/s)</label>
                  <input 
                    type="number" 
                    className="w-20 p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
                    value={preferences.notificationSettings.customAlerts.wind}
                    onChange={(e) => updateNotificationSettings({ 
                      customAlerts: { 
                        ...preferences.notificationSettings.customAlerts,
                        wind: parseInt(e.target.value) 
                      } 
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Rain Alert</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.notificationSettings.customAlerts.rain}
                      onChange={(e) => updateNotificationSettings({ 
                        customAlerts: { 
                          ...preferences.notificationSettings.customAlerts,
                          rain: e.target.checked 
                        } 
                      })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm">Snow Alert</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences.notificationSettings.customAlerts.snow}
                      onChange={(e) => updateNotificationSettings({ 
                        customAlerts: { 
                          ...preferences.notificationSettings.customAlerts,
                          snow: e.target.checked 
                        } 
                      })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Visible Widgets</h3>
              <div className="space-y-2">
                {[
                  { id: 'current-weather', label: 'Current Weather' },
                  { id: 'hourly-forecast', label: 'Hourly Forecast' },
                  { id: 'daily-forecast', label: 'Daily Forecast' },
                  { id: 'weather-details', label: 'Weather Details' },
                  { id: 'alerts', label: 'Weather Alerts' },
                  { id: 'air-quality', label: 'Air Quality' },
                ].map(widget => (
                  <div key={widget.id} className="flex items-center justify-between">
                    <label className="text-sm">{widget.label}</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={preferences.dashboardLayout.visibleWidgets.includes(widget.id)}
                        onChange={(e) => {
                          const visibleWidgets = e.target.checked
                            ? [...preferences.dashboardLayout.visibleWidgets, widget.id]
                            : preferences.dashboardLayout.visibleWidgets.filter(id => id !== widget.id);
                          updateDashboardLayout({ visibleWidgets });
                        }}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={resetPreferences}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
          >
            Reset to Default
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesPanel;
