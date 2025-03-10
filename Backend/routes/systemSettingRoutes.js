import express from "express";
import { createSettings, getSettings, updateSettings } from "../controller/systemSettingController.js";
import adminAuth from "../middleware/authMiddleware.js"; // Ensure only admins modify settings
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure authenticated users can view settings

const router = express.Router();

router.post("/configure", adminAuth, createSettings);
router.put("/configure/:userId", adminAuth, updateSettings);
router.get("/:userId", authMiddleware, getSettings);

export default router;
