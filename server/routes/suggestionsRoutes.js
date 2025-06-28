// server/routes/suggestionsRoutes.js

import express from 'express';
import { getSuggestions } from '../controllers/suggestionsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get friend suggestions for the logged-in user
router.get('/', authMiddleware, getSuggestions);

export default router;
