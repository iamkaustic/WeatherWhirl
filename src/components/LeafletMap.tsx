import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  className?: string;
  onMapInitialized?: (map: any) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  className = "",
  onMapInitialized,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Leaflet script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      const loadLeaflet = async () => {
        try {
          // Load Leaflet CSS
          const linkElement = document.createElement("link");
          linkElement.rel = "stylesheet";
          linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          linkElement.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          linkElement.crossOrigin = "";
          document.head.appendChild(linkElement);

          // Load Leaflet JS
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
          script.crossOrigin = "";
          document.body.appendChild(script);

          script.onload = () => {
            console.log("Leaflet loaded successfully");
            setIsLoading(false);
          };

          script.onerror = () => {
            console.error("Failed to load Leaflet");
            setError("Failed to load map library");
            setIsLoading(false);
            toast.error("Failed to load map library");
          };
        } catch (error) {
          console.error("Error loading Leaflet:", error);
          setError("Failed to load map library");
          setIsLoading(false);
          toast.error("Failed to load map library");
        }
      };

      loadLeaflet();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!isLoading && !error && typeof window !== "undefined" && window.L && mapRef.current && !map) {
      try {
        console.log("Initializing Leaflet map...");
        
        // Create the map instance
        const mapInstance = window.L.map(mapRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: false,
          attributionControl: true,
        });

        // Add zoom control to bottom right
        window.L.control.zoom({
          position: "bottomright"
        }).addTo(mapInstance);
        
        // Add the base tile layer (OpenStreetMap)
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance);
        
        // Set the map instance
        setMap(mapInstance);
        
        // Call onMapInitialized callback with the map instance
        if (onMapInitialized) {
          onMapInitialized(mapInstance);
        }
        
        console.log("Leaflet map initialized successfully");
      } catch (error) {
        console.error("Error initializing Leaflet map:", error);
        setError("Failed to initialize map");
        toast.error("Failed to initialize map. Please refresh the page.");
      }
    }
  }, [isLoading, error, center, zoom, onMapInitialized, map]);

  // Update map center and zoom when props change
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (map) {
        console.log("Cleaning up Leaflet map...");
        map.remove();
      }
    };
  }, [map]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm text-gray-700">Loading map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-full z-0"></div>
    </div>
  );
};

export default LeafletMap;
