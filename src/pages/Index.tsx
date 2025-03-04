import React from "react";
import WeatherDashboard from "@/components/WeatherDashboard";
import { useTheme } from "@/components/ThemeProvider";
import { Wind, Cloud, Sun, Compass } from "lucide-react";

const Index = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Sun className={`h-8 w-8 ${isDark ? 'text-amber-300' : 'text-amber-500'} animate-pulse`} />
          <Wind className={`h-8 w-8 ${isDark ? 'text-blue-300' : 'text-blue-500'} animate-pulse`} />
          <Cloud className={`h-8 w-8 ${isDark ? 'text-gray-300' : 'text-gray-500'} animate-pulse`} />
          <Compass className={`h-8 w-8 ${isDark ? 'text-green-300' : 'text-green-500'} animate-pulse`} />
        </div>
        <h2 className={`text-2xl font-light tracking-wide ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          <span className="font-medium">Elegantly Simple</span> • Weather at a Glance
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Experience weather & location insights with beautiful simplicity
        </p>
      </div>
      <WeatherDashboard />
    </div>
  );
};

export default Index;
