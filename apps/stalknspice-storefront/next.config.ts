import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["shared-ui"],
  images: {
    domains: ['localhost', 'stalknspice.com'],
  },
  env: {
    VENDURE_SHOP_API_URL: process.env.VENDURE_SHOP_API_URL || 'http://localhost:3000/shop-api',
  },
};

export default nextConfig;