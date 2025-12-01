import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mado.pilotwatcher',
  appName: 'Pilot Watcher',
  webDir: 'dist',
  appendUserAgent: ' PilotWatcher/1.0',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false, // Manual control as decided
      backgroundColor: "#0f172a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
