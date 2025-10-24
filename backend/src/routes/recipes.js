const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This route handles adding a new recipe created by the user
router.post("/", async (req, res) => {
  try {
    const { userId, name, ingredients, instructions, notes } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newRecipe = {
      name,
      ingredients,
      instructions,
      notes,
      createdAt: new Date(),
    };

    user.recipes.push(newRecipe);
    await user.save();

    res.status(201).json({
      message: "✅ Recipe saved successfully",
      recipe: newRecipe,
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

// This route suggests new recipes based on the user's profile and saves them
router.get("/suggest/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || !user.profiles.length) {
      return res.status(404).json({ message: "❌ No profile found for user" });
    }

    const latestProfile = user.profiles[user.profiles.length - 1];

    const prompt = `
    The user has the following dietary profile:
    Goals: ${latestProfile.goals.join(", ")}
    Activity Level: ${latestProfile.activityLevel}
    Dietary Preference: ${latestProfile.dietaryPreference}
    Allergies: ${latestProfile.allergies.join(", ")}
    Cooking Time: ${latestProfile.cookingTime}
    Skill Level: ${latestProfile.skillLevel}

    Suggest exactly 3 healthy recipes based on this profile.
    ❌ Do NOT return JSON.
    ✅ Instead, return in the following plain text format:

    Recipe 1:
    Name: ...
    Ingredients:
    - item1
    - item2
    Method:
    - step1
    - step2

    Recipe 2:
    Name: ...
    Ingredients:
    - item1
    - item2
    Method:
    - step1
    - step2

    Recipe 3:
    Name: ...
    Ingredients:
    - item1
    - item2
    Method:
    - step1
    - step2
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    const recipes = [];
    const recipeBlocks = textResponse
      .split(/Recipe\s+\d+:/i)
      .filter((r) => r.trim());

    recipeBlocks.forEach((block) => {
      const nameMatch = block.match(/Name:\s*(.*)/i);
      const ingredientsMatch = block.match(
        /Ingredients:\s*([\s\S]*?)(?=Method:|$)/i
      );
      const methodMatch = block.match(/Method:\s*([\s\S]*)/i);

      const name = nameMatch ? nameMatch[1].trim() : "Unnamed Recipe";

      const ingredients = ingredientsMatch
        ? ingredientsMatch[1]
            .split("\n")
            .map((i) => i.replace(/^-/, "").trim())
            .filter((i) => i)
        : [];

      const method = methodMatch
        ? methodMatch[1]
            .split("\n")
            .map((m) => m.replace(/^-/, "").trim())
            .filter((m) => m)
        : [];

      recipes.push({ name, ingredients, method, isSuggested: true });
    });

    if (!recipes.length) {
      return res
        .status(500)
        .json({ message: "❌ Could not parse recipes from Gemini output" });
    }

    user.recipes.push(...recipes);
    await user.save();

    res.json({
      message: "✅ Recipes fetched, parsed & saved successfully",
      recipes,
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

// This route gets the user's profile information
router.get("/:id/profile", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name email profiles");
    if (!user) return res.status(404).json({ message: "User not found" });

    const latestProfile =
      Array.isArray(user.profiles) && user.profiles.length
        ? user.profiles[user.profiles.length - 1]
        : null;

    return res.json({
      name: user.name,
      email: user.email,
      profile: latestProfile,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// This route gets the user's recipes with pagination and search functionality
router.get("/:id/recipes", async (req, res) => {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "4", 10));
    const search = req.query.search ? String(req.query.search).trim() : "";

    const user = await User.findById(id).select("recipes");
    if (!user) return res.status(404).json({ message: "User not found" });

    const allRecipes = Array.isArray(user.recipes) ? user.recipes : [];

    const filtered = search
      ? allRecipes.filter((r) =>
          (r.name || "").toLowerCase().includes(search.toLowerCase())
        )
      : allRecipes;

    const sorted = filtered.slice().sort((a, b) => {
      if (a.createdAt && b.createdAt) return b.createdAt - a.createdAt;
      return 0;
    });

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return res.json({
      recipes: paginated,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
