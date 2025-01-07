// Importing the Favorite model to interact with the database
const Favorite = require("../models/Favorite");

// Controller to add a new media item to the user's favorites
exports.addFavorite = async (req, res) => {
  const {
    title,
    artist,
    genre,
    releaseDate,
    coverArt,
    previewUrl,
    mediaId,
    mediaType,
  } = req.body;

  try {
    // Ensure the user is authorized
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Check if all required fields are provided
    if (!title || !artist || !mediaId || !mediaType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if media is already in the user's favorites using a single query
    const alreadyInFavorites = await Favorite.findOne({
      userId: req.user.id,
      "favorites.mediaId": mediaId,
    });

    if (alreadyInFavorites) {
      return res
        .status(400)
        .json({ message: "This media is already in your favorites." });
    }

    // Find or create the user's favorites
    let userFavorites = await Favorite.findOne({ userId: req.user.id });

    if (!userFavorites) {
      userFavorites = new Favorite({
        userId: req.user.id,
        favorites: [],
      });
    }

    // Add the new media item to the favorites list
    userFavorites.favorites.push({
      title,
      artist,
      genre,
      releaseDate,
      coverArt,
      previewUrl,
      mediaId,
      mediaType,
    });

    // Save the updated favorites list to the database
    await userFavorites.save();

    // Respond with the updated list of favorites
    res.status(200).json(userFavorites.favorites);
  } catch (error) {
    console.error("Error in addFavorite:", error);
    res
      .status(500)
      .json({ message: "Error adding to favorites", error: error.message });
  }
};

// Controller to retrieve the user's list of favorites
exports.getFavorites = async (req, res) => {
  try {
    // Find the user's favorites list
    const userFavorites = await Favorite.findOne({ userId: req.user.id });

    // If no favorites are found for the user, return a 404 error
    if (!userFavorites) {
      return res
        .status(404)
        .json({ message: "No favorites found for this user" });
    }

    // Return the list of favorites
    res.status(200).json(userFavorites.favorites);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in getFavorites:", error);
    res
      .status(500)
      .json({ message: "Error fetching favorites", error: error.message });
  }
};

// Controller to remove a media item from the user's favorites
exports.removeFavorite = async (req, res) => {
  // Get the mediaId from the request parameters
  const { mediaId } = req.params;

  try {
    // If mediaId is not provided, return an error
    if (!mediaId) {
      return res.status(400).json({ message: "Missing mediaId parameter" });
    }

    // Find the user's favorite list
    const userFavorites = await Favorite.findOne({ userId: req.user.id });

    // If no favorites are found, return an error
    if (!userFavorites || !userFavorites.favorites.length) {
      return res
        .status(404)
        .json({ message: "No favorites found for this user" });
    }

    // Store the original number of favorites before modifying
    const originalLength = userFavorites.favorites.length;

    // Filter out the favorite item with the specified mediaId
    userFavorites.favorites = userFavorites.favorites.filter(
      (item) => item.mediaId !== mediaId
    );

    // If no item was removed, return an error indicating it wasn't found
    if (userFavorites.favorites.length === originalLength) {
      return res.status(404).json({ message: "Favorite item not found" });
    }

    // Save the updated favorites list to the database
    await userFavorites.save();

    // Return the updated list of favorites
    res.status(200).json(userFavorites.favorites);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in removeFavorite:", error);
    res
      .status(500)
      .json({ message: "Error removing from favorites", error: error.message });
  }
};
