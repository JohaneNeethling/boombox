// Importing required modules
const express = require("express"); // Import the express module to create the router
const { register, login, logout } = require("../controllers/authController"); // Destructure the authentication controller functions (register, login, logout)
const router = express.Router(); // Create a new router object from express.Router()

// Route to handle user registration
router.post("/register", register); // When a POST request is made to /register, the 'register' function from authController will be called

// Route to handle user login
router.post("/login", login); // When a POST request is made to /login, the 'login' function from authController will be called

// Route to handle user logout
router.post("/logout", logout); // When a POST request is made to /logout, the 'logout' function from authController will be called

// Export the router so it can be used in other parts of the application
module.exports = router;
