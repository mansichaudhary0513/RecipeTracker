
import React, { useState, useEffect } from "react";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [recipesData, setRecipesData] = useState({
    recipes: [],
    totalPages: 1,
    currentPage: 1,
  });
  const [search, setSearch] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const [geminiRecipe, setGeminiRecipe] = useState(null);
  const [geminiMealPlan, setGeminiMealPlan] = useState(null);
  const [loadingGemini, setLoadingGemini] = useState(false);

  const [trackedItems, setTrackedItems] = useState([]);
  const [foodItem, setFoodItem] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [loadingCalories, setLoadingCalories] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (activeTab === "profile" && userId) {
      setLoadingProfile(true);
      fetch(`http://localhost:5000/api/recipes/${userId}/profile`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingProfile(false));
    }
  }, [activeTab, userId]);

  const fetchRecipes = (page = 1, query = "") => {
    if (!userId) return;
    setLoadingRecipes(true);
    const encoded = encodeURIComponent(query);
    fetch(
      `http://localhost:5000/api/recipes/${userId}/recipes?page=${page}&limit=4&search=${encoded}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recipes");
        return res.json();
      })
      .then((data) => setRecipesData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingRecipes(false));
  };

  useEffect(() => {
    if (activeTab === "recipes" && userId) {
      fetchRecipes(1, search);
    }
  }, [activeTab, search, userId]);

  const fetchGeminiRecipe = async () => {
    if (!user) return;
    setLoadingGemini(true);
    setGeminiRecipe(null);
    setGeminiMealPlan(null);

    const prompt = `Suggest a healthy recipe for someone with the following profile:
      - Goals: ${user.profile.goals.join(", ")}
      - Dietary Preference: ${user.profile.dietaryPreference}
      - Allergies: ${user.profile.allergies.join(", ")}
      - Cooking Time: ${user.profile.cookingTime}
      - Skill Level: ${user.profile.skillLevel}
      Provide the recipe name, ingredients, and method in JSON format like:
      {
        "name": "...",
        "ingredients": ["...", "..."],
        "method": ["step1", "step2", "..."]
      }`;

    try {
      const response = await fetch("http://localhost:5000/api/gemini/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to fetch Gemini recipe");

      const data = await response.json();
      setGeminiRecipe(data);
    } catch (error) {
      console.error("Failed to generate recipe:", error);
    } finally {
      setLoadingGemini(false);
    }
  };

  const fetchGeminiMealPlan = async () => {
    if (!user) return;
    setLoadingGemini(true);
    setGeminiRecipe(null);
    setGeminiMealPlan(null);

    const prompt = `Generate a full-day meal plan (Breakfast, Lunch, Dinner) based on the user profile:
      - Goals: ${user.profile.goals.join(", ")}
      - Dietary Preference: ${user.profile.dietaryPreference}
      - Daily Calorie Goal: ${dailyCalorieGoal}
      Provide the output in JSON format like:
      {
        "Breakfast": {
          "name": "...",
          "calories": 400,
          "protein": 20,
          "carbs": 50,
          "fats": 15,
          "ingredients": ["...", "..."]
        },
        "Lunch": { ... },
        "Dinner": { ... }
      }`;

    try {
      const response = await fetch(
        "http://localhost:5000/api/gemini/mealplan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch Gemini meal plan");

      const data = await response.json();
      setGeminiMealPlan(data);
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
    } finally {
      setLoadingGemini(false);
    }
  };
  // --- UPDATED fetchNutritionInfo for Nutritionix ---
  const fetchNutritionInfo = async (food) => {
    setLoadingCalories(true);
    try {
      const response = await fetch("http://localhost:5000/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: food }),
      });

      if (!response.ok) throw new Error("Failed to fetch nutrition data");

      const data = await response.json();
      console.log("Nutritionix response:", data);

      if (data.foods && data.foods.length > 0) {
        const foodData = data.foods[0]; // First matched food
        return {
          calories: foodData.nf_calories || 0,
          protein: foodData.nf_protein || 0,
          carbs: foodData.nf_total_carbohydrate || 0,
          fats: foodData.nf_total_fat || 0,
        };
      }

      return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    } catch (error) {
      console.error("Failed to fetch nutrition info:", error);
      return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    } finally {
      setLoadingCalories(false);
    }
  };

  // --- UPDATED handleSelectRecipe ---
  const handleSelectRecipe = async (recipe) => {
    const nutrition = await fetchNutritionInfo(recipe.name);

    setTrackedItems([
      ...trackedItems,
      {
        food: recipe.name,
        meal: selectedMeal,
        ...nutrition,
      },
    ]);
    setActiveTab("calorie-tracker");
  };

  // --- UPDATED handleAddFoodItem ---
  const handleAddFoodItem = async (e) => {
    e.preventDefault();
    if (foodItem) {
      const nutrition = await fetchNutritionInfo(foodItem);
      setTrackedItems((prevItems) => [
        ...prevItems,
        { food: foodItem, meal: selectedMeal, ...nutrition },
      ]);
      setFoodItem("");
    }
  };

  const dailyTotals = trackedItems.reduce(
    (total, item) => ({
      calories: total.calories + (item.calories || 0),
      protein: total.protein + (item.protein || 0),
      carbs: total.carbs + (item.carbs || 0),
      fats: total.fats + (item.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const profileData = user?.profile || {};
  const goalsArray = Array.isArray(profileData.goals) ? profileData.goals : [];
  const allergiesArray = Array.isArray(profileData.allergies)
    ? profileData.allergies
    : [];

  return (
    <div className="dashboard-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="profile-info">
          <i className="fa fa-user-circle profile-icon"></i>
          {user ? <h3>{user.name}</h3> : <h3>Loading...</h3>}
        </div>
        <div className="tabs-menu">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <i className="fa fa-user"></i> Profile
          </button>
          <button
            className={activeTab === "recipes" ? "active" : ""}
            onClick={() => setActiveTab("recipes")}
          >
            <i className="fa fa-cutlery"></i> Recipes
          </button>
          <button
            className={activeTab === "gemini" ? "active" : ""}
            onClick={() => setActiveTab("gemini")}
          >
            <i className="fa fa-magic"></i> Gemini AI
          </button>
          <button
            className={activeTab === "calorie-tracker" ? "active" : ""}
            onClick={() => setActiveTab("calorie-tracker")}
          >
            <i className="fa fa-fire"></i> Calorie Tracker
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="content-section profile-content">
            <h2>Your Profile</h2>
            {loadingProfile ? (
              <p className="loading-message">Loading profile...</p>
            ) : user ? (
              <div className="card-grid">
                <div className="card">
                  <h3>Personal Details</h3>
                  <p>
                    <i className="fa fa-envelope"></i> {user.email}
                  </p>
                </div>
                <div className="card">
                  <h3>Dietary Preferences</h3>
                  <p>
                    <b>Goals:</b>{" "}
                    {goalsArray.length ? goalsArray.join(", ") : "N/A"}
                  </p>
                  <p>
                    <b>Activity Level:</b> {profileData.activityLevel || "N/A"}
                  </p>
                  <p>
                    <b>Dietary Preference:</b>{" "}
                    {profileData.dietaryPreference || "N/A"}
                  </p>
                  <p>
                    <b>Allergies:</b>{" "}
                    {allergiesArray.length ? allergiesArray.join(", ") : "None"}
                  </p>
                </div>
                <div className="card">
                  <h3>Cooking Habits</h3>
                  <p>
                    <b>Cooking Time:</b> {profileData.cookingTime || "N/A"}
                  </p>
                  <p>
                    <b>Skill Level:</b> {profileData.skillLevel || "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="message">No profile found. Please log in.</p>
            )}
          </div>
        )}

        {/* RECIPES TAB */}
        {activeTab === "recipes" && (
          <div className="content-section recipes-content">
            <h2>Your Recipes</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => fetchRecipes(1, search)}>
                <i className="fa fa-search"></i>
              </button>
            </div>
            {loadingRecipes ? (
              <p className="loading-message">Loading recipes...</p>
            ) : recipesData.recipes && recipesData.recipes.length > 0 ? (
              <>
                <div className="card-grid">
                  {recipesData.recipes.map((recipe) => (
                    <div className="card" key={recipe._id || recipe.id}>
                      <h3>{recipe.name}</h3>
                      <p>
                        <b>Ingredients:</b>{" "}
                        {(Array.isArray(recipe.ingredients)
                          ? recipe.ingredients
                          : []
                        ).join(", ")}
                      </p>
                      <p>
                        <b>Method:</b>{" "}
                        {(Array.isArray(recipe.method)
                          ? recipe.method
                          : []
                        ).join(" → ")}
                      </p>
                      <button
                        className="track-button"
                        onClick={() => handleSelectRecipe(recipe)}
                      >
                        Track Meal
                      </button>
                    </div>
                  ))}
                </div>
                {recipesData.totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: recipesData.totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={
                          recipesData.currentPage === i + 1 ? "active" : ""
                        }
                        onClick={() => fetchRecipes(i + 1, search)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="message">No recipes found.</p>
            )}
          </div>
        )}

        {/* GEMINI TAB */}
        {activeTab === "gemini" && (
          <div className="content-section gemini-content">
            <h2>Gemini AI Suggestions</h2>
            <div className="button-group">
              <button onClick={fetchGeminiRecipe} disabled={!user}>
                Suggest a Recipe
              </button>
              <button onClick={fetchGeminiMealPlan} disabled={!user}>
                Generate a Meal Plan
              </button>
            </div>
            {loadingGemini ? (
              <p className="loading-message">
                Generating your {geminiRecipe ? "recipe" : "meal plan"}...
              </p>
            ) : geminiRecipe ? (
              <div className="card">
                <h3>{geminiRecipe.name}</h3>
                <p>
                  <b>Ingredients:</b>{" "}
                  {Array.isArray(geminiRecipe.ingredients)
                    ? geminiRecipe.ingredients.join(", ")
                    : ""}
                </p>
                <p>
                  <b>Method:</b>{" "}
                  {Array.isArray(geminiRecipe.method)
                    ? geminiRecipe.method.join(" → ")
                    : ""}
                </p>
              </div>
            ) : geminiMealPlan ? (
              <div className="card-grid">
                {Object.entries(geminiMealPlan).map(([mealName, details]) => (
                  <div className="card" key={mealName}>
                    <h3>
                      {mealName}: {details.name}
                    </h3>
                    <p>
                      <b>Calories:</b> {details.calories} kcal
                    </p>
                    <p>
                      <b>Macros:</b> P:{details.protein}g, C:{details.carbs}g,
                      F:{details.fats}g
                    </p>
                    <p>
                      <b>Ingredients:</b> {details.ingredients.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="message">
                Click a button above to get a suggestion.
              </p>
            )}
          </div>
        )}

        {/* CALORIE TRACKER TAB */}
        {activeTab === "calorie-tracker" && (
          <div className="content-section calorie-tracker-content">
            <h2>Calorie Tracker</h2>
            <div className="calorie-goal-section">
              <label>
                Daily Calorie Goal:
                <input
                  type="number"
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                />
              </label>
              <div className="calorie-progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      (dailyTotals.calories / dailyCalorieGoal) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <p>
                {dailyTotals.calories} / {dailyCalorieGoal} kcal
              </p>
            </div>
            <form onSubmit={handleAddFoodItem} className="nutrition-form">
              <select
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value)}
              >
                {meals.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Food Item"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
              />
              <button type="submit" disabled={loadingCalories}>
                {loadingCalories ? "Calculating..." : "Add Food"}
              </button>
            </form>
            <div className="macro-summary">
              <h3>Today's Totals</h3>
              <p>Calories: {dailyTotals.calories} kcal</p>
              <p>Protein: {dailyTotals.protein} g</p>
              <p>Carbs: {dailyTotals.carbs} g</p>
              <p>Fats: {dailyTotals.fats} g</p>
            </div>
            {meals.map((meal) => {
              const mealItems = trackedItems.filter(
                (item) => item.meal === meal
              );
              if (mealItems.length === 0) return null;
              return (
                <div key={meal} className="meal-section">
                  <h4>{meal}</h4>
                  <div className="meal-list">
                    {mealItems.map((item, index) => (
                      <div key={index} className="meal-item">
                        <span>{item.food}</span>
                        <div className="item-macros">
                          <span>{item.calories} kcal</span>
                          <span>P:{item.protein}g</span>
                          <span>C:{item.carbs}g</span>
                          <span>F:{item.fats}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
