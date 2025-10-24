import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Clicking logo navigates to home */}
        <Link to="/">NutriApp</Link>
      </div>

      <ul className="navbar-links">
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>

      <div className="navbar-buttons">
        {/* Log In button navigates to /login */}
        <Link to="/login" className="btn btn-secondary">
          Log In
        </Link>

        {/* Sign Up button navigates to /signup */}
        <Link to="/signup" className="btn btn-primary">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
