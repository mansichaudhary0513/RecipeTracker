// const mongoose = require("mongoose");

// const profileSchema = new mongoose.Schema(
//   {
//     goals: { type: [String], default: [] },
//     activityLevel: { type: String, default: "" },
//     dietaryPreference: { type: String, default: "" },
//     allergies: { type: [String], default: [] },
//     cookingTime: { type: String, default: "" },
//     skillLevel: { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     profiles: [profileSchema],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    goals: { type: [String], default: [] },
    activityLevel: { type: String, default: "" },
    dietaryPreference: { type: String, default: "" },
    allergies: { type: [String], default: [] },
    cookingTime: { type: String, default: "" },
    skillLevel: { type: String, default: "" },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    method: { type: [String], default: [] },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profiles: [profileSchema],

    // ✅ New field to store suggested recipes
    recipes: [recipeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
