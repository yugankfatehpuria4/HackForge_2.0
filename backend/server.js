const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging with performance tracking
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Cache middleware for GET requests.
// The previous version only ever read from the cache — nothing wrote to it, so
// it could never produce a hit. Wrap res.json to store successful responses.
if (cacheService.enabled) {
  app.use('/api', async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const cacheKey = `api:${req.originalUrl}`;

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
app.use('/api', require('./routes/codeRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Health check with enhanced status
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'HackForge Backend is running',
    timestamp: new Date().toISOString(),
    services: {
      gemini:
        !!process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
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
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🤖 Gemini configured: ${!!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'Yes' : 'No - Please add your API key'}`);
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