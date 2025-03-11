import express from "express";
import { generateReport, getUserIncomeVsExpenseReport, getUserReports } from "../controller/reportController.js";
import userAuth from "../middleware/userMiddleware.js";
import authAdmin from "../middleware/authMiddleware.js";
import { getSpendingTrendReport } from "../controller/reportController.js";
const router = express.Router();

// Routes

/**
 * @swagger
 * tags:
 *   name: Financial Reports
 *   description: API endpoints for financial reports
 */

/**
 * @swagger
 * /reports/generate:
 *   post:
 *     summary: Generate a financial report
 *     description: Generate a report based on income or expenses for a specified period.
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "income"
 *               period:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 example: "monthly"
 *     responses:
 *       201:
 *         description: Report generated successfully.
 *       500:
 *         description: Error generating report.
 */
router.post("/generate", userAuth, generateReport);

/**
 * @swagger
 * /reports/user-reports:
 *   get:
 *     summary: Get user reports
 *     description: Retrieve financial reports for the authenticated user.
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved reports.
 *       500:
 *         description: Error fetching reports.
 */
router.get("/user-reports", authAdmin, getUserReports);

/**
 * @swagger
 * /reports/income-vs-expense:
 *   get:
 *     summary: Get income vs expense report
 *     description: Retrieve a comparison of income and expenses for the user.
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Successfully retrieved income vs expense data.
 *       500:
 *         description: Error generating report.
 */
router.get("/income-vs-expense", userAuth, getUserIncomeVsExpenseReport);

/**
 * @swagger
 * /reports/spending-trend:
 *   get:
 *     summary: Get spending trend report
 *     description: Retrieve a report on spending trends over time.
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         example: "2024-01-31"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         example: "Food"
 *     responses:
 *       200:
 *         description: Successfully retrieved spending trend data.
 *       500:
 *         description: Error generating report.
 */
router.get("/spending-trend", userAuth, getSpendingTrendReport);



export default router;


