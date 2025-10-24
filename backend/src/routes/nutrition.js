// const express = require("express");
// const router = express.Router();
// require("dotenv").config();

// const EDAMAM_API_ID = process.env.EDAMAM_API_ID;
// const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;

// router.get("/", async (req, res) => {
//   const { query } = req.query;
//   if (!query) {
//     return res.status(400).json({ error: "Food item query is required" });
//   }

//   try {

//     const url = `https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_API_ID}&app_key=${EDAMAM_API_KEY}&ingr=${encodeURIComponent(
//       query
//     )}`;

//     const response = await fetch(url);

//     if (!response.ok) {
//       console.error("Edamam API response not ok:", response.statusText);
//       return res
//         .status(response.status)
//         .json({ error: "Failed to fetch data from Edamam API" });
//     }

//     const data = await response.json();

//     const calories = data.calories || 0;
//     const protein = data.totalNutrients?.PROCNT?.quantity || 0;
//     const carbs = data.totalNutrients?.CHOCDF?.quantity || 0;
//     const fats = data.totalNutrients?.FAT?.quantity || 0;

//     res.json({ calories, protein, carbs, fats });
//   } catch (error) {
//     console.error("Server error fetching nutrition data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
require("dotenv").config();

const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;

router.post("/", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Food query is required" });

  console.log("App ID:", NUTRITIONIX_APP_ID);
  console.log("App Key:", NUTRITIONIX_APP_KEY);

  try {
    const response = await fetch(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": NUTRITIONIX_APP_ID,
          "x-app-key": NUTRITIONIX_APP_KEY,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
