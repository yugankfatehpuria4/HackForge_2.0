const express = require('express');
const { generateCode } = require('../controllers/codeController');
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

router.post('/generate', codeGenerationLimiter, generateCode);

module.exports = router;