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
                <div style={{ 
                  backgroundColor: "black", 
                  color: "white", 
                  padding: "10px 15px", 
                  borderRadius: "5px", 
                  marginBottom: "20px",
                  textAlign: "center",
                  width: "70%",
                  marginLeft: "15%",
                  marginRight: "15%"
                }}>
                  <h3 style={{ 
                    color: "#2a9fd9", 
                    margin: "0", 
                    fontSize: "1.2em", 
                    fontWeight: "bold" 
                  }}>Clients & Contacts</h3>
                </div>
                <Menu vertical className="dmRootMenu">
                  <Menu.Item as={Link} to="/data_management/all_clients"><FaArrowRight style={iconStyle} />Clients</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_client_contacts"><FaArrowRight style={iconStyle} />Client Contacts</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_bank_client_accounts"><FaArrowRight style={iconStyle} />Bank Client Accounts</Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column>
                <div style={{ 
                  backgroundColor: "black", 
                  color: "white", 
                  padding: "10px 15px", 
                  borderRadius: "5px", 
                  marginBottom: "20px",
                  textAlign: "center",
                  width: "70%",
                  marginLeft: "15%",
                  marginRight: "15%"
                }}>
                  <h3 style={{ 
                    color: "#2a9fd9", 
                    margin: "0", 
                    fontSize: "1.2em", 
                    fontWeight: "bold" 
                  }}>Projects & Tasks</h3>
                </div>
                <Menu vertical className="dmRootMenu">
                  <Menu.Item as={Link} to="/data_management/all_projects"><FaArrowRight style={iconStyle} />Projects</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_associated_clients"><FaArrowRight style={iconStyle} />Associated Clients</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_project_tasks"><FaArrowRight style={iconStyle} />Project Tasks</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_task_comments"><FaArrowRight style={iconStyle} />Task Comments</Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column>
                <div style={{ 
                  backgroundColor: "black", 
                  color: "white", 
                  padding: "10px 15px", 
                  borderRadius: "5px", 
                  marginBottom: "20px",
                  textAlign: "center",
                  width: "70%",
                  marginLeft: "15%",
                  marginRight: "15%"
                }}>
                  <h3 style={{ 
                    color: "#2a9fd9", 
                    margin: "0", 
                    fontSize: "1.2em", 
                    fontWeight: "bold" 
                  }}>Documents, Financial & Directory</h3>
                </div>
                <Menu vertical className="dmRootMenu">
                  <Menu.Item as={Link} to="/data_management/all_documents"><FaArrowRight style={iconStyle} />Documents</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_properties"><FaArrowRight style={iconStyle} />Properties</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_cash"><FaArrowRight style={iconStyle} />Cash</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_bank_project_accounts"><FaArrowRight style={iconStyle} />Bank Project Accounts</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_professionals"><FaArrowRight style={iconStyle} />Professionals</Menu.Item>
                  <Menu.Item as={Link} to="/data_management/all_taxation_projects"><FaArrowRight style={iconStyle} />Taxation Projects</Menu.Item>
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
