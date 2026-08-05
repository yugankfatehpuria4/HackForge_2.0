const express = require('express');
const { generateCode } = require('../controllers/codeController');
const { optionalAuth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for code generation
const codeGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many code generation requests. Please try again later.'
  }
});

// optionalAuth, not requireAuth: generating code stays open to anonymous
// visitors so the demo works without an account. Auto-saving to history is
// what needs an identity, and the controller checks req.userId for that.
router.post('/generate', codeGenerationLimiter, optionalAuth, generateCode);

module.exports = router;