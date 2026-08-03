# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S hackforge -u 1001

# Change ownership of the app directory
RUN chown -R hackforge:nodejs /app
USER hackforge

# The server reads PORT and defaulted to 5002, so the exposed port and the
# health check below were pointing at a port nothing listened on.
ENV PORT 10000
EXPOSE 10000

# Health check. node:18-alpine ships busybox wget, not curl — the previous
# curl-based check always failed and marked the container unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:10000/health || exit 1

# Start the application
CMD ["npm", "start"]
