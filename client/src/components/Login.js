import React, { useState } from "react"; // Import React and the useState hook for state management
import { loginUser } from "../api"; // Import the loginUser function to handle API calls
import { useNavigate, Link } from "react-router-dom"; // Import navigation and linking tools from React Router
import Modal from "./Modal"; // Import the Modal component for error handling
import "./Login.css"; // Import styles for the Login component

// Login component that handles user authentication
const Login = ({ setToken }) => {
  // State variables for username, password, error messages, and modal visibility
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigating programmatically

  // Function to handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true); // Show the spinner while the login request is being processed

    try {
      // Attempt to log the user in with the provided username and password
      const response = await loginUser({ username, password });
      const token = response.data.token; // Extract the token from the API response
      setToken(token); // Set the token in the parent component
      localStorage.setItem("token", token); // Store the token in local storage for persistence
      navigate("/search"); // Navigate to the search page after successful login
    } catch (err) {
      // Handle login errors
      if (err.response && err.response.data) {
        setError(err.response.data.error || "An error occurred"); // Display the error from the backend
      } else {
        setError("An unexpected error occurred"); // Handle cases where no error message is received
      }
      setShowModal(true); // Show the modal with the error message
    } finally {
      setIsLoading(false); // Hide the spinner after the API call finishes
    }
  };

  // Function to navigate back to the previous page
  const backFunc = async () => {
    navigate("/"); // Navigate to the home page
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false); // Hide the modal
  };

  // Render the login form and related components
  return (
    <div className="the-login-container">
      <div className="the-form-container">
        <h2 className="login-header">Login</h2>
        {/* Form for user login */}
        <form onSubmit={handleLogin} className="form-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            className="input-text"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            className="input-text"
          />

          <button type="submit" className="login-button">
            Login
          </button>
          {/* Link to the registration page */}
          <p className="no-acc-tag">
            Don't have an account?{" "}
            <Link to="/register" className="register-link-button">
              Register here.
            </Link>
          </p>
        </form>
        {/* Button to navigate back */}
        <button onClick={backFunc} className="back-button">
          Back
        </button>
      </div>
      {/* Modal for displaying error messages */}
      {showModal && <Modal message={error} onClose={closeModal} />}{" "}
    </div>
  );
};

export default Login; // Export the Login component for use in other parts of the app
