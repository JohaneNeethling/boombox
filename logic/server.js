// Import necessary modules
const express = require("express"); // Express.js framework for building the server
const mongoose = require("mongoose"); // MongoDB object modeling tool
const dotenv = require("dotenv"); // Environment variable management
const cors = require("cors"); // Cross-Origin Resource Sharing (CORS) middleware
const path = require("path"); // Add import

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Create an Express app instance
const app = express();

// CORS configuration to allow specific origin (e.g., localhost:3000)
const corsOptions = {
  origin: "http://localhost:3000", // Specify the allowed origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  credentials: true, // Allow sending credentials (cookies, etc.)
};

// Use the CORS middleware with the defined options
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Import route handlers
const authRoutes = require("./routes/auth");
const mediaRoutes = require("./routes/media");
const favoritesRoutes = require("./routes/favorites");

// Mount route handlers on the appropriate paths
app.use("/auth", authRoutes); // Handle authentication routes
app.use("/media", mediaRoutes); // Handle media-related routes
app.use("/favorites", favoritesRoutes); // Handle favorites-related routes

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Handle all routes to send back the index.html for the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Connect to MongoDB using the URI from environment variables
mongoose
  .connect(process.env.MONGO_URI, {
    // Use Mongo URI from .env file
    useNewUrlParser: true, // Ensure the new URL parser is used (prevents deprecation warnings)
    useUnifiedTopology: true, // Use the unified topology (recommended by MongoDB)
  })
  .then(() => {
    const port = process.env.PORT || 5000; // Set the port, defaulting to 5000
    app.listen(port, () => {
      console.log(`Server running on port ${port}`); // Log the server start
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err); // Handle any database connection errors
    process.exit(1); // Exit the process with an error code
  });

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err); // Log the error

  const statusCode = err.statusCode || 500; // Default to status 500 if no status code is set
  const message = err.message || "Something went wrong!"; // Default error message

  res.status(statusCode).json({ message }); // Send the error response with the status and message
});

// Middleware to handle requests to undefined routes (404)
app.use((req, res, next) => {
  const error = new Error("Not Found"); // Create a new error indicating the route wasn't found
  error.statusCode = 404; // Set the error status to 404 (Not Found)
  next(error); // Pass the error to the next error-handling middleware
});
