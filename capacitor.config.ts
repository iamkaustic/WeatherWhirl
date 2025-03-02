
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f171e5a0fa1d46de918de6337bbea194',
  appName: 'weatherwhirl-forecast',
  webDir: 'dist',
  server: {
    url: 'https://f171e5a0-fa1d-46de-918d-e6337bbea194.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ["location"]
    }
  }
};

export default config;
