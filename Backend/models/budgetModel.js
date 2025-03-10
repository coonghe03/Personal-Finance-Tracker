import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  category: { type: String, required: true },
  amount: { type: Number, required: true },  
  timePeriod: { type: String, enum: ["monthly", "category"], default: "monthly" },  
  currentSpending: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Budget", budgetSchema);
