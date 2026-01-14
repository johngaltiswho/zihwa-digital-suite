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
    domains: ['localhost', 'stalknspice.com','s3.ap-south-1.amazonaws.com'],
  },
  env: {
    VENDURE_SHOP_API_URL: process.env.VENDURE_SHOP_API_URL || 'http://localhost:3000/shop-api',
  },
};

export default nextConfig;