
import React, { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationSearchProps {
  onSearch: (query: string) => void;
  onUseCurrentLocation: () => void;
  locationName: string | null;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onSearch,
  onUseCurrentLocation,
  locationName,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a location");
      return;
    }
    onSearch(searchQuery);
    setIsSearchOpen(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <div className="relative w-full">
      {!isSearchOpen ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-lg font-medium">
              {locationName || "Loading location..."}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full h-9 w-9 transition-all duration-300 hover:bg-primary/10"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search location</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUseCurrentLocation}
              className="rounded-full h-9 w-9 transition-all duration-300 hover:bg-primary/10"
            >
              <MapPin className="h-4 w-4" />
              <span className="sr-only">Use current location</span>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSearch} className="flex gap-2 items-center animate-slide-up">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city..."
            className="border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="rounded-full h-9 w-9"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="rounded-full h-9 w-9"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      )}
    </div>
  );
};

export default LocationSearch;
