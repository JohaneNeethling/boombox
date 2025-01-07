// Importing the mongoose library to work with MongoDB
const mongoose = require("mongoose");

// Defining the schema for the 'Favorite' collection in the database
const favoriteSchema = new mongoose.Schema(
  {
    // 'userId' is the reference to the User model. It stores the ID of the user who owns the favorites.
    // 'required: true' ensures that this field must be provided.
    userId: {
      type: mongoose.Schema.Types.ObjectId, // The type is ObjectId, linking it to another collection
      ref: "User", // This specifies the referenced collection (User) in MongoDB
      required: true, // This field is mandatory
    },
    // 'favorites' is an array where each item represents a favorite media (e.g., song, album).
    favorites: [
      {
        title: String, // Title of the favorite media (e.g., song or album)
        artist: String, // Artist of the media
        genre: String, // Genre of the media (e.g., pop, rock)
        releaseDate: String, // Release date of the media in string format
        coverArt: String, // URL or path to the cover art image
        previewUrl: String, // URL to a preview of the media (e.g., a song preview)
        mediaId: String, // Unique identifier for the media
        mediaType: String, // Type of media (e.g., song, album, video)
      },
    ],
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' timestamps to each document
);

// Creating a model for 'Favorite' based on the schema defined above
const Favorite = mongoose.model("Favorite", favoriteSchema);

// Exporting the 'Favorite' model so it can be used in other parts of the application
module.exports = Favorite;
