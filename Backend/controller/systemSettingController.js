import SystemSetting from "../models/systemSettingModel.js";

// 📌 Create System Settings
export const createSettings = async (req, res) => {
  try {
    const { userId, maxExpenseLimit, allowedCategories, currency } = req.body;

    // Check if settings already exist for the user
    const existingSettings = await SystemSetting.findOne({ userId });
    if (existingSettings) {
      return res.status(400).json({ message: "Settings already exist for this user." });
    }

    // Create new settings
    const newSettings = new SystemSetting({
      userId,
      maxExpenseLimit: maxExpenseLimit || 1000, // Default 1000 if not provided
      allowedCategories: allowedCategories || ["Food", "Transport", "Entertainment", "Shopping"],
      currency: currency || "USD",
    });

    await newSettings.save();
    res.status(201).json({ message: "System settings created successfully", settings: newSettings });
  } catch (error) {
    res.status(500).json({ message: "Error creating settings", error });
  }
};

// 📌 Get current system settings (for a user)
export const getSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await SystemSetting.findOne({ userId });

    if (!settings) {
      return res.status(404).json({ message: "No system settings found for this user." });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
};

// 📌 Update System Settings (for a user)
export const updateSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { maxExpenseLimit, allowedCategories, currency } = req.body;

    const settings = await SystemSetting.findOneAndUpdate(
      { userId },
      { maxExpenseLimit, allowedCategories, currency, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
};
