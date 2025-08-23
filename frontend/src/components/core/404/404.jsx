// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// CSS
import "./404.css";

// Modules / Functions
import { Button } from "semantic-ui-react";

// Defining FourOFour component
class FourOFour extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="imageContainer">
          <Button color="orange" onClick={() => (window.location = "/")}>
            Back to home page
          </Button>
        </div>
        <Footer />
      </>
    );
  }
}

export default FourOFour;
