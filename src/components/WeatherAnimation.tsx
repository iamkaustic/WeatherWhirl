import React from 'react';
import { useTheme } from './ThemeProvider';

interface WeatherAnimationProps {
  weatherId: number;
  weatherMain: string;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weatherId, weatherMain }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Weather condition groups based on OpenWeatherMap API codes
  // 2xx: Thunderstorm
  // 3xx: Drizzle
  // 5xx: Rain
  // 6xx: Snow
  // 7xx: Atmosphere (fog, mist, etc.)
  // 800: Clear
  // 80x: Clouds
  
  // Get random color from a palette based on weather type
  const getRandomColor = (type: string): string => {
    const palettes = {
      thunder: ['#a090fb', '#6c5ce7', '#8e44ad', '#9b59b6', '#5f27cd'],
      rain: ['#73c0ff', '#0984e3', '#3498db', '#00a8ff', '#48dbfb'],
      snow: ['#b8e9ff', '#81ecec', '#dff9fb', '#c7ecee', '#d2dae2'],
      fog: ['#b2bec3', '#636e72', '#dfe6e9', '#a4b0be', '#d1d8e0'],
      clear: isDark 
        ? ['#ffeaa7', '#f1c40f', '#f9ca24', '#f6e58d', '#ffbe76'] 
        : ['#fdcb6e', '#f39c12', '#e67e22', '#e58e26', '#f6b93b'],
      clouds: isDark 
        ? ['#dfe6e9', '#b2bec3', '#a4b0be', '#d1d8e0', '#e5e7eb'] 
        : ['#74b9ff', '#0984e3', '#3498db', '#00a8ff', '#48dbfb']
    };
    
    let palette;
    if (weatherId >= 200 && weatherId < 300) palette = palettes.thunder;
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) palette = palettes.rain;
    else if (weatherId >= 600 && weatherId < 700) palette = palettes.snow;
    else if (weatherId >= 700 && weatherId < 800) palette = palettes.fog;
    else if (weatherId === 800) palette = palettes.clear;
    else palette = palettes.clouds;
    
    return palette[Math.floor(Math.random() * palette.length)];
  };
  
  const getAnimationForWeather = () => {
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      return (
        <div className="weather-animation thunderstorm">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`lightning ${i % 2 === 0 ? 'lightning-1' : 'lightning-2'}`} 
                 style={{ 
                   left: `${Math.random() * 100}%`, 
                   animationDelay: `${Math.random() * 5}s`,
                   background: `linear-gradient(to bottom, rgba(255, 255, 100, 0), ${getRandomColor('thunder')}90, rgba(255, 255, 100, 0))`,
                   width: `${2 + Math.random() * 3}px`,
                 }} />
          ))}
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={`rain-${i}`} className="raindrop" 
                 style={{ 
                   left: `${Math.random() * 100}%`, 
                   animationDuration: `${0.5 + Math.random() * 0.7}s`,
                   animationDelay: `${Math.random() * 2}s`,
                   background: `linear-gradient(to bottom, rgba(120, 190, 255, 0), ${getRandomColor('rain')}80)`,
                   width: `${1 + Math.random() * 2}px`,
                   height: `${15 + Math.random() * 10}px`,
                 }} />
          ))}
        </div>
      );
    }
    
    // Rain or Drizzle
    if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      const isRainbow = weatherId === 501 || weatherId === 500; // Light/moderate rain can have rainbow
      const isHeavyRain = weatherId >= 502; // Heavy rain
      const dropCount = isHeavyRain ? 40 : 30;
      
      return (
        <div className="weather-animation rain">
          {Array.from({ length: dropCount }).map((_, i) => (
            <div key={i} className="raindrop" 
                 style={{ 
                   left: `${Math.random() * 100}%`, 
                   animationDuration: `${0.5 + Math.random() * 0.7}s`,
                   animationDelay: `${Math.random() * 2}s`,
                   background: `linear-gradient(to bottom, rgba(120, 190, 255, 0), ${getRandomColor('rain')}80)`,
                   width: `${1 + Math.random() * 2}px`,
                   height: `${15 + Math.random() * 10}px`,
                 }} />
          ))}
          {isRainbow && <div className="rainbow-effect" />}
        </div>
      );
    }
    
    // Snow
    if (weatherId >= 600 && weatherId < 700) {
      return (
        <div className="weather-animation snow">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="snowflake" 
                 style={{ 
                   left: `${Math.random() * 100}%`,
                   width: `${5 + Math.random() * 5}px`,
                   height: `${5 + Math.random() * 5}px`,
                   animationDuration: `${2 + Math.random() * 3}s`,
                   animationDelay: `${Math.random() * 2}s`,
                   opacity: 0.5 + Math.random() * 0.5,
                   backgroundColor: `${getRandomColor('snow')}${Math.floor(70 + Math.random() * 30)}`
                 }} />
          ))}
          <div className="shimmer-effect" />
        </div>
      );
    }
    
    // Atmosphere (fog, mist, etc.)
    if (weatherId >= 700 && weatherId < 800) {
      return (
        <div className="weather-animation fog">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="fog-cloud" 
                 style={{ 
                   top: `${10 + i * 12}%`, 
                   left: `${-10 - (i % 3) * 10}%`,
                   opacity: 0.08 + (i % 4) * 0.04,
                   animationDuration: `${15 + Math.random() * 10}s`,
                   animationDelay: `${i * 0.5}s`,
                   background: `linear-gradient(to right, rgba(200, 210, 230, 0), ${getRandomColor('fog')}30, rgba(200, 210, 230, 0))`
                 }} />
          ))}
        </div>
      );
    }
    
    // Clear
    if (weatherId === 800) {
      return (
        <div className="weather-animation clear">
          <div className="sun-rays" style={{ 
            background: `radial-gradient(circle, ${getRandomColor('clear')}90 0%, ${getRandomColor('clear')}00 70%)`
          }} />
          {isDark && Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className={`star ${i % 5 === 0 ? 'star-twinkle' : ''}`} 
                 style={{ 
                   top: `${Math.random() * 100}%`,
                   left: `${Math.random() * 100}%`,
                   width: `${1 + Math.random() * 3}px`,
                   height: `${1 + Math.random() * 3}px`,
                   animationDelay: `${Math.random() * 5}s`,
                   backgroundColor: i % 3 === 0 
                     ? 'rgba(255, 230, 200, 0.9)' 
                     : i % 5 === 0 
                       ? 'rgba(200, 230, 255, 0.9)' 
                       : 'rgba(230, 230, 255, 0.9)'
                 }} />
          ))}
        </div>
      );
    }
    
    // Clouds
    if (weatherId > 800 && weatherId < 900) {
      // Add a rainbow for partly cloudy (801)
      const isPartlyCloudy = weatherId === 801;
      const cloudCount = weatherId === 801 ? 3 : weatherId === 802 ? 4 : 5;
      
      return (
        <div className="weather-animation clouds">
          {Array.from({ length: cloudCount }).map((_, i) => (
            <div key={i} className="cloud" 
                 style={{ 
                   top: `${10 + i * 15}%`, 
                   left: `${-30 - (i % 3) * 20}%`,
                   opacity: 0.4 + (i % 3) * 0.08,
                   animationDuration: `${20 + Math.random() * 10}s`,
                   animationDelay: `${i * 2}s`,
                   background: `rgba(${isDark ? '230, 235, 240' : '200, 215, 235'}, ${0.25 + (i % 3) * 0.05})`,
                 }} />
          ))}
          {isPartlyCloudy && !isDark && (
            <div className="sun-rays" style={{ 
              opacity: 0.6,
              background: `radial-gradient(circle, ${getRandomColor('clear')}90 0%, ${getRandomColor('clear')}00 70%)`
            }} />
          )}
          {isPartlyCloudy && <div className="rainbow-effect" />}
        </div>
      );
    }
    
    // Default - no animation
    return null;
  };
  
  return (
    <div className="weather-animation-container">
      {getAnimationForWeather()}
    </div>
  );
};

export default WeatherAnimation;
