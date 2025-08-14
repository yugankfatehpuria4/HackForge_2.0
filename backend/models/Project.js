const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  prompt: {
    type: String,
    required: true
  },
  generatedCode: {
    type: String,
    required: true
  },
  framework: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  metadata: {
    tokensUsed: Number,
    generationTime: Number,
    model: String
  }
}, {
  timestamps: true
});

// Add regular indexes for better query performance
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, isFavorite: 1 });
projectSchema.index({ title: 1 });
projectSchema.index({ framework: 1 });

module.exports = mongoose.model('Project', projectSchema);