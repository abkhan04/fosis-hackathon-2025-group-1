import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['maps.googleapis.com'],
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'maps.googleapis.com',
            port: '',
            pathname: '/maps/api/place/photo/**',
        },
    ],
  },
};

export default nextConfig;
