
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  tabs: {
    label: string;
    path: string;
    icon?: React.ReactNode;
  }[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex overflow-x-auto pb-1 mb-4 -mx-4 px-4 scrollbar-hide">
      <div className="flex space-x-1 p-1 bg-gray-100/50 rounded-lg w-full">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap",
              currentPath === tab.path
                ? "bg-white shadow-sm text-primary"
                : "text-gray-600 hover:text-primary hover:bg-white/50"
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
