const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { register, login, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Same fail-fast rationale as projectRoutes: without this, a missing database
// makes every auth request hang for ~10s on Mongoose's buffering timeout
// before failing, instead of an immediate, honest error.
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Set MONGODB_URI in backend/.env to use accounts.',
      error: 'DATABASE_UNAVAILABLE'
    });
  }
  next();
});

// Tighter than the general API limiter — auth endpoints are the target of
// credential-stuffing and brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.'
  }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);

module.exports = router;
