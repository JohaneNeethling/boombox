// Importing the axios library for making HTTP requests
import axios from "axios";

// Defining the base API URL for the backend server
const API_URL = "http://localhost:5000";

// Function to register a new user, sends user data to the backend
export const registerUser = async (userData) => {
  // Sends a POST request to the /auth/register endpoint with the user data
  return axios.post(`${API_URL}/auth/register`, userData);
};

// Function to log in a user, sends user credentials to the backend
export const loginUser = async (userData) => {
  // Sends a POST request to the /auth/login endpoint with the user credentials
  return axios.post(`${API_URL}/auth/login`, userData);
};

// Function to search for media based on search parameters
export const searchMedia = async (searchParams) => {
  // Sends a GET request to the /media/search endpoint with the search parameters
  return axios.get(`${API_URL}/media/search`, { params: searchParams });
};

// Function to get a list of favorite media items for the logged-in user
export const getFavorites = async (token) => {
  // Sends a GET request to the /favorites endpoint with an Authorization header containing the JWT token
  return axios.get(`${API_URL}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header for authentication
    },
  });
};

// Function to add a media item to the user's favorites
export const addFavorite = async (token, mediaData) => {
  // Sends a POST request to the /favorites endpoint with the media data and the Authorization header
  return axios.post(`${API_URL}/favorites`, mediaData, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token to authorize the request
    },
  });
};

// Function to remove a media item from the user's favorites
export const removeFavorite = async (token, mediaId) => {
  // Sends a DELETE request to the /favorites/:mediaId endpoint to remove the media from favorites
  return axios.delete(`${API_URL}/favorites/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token for authentication
    },
  });
};
