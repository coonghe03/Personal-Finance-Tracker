import User from '../models/userModel.js'; // Import the User model
import asyncHandler from 'express-async-handler'; // For handling async errors
import crypto from 'crypto'; // Import crypto for hashing

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
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

    // Generate JWT token
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
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

    // Generate JWT token
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

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
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

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();

    // Save user with reset token and expiration
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;

    // Send email
    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
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
