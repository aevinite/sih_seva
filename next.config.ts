import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export so the site can be bundled into the Capacitor APK
  // and served from any static host. All interactivity is client-side.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Pin the workspace root to this project (a stray package-lock.json lives
  // in the parent Downloads/home dir).
  turbopack: { root: __dirname },
};

export default nextConfig;
