import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import necessary components from react-router-dom
import Navbar from "./components/Navbar"; // Import Navbar component
import Intro from "./pages/Intro"; // Import Intro page component
import FavoritesPage from "./pages/FavoritesPage"; // Import Favorites page component
import LoginPage from "./pages/LoginPage"; // Import Login page component
import RegisterPage from "./pages/RegisterPage"; // Import Register page component
import SearchPage from "./pages/SearchPage"; // Import Search page component
import Footer from "./components/Footer"; // Import Footer component

const App = () => {
  // State to hold the authentication token, initially fetched from localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    // Wrap the application in a Router to enable routing between different pages
    <Router>
      <Routes>
        {/* Route for the home page (Intro page) */}
        <Route path="/" element={<Intro />} />

        {/* Route for the Favorites page, includes Navbar and Footer */}
        <Route
          path="/favoritespage"
          element={
            <>
              <Navbar /> {/* Navbar displayed at the top */}
              <FavoritesPage /> {/* Main content for the Favorites page */}
              <Footer /> {/* Footer displayed at the bottom */}
            </>
          }
        />

        {/* Route for the Login page, passes setToken function to LoginPage */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />

        {/* Route for the Register page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Route for the Search page, passes the token as a prop */}
        <Route
          path="/search"
          element={
            <>
              <Navbar /> {/* Navbar displayed at the top */}
              <SearchPage token={token} />{" "}
              {/* Main content for the Search page, token passed as prop */}
              <Footer /> {/* Footer displayed at the bottom */}
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; // Export the App component for use in other parts of the application

//Sources: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html#//apple_ref/doc/uid/TP40017632-CH3-SW1
//https://www.markdownguide.org/cheat-sheet/
