import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import weatherAnimation from '../assets/animations/weather-animation.json';
import BackgroundColorPicker from './BackgroundColorPicker';

interface AppHeaderProps {
  toggleTheme?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

const AppHeader: React.FC<AppHeaderProps> = ({ toggleTheme, theme = 'light' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 mt-7 sm:mt-5 ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-[#111] border-b border-[#222]'
            : 'bg-white border-b border-[#e5e5e5]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="flex items-center justify-between h-16 md:h-24">
          <a href="/" className="flex items-center gap-2 md:gap-3" style={{ cursor: 'pointer' }}>
            <div className="w-16 h-16 md:w-24 md:h-24">
              <Lottie 
                animationData={weatherAnimation} 
                loop={true} 
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span className={`text-xl md:text-2xl font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              WeatherWhirl
            </span>
          </a>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            <BackgroundColorPicker />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`rounded-none ${
                theme === 'dark' ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
              }`}
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
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
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className={`md:hidden py-4 px-2 ${
              theme === 'dark' ? 'bg-[#111] border-t border-[#222]' : 'bg-white border-t border-[#e5e5e5]'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
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
                    <Sun className="h-5 w-5" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Switch to Dark Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
