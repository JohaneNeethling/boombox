import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component for displaying messages
import "./Search.css"; // Import styles for this component
import MusicLong from "../media/MusicLong.png"; // Import an image for the music section

const SearchPage = () => {
  // State hooks to store various data
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("searchTerm") || ""
  );
  const [mediaType, setMediaType] = useState("music"); // Default media type is 'music'
  const [results, setResults] = useState([]); // To store search results
  const [favorites, setFavorites] = useState([]); // To store user's favorite media items
  const [userLoggedIn] = useState(true); // Simulate user login state
  const [playingSong, setPlayingSong] = useState(null); // Track the currently playing song
  const [songProgress, setSongProgress] = useState({}); // Store progress of the song
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [searchAttempted, setSearchAttempted] = useState(false); // Flag to track if search was performed
  const audioRefs = useRef({}); // Ref to track audio elements
  const [error, setError] = useState(""); // To store error messages
  const [successMessage, setSuccessMessage] = useState(""); // To store success messages
  const [loading, setLoading] = useState(false); // State to track if data is loading
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const favoritesRef = useRef(favorites); // Ref to track favorites state

  // Function to handle media search
  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term."); // Show error if search term is empty
      setShowModal(true); // Show error modal
      return;
    }

    setError(""); // Reset error
    setSearchAttempted(true); // Mark search as attempted
    setLoading(true); // Start loading

    try {
      // Make API request to fetch media based on search term and media type
      const response = await axios.get(
        "https://boombox-6y0e.onrender.com/media/search",
        {
          params: { term: searchTerm, mediaType: mediaType, page: page },
        }
      );
      setResults(response.data.results); // Set search results
      setTotalPages(response.data.totalPages || 1); // Set total pages for pagination
      setCurrentPage(page); // Update current page
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to fetch results, please try again.");
      setShowModal(true); // Show error modal if request fails
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Store the search term in localStorage when it changes
  useEffect(() => {
    if (searchTerm.trim()) {
      localStorage.setItem("searchTerm", searchTerm);
    }
  }, [searchTerm]);

  // Function to clear search results and reset the state
  const handleClearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setSearchAttempted(false);
    localStorage.removeItem("searchTerm");
  };

  // Update the favoritesRef whenever favorites state changes
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  // Function to add an item to favorites
  const handleAddToFavorites = async (item) => {
    try {
      // Check if the item is already in favorites to avoid duplicates
      const isDuplicate = favorites.some(
        (favorite) => favorite.mediaId === item.mediaId
      );

      if (isDuplicate) {
        setError("This media is already in your favorites.");
        setShowModal(true);
        return; // Exit early to avoid unnecessary request
      }

      // Proceed with adding to favorites via API request
      const response = await axios.post(
        "https://boombox-6y0e.onrender.com/favorites",
        {
          title: item.title,
          artist: item.artist,
          genre: item.genre,
          releaseDate: item.releaseDate,
          coverArt: item.coverArt,
          previewUrl: item.previewUrl,
          mediaId: item.mediaId,
          mediaType: item.mediaType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization header with token
          },
        }
      );

      // Handle duplicate response from server (in case it's already in favorites)
      if (
        response.data.message === "This media is already in your favorites."
      ) {
        setError(response.data.message);
        setShowModal(true);
        return;
      }

      // Update favorites and show success message if item is added
      setFavorites((prevFavorites) => [...prevFavorites, response.data]);
      setSuccessMessage("Successfully added to favorites!");
      setShowModal(true);
    } catch (error) {
      if (error.response) {
        // Handle known error responses from the server
        if (
          error.response.status === 400 &&
          error.response.data.message ===
            "This media is already in your favorites."
        ) {
          setError(error.response.data.message);
          setShowModal(true);
          return;
        }

        // Handle other types of errors (if any)
        setError(
          error.response.data.message ||
            "There was an error adding the item to favorites."
        );
      } else {
        // Handle network or unexpected errors
        setError("There was an error adding the item to favorites.");
      }

      setShowModal(true);
    }
  };

  // Toggle between play and pause for the selected song
  const togglePlayPause = (item) => {
    const audioRef = audioRefs.current[item.previewUrl];
    if (playingSong === item.previewUrl && audioRef && !audioRef.paused) {
      audioRef.pause();
      setPlayingSong(null);
    } else {
      if (playingSong) {
        const prevAudioRef = audioRefs.current[playingSong];
        prevAudioRef && prevAudioRef.pause();
      }
      audioRef.play();
      setPlayingSong(item.previewUrl);
    }
  };

  // Skip ahead by 10 seconds in the current song
  const skipAhead = () => {
    const audioRef = audioRefs.current[playingSong];
    if (audioRef) {
      audioRef.currentTime += 10;
    }
  };

  // Skip back by 10 seconds in the current song
  const skipBack = () => {
    const audioRef = audioRefs.current[playingSong];
    if (audioRef) {
      audioRef.currentTime -= 10;
    }
  };

  // Track song progress (current time and duration)
  const handleTimeUpdate = (item) => {
    const audioRef = audioRefs.current[item.previewUrl];
    if (audioRef) {
      setSongProgress((prevProgress) => ({
        ...prevProgress,
        [item.previewUrl]: {
          currentTime: audioRef.currentTime,
          duration: audioRef.duration,
        },
      }));
    }
  };

  // Handle pagination for search results
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(page); // Fetch search results for the new page
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  };

  // Reset the search when the media type changes
  useEffect(() => {
    setResults([]);
    setSearchAttempted(false);
    setCurrentPage(1);
  }, [mediaType]);

  return (
    <div>
      {showModal && (
        <Modal
          message={error || successMessage} // Display error or success message in modal
          onClose={() => {
            setShowModal(false);
            setSuccessMessage(""); // Reset success message when modal closes
          }}
        />
      )}

      {userLoggedIn ? (
        <div className="the-search-container">
          <div className="music-long-container">
            <img src={MusicLong} alt="Music" />
          </div>
          <div className="search-form-container">
            <input
              type="text"
              placeholder="Search for media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              className="media-search-input"
            />
            <select
              onChange={(e) => setMediaType(e.target.value)} // Update media type (music, movie, etc.)
              value={mediaType}
              className="dropdown-input"
            >
              {/* List of media types */}
              <option value="music">Music</option>
              <option value="movie">Movies</option>
              <option value="podcast">Podcasts</option>
              <option value="audiobook">Audiobooks</option>
              <option value="shortFilm">Short Films</option>
              <option value="tvShow">TV Shows</option>
              <option value="software">Software</option>
              <option value="ebook">Ebooks</option>
              <option value="all">All</option>
            </select>
            <button
              onClick={() => handleSearch(1)}
              className="the-search-button"
            >
              Search
            </button>
          </div>
          <div>
            {results.length > 0 && (
              <button
                onClick={handleClearSearch}
                className="clear-search-button"
              >
                Clear Search Results
              </button>
            )}
            <div className="search-results">
              {loading && <p className="searching-results">Searching...</p>}
              {!loading && results.length === 0 && searchAttempted && (
                <p className="no-results">No results found.</p>
              )}
              {results.length > 0
                ? results.map((item, index) => (
                    <div key={index}>
                      <img
                        src={item.coverArt}
                        alt={item.title}
                        className="cover-media-item"
                      />
                      <h3 className="myh3">{item.title}</h3>
                      <p className="song-details">
                        <strong>Artist:</strong> {item.artist}
                      </p>
                      <p className="song-details">
                        <strong>Genre:</strong> {item.genre}
                      </p>
                      <p className="song-details">
                        <strong>Release Date:</strong>{" "}
                        {item.releaseDate !== "N/A"
                          ? new Date(item.releaseDate).toLocaleDateString()
                          : item.releaseDate}
                      </p>

                      {/* Display music player controls if previewUrl exists */}
                      {item.previewUrl && mediaType === "music" && (
                        <div className="mp3-player">
                          <audio
                            ref={(el) =>
                              (audioRefs.current[item.previewUrl] = el)
                            }
                            src={item.previewUrl}
                            onTimeUpdate={() => handleTimeUpdate(item)}
                          />
                          <div className="audio-controls">
                            <button
                              onClick={skipBack}
                              className="skip-back-button"
                            >
                              {"<<"}
                            </button>
                            <button
                              onClick={() => togglePlayPause(item)}
                              className="play-pause-button"
                            >
                              {playingSong === item.previewUrl
                                ? "Pause"
                                : "Play"}
                            </button>
                            <button
                              onClick={skipAhead}
                              className="skip-ahead-button"
                            >
                              {">>"}
                            </button>
                          </div>
                          <div className="audio-progress">
                            <span>
                              {Math.floor(
                                songProgress[item.previewUrl]?.currentTime || 0
                              )}{" "}
                              s
                            </span>{" "}
                            /{" "}
                            <span>
                              {Math.floor(
                                songProgress[item.previewUrl]?.duration || 0
                              )}{" "}
                              s
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Add to favorites button */}
                      <button
                        onClick={() => handleAddToFavorites(item)}
                        className="add-fav-button"
                      >
                        Add to Favorites
                      </button>
                    </div>
                  ))
                : searchAttempted}
            </div>

            {/* Pagination controls */}
            {results.length > 0 && totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>You need to log in to view this page.</p>
      )}
    </div>
  );
};

export default SearchPage;
