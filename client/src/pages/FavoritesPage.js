import React, { useState, useEffect, useRef } from "react"; // Import necessary hooks from React
import axios from "axios"; // Import axios for making HTTP requests
import "./FavoritesPage.css"; // Import CSS for styling the page

const FavoritesPage = () => {
  // State variables to manage the favorites, the current playing song, the song progress, error message, and modal visibility
  const [favorites, setFavorites] = useState([]); // Store the list of favorite items
  const [playingSong, setPlayingSong] = useState(null); // Track which song is currently playing
  const [songProgress, setSongProgress] = useState({}); // Store the current progress of each song
  const [errorMessage, setErrorMessage] = useState(""); // Store any error message
  const [isModalOpen, setModalOpen] = useState(false); // Manage the visibility of the error modal
  const audioRefs = useRef({}); // Create a reference to manage the audio elements

  // useEffect to fetch the favorites from the server when the component is mounted
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Make an API call to fetch favorites
        const response = await axios.get("http://localhost:5000/favorites", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token to header for authorization
          },
        });

        // Remove duplicates based on mediaId
        const uniqueFavorites = Array.from(
          new Map(response.data.map((item) => [item.mediaId, item])).values()
        );

        setFavorites(uniqueFavorites); // Set the state with the unique list of favorites
      } catch (error) {
        console.error("Error fetching favorites:", error); // Log the error if the API call fails
        setErrorMessage("There was an error fetching your favorites."); // Set error message
        setModalOpen(true); // Open the modal to display the error
      }
    };

    fetchFavorites(); // Call the fetch function on component mount
  }, []); // Empty dependency array means this effect runs only once when the component is first rendered

  // Function to toggle between playing and pausing a song
  const togglePlayPause = (item) => {
    const audioRef = audioRefs.current[item.previewUrl]; // Get the reference to the audio element

    if (playingSong === item.previewUrl && audioRef && !audioRef.paused) {
      // If the same song is already playing, pause it
      audioRef.pause();
      setPlayingSong(null); // Clear the currently playing song
    } else {
      // If another song is playing, pause it first
      if (playingSong) {
        const prevAudioRef = audioRefs.current[playingSong];
        prevAudioRef && prevAudioRef.pause();
      }

      // Play the selected song
      audioRef.play();
      setPlayingSong(item.previewUrl); // Update the state with the new song being played
    }
  };

  // Function to update the song's progress as it plays
  const handleTimeUpdate = (item) => {
    const audioRef = audioRefs.current[item.previewUrl];
    if (audioRef) {
      // Update the song progress in the state with current time and duration
      setSongProgress((prevProgress) => ({
        ...prevProgress,
        [item.previewUrl]: {
          currentTime: audioRef.currentTime,
          duration: audioRef.duration,
        },
      }));
    }
  };

  // Function to skip ahead by 10 seconds
  const skipAhead = (item) => {
    const audioRef = audioRefs.current[item.previewUrl];
    if (audioRef) {
      audioRef.currentTime += 10; // Increment the current time of the audio
    }
  };

  // Function to skip back by 10 seconds
  const skipBack = (item) => {
    const audioRef = audioRefs.current[item.previewUrl];
    if (audioRef) {
      audioRef.currentTime -= 10; // Decrement the current time of the audio
    }
  };

  // Function to handle removing an item from favorites
  const handleRemoveFromFavorites = async (mediaId) => {
    try {
      // Make an API call to remove the favorite item
      await axios.delete(`http://localhost:5000/favorites/${mediaId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Add token to header for authorization
      });

      // Update the favorites list by filtering out the removed item
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.mediaId !== mediaId)
      );
    } catch (error) {
      console.error("Error removing from favorites:", error); // Log the error if the API call fails
      setErrorMessage(
        "There was an error removing the item from your favorites."
      ); // Set error message
      setModalOpen(true); // Open the modal to display the error
    }
  };

  return (
    <div className="the-favorites-container">
      <div className="fav-results">
        {favorites.length > 0 ? (
          // Display favorites if there are any
          favorites.map((fav) => (
            <div key={fav.mediaId}>
              <img
                src={fav.coverArt}
                alt={fav.title}
                className="cover-media-item"
              />
              <h3 className="myh3">{fav.title}</h3>
              <p className="song-details">
                <strong>Artist:</strong> {fav.artist}
              </p>
              <p className="song-details">
                <strong>Genre:</strong> {fav.genre}
              </p>
              <p className="song-details">
                <strong>Release Date:</strong> {fav.releaseDate}
              </p>
              {fav.previewUrl && fav.mediaType === "music" && (
                <div>
                  {/* Audio controls for playing music */}
                  <audio
                    ref={(el) => (audioRefs.current[fav.previewUrl] = el)}
                    src={fav.previewUrl}
                    onTimeUpdate={() => handleTimeUpdate(fav)} // Update progress when time changes
                  />
                  <div className="audio-controls">
                    <button
                      onClick={() => skipBack(fav)}
                      className="skip-back-button"
                    >
                      {"<<"}
                    </button>
                    <button
                      onClick={() => togglePlayPause(fav)}
                      className="play-pause-button"
                    >
                      {playingSong === fav.previewUrl ? "Pause" : "Play"}
                    </button>
                    <button
                      onClick={() => skipAhead(fav)}
                      className="skip-ahead-button"
                    >
                      {">>"}
                    </button>
                  </div>
                  <div className="audio-progress">
                    <span>
                      {Math.floor(
                        songProgress[fav.previewUrl]?.currentTime || 0
                      )}{" "}
                      s
                    </span>{" "}
                    /{" "}
                    <span>
                      {Math.floor(songProgress[fav.previewUrl]?.duration || 0)}{" "}
                      s
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => handleRemoveFromFavorites(fav.mediaId)}
                className="remove-fav-button"
              >
                Remove from Favorites
              </button>
            </div>
          ))
        ) : (
          <p className="favorites-results">No favorites yet.</p> // Display message if no favorites
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
