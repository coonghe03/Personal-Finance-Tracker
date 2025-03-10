import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    maxExpenseLimit: { type: Number, default: 1000 }, // Default max limit
    allowedCategories: { type: [String], default: ["Food", "Transport", "Entertainment", "Shopping"] }, // Allowed categories
    currency: { type: String, default: "USD" }, // Preferred currency
}, { timestamps: true });

export default mongoose.model("SystemSettings", systemSettingsSchema);
