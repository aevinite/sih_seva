import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full server app (API routes + database) hosted on Vercel.
  // The Capacitor APK loads the live URL, so it stays in sync automatically.
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
