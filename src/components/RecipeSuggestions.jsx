import React, { useEffect, useState } from "react";
import "./RecipeSuggestions.css";

const RecipeSuggestions = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const userId = localStorage.getItem("userId") || "PUT_A_VALID_USER_ID";
        const res = await fetch(
          `http://localhost:5000/api/recipes/suggest/${userId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch recipes");

        setRecipes(data.recipes);
      } catch (err) {
        console.error("❌ Error fetching recipes:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p className="loading">Loading recipes...</p>;

  return (
    <div className="recipes-container">
      <h2 className="recipes-title">🍲 Suggested Recipes for You</h2>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div className="recipe-card" key={index}>
            <h3>{recipe.name}</h3>
            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
            <h4>Method:</h4>
            <ol>
              {recipe.method.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSuggestions;
