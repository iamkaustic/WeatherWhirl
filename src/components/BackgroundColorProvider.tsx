import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available background color options
export const backgroundColors = {
  default: {
    light: '#ffffff',
    dark: '#111111',
  },
  blue: {
    light: '#e6f2ff',
    dark: '#0a1929',
  },
  green: {
    light: '#e6f5ec',
    dark: '#0a2918',
  },
  purple: {
    light: '#f2e6ff',
    dark: '#190a29',
  },
  amber: {
    light: '#fff8e6',
    dark: '#291f0a',
  },
  gray: {
    light: '#f2f2f2',
    dark: '#1a1a1a',
  }
};

export type BackgroundColorOption = keyof typeof backgroundColors;

type BackgroundColorContextType = {
  backgroundColor: BackgroundColorOption;
  setBackgroundColor: (color: BackgroundColorOption) => void;
  getBgColor: (theme: 'light' | 'dark') => string;
};

const BackgroundColorContext = createContext<BackgroundColorContextType | undefined>(undefined);

export const BackgroundColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get saved background color from localStorage or use default
  const [backgroundColor, setBackgroundColorState] = useState<BackgroundColorOption>(() => {
    const savedColor = localStorage.getItem('weatherwhirl-bg-color');
    return (savedColor as BackgroundColorOption) || 'default';
  });

  // Save background color to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('weatherwhirl-bg-color', backgroundColor);
  }, [backgroundColor]);

  // Function to set background color
  const setBackgroundColor = (color: BackgroundColorOption) => {
    setBackgroundColorState(color);
  };

  // Function to get the actual color based on theme
  const getBgColor = (theme: 'light' | 'dark') => {
    return backgroundColors[backgroundColor][theme];
  };

  return (
    <BackgroundColorContext.Provider value={{ backgroundColor, setBackgroundColor, getBgColor }}>
      {children}
    </BackgroundColorContext.Provider>
  );
};

// Custom hook to use background color context
export const useBackgroundColor = () => {
  const context = useContext(BackgroundColorContext);
  if (context === undefined) {
    throw new Error('useBackgroundColor must be used within a BackgroundColorProvider');
  }
  return context;
};
