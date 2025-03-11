import express from "express";
import { createSettings, getSettings, updateSettings } from "../controller/systemSettingController.js";
import adminAuth from "../middleware/authMiddleware.js"; // Ensure only admins modify settings
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure authenticated users can view settings

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: System Settings
 *   description: API endpoints for managing system settings
 */

/**
 * @swagger
 * /settings/configure:
 *   post:
 *     summary: Create system settings
 *     description: Create system settings for a specific user. Only accessible to admin users.
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65d1a6a7e45c36001f1e923c"
 *               maxExpenseLimit:
 *                 type: number
 *                 example: 2000
 *               allowedCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Food", "Transport", "Entertainment"]
 *               currency:
 *                 type: string
 *                 example: "EUR"
 *     responses:
 *       201:
 *         description: System settings created successfully.
 *       400:
 *         description: Settings already exist for this user.
 *       500:
 *         description: Server error.
 */
router.post("/configure", adminAuth, createSettings);

/**
 * @swagger
 * /settings/{userId}:
 *   get:
 *     summary: Get system settings for a user
 *     description: Retrieve the current system settings for a specific user.
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "65d1a6a7e45c36001f1e923c"
 *     responses:
 *       200:
 *         description: Successfully retrieved system settings.
 *       404:
 *         description: No system settings found for this user.
 *       500:
 *         description: Server error.
 */
router.get("/:userId", authMiddleware, getSettings);

/**
 * @swagger
 * /settings/configure/{userId}:
 *   put:
 *     summary: Update system settings for a user
 *     description: Update system settings such as expense limit, allowed categories, and currency.
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "65d1a6a7e45c36001f1e923c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maxExpenseLimit:
 *                 type: number
 *                 example: 3000
 *               allowedCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Food", "Shopping", "Travel"]
 *               currency:
 *                 type: string
 *                 example: "GBP"
 *     responses:
 *       200:
 *         description: Settings updated successfully.
 *       500:
 *         description: Server error.
 */
router.put("/configure/:userId", adminAuth, updateSettings);


export default router;
