const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../config/upload');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post (text and/or image). Requires login.
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must have text, an image, or both' });
    }

    const post = await Post.create({
      user: req.user.id,
      username: req.user.username,
      text: text || '',
      imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @route   GET /api/posts
// @desc    Get the public feed (all posts, newest first). Supports basic pagination.
// @query   page (default 1), limit (default 10)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching feed' });
  }
});

// @route   PUT /api/posts/:id/like
// @desc    Like or unlike a post (toggle). Requires login.
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    if (alreadyLikedIndex >= 0) {
      // already liked -> unlike
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      post.likes.push({ user: req.user.id, username: req.user.username });
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating like' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post. Requires login.
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

module.exports = router;
