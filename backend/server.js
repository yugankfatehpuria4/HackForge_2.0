const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const { optionalAuth } = require('./middleware/auth');
const grokService = require('./services/grokService');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database (optional)
try {
  const connectDB = require('./config/db');
  connectDB();
} catch (error) {
  console.log('⚠️  Database connection skipped (optional for basic functionality)');
}

// Initialize Redis cache (optional). This used to require('../lib/cache'),
// a TypeScript file Node cannot load, so caching was always disabled.
const cacheService = require('./services/cacheService');

const app = express();

// Debug logging for services
console.log('🔍 Services initialization complete');

// Middleware
// FRONTEND_URL accepts a comma-separated list. A single origin meant that
// opening the app on a LAN address (http://192.168.1.4:3000) while the backend
// allowed only http://localhost:3000 failed every request with an opaque
// "Failed to fetch" in the browser.
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // No origin: curl, server-to-server, same-origin navigations.
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Any localhost/LAN origin is fine in development; production stays strict.
    if (
      process.env.NODE_ENV !== 'production' &&
      /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }

    console.warn(`⚠️  Blocked CORS request from ${origin}. Add it to FRONTEND_URL.`);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging with performance tracking
app.use((req, res, next) => {
  const start = Date.now();
  // req.path is rewritten relative to the matched router, so by the time
  // 'finish' fires it reads '/' for every mounted route. originalUrl is stable.
  const url = req.originalUrl;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Cache middleware for GET requests.
// The previous version only ever read from the cache — nothing wrote to it, so
// it could never produce a hit. Wrap res.json to store successful responses.
if (cacheService.enabled) {
  // optionalAuth must run before the cache so the key can be scoped to the
  // caller. Keying on the URL alone would serve one signed-in user's projects
  // to a different user requesting the same path.
  app.use('/api', optionalAuth);

  app.use('/api', async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const cacheKey = `api:${req.userId || 'anon'}:${req.originalUrl}`;

    try {
      const cached = await cacheService.get(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit: ${cacheKey}`);
        return res.json(cached);
      }
    } catch (error) {
      console.warn('Cache error:', error.message);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(cacheKey, body, 60).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  });
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/codeRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Health check with enhanced status
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HackForge Backend is running',
    timestamp: new Date().toISOString(),
    services: {
      grok: grokService.isConfigured,
      cache: cacheService.isConnected,
      // readyState 1 === connected. This was previously hardcoded to false, so
      // health always reported the database as down even when it was up.
      database: mongoose.connection.readyState === 1
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Unknown API routes should return JSON, not Express' default HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: 'NOT_FOUND'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 HackForge Backend running on http://localhost:${PORT}`);
  console.log(`📡 CORS allowed origins: ${allowedOrigins.join(', ')}${process.env.NODE_ENV !== 'production' ? ' (+ any localhost/LAN origin in development)' : ''}`);
  console.log(`🤖 Grok configured: ${grokService.isConfigured ? `Yes (${grokService.model})` : 'No - add XAI_API_KEY to backend/.env'}`);
  console.log(`💾 Cache: ${cacheService.enabled ? 'Redis' : 'Disabled'}`);
});

// Without these, a rejected promise or thrown error anywhere in the app takes
// the process down with no usable log line.
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
});