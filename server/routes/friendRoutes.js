// server/routes/friendRoutes.js

import express from 'express';
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getPendingRequests
} from '../controllers/friendController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Send a friend request
router.post('/send', authMiddleware, sendRequest);

// Accept a friend request
router.post('/accept/:id', authMiddleware, acceptRequest);

// Reject a friend request
router.post('/reject/:id', authMiddleware, rejectRequest);

// Get all pending friend requests for the logged-in user
router.get('/requests', authMiddleware, getPendingRequests);

// Get the logged-in user's friends
router.get('/myfriends', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'name email');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.friends || []);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ msg: "Server error while fetching friends" });
  }
});

export default router;
