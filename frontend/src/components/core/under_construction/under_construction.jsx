// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";

// Functions / Modules
import { Button } from "semantic-ui-react";

// CSS
import "./under_construction.css";

// url path = '/under_construction'
class UnderConstruction extends React.Component {
  // This is a temp page, for pages that have not yet been developed
  render() {
    return (
      <>
        <NavigationBar />
        <div className="underConstructionContainer">
          <Button
            color="orange"
            onClick={() => (window.location = "/")}
            className=""
          >
            Back to home page
          </Button>
        </div>
        <Footer />
      </>
    );
  }
}

export default UnderConstruction;
