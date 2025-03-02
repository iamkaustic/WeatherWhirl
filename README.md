# WeatherWhirl

A modern, responsive weather application that provides real-time weather information and forecasts based on user location or search queries.

## About the App

WeatherWhirl is a comprehensive weather application that offers:

- Current weather conditions including temperature, humidity, wind speed, and more
- Hourly weather forecasts
- Daily weather forecasts
- Detailed weather information such as UV index, visibility, and pressure
- Location-based weather using device geolocation
- Search functionality to check weather in any location
- Responsive design that works on desktop and mobile devices

## Technologies and Tools

This project is built with a modern tech stack:

- **React**: Frontend library for building user interfaces
- **TypeScript**: Typed JavaScript for better code quality and developer experience
- **Vite**: Fast, modern frontend build tool
- **React Router**: For navigation and routing
- **TanStack Query (React Query)**: For data fetching, caching, and state management
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind CSS
- **Framer Motion**: Animation library for React
- **Capacitor**: For building cross-platform mobile applications
- **Mapbox GL**: For interactive maps and geolocation features
- **Recharts**: Composable charting library for React
- **Zod**: TypeScript-first schema validation
- **React Hook Form**: Form handling with validation

## APIs

- **OpenWeatherMap API**: For fetching weather data and forecasts

## Dependencies

### Main Dependencies

```
"dependencies": {
  "@capacitor/android": "^7.0.1",
  "@capacitor/cli": "^7.0.1",
  "@capacitor/core": "^7.0.1",
  "@capacitor/geolocation": "^7.1.1",
  "@capacitor/ios": "^7.0.1",
  "@hookform/resolvers": "^3.9.0",
  "@radix-ui/react-*": "^1.1.0 - ^2.2.1", // Various Radix UI components
  "@tanstack/react-query": "^5.56.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^3.6.0",
  "framer-motion": "^12.4.7",
  "lucide-react": "^0.462.0",
  "mapbox-gl": "^3.10.0",
  "next-themes": "^0.3.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hook-form": "^7.53.0",
  "react-router-dom": "^6.26.2",
  "recharts": "^2.12.7",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7",
  "zod": "^3.23.8"
}
```

### Development Dependencies

```
"devDependencies": {
  "@eslint/js": "^9.9.0",
  "@tailwindcss/typography": "^0.5.15",
  "@types/node": "^22.5.5",
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react-swc": "^3.5.0",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.9.0",
  "postcss": "^8.4.47",
  "tailwindcss": "^3.4.11",
  "typescript": "^5.5.3",
  "vite": "^5.4.1"
}
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Building for Production

```
npm run build
```

## Preview Production Build

```
npm run preview
