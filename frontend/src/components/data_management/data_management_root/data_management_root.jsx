// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { FaArrowRight } from "react-icons/fa";

// Modules / Functions
import { Menu, Grid } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { pageHeader } from "../../global_vars";

// Variables
let iconStyle = { color: "#2a9fd9", fontSize: "1.5em", marginRight: 20 };

class DataManagementRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
          <div className="rootContainer">
            {pageHeader("data_management_root")}
              <Grid divided stackable columns={3}>
                <Grid.Column>
                  <Menu vertical className="dmRootMenu">
                    <Menu.Item as={Link} to="/data_management/bank_client_accounts"><FaArrowRight style={iconStyle} />Bank Client Accounts</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/banks"><FaArrowRight style={iconStyle} />Banks</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/cash"><FaArrowRight style={iconStyle} />Cash</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/client_contacts"><FaArrowRight style={iconStyle} />Client Contacts</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/clients"><FaArrowRight style={iconStyle} />Clients</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/consultants"><FaArrowRight style={iconStyle} />Consultants </Menu.Item>
                  </Menu>
                </Grid.Column>
                <Grid.Column>
                  <Menu vertical className="dmRootMenu">
                    <Menu.Item as={Link} to="/data_management/documents"><FaArrowRight style={iconStyle} />Documents</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/insurance_carriers"><FaArrowRight style={iconStyle} />Insurance Carriers</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/professions"><FaArrowRight style={iconStyle} />Professions</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/professionals"><FaArrowRight style={iconStyle} />Professionals</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/projects"><FaArrowRight style={iconStyle} />Projects</Menu.Item>
                  </Menu>
                </Grid.Column>
                <Grid.Column>
                <Menu vertical className="dmRootMenu">
                    <Menu.Item as={Link} to="/data_management/project_tasks"><FaArrowRight style={iconStyle} />Project Tasks</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/project_categories"><FaArrowRight style={iconStyle} />Project Categories</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/properties"><FaArrowRight style={iconStyle} />Properties</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/task_categories"><FaArrowRight style={iconStyle} />Task Categories</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/task_comments"><FaArrowRight style={iconStyle} />Task Comments</Menu.Item>
                    <Menu.Item as={Link} to="/data_management/taxation_projects"><FaArrowRight style={iconStyle} />Taxation Projects</Menu.Item>
                  </Menu>
                </Grid.Column>
              </Grid>
          </div>
        <Footer />
      </>
    );
  }
}

export default DataManagementRoot;
