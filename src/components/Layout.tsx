import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppHeader from './AppHeader';
import { useTheme } from './ThemeProvider';
import { getUserHits, incrementUserHits } from '@/utils/userHits';
import IPInfoBar from './IPInfoBar';
import { useBackgroundColor } from './BackgroundColorProvider';

const Layout: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { getBgColor } = useBackgroundColor();
  const [userHits, setUserHits] = useState<number>(0);

  useEffect(() => {
    // Increment user hits on component mount
    const hits = incrementUserHits();
    setUserHits(hits);
  }, []);

  // Get the background color based on the current theme
  const bgColor = getBgColor(resolvedTheme);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: bgColor,
        color: resolvedTheme === 'dark' ? 'white' : '#111111',
        transition: 'background-color 0.3s ease'
      }}
    >
      <IPInfoBar />
      <AppHeader toggleTheme={toggleTheme} theme={resolvedTheme} />
      
      <main className="pt-24 md:pt-32 pb-12 md:pb-16 px-3 md:px-4 max-w-screen-xl mx-auto">
        <Outlet />
      </main>
      
      <footer className={`py-6 md:py-8 border-t ${
        resolvedTheme === 'dark' ? 'border-[#222]' : 'border-[#e5e5e5]'
      }`}>
        <div className="container mx-auto px-3 md:px-4 max-w-screen-xl">
          <div className="text-center text-xs md:text-sm text-gray-500">
            <div>Made with love using AI by iamkaustic</div>
            <div className="mt-2">User Visits: {userHits}</div>
          </div>
        </div>
      </footer>
      
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default Layout;
