/**
 * @type { import("next").NextConfig }
 */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  env: {
    IDENTIFIKA_API_URL: process.env.IDENTIFIKA_API_URL,
  }
};

module.exports = nextConfig;
