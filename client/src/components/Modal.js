import React from "react"; // Importing React library for building components
import "./Modal.css"; // Importing the CSS file to style the modal

// Modal component that accepts props: message (the content of the modal) and onClose (a function to handle closing)
const Modal = ({ message, onClose }) => {
  return (
    // The overlay div that covers the entire screen
    <div className="modal-overlay">
      {/* Modal content */}
      <div className="modal">
        {/* Display the message passed as a prop */}
        <p>{message}</p>

        {/* Close button that triggers the onClose function when clicked */}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Export the Modal component to be used elsewhere in the app
export default Modal;
