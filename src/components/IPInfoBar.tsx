import React, { useEffect, useState } from 'react';
import { fetchIPInfo } from '../utils/ipInfoService';
import { useTheme } from './ThemeProvider';
import { Network, Clock } from 'lucide-react';

const IPInfoBar: React.FC = () => {
  const [ipInfo, setIpInfo] = useState({
    ip: '',
    isp: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const getIPInfo = async () => {
      try {
        setIsLoading(true);
        const data = await fetchIPInfo();
        setIpInfo({
          ip: data.ip,
          isp: data.org || data.isp || 'Unknown ISP'
        });
      } catch (error) {
        console.error('Error in IP Info component:', error);
        setIpInfo({
          ip: 'Unable to fetch IP',
          isp: 'Unknown ISP'
        });
      } finally {
        setIsLoading(false);
      }
    };

    getIPInfo();
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`w-full py-0.5 px-2 text-xs flex flex-wrap justify-center items-center gap-1 md:gap-2 relative z-50 ${
      isDark ? 'bg-[#222] text-gray-300' : 'bg-gray-100 text-gray-700'
    }`}>
      <div className="flex items-center gap-1 border-r pr-1 border-gray-400">
        <Clock className="h-2.5 w-2.5" />
        <span className="text-xs">{formatTime(currentDateTime)} | {formatDate(currentDateTime)}</span>
      </div>
      
      <div className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Your ISP and IP:
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-1">
          <Network className="h-2.5 w-2.5" />
          <span className="text-xs">Loading...</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <div className="flex items-center gap-1">
            <Network className="h-2.5 w-2.5" />
            <span className="text-xs">IP: {ipInfo.ip}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">ISP: {ipInfo.isp}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPInfoBar;
