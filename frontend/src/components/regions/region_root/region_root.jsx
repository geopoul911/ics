// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { FaArrowRight } from "react-icons/fa";

// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { pageHeader } from "../../global_vars";

// Variables
let iconStyle = { color: "#2a9fd9", fontSize: "1.5em", marginRight: 20 };

class RegionRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("region_root")}
          <Menu vertical className="rootMenu">
            <Menu.Item as={Link} to="/regions/all_countries">
              <FaArrowRight style={iconStyle} /> Countries
            </Menu.Item>
            <Menu.Item as={Link} to="/regions/all_provinces">
              <FaArrowRight style={iconStyle} /> Provinces
            </Menu.Item>
            <Menu.Item as={Link} to="/regions/all_cities">
              <FaArrowRight style={iconStyle} /> Cities
            </Menu.Item>

          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default RegionRoot;
