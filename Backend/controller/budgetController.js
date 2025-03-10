import Budget from "../models/budgetModel.js";

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    const { category, amount, timePeriod } = req.body;
    const userId = req.userId;  // From the userAuth middleware

    // Check if the user already has a budget set for this category
    const existingBudget = await Budget.findOne({ userId, category });
    if (existingBudget) {
      return res.status(400).json({ success: false, message: "Budget already exists for this category." });
    }

    const budget = new Budget({
      userId,
      category,
      amount,
      timePeriod,
    });

    await budget.save();
    res.status(201).json({ success: true, message: "Budget created successfully!", budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Update current spending in a budget
export const updateSpending = async (req, res) => {
  try {
    const { category, amountSpent } = req.body;
    const userId = req.userId;  

    const budget = await Budget.findOne({ userId, category });
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found for this category." });
    }
    budget.currentSpending += amountSpent;
    await budget.save();

// Check if the user has exceeded their budget
    const isOverBudget = budget.currentSpending > budget.amount;

    res.status(200).json({
      success: true,
      message: isOverBudget ? "You have exceeded your budget!" : "Spending updated successfully!",
      budget,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Get all budgets for a user
export const getUserBudgets = async (req, res) => {
  try {
    const userId = req.userId;  

    const budgets = await Budget.find({ userId });
    if (!budgets || budgets.length === 0) {
      return res.status(404).json({ success: false, message: "No budgets found." });
    }

    res.status(200).json({ success: true, budgets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
