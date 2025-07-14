import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mascotask.app',
  appName: 'MascotaskR',
  webDir: 'www',
  ios: {
    contentInset: 'always'
  },
  cordova: {}
};

export default config;