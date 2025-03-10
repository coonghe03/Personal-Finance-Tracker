import Report from "../models/reportModel.js";
import Transaction from "../models/transactionModel.js";
import mongoose from "mongoose";

// Generate financial report
export const generateReport = async (req, res) => {
  try {
    const { reportType, period } = req.body;
    const userId = req.userId; // Retrieved from middleware

    // Define time range based on period
    const dateRange = getDateRange(period);

    // Fetch transactions based on type and date range
    const transactions = await Transaction.find({
      userId,
      type: reportType,
      createdAt: { $gte: dateRange.start, $lte: dateRange.end },
    });

    // Calculate total amount
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Save report in database
    const newReport = new Report({
      userId,
      reportType,
      period,
      transactions: transactions.map((t) => t._id),
      totalAmount,
    });

    await newReport.save();
    res.status(201).json({ success: true, message: "Report generated successfully", report: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating report", error: error.message });
  }
};

// Fetch user reports
export const getUserReports = async (req, res) => {
  try {
    const userId = req.userId;
    const reports = await Report.find({ userId }).populate("transactions");

    res.status(200).json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reports", error: error.message });
  }
};

// Get date range based on period
const getDateRange = (period) => {
  const now = new Date();
  let start, end;

  switch (period) {
    case "daily":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "weekly":
      start = new Date(now.setDate(now.getDate() - now.getDay()));
      end = new Date(now.setDate(start.getDate() + 6));
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      throw new Error("Invalid period");
  }

  return { start, end };
};

export const getUserIncomeVsExpenseReport = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from middleware
    const { startDate, endDate, category, tag } = req.query;

    // Convert userId properly
    const filter = { userId: new mongoose.Types.ObjectId(userId) };

    // Log received filters
    console.log("Filters Received:", { userId, startDate, endDate, category, tag });

    // Fix Date Filtering
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate + "T00:00:00.000Z"),
        $lte: new Date(endDate + "T23:59:59.999Z")
      };
    }

    // Fix Category Filtering
    if (category) filter.category = category;

    // Fix Tags Filtering (Array Issue)
    if (tag) filter.tags = { $in: [tag] };

    console.log("Final Filter:", JSON.stringify(filter, null, 2));

    const incomeTransactions = await Transaction.aggregate([
      { $match: { ...filter, type: "income" } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
    ]);

    const expenseTransactions = await Transaction.aggregate([
      { $match: { ...filter, type: "expense" } },
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);

    // Check aggregation results
    console.log("Income Transactions:", incomeTransactions);
    console.log("Expense Transactions:", expenseTransactions);

    const income = incomeTransactions.length ? incomeTransactions[0].totalIncome : 0;
    const expense = expenseTransactions.length ? expenseTransactions[0].totalExpense : 0;

    res.status(200).json({
      userId,
      income,
      expense,
      balance: income - expense,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error generating user Income vs Expense report", error });
  }
};


// 📅 Generate Spending Trend Report
export const getSpendingTrendReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let filter = { type: "expense" };

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) filter.category = category;

    const trend = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, totalSpent: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json(trend);
  } catch (error) {
    res.status(500).json({ message: "Error generating Spending Trend report" });
  }
};
