import React, { useState } from 'react';
import { WeatherAlert } from '@/types/weatherTypes';
import { AlertTriangle, Bell, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useUserPreferences } from './UserPreferencesProvider';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  isLoading?: boolean;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts, isLoading = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { preferences } = useUserPreferences();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900">
          <div className="flex items-center">
            <AlertTriangle className="text-red-600 dark:text-red-400 mr-2" size={18} />
            <span className="font-medium text-sm">Weather Alerts</span>
          </div>
        </div>
        <div className="p-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0 || !preferences?.notificationSettings?.enableAlerts) {
    return null;
  }

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  
  if (activeAlerts.length === 0) {
    return null;
  }

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-600 text-white';
      case 'severe':
        return 'bg-orange-500 text-white';
      case 'moderate':
        return 'bg-yellow-400 text-black';
      case 'minor':
      default:
        return 'bg-blue-400 text-white';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 overflow-hidden">
      <div 
        className="flex items-center justify-between p-2 bg-red-100 dark:bg-red-900 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <AlertTriangle className="text-red-600 dark:text-red-400 mr-2" size={18} />
          <span className="font-medium text-sm">
            {activeAlerts.length} Weather {activeAlerts.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        </div>
        <div>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-2 text-sm">
          {activeAlerts.map(alert => (
            <div 
              key={alert.id} 
              className="mb-2 p-2 border-l-4 bg-gray-50 dark:bg-gray-700 rounded"
              style={{ borderLeftColor: getSeverityColor(alert.severity).split(' ')[0].replace('bg-', '') }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-0.5 rounded mr-2 ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <h4 className="font-medium">{alert.title}</h4>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissAlert(alert.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
              
              <p className="mt-1 text-gray-600 dark:text-gray-300 text-xs">
                {alert.description}
              </p>
              
              <div className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                {formatDate(alert.start)} - {formatDate(alert.end)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherAlerts;
