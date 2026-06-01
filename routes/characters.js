const express = require('express');
const Character = require('../models/Character');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all characters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const characters = await Character.find(query)
      .populate('uploadedBy', 'username avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Character.countDocuments(query);

    res.json({
      characters,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single character
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploadedBy', 'username avatar');

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create character (requires auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, anime, description, image, role, powers } = req.body;

    const character = new Character({
      name,
      anime,
      description,
      image,
      role,
      powers: powers || [],
      uploadedBy: req.user.id
    });

    await character.save();
    await character.populate('uploadedBy', 'username avatar');

    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update character (only by uploader or admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (character.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('uploadedBy', 'username avatar');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete character (only by uploader or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (character.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Character.findByIdAndDelete(req.params.id);
    res.json({ message: 'Character deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate character
router.post('/:id/rate', verifyToken, async (req, res) => {
  try {
    const { score } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    const character = await Character.findById(req.params.id);

    // Remove existing rating if any
    character.ratings = character.ratings.filter(r => r.user.toString() !== req.user.id);

    // Add new rating
    character.ratings.push({ user: req.user.id, score });

    // Calculate average rating
    character.rating = character.ratings.length > 0
      ? character.ratings.reduce((sum, r) => sum + r.score, 0) / character.ratings.length
      : 0;

    await character.save();
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;