/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Default output: served by `next start`, which is what render.yaml and the
  // Dockerfile both run.
  // NOTE: do not set output: 'export' here — static export cannot run
  // middleware.ts and makes `next start` fail. Do not set 'standalone' either
  // unless the start command is changed to node .next/standalone/server.js.
  trailingSlash: true,
};

module.exports = nextConfig;
