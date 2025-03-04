import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(formatTime(new Date()));
  const [currentDate, setCurrentDate] = useState<string>(formatDate(new Date()));
  const [blinkColon, setBlinkColon] = useState<boolean>(true);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Format time with hours and minutes
  function formatTime(date: Date): string {
    const timeString = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Replace the colon for blinking effect
    return timeString.replace(':', '|');
  }

  // Format date
  function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  useEffect(() => {
    // Update time every second
    const timeIntervalId = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
      setBlinkColon(prev => !prev);
    }, 1000);

    // Update date every minute
    const dateIntervalId = setInterval(() => {
      setCurrentDate(formatDate(new Date()));
    }, 60000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(timeIntervalId);
      clearInterval(dateIntervalId);
    };
  }, []);

  // Replace the pipe with a colon or space based on blink state
  const displayTime = currentTime.replace('|', blinkColon ? ':' : ' ');

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center gap-1.5 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
        <Clock className="h-4 w-4" />
        <span className={`text-lg font-medium tracking-wide ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {displayTime}
        </span>
      </div>
      <span className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {currentDate}
      </span>
    </div>
  );
};

export default TimeDisplay;
