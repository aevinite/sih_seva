import type { CapacitorConfig } from "@capacitor/cli";

/**
 * AeviWork — native Android shell (Capacitor).
 *
 * The app is a full server app (Next.js API routes + database) hosted on Vercel,
 * so the native shell loads the live production URL. This keeps the installed app
 * always in sync with the website — no re-publish needed when the site updates.
 *
 * `webDir` (./www) only holds a tiny offline fallback; the real UI comes from `server.url`.
 */
const config: CapacitorConfig = {
  appId: "com.aeviwork.app",
  appName: "AeviWork",
  webDir: "www",
  backgroundColor: "#7c5cff",
  server: {
    url: "https://aeviwork-next.vercel.app",
    androidScheme: "https",
    // Allow only our own origin to render inside the app shell.
    allowNavigation: ["aeviwork-next.vercel.app"],
  },
  android: {
    backgroundColor: "#7c5cff",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      // Keep the native splash up until the web app mounts and calls
      // SplashScreen.hide() — hands off seamlessly to the animated web loader
      // instead of flashing a blank screen. (Requires an APK rebuild to apply.)
      launchAutoHide: false,
      backgroundColor: "#7c5cff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      backgroundColor: "#7c5cff",
      style: "LIGHT",
      overlaysWebView: false,
    },
  },
};

export default config;
