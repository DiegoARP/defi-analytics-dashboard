/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  swcMinify: true,
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build size
  experimental: {
    optimizeCss: true,
  }
}

module.exports = nextConfig