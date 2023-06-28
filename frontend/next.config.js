/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_POOL_BACKEND_URL: process.env.REACT_APP_POOL_BACKEND_URL
  },
  // productionBrowserSourceMaps: false,
  reactStrictMode: true,
  experimental: {
    // ssr and displayName are configured by default
    // styledComponents: true,
    // removeConsole: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

}

module.exports = nextConfig
