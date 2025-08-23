// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Icons / Images
import { BsFillKeyFill } from "react-icons/bs";
import { MdUpdate } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { FaInfo } from "react-icons/fa";
import { GoLaw } from "react-icons/go";

// Global Variables
import { rootIconStyle, pageHeader } from "../../global_vars";

// url path = '/help'
class Help extends React.Component {
  // Help contains Documentations, About and Terms pages
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("help")}
          <Menu vertical className="rootMenu">
            <Menu.Item as={Link} to="/help/staff_dox">
              <BsFillKeyFill style={rootIconStyle} /> Staff Documentation
            </Menu.Item>
            <Menu.Item as={Link} to="/help/dev_dox">
              <FaCode style={rootIconStyle} /> Developer Documentation
            </Menu.Item>
            <Menu.Item as={Link} to="/help/useful_links">
              <ImBooks style={rootIconStyle} /> Useful Links
            </Menu.Item>
            <Menu.Item as={Link} to="/help/updates">
              <MdUpdate style={rootIconStyle} /> Updates & Fixes
            </Menu.Item>
            <Menu.Item as={Link} to="/about">
              <FaInfo style={rootIconStyle} /> About
            </Menu.Item>
            <Menu.Item as={Link} to="/terms">
              <GoLaw style={rootIconStyle} /> Terms
            </Menu.Item>
          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default Help;
