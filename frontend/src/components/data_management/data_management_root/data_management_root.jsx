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
let iconStyle = { color: "#93ab3c", fontSize: "1.5em", marginRight: 20 };

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
                    color: "#93ab3c", 
                    margin: "0", 
                    fontSize: "1.2em", 
                    fontWeight: "bold" 
                  }}>Clients & Contacts</h3>
                </div>
                <Menu vertical className="dmRootMenu">
                  <Menu.Item as={Link} to="/data_management/all_clients"><FaArrowRight style={iconStyle} />Clients</Menu.Item>
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
                    color: "#93ab3c", 
                    margin: "0", 
                    fontSize: "1.2em", 
                    fontWeight: "bold" 
                  }}>Projects & Tasks</h3>
                </div>
                <Menu vertical className="dmRootMenu">
                  <Menu.Item as={Link} to="/data_management/all_projects"><FaArrowRight style={iconStyle} />Projects</Menu.Item>
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
                    color: "#93ab3c", 
                    margin: "0", 
                    fontSize: "1.2em", 
                    fontWeight: "bold" 
                  }}>Financial & Directory</h3>
                </div>
                <Menu vertical className="dmRootMenu">
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
