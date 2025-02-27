import express from 'express';
import { registerUser, loginUser, getMe, forgotPassword, resetPassword } from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Middleware to protect routes

const router = express.Router();

// @route   POST /api/users/register
router.post('/register', registerUser);
// @route   POST /api/users/login
router.post('/login', loginUser);
// @route   GET /api/users/me
router.get('/me', protect, getMe);
// @route   POST /api/users/forgotpassword
router.post('/forgotpassword', forgotPassword);
// @route   PUT /api/users/resetpassword/:resettoken
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
