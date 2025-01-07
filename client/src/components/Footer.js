// Importing the React library to enable the creation of React components
import React from "react";

// Importing the associated CSS file for styling the Footer component
import "./Footer.css";

// Defining a functional component named Footer
const Footer = () => (
  // Rendering a div element with a class name "footer" for styling purposes
  <div className="footer">
    {/* Displaying a paragraph element with a copyright message */}
    {/* The class name "footer-line" is used for additional styling */}
    <p className="footer-line">&copy; 2024 BoomBox. All rights reserved.</p>
  </div>
);

// Exporting the Footer component as the default export from this module
export default Footer;
