import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  name: { type: String, required: true }, 
  targetAmount: { type: Number, required: true }, 
  currentSavings: { type: Number, default: 0 },
  deadline: { type: Date, required: true }, 
  autoAllocate: { type: Boolean, default: false }, 
  allocationPercentage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }, 
});

export default mongoose.model("Goal", goalSchema);
