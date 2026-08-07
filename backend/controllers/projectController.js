const Project = require('../models/Project');
const aiService = require('../services/aiService');
const { extractFramework, extractTags } = require('../utils/codeMetadata');

// Only these fields may be sorted on. `sortBy` came straight from the query
// string, letting callers sort by arbitrary (including non-indexed) fields.
const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'title', 'framework', 'isFavorite'];

// Escape user input before embedding it in a RegExp — an unbalanced "(" in the
// search box made Mongo throw and returned a 500.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, prompt, generatedCode, framework, tags } = req.body;
    // requireAuth verified the caller's identity; never trust a client-supplied userId.
    const userId = req.userId;

    if (!title || !prompt || !generatedCode) {
      return res.status(400).json({
        success: false,
        message: 'Title, prompt, and generated code are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Detect rather than defaulting to 'react'. The auto-save path in
    // codeController has always done this; a manual save hardcoded 'react', so
    // every project saved from the Save button was mislabelled in the dashboard.
    const project = new Project({
      userId,
      title,
      prompt,
      generatedCode,
      framework: framework || extractFramework(prompt, generatedCode),
      tags: tags?.length ? tags : extractTags(prompt, generatedCode),
      metadata: {
        model: aiService.model
      }
    });

    await project.save();

    res.status(201).json({
      success: true,
      project,
      message: 'Project saved successfully'
    });
  } catch (error) {
    console.error('❌ Create project error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: 'CREATE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all projects for a user
const getUserProjects = async (req, res) => {
  try {
    const userId = req.userId;
    // Clamp pagination so page=0/-1 cannot produce a negative skip and
    // limit=100000 cannot dump the whole collection.
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = req.query.search || '';
    const requestedSort = req.query.sortBy;
    const sortBy = SORTABLE_FIELDS.includes(requestedSort) ? requestedSort : 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = { userId };

    // Add search functionality using regex
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { prompt: { $regex: safeSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(safeSearch, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get projects error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: 'FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('❌ Get project error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: 'FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.userId;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('❌ Update project error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: 'UPDATE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const project = await Project.findOneAndDelete({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete project error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: 'DELETE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Toggle favorite status
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'PROJECT_NOT_FOUND'
      });
    }

    project.isFavorite = !project.isFavorite;
    await project.save();

    res.json({
      success: true,
      project,
      message: `Project ${project.isFavorite ? 'added to' : 'removed from'} favorites`
    });
  } catch (error) {
    console.error('❌ Toggle favorite error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite status',
      error: 'TOGGLE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleFavorite
};