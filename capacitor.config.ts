import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.citypulse.ai',
  appName: 'CityPulse AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
