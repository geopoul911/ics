// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

// Icons / Images
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaPiggyBank } from "react-icons/fa";
import { BsBank } from "react-icons/bs";

// Global Variables
import { pageHeader } from "../../global_vars";

// Variables
let icon_style = { color: "#F3702D", fontSize: "1.5em", marginRight: 20 };

// url path = '/maps/root'
class MapsRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("financial_root")}
          <Menu vertical className="rootMenu">
            <Menu.Item as={Link} to="/financial/payment_orders">
              <MdOutlinePlaylistAdd style={icon_style} /> Payment Orders
            </Menu.Item>
            <Menu.Item as={Link} to="/financial/all_payments">
              <BsBank style={icon_style} /> All Payments
            </Menu.Item>
            <Menu.Item as={Link} to="/financial/all_deposits">
              <FaPiggyBank style={icon_style} /> All Deposits
            </Menu.Item>
          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default MapsRoot;
