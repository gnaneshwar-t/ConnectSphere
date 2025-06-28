// server/routes/userRoutes.js

import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Search users by name
router.get('/search', authMiddleware, async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ msg: 'Query missing' });
  }

  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive search
    }).select('-password'); // Exclude password field

    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user by ID (used in chat display, etc.)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
