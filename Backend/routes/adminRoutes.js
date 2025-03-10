import express from 'express';
import adminAuth from '../middleware/authMiddleware.js'; // Middleware for protection and authorization
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllTransactions,
    getAllBudgets,
    getAllReports
} from '../controller/adminController.js';

const router = express.Router();

router.get('/users', adminAuth, getAllUsers);
router.get('/users/:id',adminAuth, getUserById);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id',adminAuth, deleteUser);
router.get('/transactions', adminAuth, getAllTransactions);
router.get('/budgets', adminAuth, getAllBudgets);
router.get('/reports', adminAuth, getAllReports);

export default router;
