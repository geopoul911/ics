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
          <Button style={{color: "#93ab3c", backgroundColor: "black", border: "1px solid #93ab3c"}} onClick={() => (window.location = "/")}>
            Back to home page
          </Button>
        </div>
        <Footer />
      </>
    );
  }
}

export default FourOFour;
