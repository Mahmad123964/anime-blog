const express = require('express');
const Comment = require('../models/Comment');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get comments for blog
router.get('/blog/:blogId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('author', 'username avatar')
      .populate('replies.author', 'username avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ blog: req.params.blogId });

    res.json({
      comments,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create comment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, blog, character, rating } = req.body;

    const comment = new Comment({
      content,
      blog,
      character,
      rating,
      author: req.user.id
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like comment
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.likes.includes(req.user.id)) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reply to comment
router.post('/:id/reply', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.replies.push({
      author: req.user.id,
      content
    });

    await comment.save();
    await comment.populate('replies.author', 'username avatar');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment (only by author)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;