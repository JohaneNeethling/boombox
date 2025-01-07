const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for handling JWTs
const User = require("../models/User"); // Import the User model for accessing the database

// Middleware to authenticate and authorize users based on JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists in the request
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      // If no Authorization header, respond with 401 (Unauthorized)
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    // Extract token from the Authorization header (Bearer token format)
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      // If no token, respond with 401 (Unauthorized)
      return res.status(401).json({ message: "Token is missing or malformed" });
    }

    // Verify and decode the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      // If token is invalid or the user ID is not found, respond with 401
      return res.status(401).json({ message: "Token verification failed" });
    }

    // Find the user by the ID decoded from the token
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      // If user is not found, respond with 404 (Not Found)
      return res.status(404).json({ message: "User not found" });
    }

    // Continue to the next middleware or route handler if everything is valid
    next();
  } catch (error) {
    // Handle specific errors from JWT verification
    if (error.name === "JsonWebTokenError") {
      // If token is invalid
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      // If token has expired
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "NotBeforeError") {
      // If token is not yet valid (not before the specified date)
      return res.status(401).json({ message: "Token is not active yet" });
    }

    // For any other errors, log and respond with 500 (Internal Server Error)
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware; // Export the middleware to use in other parts of the app
