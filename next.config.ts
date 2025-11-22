import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@pigment-css/react": false,
    };
    return config;
  },
};

export default nextConfig;
