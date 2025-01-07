// Importing necessary dependencies
import { Link } from "react-router-dom"; // Link component for navigation between pages in React
import Boombox from "../media/BoomBox.gif"; // Importing an image (Boombox gif)
import "./Intro.css"; // Importing the CSS stylesheet for styling the Intro page

// Functional component for the Intro page
const IntroPage = () => {
  return (
    // Main container div for the intro page
    <div className="intro-container">
      {/* Image container for the boombox gif */}
      <div className="img-container">
        {/* Image element for displaying the boombox gif */}
        <img src={Boombox} alt="BoomBox" className="boomBoxLogo" />
      </div>

      {/* Text container that holds the heading and the button */}
      <div className="text-container">
        {/* Title for the page */}
        <h1 className="intro-title">BoomBox</h1>

        {/* Link that navigates to the login page when clicked */}
        <Link to="/login" className="intro-link">
          {/* Button that triggers the navigation */}
          <button className="get-started-button">START LISTENING</button>
        </Link>
      </div>
    </div>
  );
};

// Exporting the component to be used in other parts of the app
export default IntroPage;
