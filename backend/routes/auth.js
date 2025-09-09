import express from 'express';
import { register, login, updatePassword , resetPassword } from '../controllers/authController.js';
import { validateUser, handleValidationErrors } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register', validateUser, handleValidationErrors, register);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], handleValidationErrors, login);

router.put('/password', authenticateToken, [
  // body('currentEmail').notEmpty().withMessage('Current password is required'),
   body("currentEmail").isEmail().withMessage("Valid email is required"),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least 1 uppercase letter and 1 special character')
], handleValidationErrors, updatePassword);


// added
router.put('/reset_password', [
  // body('currentEmail').notEmpty().withMessage('Current password is required'),
   body("currentEmail").isEmail().withMessage("Valid email is required"),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least 1 uppercase letter and 1 special character')
], resetPassword);

export default router;