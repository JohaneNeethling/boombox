// Importing the necessary modules
const express = require("express"); // Importing Express.js for routing
const {
  addFavorite, // Importing the function to add a favorite
  getFavorites, // Importing the function to get all favorites
  removeFavorite, // Importing the function to remove a favorite
} = require("../controllers/favoriteController"); // Importing functions from favoriteController
const authMiddleware = require("../middleware/authMiddleware"); // Importing authentication middleware
const router = express.Router(); // Creating an instance of an Express router

// Route to add a new favorite
router.post("/", authMiddleware, addFavorite);
// This route expects a POST request at "/" to add a favorite.
// It uses authMiddleware to ensure the user is authenticated before calling addFavorite.

// Route to get all favorites
router.get("/", authMiddleware, getFavorites);
// This route expects a GET request at "/" to retrieve all favorites.
// It also uses authMiddleware to ensure the user is authenticated before calling getFavorites.

// Route to remove a favorite by mediaId
router.delete("/:mediaId", authMiddleware, removeFavorite);
// This route expects a DELETE request at "/:mediaId" where ":mediaId" is a parameter representing the ID of the media to be removed.
// It uses authMiddleware to ensure the user is authenticated before calling removeFavorite.

// Exporting the router so it can be used in other parts of the application
module.exports = router;
