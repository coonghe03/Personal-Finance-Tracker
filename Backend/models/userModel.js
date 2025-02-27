import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate JWT Token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration (15 minutes)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export default mongoose.model('User', UserSchema);
