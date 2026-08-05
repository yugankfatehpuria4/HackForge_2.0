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
  // Opening the dev server on a LAN address (e.g. http://192.168.1.4:3000)
  // otherwise logs a cross-origin warning and will be blocked outright in a
  // future Next.js major.
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.0/16', '10.0.0.0/8'],
};

module.exports = nextConfig;
