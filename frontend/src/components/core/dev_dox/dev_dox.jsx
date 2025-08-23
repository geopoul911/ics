// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";
import General from "./general";

// Global Variables
import { pageHeader, forbidden, restrictedUsers } from "../../global_vars";

// url path = '/dev_dox'
class DevDox extends React.Component {
  // Documentation for Company's developers
  constructor(props) {
    super(props);
    this.state = {
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
  }

  render() {
    return (
      <div>
        <NavigationBar />
        {pageHeader("dev_dox")}
        <div className="mainContainer">
          {this.state.forbidden ? (
            <> {forbidden("Developer Documentation")} </>
          ) : (
            <General />
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default DevDox;
