// import "./Features.css";

// const Features = () => {
//   return (
//     <section id="features" className="features">
//       <h2>Why You'll Love NutriApp</h2>
//       <div className="features-container">
//         <div className="feature-card">
//           <div className="feature-icon">{/* Placeholder for an icon */}</div>
//           <h3>Personalized Recipes</h3>
//           <p>
//             Get recipe recommendations based on your dietary preferences and
//             goals.
//           </p>
//         </div>
//         <div className="feature-card">
//           <div className="feature-icon">{/* Placeholder for an icon */}</div>
//           <h3>Nutrition Tracking</h3>
//           <p>
//             Easily log your meals and monitor your daily intake of calories,
//             macros, and nutrients.
//           </p>
//         </div>
//         <div className="feature-card">
//           <div className="feature-icon">{/* Placeholder for an icon */}</div>
//           <h3>Meal Planning</h3>
//           <p>
//             Plan your meals for the week ahead and generate a shopping list
//             automatically.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default Features;
import React from "react";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import "./Features.css";

const Features = () => {
  return (
    <section className="features">
      <h2>Why You'll Love NutriApp</h2>
      <div className="features-container">
        <div
          className="feature-card"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${image1})`,
          }}
        >
          <h3>Personalized Recipes</h3>
          <p>Get meal ideas tailored just for you.</p>
        </div>

        <div
          className="feature-card"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${image2})`,
          }}
        >
          <h3>Nutrition Tracking</h3>
          <p>Track your nutrition and stay healthy.</p>
        </div>

        <div
          className="feature-card"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${image3})`,
          }}
        >
          <h3>Meal Planning</h3>
          <p>Plan your meals with ease and save time.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;

