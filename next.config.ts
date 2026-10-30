import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.29.12', 'localhost', '127.0.0.1'],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  // Allow NVIDIA API calls from server components
  serverExternalPackages: [],
};

export default nextConfig;
