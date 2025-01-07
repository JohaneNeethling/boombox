import React, { useState } from "react"; // Importing React and useState hook
import { registerUser } from "../api"; // Importing the registerUser function from the api module
import { useNavigate, Link } from "react-router-dom"; // Importing navigation hooks from react-router-dom
import Modal from "../components/Modal"; // Importing Modal component to show error messages
import "./Register.css"; // Importing the associated CSS file for styling
import Sing from "../media/Sing.gif"; // Importing a gif image to display on the registration page

const Register = () => {
  // State variables for storing input values and error messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state for registration failure
  const navigate = useNavigate(); // Hook to handle navigation programmatically

  // Function to handle form submission and user registration
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      // Calls the registerUser function, passing the username and password from state
      await registerUser({ username, password });
      navigate("/login"); // If registration is successful, redirects to the login page
    } catch (err) {
      // Check if the error has a message and set it accordingly
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Show the specific error message
      } else {
        setError("Registration failed. Please try again."); // Generic error message if no specific message is returned
      }
    }
  };

  // Function to close the error modal when the user clicks to close
  const handleCloseModal = () => {
    setError(""); // Clears the error message
  };

  return (
    <div className="the-login-container">
      {/* Main container for the registration page */}
      <div className="reg-form-container">
        {/* Form container for user registration */}
        <h2 className="register-header">Register</h2>
        <form onSubmit={handleRegister} className="form-container">
          {/* Username input field */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Updates the username state on input change
            className="reg-input-text"
          />
          {/* Password input field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Updates the password state on input change
            className="reg-input-text"
          />
          {/* Submit button for form */}
          <button type="submit" className="register-button">
            Register
          </button>
          {/* Link to redirect users to the login page if they already have an account */}
          <p className="have-acc-tag">
            Already have an account?{" "}
            <Link to="/login" className="login-link-button">
              Login here.
            </Link>
          </p>
        </form>
      </div>
      {/* Conditionally rendering the Modal component if there's an error */}
      {error && <Modal message={error} onClose={handleCloseModal} />}
    </div>
  );
};

export default Register; // Exporting the Register component for use in other parts of the app
