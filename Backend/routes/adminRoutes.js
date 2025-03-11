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


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 */
router.get('/users', adminAuth, getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 */
router.get('/users/:id',adminAuth, getUserById);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       404:
 *         description: User not found
 */
router.put('/users/:id', adminAuth, updateUser);


/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       404:
 *         description: User not found
 */
router.delete('/users/:id',adminAuth, deleteUser);


/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
 */
router.get('/transactions', adminAuth, getAllTransactions);


/**
 * @swagger
 * /api/admin/budgets:
 *   get:
 *     summary: Get all budgets
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved budgets
 */
router.get('/budgets', adminAuth, getAllBudgets);


/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved reports
 */
router.get('/reports', adminAuth, getAllReports);


export default router;
