import express from "express";
import { createGoal, updateSavings, getUserGoals } from "../controller/goalController.js";
import userAuth from "../middleware/userMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: API for managing financial goals
 */

/**
 * @swagger
 * /goals/create:
 *   post:
 *     summary: Create a new financial goal
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vacation Fund"
 *               targetAmount:
 *                 type: number
 *                 example: 5000
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               autoAllocate:
 *                 type: boolean
 *                 example: true
 *               allocationPercentage:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       500:
 *         description: Server error
 */
router.post("/create", userAuth, createGoal);

/**
 * @swagger
 * /goals/update-savings:
 *   put:
 *     summary: Update savings progress for a financial goal
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Savings updated successfully
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Server error
 */
router.put("/update-savings", userAuth, updateSavings);

/**
 * @swagger
 * /goals/user-goals:
 *   get:
 *     summary: Get all financial goals for a user
 *     tags: [Goals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of financial goals
 *       404:
 *         description: No goals found
 *       500:
 *         description: Server error
 */
router.get("/user-goals", userAuth, getUserGoals);


export default router;
