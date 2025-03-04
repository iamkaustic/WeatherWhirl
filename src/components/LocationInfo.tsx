import React, { useState, useEffect } from 'react';
import { MapPin, Info, Map, Building, Compass, Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface LocationInfoProps {
  name: string;
  country: string;
  lat?: number;
  lon?: number;
  isLoading?: boolean;
}

interface LocationDetails {
  description: string;
  municipality: string;
  attractions: string[];
  nearbySpots: string[];
}

const LocationInfo: React.FC<LocationInfoProps> = ({ 
  name, 
  country, 
  lat, 
  lon, 
  isLoading = false 
}) => {
  const [locationInfo, setLocationInfo] = useState<LocationDetails | null>(null);
  
  // Fetch location details from Wikipedia
  const { data: wikiData, isLoading: isLoadingWikiData } = useQuery({
    queryKey: ['wikiData', name, country],
    queryFn: async () => {
      try {
        // First, search for the location on Wikipedia
        const searchResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + ' ' + country)}&format=json&origin=*`
        );
        const searchData = await searchResponse.json();
        
        if (!searchData.query?.search || searchData.query.search.length === 0) {
          throw new Error('No Wikipedia entry found');
        }
        
        // Get the page ID of the first search result
        const pageId = searchData.query.search[0].pageid;
        
        // Get the full page content
        const pageResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|coordinates|info|categories&inprop=url&exintro=1&explaintext=1&pageids=${pageId}&format=json&origin=*`
        );
        const pageData = await pageResponse.json();
        
        // Get nearby locations using GeoSearch
        let nearbyLocations = [];
        if (lat && lon) {
          const geoResponse = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=10000&gslimit=10&format=json&origin=*`
          );
          const geoData = await geoResponse.json();
          nearbyLocations = geoData.query?.geosearch || [];
        }
        
        return {
          pageData: pageData.query.pages[pageId],
          nearbyLocations
        };
      } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return null;
      }
    },
    enabled: !isLoading && !!name,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Process the data from Wikipedia
  useEffect(() => {
    if (wikiData) {
      const page = wikiData.pageData;
      const extract = page.extract || `${name} is a location in ${country}.`;
      
      // Extract municipality information from categories
      let municipality = 'Local municipality';
      if (page.categories) {
        const adminCategories = page.categories
          .filter((cat: any) => 
            cat.title.includes('administrative') || 
            cat.title.includes('division') || 
            cat.title.includes('capital'))
          .map((cat: any) => cat.title.replace('Category:', ''));
        
        if (adminCategories.length > 0) {
          municipality = adminCategories.join(', ');
        }
      }
      
      // Get nearby locations as attractions and spots
      const nearbyNames = wikiData.nearbyLocations
        .filter((loc: any) => loc.title !== page.title)
        .map((loc: any) => loc.title);
      
      // Split nearby locations into attractions and spots
      const halfLength = Math.ceil(nearbyNames.length / 2);
      const attractions = nearbyNames.slice(0, halfLength);
      const nearbySpots = nearbyNames.slice(halfLength);
      
      setLocationInfo({
        description: extract,
        municipality,
        attractions: attractions.length > 0 ? attractions : ['Historical sites', 'Cultural centers', 'Parks and recreation'],
        nearbySpots: nearbySpots.length > 0 ? nearbySpots : ['Regional landmarks', 'Neighboring areas', 'Natural wonders']
      });
    }
  }, [wikiData, name, country]);
  
  // Fallback data for when API fails or is loading
  useEffect(() => {
    if (!wikiData && !isLoadingWikiData && name) {
      setLocationInfo({
        description: `${name} is a location in ${country}. It's known for its unique character and local attractions.`,
        municipality: 'Local municipal corporations and governing bodies',
        attractions: ['Historical sites', 'Cultural centers', 'Natural landmarks', 'Local cuisine'],
        nearbySpots: ['Regional parks', 'Neighboring cities', 'Natural wonders', 'Cultural destinations']
      });
    }
  }, [wikiData, isLoadingWikiData, name, country]);

  if (isLoading || isLoadingWikiData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
        <div className="flex items-center mb-4">
          <MapPin className="mr-2 text-blue-500" size={18} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Location Information
          </h3>
        </div>
        <div className="flex justify-center items-center h-full">
          <Loader className="animate-spin text-blue-500" size={24} />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading location data...</span>
        </div>
      </div>
    );
  }

  if (!locationInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
        <div className="flex items-center mb-4">
          <MapPin className="mr-2 text-blue-500" size={18} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Location Information
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No location information available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
      <div className="flex items-center mb-4">
        <MapPin className="mr-2 text-blue-500" size={18} />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Location Information
        </h3>
      </div>
      
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 40px)' }}>
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <Map className="mr-2 text-green-500" size={14} />
            <h4 className="font-medium text-sm text-gray-800 dark:text-white">About {name}</h4>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 ml-6">
            {locationInfo.description}
          </p>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <Building className="mr-2 text-purple-500" size={14} />
            <h4 className="font-medium text-sm text-gray-800 dark:text-white">Municipal Information</h4>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 ml-6">
            {locationInfo.municipality}
          </p>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <Compass className="mr-2 text-red-500" size={14} />
            <h4 className="font-medium text-sm text-gray-800 dark:text-white">Top Attractions</h4>
          </div>
          <ul className="text-xs text-gray-600 dark:text-gray-300 ml-6 list-disc pl-4">
            {locationInfo.attractions.map((attraction, index) => (
              <li key={index}>{attraction}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center mb-1">
            <MapPin className="mr-2 text-blue-500" size={14} />
            <h4 className="font-medium text-sm text-gray-800 dark:text-white">Nearby Places</h4>
          </div>
          <ul className="text-xs text-gray-600 dark:text-gray-300 ml-6 list-disc pl-4">
            {locationInfo.nearbySpots.map((spot, index) => (
              <li key={index}>{spot}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
