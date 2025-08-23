// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../navigation_bar/navigation_bar";
import Footer from "../footer/footer";
import General from "./general";
import GroupManagement from "./group_management";
import Reports from "./reports";
import DataManagement from "./data_management";
import Maps from "./maps";
import SiteAdministration from "./site_administration";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";
import { pageHeader } from "../../global_vars";

// Global Variables
import { forbidden, restrictedUsers } from "../../global_vars";

// url path = '/staff_dox'
class StaffDox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "General",
      forbidden: false,
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <>
        <NavigationBar />
        {pageHeader("staff_dox")}
        <div className="mainContainer">
          {this.state.forbidden ? (
            <>{forbidden("Staff Documentation")}</>
          ) : (
            <>
              <Grid divided stackable columns={3}>
                <Grid.Column width={2}>
                  <Menu pointing vertical>
                    <Menu.Item
                      name="General"
                      active={this.state.activeItem === "General"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name="Group Management"
                      active={this.state.activeItem === "Group Management"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name="Reports"
                      active={this.state.activeItem === "Reports"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name="Data Management"
                      active={this.state.activeItem === "Data Management"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name="Maps"
                      active={this.state.activeItem === "Maps"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name="Site Administration"
                      active={this.state.activeItem === "Site Administration"}
                      onClick={this.handleItemClick}
                    />
                  </Menu>
                </Grid.Column>
                {this.state.activeItem === "General" ? <General /> : ""}
                {this.state.activeItem === "Group Management" ? (
                  <GroupManagement />
                ) : (
                  ""
                )}
                {this.state.activeItem === "Reports" ? <Reports /> : ""}
                {this.state.activeItem === "Data Management" ? (
                  <DataManagement />
                ) : (
                  ""
                )}
                {this.state.activeItem === "Maps" ? <Maps /> : ""}
                {this.state.activeItem === "Site Administration" ? (
                  <SiteAdministration />
                ) : (
                  ""
                )}
              </Grid>
              <hr />
            </>
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default StaffDox;
