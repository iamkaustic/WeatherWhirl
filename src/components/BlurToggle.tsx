import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useBackground } from './BackgroundProvider';
import { useTheme } from './ThemeProvider';

const BlurToggle: React.FC = () => {
  const { isBlurred, toggleBlur } = useBackground();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleBlur}
      className={`fixed bottom-4 right-4 p-3 rounded-full transition-all duration-300 z-50 shadow-lg
        ${isDark 
          ? 'bg-gray-800/70 hover:bg-gray-700/80 text-white' 
          : 'bg-white/70 hover:bg-white/80 text-gray-800'} 
        backdrop-blur-md hover:shadow-xl transform hover:scale-105`}
      aria-label={isBlurred ? "Disable blur effect" : "Enable blur effect"}
      title={isBlurred ? "Disable blur effect" : "Enable blur effect"}
    >
      {isBlurred ? (
        <Eye className="h-5 w-5" />
      ) : (
        <EyeOff className="h-5 w-5" />
      )}
    </button>
  );
};

export default BlurToggle;
