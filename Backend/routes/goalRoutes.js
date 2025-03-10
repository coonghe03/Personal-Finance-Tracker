import express from "express";
import { createGoal, updateSavings, getUserGoals } from "../controller/goalController.js";
import userAuth from "../middleware/userMiddleware.js";

const router = express.Router();

// ✅ Routes for managing financial goals
router.post("/create", userAuth, createGoal); // Create a new goal
router.put("/update-savings", userAuth, updateSavings); // Update savings for a goal
router.get("/user-goals", userAuth, getUserGoals); // Get all goals for a user

export default router;
