import React, { useState } from "react";
import "./GeminiFeature.css";

// New component to parse and display the recipe beautifully
const RecipeCard = ({ recipeText }) => {
  // Split the text into lines
  const lines = recipeText.split("\n");
  const recipeTitle = lines[0].replace("###", "").trim();

  // Find where ingredients and instructions start
  const ingredientsIndex = lines.findIndex((line) =>
    line.toLowerCase().includes("ingredients")
  );
  const instructionsIndex = lines.findIndex((line) =>
    line.toLowerCase().includes("instructions")
  );

  // Extract the different parts of the recipe
  const description = lines.slice(1, ingredientsIndex).join("\n").trim();
  const ingredients = lines
    .slice(ingredientsIndex + 1, instructionsIndex)
    .map((line) => line.replace("*", "").trim())
    .filter((line) => line); // Remove empty lines
  const instructions = lines
    .slice(instructionsIndex + 1)
    .map((line) => line.replace("*", "").trim())
    .filter((line) => line); // Remove empty lines

  return (
    <div className="recipe-card">
      <h2>{recipeTitle}</h2>
      <p className="recipe-description">{description}</p>

      <div className="recipe-columns">
        <div className="recipe-ingredients">
          <h3>Ingredients</h3>
          <ul>
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="recipe-instructions">
          <h3>Instructions</h3>
          <ol>
            {instructions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const GeminiFeature = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRecipe = async () => {
    if (!ingredients) {
      setError("Please enter some ingredients.");
      return;
    }
    setLoading(true);
    setError("");
    setRecipe("");

    const apiKey = "AIzaSyBWge1mnvmQJU5hphhpxfsjN-9EeFKACTI";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const systemPrompt =
      "You are a helpful chef. Your goal is to create a simple and delicious recipe based on the ingredients provided. Start with a title prefixed with '###'. Then, provide a short, one-sentence description. Follow this with a section titled '**Ingredients:**' and a bulleted list of ingredients (using '*'). Finally, add a section titled '**Instructions:**' with a numbered or bulleted list of steps (using '*').";
    const userQuery = `Ingredients: ${ingredients}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    const fetchWithBackoff = async (retries = 3, delay = 1000) => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      } catch (e) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithBackoff(retries - 1, delay * 2);
        } else {
          throw e;
        }
      }
    };

    try {
      const result = await fetchWithBackoff();
      const candidate = result.candidates?.[0];
      if (candidate && candidate.content?.parts?.[0]?.text) {
        setRecipe(candidate.content.parts[0].text);
      } else {
        setError("Sorry, I couldn't generate a recipe. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError(
        "Failed to generate recipe. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="gemini-feature">
      <h2>✨ Get Instant Recipe Ideas</h2>
      <p>
        Have some ingredients but not sure what to make? Enter them below and
        let our AI chef whip up a recipe for you!
      </p>
      <div className="input-area">
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="e.g., chicken, rice, broccoli"
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={generateRecipe}
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Recipe"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <div className="loading-spinner"></div>}
      {recipe && <RecipeCard recipeText={recipe} />}
    </section>
  );
};

export default GeminiFeature;
