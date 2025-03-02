// Leaflet loader script
(function() {
  console.log("Leaflet loader script running");
  
  // Check if Leaflet is already loaded
  if (window.L) {
    console.log("Leaflet already loaded");
    return;
  }
  
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
  
  script.onload = function() {
    console.log("Leaflet loaded successfully via loader script");
    // Dispatch an event that Leaflet is loaded
    const event = new Event('leaflet-loaded');
    document.dispatchEvent(event);
  };
  
  script.onerror = function(error) {
    console.error("Error loading Leaflet script:", error);
  };
  
  document.body.appendChild(script);
})();
