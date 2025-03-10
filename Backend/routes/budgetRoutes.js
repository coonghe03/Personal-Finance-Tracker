import express from "express";
import { createBudget, updateSpending, getUserBudgets } from "../controller/budgetController.js";
import userAuth from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/create", userAuth, createBudget);
router.put("/update", userAuth, updateSpending);
router.get("/user-budgets", userAuth, getUserBudgets);

export default router;
