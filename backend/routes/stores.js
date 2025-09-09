import express from 'express';
import { getStores, createStore, getStoresByOwner, getStoreRatings } from '../controllers/storeController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateStore, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public/User routes
router.get('/', authenticateToken, getStores);

// Store owner routes
router.get('/my-stores', authenticateToken, requireRole(['store_owner']), getStoresByOwner);
router.get('/:storeId/ratings', authenticateToken, requireRole(['store_owner']), getStoreRatings);

// Admin only routes
router.post('/', authenticateToken, requireRole(['admin']), validateStore, handleValidationErrors, createStore);

export default router;