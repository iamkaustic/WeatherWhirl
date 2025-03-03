import React, { useState, useEffect } from 'react';

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(formatTime(new Date()));

  // Format time with hours, minutes, and seconds
  function formatTime(date: Date): string {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  useEffect(() => {
    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="text-sm font-medium">{currentTime}</span>
  );
};

export default TimeDisplay;
