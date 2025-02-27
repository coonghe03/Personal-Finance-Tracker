import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js'; // Middleware for protection and authorization
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

// @route   GET /api/admin/users
router.get('/users', protect, authorize('admin'), getAllUsers);
// @route   GET /api/admin/users/:id
router.get('/users/:id', protect, authorize('admin'), getUserById);
// @route   PUT /api/admin/users/:id
router.put('/users/:id', protect, authorize('admin'), updateUser);
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
