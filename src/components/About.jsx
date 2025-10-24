// src/components/AboutUs.jsx
import React from "react";
import aboutImage from "../assets/about-us.jpg";
import "./About.css"; // optional CSS for styling

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Text Column */}
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            Welcome to <strong>NutriApp</strong> — your personal nutrition and
            meal planning assistant. Our mission is to help you stay healthy
            with personalized recipes, meal tracking, and planning tools.
          </p>
          <p>
            NutriApp is designed to make healthy living simple and enjoyable.
            Whether you want to track your daily nutrition, plan your weekly
            meals, or get personalized recipe suggestions, NutriApp has you
            covered.
          </p>
          <p>
            We believe that good nutrition is the foundation of a happy and
            productive life. Join thousands of users who are already
            transforming their eating habits with NutriApp.
          </p>
        </div>

        {/* Image Column */}
        <div className="about-image">
          <img src={aboutImage} alt="Healthy Eating" />
        </div>
      </div>
    </section>
  );
};

export default About;
