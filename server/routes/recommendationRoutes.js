// server/routes/recommendationRoutes.js

import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get friend recommendations for the authenticated user
router.get('/', authMiddleware, getRecommendations);

export default router;
