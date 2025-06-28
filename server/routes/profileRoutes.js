// server/routes/profileRoutes.js

import express from 'express';
import { updateProfile, getUserProfile } from '../controllers/profileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Update the logged-in user's profile
router.post('/update', authMiddleware, updateProfile);

// Get a user's profile by their userId
router.get('/user/:userId', authMiddleware, getUserProfile);

export default router;
