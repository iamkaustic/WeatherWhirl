import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ExternalLink, Search as SearchIcon } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

// Component to load Google Custom Search script and add custom styles
const GoogleCustomSearchScript: React.FC = () => {
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=812921da96f2b40fb';
    script.async = true;
    
    // Add script to document
    document.head.appendChild(script);
    
    // Add custom styles to ensure text is visible in dark mode
    const style = document.createElement('style');
    style.id = 'google-search-styles';
    style.textContent = `
      /* Light mode styles */
      .gsc-control-cse {
        background-color: transparent !important;
        border: none !important;
      }
      
      /* Force text color for results */
      .gs-title, .gs-snippet, .gsc-table-result, .gsc-thumbnail-inside, .gsc-url-top, .gsc-result-info {
        color: #333 !important;
      }
      
      /* Dark mode styles */
      .dark .gsc-control-cse {
        background-color: transparent !important;
        border: none !important;
      }
      
      .dark .gs-title, .dark .gs-snippet, .dark .gsc-table-result, .dark .gsc-thumbnail-inside, .dark .gsc-url-top, .dark .gsc-result-info {
        color: #fff !important;
      }
      
      .dark .gsc-webResult.gsc-result {
        background-color: #1f2937 !important;
        border-color: #374151 !important;
      }
      
      .dark .gsc-input-box {
        background: #374151 !important;
        border-color: #4b5563 !important;
      }
      
      .dark .gsc-input {
        background-color: transparent !important;
        color: #fff !important;
      }
      
      .dark .gsc-search-button-v2 {
        background-color: #3b82f6 !important;
        border-color: #2563eb !important;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up on unmount
    return () => {
      document.head.removeChild(script);
      if (document.getElementById('google-search-styles')) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  // Update document class when theme changes
  useEffect(() => {
    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [resolvedTheme]);
  
  return null;
};

const Search: React.FC = () => {
  const [directQuery, setDirectQuery] = useState('');
  const SEARCH_ENGINE_ID = '812921da96f2b40fb';

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directQuery.trim()) return;
    
    const searchUrl = `https://cse.google.com/cse?cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(directQuery)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <Layout>
      <GoogleCustomSearchScript />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Search the Web
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <a 
            href="https://cse.google.com/cse?cx=812921da96f2b40fb" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-2 md:mb-0"
          >
            <span>Open in Google Custom Search</span>
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </a>
          
          <form onSubmit={handleDirectSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={directQuery}
                onChange={(e) => setDirectQuery(e.target.value)}
                placeholder="Direct search..."
                className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="submit"
              className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
            >
              Search in New Tab
            </button>
          </form>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="gcse-search"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
