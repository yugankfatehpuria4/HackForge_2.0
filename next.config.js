/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost'],
  },
  output: 'standalone',
  // Enable static exports for Render
  trailingSlash: true,
};

module.exports = nextConfig;
