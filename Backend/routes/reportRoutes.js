import express from "express";
import { generateReport, getUserIncomeVsExpenseReport, getUserReports } from "../controller/reportController.js";
import userAuth from "../middleware/userMiddleware.js";
import authAdmin from "../middleware/authMiddleware.js";
import { getSpendingTrendReport } from "../controller/reportController.js";
const router = express.Router();

// Routes
router.post("/generate", userAuth, generateReport);
router.get("/user-reports", authAdmin, getUserReports);
router.get("/income-vs-expense", userAuth, getUserIncomeVsExpenseReport);
router.get("/spending-trend", userAuth, getSpendingTrendReport);


export default router;


