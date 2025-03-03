import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X, Network, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import weatherAnimation from '../assets/animations/weather-animation.json';
import BackgroundColorPicker from './BackgroundColorPicker';
import { fetchIPInfo } from '../utils/ipInfoService';
import { useTheme } from './ThemeProvider';

interface AppHeaderProps {
  toggleTheme?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

const AppHeader: React.FC<AppHeaderProps> = ({ toggleTheme, theme = 'light' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // IP Info state
  const [ipInfo, setIpInfo] = useState({
    ip: '',
    isp: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* IP Info Bar */}
      <div className={`w-full py-0.5 px-2 text-xs flex flex-wrap justify-center items-center gap-1 md:gap-2 ${
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
      
      {/* Main Header */}
      <div className={`${
        theme === 'dark'
          ? 'bg-[#111] border-b border-[#222]'
          : 'bg-white border-b border-[#e5e5e5]'
      }`}>
        <div className="container mx-auto px-3 max-w-screen-xl">
          <div className="flex items-center justify-between h-12 md:h-16">
            <a href="/" className="flex items-center gap-1 md:gap-2" style={{ cursor: 'pointer' }}>
              <div className="w-10 h-10 md:w-14 md:h-14">
                <Lottie 
                  animationData={weatherAnimation} 
                  loop={true} 
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <span className={`text-lg md:text-xl font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                WeatherWhirl
              </span>
            </a>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-3">
              <BackgroundColorPicker />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`rounded-none ${
                  theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className={`rounded-none ${
                  theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                }`}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div 
              className={`md:hidden py-3 px-2 ${
                theme === 'dark' ? 'bg-[#111] border-t border-[#222]' : 'bg-white border-t border-[#e5e5e5]'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <BackgroundColorPicker />
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                  }`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span className="text-sm">Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span className="text-sm">Switch to Dark Mode</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
