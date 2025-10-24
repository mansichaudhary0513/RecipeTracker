const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const geminiRoutes = require("./routes/gemini");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Check Nutritionix API Keys ---
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;

if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_APP_KEY) {
  console.error(
    "Error: NUTRITIONIX_APP_ID or NUTRITIONIX_APP_KEY is not defined in the .env file."
  );
}

// --- Import Route Modules ---
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const recipeRoutes = require("./routes/recipes");
const nutritionRoutes = require("./routes/nutrition");

// --- Mount Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/gemini", geminiRoutes);
// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// --- Handle uncaught exceptions ---
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
