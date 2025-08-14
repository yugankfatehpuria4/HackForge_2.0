const Project = require('../models/Project');

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, prompt, generatedCode, framework, tags } = req.body;
    const userId = req.body.userId || 'demo-user'; // For now, using demo user

    if (!title || !prompt || !generatedCode) {
      return res.status(400).json({
        success: false,
        message: 'Title, prompt, and generated code are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    const project = new Project({
      userId,
      title,
      prompt,
      generatedCode,
      framework: framework || 'react',
      tags: tags || [],
      metadata: {
        model: 'gemini-2.0-flash'
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
    const userId = req.query.userId || 'demo-user';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    let query = { userId };

    // Add search functionality using regex
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { prompt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
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
    const userId = req.query.userId || 'demo-user';

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
    const userId = req.body.userId || 'demo-user';
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
    const userId = req.query.userId || 'demo-user';

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
    const userId = req.body.userId || 'demo-user';

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