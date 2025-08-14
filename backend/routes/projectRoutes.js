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

const router = express.Router();

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