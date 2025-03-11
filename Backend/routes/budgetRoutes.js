import express from "express";
import { createBudget, updateSpending, getUserBudgets } from "../controller/budgetController.js";
import userAuth from "../middleware/userMiddleware.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: API for managing budgets
 */

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Food"
 *               amount:
 *                 type: number
 *                 example: 500
 *               timePeriod:
 *                 type: string
 *                 example: "Monthly"
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Budget already exists for this category
 *       500:
 *         description: Server error
 */
router.post("/create", userAuth, createBudget);

/**
 * @swagger
 * /update:
 *   put:
 *     summary: Update current spending in a budget
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "Food"
 *               amountSpent:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Spending updated successfully or over budget warning
 *       404:
 *         description: Budget not found for this category
 *       500:
 *         description: Server error
 */
router.put("/update", userAuth, updateSpending);

/**
 * @swagger
 * /user-budgets:
 *   get:
 *     summary: Get all budgets for a user
 *     tags: [Budgets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets retrieved successfully
 *       404:
 *         description: No budgets found
 *       500:
 *         description: Server error
 */
router.get("/user-budgets", userAuth, getUserBudgets);

export default router;
