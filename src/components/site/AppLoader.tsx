"use client";
import { useEffect, useState } from "react";

/**
 * Full-screen loading screen shown while the app boots. The shield logo draws
 * itself, then gently breathes. On native (APK) it hides the Capacitor splash
 * as soon as it mounts, so the native purple splash hands off to this animated
 * loader with no blank gap; it then fades out once the page is ready.
 */
export default function AppLoader() {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Hand off from the native splash to this (already-animating) web loader.
    (async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (Capacitor.isNativePlatform()) {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          await SplashScreen.hide();
        }
      } catch {
        /* not native / plugin unavailable — web loader is enough */
      }
    })();

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setHidden(true);
      window.setTimeout(() => setGone(true), 520); // remove after the fade
    };

    // Show for at least the draw animation, then hide once the page is ready.
    const MIN_MS = 1400;
    const start = performance.now();
    const ready = () => window.setTimeout(finish, Math.max(0, MIN_MS - (performance.now() - start)));
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    const safety = window.setTimeout(finish, 6000); // never hang
    return () => {
      window.clearTimeout(safety);
      window.removeEventListener("load", ready);
    };
  }, []);

  if (gone) return null;

  return <LoaderScreen hidden={hidden} />;
}

/**
 * The shared branded loading screen — full-screen purple with the shield that
 * draws itself. Reused by AuthGate so its "reading session" state looks identical
 * to the boot loader (one seamless loader, no white flash).
 */
export function LoaderScreen({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={"app-loader" + (hidden ? " hide" : "")} role="status" aria-label="Loading AeviWork">
      <div className="app-loader-mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path className="al-shield" pathLength={1} strokeWidth={1.9} d="M12 4.3 5.2 7.3v5.1c0 4.4 3 7.2 6.8 8.8 3.8-1.6 6.8-4.4 6.8-8.8V7.3z" />
          <path className="al-check" pathLength={1} strokeWidth={2.2} d="M8.8 12.7l2.4 2.4 4.2-4.7" />
        </svg>
      </div>
    </div>
  );
}
