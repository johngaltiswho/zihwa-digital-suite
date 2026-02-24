import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["shared-ui"],

  // 1. IGNORE LINTING ERRORS DURING BUILD
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. IGNORE TYPESCRIPT ERRORS DURING BUILD
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ['localhost', 'stalknspice.com','s3.ap-south-1.amazonaws.com', 'fbflxwzygztakprsrmpc.supabase.co'],
  },
  env: {
    VENDURE_SHOP_API_URL: process.env.VENDURE_SHOP_API_URL || 'http://localhost:3000/shop-api',
  },

  // Proxy API requests to avoid CORS issues in Safari (dev only)
  async rewrites() {
    // Only use proxy in development - production uses direct backend URLs with CORS
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    return [
      {
        source: '/api/vendure/:path*',
        destination: 'http://localhost:3100/:path*',
      },
    ];
  },
};

export default nextConfig;