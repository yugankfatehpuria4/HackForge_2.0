const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// Initialize Redis cache (optional)
let cacheService;
try {
  const { cacheService: redisCache } = require('../lib/cache');
  cacheService = redisCache;
  console.log('✅ Redis cache service initialized');
} catch (error) {
  console.log('⚠️  Redis cache not available (optional for performance)');
}

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

// Cache middleware for GET requests
if (cacheService) {
  app.use('/api', async (req, res, next) => {
    if (req.method === 'GET') {
      const cacheKey = `api:${req.originalUrl}`;
      try {
        const cached = await cacheService.get(cacheKey);
        if (cached) {
          console.log(`📦 Cache hit: ${cacheKey}`);
          return res.json(cached);
        }
      } catch (error) {
        console.warn('Cache error:', error);
      }
    }
    next();
  });
}

// Routes
app.use('/api', require('./routes/codeRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// New routes for enhanced features
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/offline', require('./routes/offlineRoutes'));

// Health check with enhanced status
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'OK',
    message: 'HackForge Backend is running',
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
      cache: !!cacheService,
      database: false // Will be updated if DB is connected
    },
    environment: process.env.NODE_ENV || 'development'
  };

  // Check cache service status
  if (cacheService) {
    try {
      await cacheService.set('health:test', 'test', 1);
      healthStatus.services.cache = true;
    } catch (error) {
      healthStatus.services.cache = false;
    }
  }

  res.json(healthStatus);
});

// Error handling middleware

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 HackForge Backend running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🤖 Gemini configured: ${!!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'Yes' : 'No - Please add your API key'}`);
  console.log(`💾 Cache: ${cacheService ? 'Redis' : 'Disabled'}`);
  console.log(`🔐 Auth: Role-based access control enabled`);
  console.log(`📱 Offline: IndexedDB support enabled`);
});