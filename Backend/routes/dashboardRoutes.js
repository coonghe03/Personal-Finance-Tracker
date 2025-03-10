import express from "express";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import authAdmin from "../middleware/authMiddleware.js";
import userAuth from "../middleware/userMiddleware.js";

const router = express.Router();

// Admin Dashboard
router.get("/admin", authAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTransactions = await Transaction.countDocuments();
        const totalIncome = await Transaction.aggregate([{ $match: { type: "income" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);
        const totalExpense = await Transaction.aggregate([{ $match: { type: "expense" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

        res.json({
            totalUsers,
            totalTransactions,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Dashboard
router.get("/user", userAuth, async (req, res) => {
    try {
        console.log("User ID from middleware:", req.userId);

        // Fetch transactions for the authenticated user
        const transactions = await Transaction.find({ userId: req.userId });

        // Calculate total income
        const totalIncome = await Transaction.aggregate([
            { $match: { userId: req.userId, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Calculate total expense
        const totalExpense = await Transaction.aggregate([
            { $match: { userId: req.userId, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalTransactions: transactions.length,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
        });
    } catch (error) {
        console.error("Error in user dashboard:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
