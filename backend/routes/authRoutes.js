const express = require('express');
const router = express.Router();

// Mock user data for demo purposes
const users = [
  {
    id: '1',
    email: 'demo@hackforge.com',
    role: 'free',
    aiTokens: 100,
    maxTokens: 100,
    features: ['advanced_ai'],
    createdAt: new Date(),
    lastActive: new Date()
  },
  {
    id: '2',
    email: 'premium@hackforge.com',
    role: 'premium',
    aiTokens: 1000,
    maxTokens: 1000,
    features: ['advanced_ai', 'custom_templates', 'api_access', 'priority_support'],
    createdAt: new Date(),
    lastActive: new Date()
  },
  {
    id: '3',
    email: 'enterprise@hackforge.com',
    role: 'enterprise',
    aiTokens: -1,
    maxTokens: -1,
    features: ['advanced_ai', 'custom_templates', 'team_collaboration', 'api_access', 'priority_support', 'unlimited_tokens'],
    createdAt: new Date(),
    lastActive: new Date()
  }
];

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive information
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user role (upgrade/downgrade)
router.put('/upgrade/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate role
    const validRoles = ['free', 'premium', 'enterprise'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Update user role and features
    user.role = newRole;
    user.updatedAt = new Date();
    
    // Update tokens and features based on role
    switch (newRole) {
      case 'free':
        user.maxTokens = 100;
        user.aiTokens = 100;
        user.features = ['advanced_ai'];
        break;
      case 'premium':
        user.maxTokens = 1000;
        user.aiTokens = 1000;
        user.features = ['advanced_ai', 'custom_templates', 'api_access', 'priority_support'];
        break;
      case 'enterprise':
        user.maxTokens = -1;
        user.aiTokens = -1;
        user.features = ['advanced_ai', 'custom_templates', 'team_collaboration', 'api_access', 'priority_support', 'unlimited_tokens'];
        break;
    }
    
    res.json({ 
      message: 'User upgraded successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        aiTokens: user.aiTokens,
        maxTokens: user.maxTokens,
        features: user.features
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upgrade user' });
  }
});

// Consume AI tokens
router.post('/consume-tokens/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { tokens } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Enterprise users have unlimited tokens
    if (user.role === 'enterprise') {
      return res.json({ 
        success: true, 
        remainingTokens: -1,
        message: 'Unlimited tokens available'
      });
    }
    
    // Check if user has enough tokens
    if (user.aiTokens < tokens) {
      return res.status(400).json({ 
        error: 'Insufficient tokens',
        required: tokens,
        available: user.aiTokens
      });
    }
    
    // Consume tokens
    user.aiTokens -= tokens;
    user.lastActive = new Date();
    
    res.json({ 
      success: true,
      consumed: tokens,
      remainingTokens: user.aiTokens,
      message: 'Tokens consumed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to consume tokens' });
  }
});

// Get user features
router.get('/features/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      userId: user.id,
      role: user.role,
      features: user.features,
      aiTokens: user.aiTokens,
      maxTokens: user.maxTokens
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user features' });
  }
});

// Check feature access
router.post('/check-feature', (req, res) => {
  try {
    const { userId, feature } = req.body;
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const hasFeature = user.features.includes(feature);
    
    res.json({
      userId: user.id,
      feature,
      hasAccess: hasFeature,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check feature access' });
  }
});

// Get all users (admin only)
router.get('/users', (req, res) => {
  try {
    // In a real app, check if user has admin role
    const userList = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      aiTokens: user.aiTokens,
      maxTokens: user.maxTokens,
      features: user.features,
      createdAt: user.createdAt,
      lastActive: user.lastActive
    }));
    
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

module.exports = router; 