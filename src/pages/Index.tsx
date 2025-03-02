import React from "react";
import WeatherDashboard from "@/components/WeatherDashboard";
import { useTheme } from "@/components/ThemeProvider";

const Index = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <WeatherDashboard />
    </div>
  );
};

export default Index;
