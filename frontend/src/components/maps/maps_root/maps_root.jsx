// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Icons / Images
import { MdTravelExplore } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";

// Global Variables
import { pageHeader } from "../../global_vars";

// Variables
let icon_style = { color: "#F3702D", fontSize: "1.5em", marginRight: 20 };

// url path = '/maps/root'
class MapsRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups_data: 0,
    };
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("maps_root")}
          <Menu vertical className="rootMenu">
            <Menu.Item as={Link} to="/maps/explore">
              <MdTravelExplore style={icon_style} /> Explore
            </Menu.Item>
            <Menu.Item as={Link} to="/maps/daily_status">
              <FaMapMarkerAlt style={icon_style} /> Daily Status
            </Menu.Item>
          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default MapsRoot;
