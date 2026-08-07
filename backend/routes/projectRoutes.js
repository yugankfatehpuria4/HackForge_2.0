const express = require('express');
const { 
  createProject, 
  getUserProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  toggleFavorite 
} = require('../controllers/projectController');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Every project route requires a signed-in user. Previously userId came from
// req.body/req.query — a client-supplied value the server merely trusted —
// so anyone who knew (or guessed) another user's id could read, edit, or
// delete their projects. requireAuth derives userId from a verified JWT
// instead; controllers no longer accept it from the request at all.
router.use(requireAuth);

// Fail fast when there is no database.
// Without this, Mongoose buffers the query and every request hangs for the
// full 10s bufferTimeoutMS before returning a generic 500 — the dashboard
// showed a spinner for ten seconds and then blamed the backend for being down.
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Database is not connected. Set MONGODB_URI in backend/.env to save and list projects.',
      error: 'DATABASE_UNAVAILABLE'
    });
  }
  next();
});

// Rate limiting for project operations
const projectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many project requests. Please try again later.'
  }
});

// Apply rate limiting to all routes
router.use(projectLimiter);

// A malformed :id (e.g. /api/projects/garbage) makes Mongoose throw a CastError
// inside each controller's own try/catch, which turned a plain "not found" into
// a 500. errorHandler maps CastError to 404, but it never sees it because the
// controllers catch first. Reject the id before it reaches the database.
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
      error: 'PROJECT_NOT_FOUND'
    });
  }
  next();
});

// Create a new project
router.post('/', createProject);

// Get all projects for a user
router.get('/', getUserProjects);

// Get a single project by ID
router.get('/:id', getProjectById);

// Update a project
router.put('/:id', updateProject);

// Delete a project
router.delete('/:id', deleteProject);

// Toggle favorite status
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;