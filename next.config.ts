import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full server app (API routes + database) hosted on Vercel.
  // The Capacitor APK loads the live URL, so it stays in sync automatically.
  images: { unoptimized: true },
  turbopack: { root: __dirname },
  // Never let the browser / WebView serve a stale HTML document — always fetch
  // the newest UI (hashed static assets under /_next/static still cache fine).
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
