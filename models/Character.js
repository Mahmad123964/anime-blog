const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  anime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['protagonist', 'antagonist', 'supporting'],
    default: 'supporting'
  },
  powers: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for better query performance
characterSchema.index({ anime: 1 });
characterSchema.index({ name: 'text', anime: 'text', description: 'text' });
characterSchema.index({ createdAt: -1 });
characterSchema.index({ rating: -1 });

module.exports = mongoose.model('Character', characterSchema);