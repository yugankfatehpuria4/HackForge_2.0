/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo root holds a package-lock.json for the convenience scripts, and
  // backend/ has its own. Without this, Next walks up, finds several lockfiles
  // and guesses the workspace root, which makes build file-tracing wrong.
  // The frontend is self-contained: this directory is the root.
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Default output: served by `next start`, which is what both render.yaml and
  // Vercel run. Do not set output: 'standalone' unless the start command is
  // changed to `node .next/standalone/server.js`, and do not set 'export' —
  // static export drops the Node server these deployments rely on.
  trailingSlash: true,
  // Opening the dev server on a LAN address (e.g. http://192.168.1.4:3000)
  // otherwise logs a cross-origin warning and will be blocked outright in a
  // future Next.js major.
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.0.0/16', '10.0.0.0/8'],
};

module.exports = nextConfig;
