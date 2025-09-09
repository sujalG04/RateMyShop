import express from 'express';
import { submitRating, getUserRatings } from '../controllers/ratingController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateRating, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// User routes
router.post('/', authenticateToken, requireRole(['user']), validateRating, handleValidationErrors, submitRating);
router.get('/my-ratings', authenticateToken, requireRole(['user']), getUserRatings);

export default router;