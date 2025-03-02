import React, { useEffect, useState } from 'react';
import { fetchIPInfo } from '../utils/ipInfoService';
import { useTheme } from './ThemeProvider';
import { Network } from 'lucide-react';

const IPInfoBar: React.FC = () => {
  const [ipInfo, setIpInfo] = useState({
    ip: '',
    isp: ''
  });
  const [isLoading, setIsLoading] = useState(true);
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
  }, []);

  return (
    <div className={`w-full py-1 px-4 text-xs flex flex-wrap justify-center items-center gap-2 md:gap-4 ${
      isDark ? 'bg-[#222] text-gray-300' : 'bg-gray-100 text-gray-700'
    }`}>
      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Your ISP and IP details:
      </div>
      
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Network className="h-3 w-3" />
          <span>Loading network information...</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1">
            <Network className="h-3 w-3" />
            <span>IP: {ipInfo.ip}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>ISP: {ipInfo.isp}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPInfoBar;
