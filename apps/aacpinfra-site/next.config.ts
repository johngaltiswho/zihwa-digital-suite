import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@repo/ui"], // ✅ REQUIRED for monorepo

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For your hero images
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',     // <-- ADD THIS LINE for the service icons
      },
      // Add any other external image hosts here if you use them in the future
    ],
  },
};

export default nextConfig;
