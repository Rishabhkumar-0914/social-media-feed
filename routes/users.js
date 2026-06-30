const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user profile
router.put('/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { bio, profilePicture },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Follow user
router.post('/:userId/follow', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const userToFollow = await User.findById(req.params.userId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(req.params.userId);
    userToFollow.followers.push(req.userId);

    await currentUser.save();
    await userToFollow.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
});

// Unfollow user
router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const userToUnfollow = await User.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.userId);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
