import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Transaction from '../models/transactionModel.js';
import Budgets from '../models/budgetModel.js';
import Reports from '../models/reportModel.js';

// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
});

// @route   GET /api/admin/transactions
export const getAllTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, data: transactions });
});

// @route   GET /api/admin/budgets
export const getAllBudgets = asyncHandler(async (req, res) => {
    const budgets = await Budgets.find();
    res.status(200).json({ success: true, data: budgets });
});

//@route    GET /api/admin/reports
export const getAllReports = asyncHandler(async (req, res) => {
    const reports = await Reports.find();
    res.status(200).json({ success: true, data: reports });
});

// @route   GET /api/admin/users/:id
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({ success: true, data: user });
});

// @route   PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        data: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        }
    });
});

// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.remove();

    res.status(200).json({ success: true, data: {} });
});
