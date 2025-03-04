import React, { createContext, useContext, useState, useEffect } from 'react';
import mountainBg from '../assets/images/mountain-bg.jpg';
import { useTheme } from './ThemeProvider';

interface BackgroundContextType {
  isBlurred: boolean;
  toggleBlur: () => void;
  backgroundImage: string;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

interface BackgroundProviderProps {
  children: React.ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Default to blurred on first visit
  const [isBlurred, setIsBlurred] = useState<boolean>(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    return hasVisitedBefore !== 'true';
  });

  useEffect(() => {
    // Set that the user has visited before
    localStorage.setItem('hasVisitedBefore', 'true');
  }, []);

  const toggleBlur = () => {
    setIsBlurred(prev => !prev);
  };

  const value = {
    isBlurred,
    toggleBlur,
    backgroundImage: mountainBg
  };

  return (
    <BackgroundContext.Provider value={value}>
      <div
        className="fixed inset-0 w-full h-full -z-10 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: `url(${mountainBg})`,
          filter: isDark ? 'brightness(0.7) saturate(1.2)' : 'brightness(1) saturate(1)'
        }}
      />
      {isBlurred && (
        <div 
          className={`fixed inset-0 w-full h-full -z-5 transition-all duration-500 ease-in-out ${
            isDark ? 'backdrop-blur-md bg-black/30' : 'backdrop-blur-md bg-white/20'
          }`} 
        />
      )}
      <div className="relative z-0">
        {children}
      </div>
    </BackgroundContext.Provider>
  );
};

export default BackgroundProvider;
