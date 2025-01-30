/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    return config;
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      loaders: {
        '.ts': ['swc-loader'],
        '.tsx': ['swc-loader'],
      },
    },
  },
  env: {
    CRON_SECRET: process.env.CRON_SECRET,
  },
}

module.exports = nextConfig