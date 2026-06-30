const express = require('express');
const authMiddleware = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const router = express.Router();

// Create comment
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      postId: req.params.postId,
      author: req.userId,
      content,
    });

    await comment.save();
    await comment.populate('author', 'username profilePicture');

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
});

// Get comments for post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Like comment
router.post('/:commentId/like', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Already liked this comment' });
    }

    comment.likes.push(req.userId);
    await comment.save();

    res.json({ message: 'Comment liked successfully', likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking comment', error: error.message });
  }
});

// Unlike comment
router.post('/:commentId/unlike', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes = comment.likes.filter(id => id.toString() !== req.userId);
    await comment.save();

    res.json({ message: 'Comment unliked successfully', likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking comment', error: error.message });
  }
});

// Delete comment
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: req.params.commentId } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
});

module.exports = router;
