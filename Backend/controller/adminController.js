import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
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
