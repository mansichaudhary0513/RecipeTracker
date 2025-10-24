import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileForm.css";

const Icon = ({ name }) => {
  let iconContent = "";
  switch (name) {
    case "Gluten":
      iconContent = "🌾";
      break;
    case "Dairy":
      iconContent = "🥛";
      break;
    case "Peanut":
      iconContent = "🥜";
      break;
    case "Nuts":
      iconContent = "🌰";
      break;
    default:
      iconContent = "✨";
  }
  return <div className="icon-placeholder">{iconContent}</div>;
};

const ProfileForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    goals: [],
    activityLevel: "Moderately Active",
    dietaryPreference: "",
    allergies: [],
    cookingTime: "",
    skillLevel: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleMultiSelect = (field, value) => {
    const currentValues = formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setFormData({ ...formData, [field]: newValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 👉 replace with actual logged-in userId nice i
      const userId = localStorage.getItem("userId") || "PUT_A_VALID_USER_ID";

      const response = await fetch("http://localhost:5000/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...formData }),
      });

      console.log(response);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("✅ Profile saved successfully!");
      console.log("Saved Profile:", data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("❌ Failed to save profile: " + err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3>Health & Fitness Goals</h3>
            <div className="button-group">
              {[
                "Lose Weight",
                "Gain Muscle",
                "Maintain Weight",
                "Eat Healthier",
              ].map((goal) => (
                <button
                  type="button"
                  key={goal}
                  className={formData.goals.includes(goal) ? "selected" : ""}
                  onClick={() => handleMultiSelect("goals", goal)}
                >
                  {goal}
                </button>
              ))}
            </div>

            <h3>Activity Level</h3>
            <div className="button-group activity-level">
              {[
                "Sedentary",
                "Lightly Active",
                "Moderately Active",
                "Very Active",
              ].map((level) => (
                <button
                  type="button"
                  key={level}
                  name="activityLevel"
                  className={formData.activityLevel === level ? "selected" : ""}
                  onClick={() =>
                    setFormData({ ...formData, activityLevel: level })
                  }
                >
                  {level}
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3>Dietary Preferences</h3>
            <div className="button-group">
              {["Vegan", "Vegetarian", "Keto", "Paleo", "None"].map((diet) => (
                <button
                  type="button"
                  key={diet}
                  className={
                    formData.dietaryPreference === diet ? "selected" : ""
                  }
                  onClick={() =>
                    setFormData({ ...formData, dietaryPreference: diet })
                  }
                >
                  {diet}
                </button>
              ))}
            </div>

            <h3>Allergies</h3>
            <div className="icon-group">
              {["Gluten", "Dairy", "Peanut", "Nuts"].map((allergy) => (
                <div
                  key={allergy}
                  className={`icon-item ${
                    formData.allergies.includes(allergy) ? "selected" : ""
                  }`}
                  onClick={() => handleMultiSelect("allergies", allergy)}
                >
                  <Icon name={allergy} />
                  <span>{allergy}</span>
                </div>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3>Cooking Habits</h3>
            <div className="side-by-side">
              <div>
                <h4>🕒 Cooking Time</h4>
                <div className="button-group vertical">
                  {["Under 30 min", "30-60 min", "Over 60 min"].map((time) => (
                    <button
                      type="button"
                      key={time}
                      className={
                        formData.cookingTime === time ? "selected" : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, cookingTime: time })
                      }
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4>🧑‍🍳 Skill Level</h4>
                <div className="button-group vertical">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      type="button"
                      key={level}
                      className={
                        formData.skillLevel === level ? "selected" : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, skillLevel: level })
                      }
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="progress-header">
          {step > 1 && (
            <span className="back-arrow" onClick={prevStep}>
              ←
            </span>
          )}
          <h4>Step {step} of 3</h4>
          <h2>Create Your Profile</h2>
        </div>

        <div className="form-content">{renderStep()}</div>

        <div className="navigation-buttons">
          {step < 3 && (
            <button type="button" className="nav-button" onClick={nextStep}>
              Continue
            </button>
          )}
          {step === 3 && (
            <button type="submit" className="nav-button">
              Save Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
