// Import the Express library to use its routing functionality
const express = require("express");

// Import the 'searchMedia' function from the mediaController to handle the search functionality
const { searchMedia } = require("../controllers/mediaController");

// Create a new instance of the Express router to define routes
const router = express.Router();

// Define the route for handling GET requests to '/search'.
// When a GET request is made to '/search', the 'searchMedia' function will be called.
router.get("/search", searchMedia);

// Export the router so it can be used in other parts of the application
module.exports = router;
