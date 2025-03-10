import User from '../models/userModel.js'; 
import asyncHandler from 'express-async-handler';
import crypto from 'crypto'; 
import sendEmail from '../utils/sendEmail.js';
import nodemailer from 'nodemailer';


export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({ name, email, password, role });
    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        res.status(401);
        throw new Error('Email and Password are required');
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        message: "Login Successfull",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @route   GET /api/users/me
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// @route   POST /api/users/forgotpassword
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get password reset token
    const resetToken = user.getResetPasswordToken();

    // Save the user with the reset token
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;

    // Message to be sent in the email
    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        // Send the reset email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        // If error occurs, reset token fields and save
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});


// @desc    Reset password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
    // Hash the token from the URL
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    // Find user by reset token and check expiration
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        data: 'Password reset successful'
    });
});
