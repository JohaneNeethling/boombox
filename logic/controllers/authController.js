// Import necessary libraries
const bcrypt = require("bcryptjs"); // Library to hash and compare passwords
const jwt = require("jsonwebtoken"); // Library to generate and verify JSON Web Tokens
const User = require("../models/User"); // Import the User model to interact with the database

// Controller for user registration
exports.register = async (req, res) => {
  try {
    // Check if the username already exists before creating the user
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Create a new user instance from the request body
    const user = new User(req.body);

    // Save the user to the database
    await user.save();

    // Send a success response when the user is registered
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle specific errors
    if (error.name === "ValidationError") {
      // If the validation of the data fails, send a 400 Bad Request response
      res.status(400).json({ message: "Invalid data provided" });
    } else {
      // For any other errors, send a generic 500 Server Error response
      res
        .status(500)
        .json({ message: "Registration failed due to server error" });
    }
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // Extract username and password from the request body

    // Find the user by their username
    const user = await User.findOne({ username });

    // If the user is not found, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the passwords don't match, return a 400 Bad Request response
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create a JWT token with the user's ID and an expiration time of 1 hour
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token back to the user as a JSON response
    res.json({ token });
  } catch (error) {
    // If any error occurs, return a 500 Server Error response
    res.status(500).json({ error: "Login failed due to server error" });
  }
};

// Controller for user logout (though usually handled on the frontend, this is a basic example)
exports.logout = async (req, res) => {
  try {
    // Respond with a success message for logout
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // If an error occurs during logout, return a 500 Server Error response
    res.status(500).json({ error: "Logout failed due to server error" });
  }
};
