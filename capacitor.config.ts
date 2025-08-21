import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'CampusClaim',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "Keyboard": {
      "resizeOnFullScreen": false
    }
  }

};

export default config;