import express from "express";
import userAuth from "../middleware/userMiddleware.js"

import { 
    createTransaction, 
    getTransactions, 
    updateTransaction, 
    deleteTransaction 
} from "../controller/transactionController.js";
 
const router = express.Router();

// CRUD Routes for Transactions

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transactions (income & expenses)
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Adds a new transaction (income or expense) for an authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - amount
 *               - category
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID who owns this transaction
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: Type of transaction (income or expense)
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Amount of the transaction
 *               category:
 *                 type: string
 *                 description: Category of the transaction
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Custom labels for filtering
 *               recurring:
 *                 type: boolean
 *                 description: Whether the transaction is recurring
 *               recurrencePattern:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *                 nullable: true
 *                 description: Recurrence pattern
 *     responses:
 *       "201":
 *         description: Transaction created successfully
 *       "401":
 *         description: Unauthorized (Invalid or missing token)
 *       "403":
 *         description: Forbidden (User not authorized)
 */
router.post("/", userAuth, createTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieves all transactions for the authenticated user.
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter transactions by type
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter transactions by category
 *       - name: tag
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter transactions by tag
 *     responses:
 *       "200":
 *         description: List of transactions retrieved successfully
 *       "401":
 *         description: Unauthorized (Invalid or missing token)
 *       "403":
 *         description: Forbidden (User not authorized)
 */
router.get("/", userAuth,getTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Modify an existing transaction.
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 description: Type of transaction (income or expense)
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Amount of the transaction
 *               category:
 *                 type: string
 *                 description: Category of the transaction
 *     responses:
 *       "200":
 *         description: Transaction updated successfully
 *       "400":
 *         description: Invalid transaction ID or data
 *       "401":
 *         description: Unauthorized (Invalid or missing token)
 *       "403":
 *         description: Forbidden (User not authorized)
 *       "404":
 *         description: Transaction not found
 */
router.put("/:id", userAuth, updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Remove a transaction by ID.
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID to delete
 *     responses:
 *       "200":
 *         description: Transaction deleted successfully
 *       "401":
 *         description: Unauthorized (Invalid or missing token)
 *       "403":
 *         description: Forbidden (User not authorized)
 *       "404":
 *         description: Transaction not found
 */
router.delete("/:id",userAuth, deleteTransaction);

export default router;
