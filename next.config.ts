import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Provide a mock for @pigment-css/react since it's not compatible with React 19
    config.resolve.alias = {
      ...config.resolve.alias,
      "@pigment-css/react$": require.resolve("./src/lib/pigment-mock.ts"),
    };
    return config;
  },
};

export default nextConfig;
