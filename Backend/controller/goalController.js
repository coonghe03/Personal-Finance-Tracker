import Goal from "../models/goalModel.js";

// ✅ Create a new financial goal
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, autoAllocate, allocationPercentage } = req.body;
    const userId = req.userId; // From authentication middleware

    const goal = new Goal({
      userId,
      name,
      targetAmount,
      deadline,
      autoAllocate,
      allocationPercentage,
    });

    await goal.save();
    res.status(201).json({ success: true, message: "Goal created successfully!", goal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ✅ Update savings progress for a goal
export const updateSavings = async (req, res) => {
  try {
    const { goalId, amount } = req.body;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found." });
    }

    goal.currentSavings += amount;
    await goal.save();

    // Check if goal is reached
    const isGoalReached = goal.currentSavings >= goal.targetAmount;

    res.status(200).json({
      success: true,
      message: isGoalReached ? "Congratulations! Goal achieved!" : "Savings updated successfully!",
      goal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ✅ Get all financial goals for a user
export const getUserGoals = async (req, res) => {
  try {
    const userId = req.userId; // From authentication middleware

    const goals = await Goal.find({ userId });
    if (!goals.length) {
      return res.status(404).json({ success: false, message: "No goals found." });
    }

    res.status(200).json({ success: true, goals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
