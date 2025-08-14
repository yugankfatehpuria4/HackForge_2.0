/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost'],
  },
  output: 'export',
  // Enable static exports for Render
  trailingSlash: true,
  distDir: 'out',
};

module.exports = nextConfig;
