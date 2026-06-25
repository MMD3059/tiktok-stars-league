import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hayderleague.app',
  appName: 'دوري نجوم تيك توك',
  webDir: 'dist',
  server: {
    url: 'https://hayder-league.vercel.app',
    cleartext: false,
  },
};

export default config;
