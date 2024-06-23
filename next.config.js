/**
 * @type { import("next").NextConfig }
 */
module.exports = {
 
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  env: {
    IDENTIFIKA_API_URL: process.env.IDENTIFIKA_API_URL,
  }
}
