import type { NextConfig } from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  distDir: 'out',
  basePath: process.env.NEXT_PUBLIC_BASE_URL,
  output: isGithubActions ? 'export' : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     // Phaser is browser-only — exclude from server bundle
  //     config.externals = [...(config.externals || []), 'phaser'];
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;
