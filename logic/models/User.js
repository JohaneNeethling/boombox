// Importing mongoose for database interaction and bcryptjs for password hashing
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Defining a user schema for MongoDB using Mongoose
const userSchema = new mongoose.Schema({
  // 'username' field is required, must be unique
  username: { type: String, required: true, unique: true },

  // 'password' field is required for every user
  password: { type: String, required: true },
});

// Pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function (next) {
  // If the password is not modified, skip the hashing process
  if (!this.isModified("password")) return next();

  // Hash the password using bcryptjs with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);

  // Continue with saving the document after hashing the password
  next();
});

// Export the User model based on the schema for use in other parts of the application
module.exports = mongoose.model("User", userSchema);
