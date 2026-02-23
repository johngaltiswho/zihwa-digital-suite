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

  // Proxy API requests to avoid CORS issues in Safari
  async rewrites() {
    const vendureUrl = process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL?.replace('/shop-api', '') || 'http://localhost:3100';
    return [
      {
        source: '/api/vendure/:path*',
        destination: `${vendureUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;