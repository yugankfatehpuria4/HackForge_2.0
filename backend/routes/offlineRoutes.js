const express = require('express');
const router = express.Router();

// Mock offline data storage for demo purposes
let offlineCodes = [];
let offlineProjects = [];

// Save code for offline access
router.post('/save-code', (req, res) => {
  try {
    const { id, title, description, code, language, tags } = req.body;
    
    const offlineCode = {
      id: id || `offline_${Date.now()}`,
      title,
      description,
      code,
      language,
      timestamp: Date.now(),
      tags: tags || [],
      isFavorite: false
    };
    
    // Check if code already exists
    const existingIndex = offlineCodes.findIndex(c => c.id === offlineCode.id);
    if (existingIndex >= 0) {
      offlineCodes[existingIndex] = offlineCode;
    } else {
      offlineCodes.push(offlineCode);
    }
    
    res.json({
      success: true,
      message: 'Code saved for offline access',
      code: offlineCode
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save code for offline access' });
  }
});

// Get all offline codes
router.get('/codes', (req, res) => {
  try {
    res.json({
      success: true,
      codes: offlineCodes,
      count: offlineCodes.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offline codes' });
  }
});

// Get offline code by ID
router.get('/codes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const code = offlineCodes.find(c => c.id === id);
    
    if (!code) {
      return res.status(404).json({ error: 'Offline code not found' });
    }
    
    res.json({
      success: true,
      code
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offline code' });
  }
});

// Search offline codes
router.get('/codes/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const lowerQuery = query.toLowerCase();
    
    const results = offlineCodes.filter(code => 
      code.title.toLowerCase().includes(lowerQuery) ||
      code.description.toLowerCase().includes(lowerQuery) ||
      code.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      code.code.toLowerCase().includes(lowerQuery)
    );
    
    res.json({
      success: true,
      query,
      results,
      count: results.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search offline codes' });
  }
});

// Toggle favorite status
router.put('/codes/:id/favorite', (req, res) => {
  try {
    const { id } = req.params;
    const code = offlineCodes.find(c => c.id === id);
    
    if (!code) {
      return res.status(404).json({ error: 'Offline code not found' });
    }
    
    code.isFavorite = !code.isFavorite;
    
    res.json({
      success: true,
      message: `Code ${code.isFavorite ? 'added to' : 'removed from'} favorites`,
      code
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite status' });
  }
});

// Delete offline code
router.delete('/codes/:id', (req, res) => {
  try {
    const { id } = req.params;
    const codeIndex = offlineCodes.findIndex(c => c.id === id);
    
    if (codeIndex === -1) {
      return res.status(404).json({ error: 'Offline code not found' });
    }
    
    const deletedCode = offlineCodes.splice(codeIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Code deleted from offline storage',
      deletedCode
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete offline code' });
  }
});

// Save project for offline access
router.post('/save-project', (req, res) => {
  try {
    const { id, name, description, codes } = req.body;
    
    const offlineProject = {
      id: id || `offline_project_${Date.now()}`,
      name,
      description,
      codes: codes || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Check if project already exists
    const existingIndex = offlineProjects.findIndex(p => p.id === offlineProject.id);
    if (existingIndex >= 0) {
      offlineProjects[existingIndex] = offlineProject;
    } else {
      offlineProjects.push(offlineProject);
    }
    
    res.json({
      success: true,
      message: 'Project saved for offline access',
      project: offlineProject
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project for offline access' });
  }
});

// Get all offline projects
router.get('/projects', (req, res) => {
  try {
    res.json({
      success: true,
      projects: offlineProjects,
      count: offlineProjects.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offline projects' });
  }
});

// Get offline project by ID
router.get('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = offlineProjects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({ error: 'Offline project not found' });
    }
    
    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offline project' });
  }
});

// Update offline project
router.put('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const projectIndex = offlineProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Offline project not found' });
    }
    
    offlineProjects[projectIndex] = {
      ...offlineProjects[projectIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      project: offlineProjects[projectIndex]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offline project' });
  }
});

// Delete offline project
router.delete('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = offlineProjects.findIndex(p => p.id === id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Offline project not found' });
    }
    
    const deletedProject = offlineProjects.splice(projectIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Project deleted from offline storage',
      deletedProject
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete offline project' });
  }
});

// Export offline data
router.get('/export', (req, res) => {
  try {
    const exportData = {
      codes: offlineCodes,
      projects: offlineProjects,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="hackforge-offline-data.json"');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export offline data' });
  }
});

// Import offline data
router.post('/import', (req, res) => {
  try {
    const { codes, projects } = req.body;
    
    if (codes && Array.isArray(codes)) {
      offlineCodes = [...offlineCodes, ...codes];
    }
    
    if (projects && Array.isArray(projects)) {
      offlineProjects = [...offlineProjects, ...projects];
    }
    
    res.json({
      success: true,
      message: 'Offline data imported successfully',
      imported: {
        codes: codes?.length || 0,
        projects: projects?.length || 0
      },
      total: {
        codes: offlineCodes.length,
        projects: offlineProjects.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import offline data' });
  }
});

// Get storage statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      codes: {
        total: offlineCodes.length,
        favorites: offlineCodes.filter(c => c.isFavorite).length,
        byLanguage: offlineCodes.reduce((acc, code) => {
          acc[code.language] = (acc[code.language] || 0) + 1;
          return acc;
        }, {})
      },
      projects: {
        total: offlineProjects.length,
        withCodes: offlineProjects.filter(p => p.codes.length > 0).length
      },
      storage: {
        estimatedSize: JSON.stringify({ codes: offlineCodes, projects: offlineProjects }).length,
        lastUpdated: new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get storage statistics' });
  }
});

// Clear all offline data
router.delete('/clear', (req, res) => {
  try {
    const deletedCount = offlineCodes.length + offlineProjects.length;
    
    offlineCodes = [];
    offlineProjects = [];
    
    res.json({
      success: true,
      message: 'All offline data cleared successfully',
      deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear offline data' });
  }
});

module.exports = router; 