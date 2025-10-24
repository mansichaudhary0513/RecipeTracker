import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Your Culinary Journey,
          <span> Tracked</span> &amp;
          <span> Tasted</span>
        </h1>
        <p>
          Discover personalized recipes, track your nutrition goals, and
          transform your relationship with food through intelligent meal
          planning and insights.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Start Your Free Trial →</button>
          <button className="btn btn-secondary">Watch Demo</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
