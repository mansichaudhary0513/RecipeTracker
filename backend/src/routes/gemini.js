const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Utility: clean Gemini text into JSON string
 */
function extractJson(text) {
  try {
    // Remove Markdown fences if present
    const cleaned = text.replace(/```json|```/gi, "").trim();

    // Find first { and last }
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failed. Raw Gemini output:", text);
    throw new Error("Failed to parse Gemini JSON output");
  }
}

/**
 * POST /api/gemini/recipe
 */
router.post("/recipe", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const recipe = extractJson(text);
    res.json(recipe);
  } catch (err) {
    console.error("Error in /gemini/recipe:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

/**
 * POST /api/gemini/mealplan
 */
router.post("/mealplan", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const mealPlan = extractJson(text);
    res.json(mealPlan);
  } catch (err) {
    console.error("Error in /gemini/mealplan:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
