// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";

// // Components
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Features from "./components/Features";
// import GeminiFeature from "./components/GeminiFeature";
// import Footer from "./components/Footer";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import ProfileForm from "./components/ProfileForm";
// import SuggestRecipe from "./components/RecipeSuggestions";
// import RecipeSuggestions from "./components/RecipeSuggestions";
// import UserDashboard from "./components/UserDashboard";

// // Landing page (home)
// const LandingPage = () => (
//   <>
//     <Hero />
//     <Features />
//     <GeminiFeature />
//     <Footer />
//   </>
// );

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/profile" element={<ProfileForm />} />
//           <Route path="/recipes" element={<RecipeSuggestions />} />
//           <Route path="/suggest" element={<RecipeSuggestions />} />
//           <Route path="/dashboard" element={<UserDashboard />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import GeminiFeature from "./components/GeminiFeature";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProfileForm from "./components/ProfileForm";
import SuggestRecipe from "./components/RecipeSuggestions";
import RecipeSuggestions from "./components/RecipeSuggestions";
import UserDashboard from "./components/UserDashboard";
import About from "./components/About";

// Landing page (home)
const LandingPage = () => (
  <>
    <Hero />

    {/* Features Section */}
    <section id="features">
      <Features />
    </section>
    <GeminiFeature />
    <About />
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/recipes" element={<RecipeSuggestions />} />
          <Route path="/suggest" element={<RecipeSuggestions />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
