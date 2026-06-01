const express = require('express');
const Blog = require('../models/Blog');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query = { published: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username avatar');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create blog (requires auth)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, excerpt, featuredImage, category, tags } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags: tags || [],
      author: req.user.id
    });

    await blog.save();
    await blog.populate('author', 'username avatar');

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog (only by author or admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'username avatar');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish blog (only by author or admin)
router.patch('/:id/publish', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    blog.published = !blog.published;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate blog
router.post('/:id/rate', verifyToken, async (req, res) => {
  try {
    const { score } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    const blog = await Blog.findById(req.params.id);

    blog.ratings = blog.ratings.filter(r => r.user.toString() !== req.user.id);
    blog.ratings.push({ user: req.user.id, score });

    blog.rating = blog.ratings.length > 0
      ? blog.ratings.reduce((sum, r) => sum + r.score, 0) / blog.ratings.length
      : 0;

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;