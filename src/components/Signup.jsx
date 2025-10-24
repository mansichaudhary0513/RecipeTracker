import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("green");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageColor("green");
        setMessage(data.message); // "User created successfully"
        setFormData({ name: "", email: "", password: "" });
      } else {
        setMessageColor("red");
        setMessage(data.message); // "User already exists" or other errors
      }
    } catch (err) {
      setMessageColor("red");
      setMessage("Server error. Please try again.");
      console.error("Error connecting to server:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8e063, #56ab2f)",
        padding: "2rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2.5rem 3rem",
          borderRadius: "20px",
          width: "350px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.8rem",
            backgroundColor: "#56ab2f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Sign Up
        </button>

        {message && (
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontWeight: "bold",
              color: messageColor,
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
