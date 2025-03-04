import React, { useEffect, useState, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppHeader from './AppHeader';
import { useTheme } from './ThemeProvider';
import { getUserHits, incrementUserHits } from '@/utils/userHits';
import { useBackgroundColor } from './BackgroundColorProvider';
import { useBackground } from './BackgroundProvider';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { getBgColor } = useBackgroundColor();
  const { isBlurred } = useBackground();
  const [userHits, setUserHits] = useState<number>(0);

  useEffect(() => {
    // Increment user hits on component mount
    const hits = incrementUserHits();
    setUserHits(hits);
  }, []);

  // Get the background color based on the current theme, but make it transparent
  const bgColor = 'transparent';

  return (
    <div 
      className="min-h-screen"
      style={{ 
        color: resolvedTheme === 'dark' ? 'white' : '#111111',
        transition: 'background-color 0.3s ease'
      }}
    >
      <AppHeader toggleTheme={toggleTheme} theme={resolvedTheme} />
      
      <main className="pt-20 md:pt-24 pb-8 md:pb-12 px-2 md:px-3 max-w-screen-xl mx-auto">
        <div className={`${isBlurred ? 'backdrop-blur-md bg-white/10 dark:bg-black/10' : 'bg-white/80 dark:bg-gray-900/80'} rounded-xl shadow-lg transition-all duration-300 p-4 md:p-6`}>
          {children || <Outlet />}
        </div>
      </main>
      
      <footer className={`py-4 md:py-6 border-t ${
        resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
      } backdrop-blur-sm bg-white/10 dark:bg-black/10`}>
        <div className="container mx-auto px-2 md:px-3 max-w-screen-xl">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Weather Whirl
              </p>
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-blue-400 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Crafted with <span className="text-red-500">♥</span> by <a href="https://instagram.com/iamkaustic" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:text-blue-600 transition-colors">@iamkaustic</a>
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">User Visits: {userHits}</div>
          </div>
        </div>
      </footer>
      
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default Layout;
