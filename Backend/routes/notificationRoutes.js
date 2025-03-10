import express from "express";
import { createNotification, getUserNotifications, markAsRead, deleteNotification } from "../controller/notificationController.js";
import userAuth from "../middleware/userMiddleware.js"; // Ensure user is authenticated

const router = express.Router();

router.post("/", userAuth, createNotification);
router.get("/", userAuth, getUserNotifications);
router.put("/:notificationId/read", userAuth, markAsRead);
router.delete("/:notificationId", userAuth, deleteNotification);

export default router;
