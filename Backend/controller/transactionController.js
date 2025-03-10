import Transaction from "../models/transactionModel.js";
import Goal from "../models/goalModel.js";
import Budget from "../models/budgetModel.js";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import SystemSetting from "../models/systemSettingModel.js";
import { getExchangeRate } from "../utils/exchangeRate.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "pahitharandilakshan@gmail.com",
        pass: "sqcu plul lmtg eqdg"
    }
});

// 📌 Create a new Transaction
export const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, tags, recurring, currency, recurrencePattern } = req.body;
        const userId = req.userId;

        // 🔹 Fetch system settings for transaction limits
        const systemSettings = await SystemSetting.findOne({ userId });
        if (systemSettings && amount > systemSettings.maxExpenseLimit) {
            return res.status(400).json({ message: "Transaction amount exceeds the system limit." });
        }

        let nextOccurrenceDate = null;
        if (recurring) {
            nextOccurrenceDate = getNextOccurrenceDate(new Date(), recurrencePattern);
        }

        // 🔹 Fetch user to get preferred currency
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const preferredCurrency = user.preferredCurrency || "USD";

        // 🔹 Convert amount only if needed
        let convertedAmount = amount;
        if (currency !== preferredCurrency) {
            const exchangeRate = await getExchangeRate(currency, preferredCurrency);
            convertedAmount = amount * exchangeRate;
        }

        // 🔹 Create and save the transaction
        const transaction = new Transaction({
            userId,
            type,
            amount,  // Original amount in entered currency
            currency,
            convertedAmount,  // Converted to preferred currency
            preferredCurrency,
            category,
            tags,
            recurring,
            recurrencePattern,
            nextOccurrenceDate
        });

        await transaction.save();

        // 🔹 If it's an income, allocate a percentage to goals
        if (type === "income") {
            const goals = await Goal.find({ userId, autoAllocate: true });

            for (const goal of goals) {
                const allocatedAmount = (goal.allocationPercentage / 100) * amount;
                goal.currentSavings += allocatedAmount;

                if (goal.currentSavings >= goal.targetAmount) {
                    await sendGoalReachedEmail(userId, goal.name);
                }
                await goal.save();
            }
        }

        // 🔹 If it's an expense, check the budget
        if (type === "expense") {
            const budget = await Budget.findOne({ userId, category });

            if (budget) {
                // Update current spending
                budget.currentSpending += amount;
                await budget.save();

                // If spending exceeds budget, send an email alert
                if (budget.currentSpending > budget.amount) {
                    await sendBudgetExceededEmail(userId, category, budget.amount, budget.currentSpending);
                }
            }
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction" });
    }
};



const sendGoalReachedEmail = async (userId, goalName) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.email) return;

        const mailOptions = {
            from: "pahitharandilakshan@gmail.com",
            to: user.email,
            subject: "🎉 Congratulations! Goal Achieved",
            text: `Great news! You have successfully reached your savings goal: ${goalName}.\n
                   Keep up the great work with your financial planning! 🎯`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Goal reached email sent.");
    } catch (error) {
        console.error("❌ Error sending goal reached email:", error);
    }
};

// 📧 Function to send budget exceeded email
const sendBudgetExceededEmail = async (userId, category, budgetAmount, currentSpending) => {
    console.log(userId);
    try {
        // Fetch user's email (Assuming you have a User model)
        const user = await User.findById(userId);
        if (!user || !user.email) return;

        const mailOptions = {
            from: "pahitharandilakshan@gmail.com", 
            to: user.email,
            subject: "Budget Alert: Overspending Warning!",
            text: `You have exceeded your budget for ${category}.\n
                   Budgeted Amount: $${budgetAmount}\n
                   Current Spending: $${currentSpending}\n
                   Please review your expenses.`
        };

        await transporter.sendMail(mailOptions);
        console.log("Budget exceeded email sent.");
    } catch (error) {
        console.error("Error sending budget exceeded email:", error);
    }
};


// 📌 Get All Transactions (Filter by type, category, tags)
export const getTransactions = async (req, res) => {
    try {
        const { type, category, tag } = req.query;
        let filter = { userId: req.user.id };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (tag) filter.tags = tag;

        const transactions = await Transaction.find(filter).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions" });
    }
};

// 📌 Update Transaction
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        Object.assign(transaction, req.body);
        await transaction.save();
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction" });
    }
};

// 📌 Delete Transaction
export const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction" });
    }
};

// 📌 Helper function to calculate next occurrence date for recurring transactions
const getNextOccurrenceDate = (currentDate, pattern) => {
    const nextDate = new Date(currentDate);
    if (pattern === "daily") nextDate.setDate(nextDate.getDate() + 1);
    if (pattern === "weekly") nextDate.setDate(nextDate.getDate() + 7);
    if (pattern === "monthly") nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate;
};
