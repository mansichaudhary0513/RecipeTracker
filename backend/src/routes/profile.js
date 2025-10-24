const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Save new profile
router.post("/save", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "❌ userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    // 👉 Push new profile into array
    user.profiles.push(profileData);
    await user.save();

    res.json({
      message: "✅ Profile saved successfully",
      profiles: user.profiles,
    });
  } catch (err) {
    console.error("❌ Error saving profile:", err.message);
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

module.exports = router;
