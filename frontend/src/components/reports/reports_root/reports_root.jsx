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

class ReportsRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_root")}
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
                }}>Client Reports</h3>
              </div>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/reports/clients">
                  <FaArrowRight style={iconStyle} /> Clients
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/professionals">
                  <FaArrowRight style={iconStyle} /> Professionals
                </Menu.Item>
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
                }}>Project Reports</h3>
              </div>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/reports/projects">
                  <FaArrowRight style={iconStyle} /> Projects
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/tasks">
                  <FaArrowRight style={iconStyle} /> Tasks
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/properties">
                  <FaArrowRight style={iconStyle} /> Properties
                </Menu.Item>
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
                }}>Financial Reports</h3>
              </div>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/reports/documents">
                  <FaArrowRight style={iconStyle} /> Documents
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/cash">
                  <FaArrowRight style={iconStyle} /> Cash
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/statistics">
                  <FaArrowRight style={iconStyle} /> Statistics
                </Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid>
        </div>
        <Footer />
      </>
    );
  }
}

export default ReportsRoot;
