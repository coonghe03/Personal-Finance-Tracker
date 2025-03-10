import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    convertedAmount: { type: Number, required: true },  
    preferredCurrency: { type: String, required: true },  
    category: { type: String, required: true },
    tags: [{ type: String }],
    recurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
    nextOccurrenceDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("Transaction", transactionSchema);
