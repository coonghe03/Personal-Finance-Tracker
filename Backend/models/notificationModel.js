import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  message: { type: String, required: true }, // Notification message
  type: { type: String, enum: ["spending", "deadline", "reminder"], required: true }, // Notification type
  isRead: { type: Boolean, default: false }, // Read status
  createdAt: { type: Date, default: Date.now } // Timestamp
});

export default mongoose.model("Notification", notificationSchema);
