# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files.
# NOTE: this must be a full install, not `--only=production`. The build needs
# typescript and @types/* from devDependencies, and next build fails without them.
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# `public/` is optional in this repo, but the runner stage copies it — make sure
# it exists so the COPY below cannot fail the build.
RUN mkdir -p public

# Build the frontend only. The root `build` script also installs the backend,
# which does not belong in the frontend image.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Runtime needs production dependencies plus the build output. The previous
# version copied .next/standalone, which next.config.js does not produce.
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check. node:18-alpine ships busybox wget, not curl — the previous
# curl-based check always failed and marked the container unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["npx", "next", "start"]
