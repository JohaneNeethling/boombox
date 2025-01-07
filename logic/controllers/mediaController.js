// Importing the axios library for making HTTP requests
const axios = require("axios");

// The main function to handle media search requests
exports.searchMedia = async (req, res) => {
  // Destructuring the query parameters from the request
  const { term, mediaType, page = 1 } = req.query;

  // Defining valid media types that can be searched
  const validMediaTypes = [
    "music",
    "movie",
    "podcast",
    "audiobook",
    "shortFilm",
    "tvShow",
    "software",
    "ebook",
    "all",
  ];

  // Check if the provided mediaType is valid, if not return a 400 error
  if (!validMediaTypes.includes(mediaType)) {
    return res.status(400).json({ message: "Invalid media type." });
  }

  // Set pagination limit (10 results per page)
  const limit = 10;
  const offset = (page - 1) * limit; // Offset for pagination
  const encodedTerm = encodeURIComponent(term); // Encoding the search term to prevent errors in URLs

  // Helper function to validate response data from the API
  const validateResponseData = (data) => {
    return (
      data && // Check if data exists
      Array.isArray(data.results) && // Check if results is an array
      typeof data.resultCount === "number" // Check if resultCount is a number
    );
  };

  // If mediaType is 'all', perform searches for all media types
  if (mediaType === "all") {
    // Generate requests for all media types except 'all'
    const requests = validMediaTypes
      .filter((type) => type !== "all")
      .map((type) =>
        axios.get(
          `https://itunes.apple.com/search?term=${encodedTerm}&limit=${limit}&offset=${offset}&media=${type}`
        )
      );

    try {
      // Wait for all the requests to resolve
      const responses = await Promise.all(requests);

      // Combine and filter the results from all responses
      const allResults = responses
        .filter((response) => validateResponseData(response.data)) // Only include valid responses
        .flatMap((response) => response.data.results); // Merge all the results into a single array

      // Modify the results to match the desired format
      const modifiedResults = allResults.map((item) => ({
        title: item.trackName || item.collectionName || "Unknown Title", // Title of the item
        artist:
          item.artistName || item.collectionArtistName || "Unknown Artist", // Artist name
        genre: item.primaryGenreName || item.genre || "N/A", // Genre
        releaseDate: item.releaseDate || "N/A", // Release date
        description: item.description || "No description available", // Description
        coverArt: item.artworkUrl100 || item.artworkUrl60 || null, // Cover art URL
        previewUrl: item.previewUrl || null, // Preview URL for media
        mediaId: item.trackId || item.collectionId || null, // Unique media ID
        mediaType: item.collectionType || "unknown", // Type of media (e.g., album, movie)
      }));

      // Calculate total number of pages based on total results
      const totalResults = allResults.length;
      const totalPages = Math.ceil(totalResults / limit);

      // Send the response with modified results, page number, and total pages
      res.json({
        results: modifiedResults,
        page,
        totalPages: totalPages,
      });
    } catch (error) {
      // If there is an error in fetching the data, log it and send a 500 error
      console.error("Error fetching from iTunes API:", error.message || error);
      res.status(500).json({ message: "Failed to fetch search results" });
    }
  } else {
    // For specific media type, construct the URL for the iTunes search API
    let url = `https://itunes.apple.com/search?term=${encodedTerm}&limit=${limit}&offset=${offset}`;

    // If the mediaType is not 'all', add it to the URL query parameters
    if (mediaType !== "all") {
      url += `&media=${mediaType}`;
    }

    try {
      // Fetch the response from the iTunes API
      const response = await axios.get(url);

      // Validate the response data
      if (!validateResponseData(response.data)) {
        throw new Error("Invalid API response format");
      }

      // Modify the results to match the desired format
      const results = response.data.results;
      const modifiedResults = results.map((item) => ({
        title: item.trackName || item.collectionName || "Unknown Title",
        artist:
          item.artistName || item.collectionArtistName || "Unknown Artist",
        genre: item.primaryGenreName || item.genre || "N/A",
        releaseDate: item.releaseDate || "N/A",
        description: item.description || "No description available",
        coverArt: item.artworkUrl100 || item.artworkUrl60 || null,
        previewUrl: item.previewUrl || null,
        mediaId: item.trackId || item.collectionId || null,
        mediaType: mediaType,
      }));

      // Calculate total number of pages based on the total result count
      const totalPages = Math.ceil(response.data.resultCount / limit);

      // Send the response with modified results, page number, and total pages
      res.json({
        results: modifiedResults,
        page,
        totalPages: totalPages,
      });
    } catch (error) {
      // If there is an error in fetching the data, log it and send a 500 error
      console.error("Error fetching from iTunes API:", error.message || error);
      res.status(500).json({ message: "Failed to fetch search results" });
    }
  }
};
