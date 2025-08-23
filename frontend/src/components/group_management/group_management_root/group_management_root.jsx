// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Badge, Spinner } from "react-bootstrap";

// Icons / Images
import {
  MdLocalOffer,
  MdEventAvailable,
  MdPendingActions,
} from "react-icons/md";
import { TiGroup } from "react-icons/ti";

// Global Variables
import { pageHeader } from "../../global_vars";

// Variables
let icon_style = { color: "#F3702D", fontSize: "1.5em", marginRight: 20 };

// url path = '/group_management_root/'
class GroupManagementRoot extends React.Component {
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
          {pageHeader("group_management_root")}
          <Menu vertical className="rootMenu">
            <Menu.Item as={Link} to="/group_management/all_groups">
              <TiGroup style={icon_style} /> Groups
            </Menu.Item>
            <Menu.Item as={Link} to="/group_management/all_group_offers">
              <MdLocalOffer style={icon_style} /> Offers
            </Menu.Item>
            <Menu.Item as={Link} to="/group_management/availability">
              <MdEventAvailable style={icon_style} /> Availability
            </Menu.Item>
            <Menu.Item as={Link} to="/group_management/pending_groups">
              <MdPendingActions style={icon_style} /> Pending Groups
              {Number(localStorage.getItem("groups_data")) === 0 ? (
                ""
              ) : Number(localStorage.getItem("groups_data")) > 0 ? (
                <Badge
                  title={"Groups pending"}
                  style={{
                    backgroundColor: "red",
                    marginLeft: 10,
                    padding: 5,
                    color: "white",
                  }}
                >
                  {localStorage.getItem("groups_data")}
                </Badge>
              ) : (
                <Spinner
                  animation="border"
                  variant="danger"
                  size="sm"
                  style={{ marginLeft: 10, padding: 5 }}
                />
              )}
            </Menu.Item>
          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default GroupManagementRoot;
