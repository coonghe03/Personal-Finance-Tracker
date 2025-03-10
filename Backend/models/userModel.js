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
    preferredCurrency: { type: String, default: "USD" }, // Preferred currency field
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function() {
     const resetToken = crypto.randomBytes(20).toString('hex');
     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
     this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

export default mongoose.model('User', UserSchema);
