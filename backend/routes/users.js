import express from 'express';
import { getUsers, getUserById, createUser, getDashboardStats } from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validateUser, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Admin only routes
router.get('/stats', authenticateToken, requireRole(['admin']), getDashboardStats);
router.get('/', authenticateToken, requireRole(['admin']), getUsers);
router.get('/:id', authenticateToken, requireRole(['admin']), getUserById);
router.post('/', authenticateToken, requireRole(['admin']), validateUser, handleValidationErrors, createUser);

export default router;