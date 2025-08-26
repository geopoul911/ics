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

class AdministrationRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
                  <div className="rootContainer">
          {pageHeader("administration_root")}
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
                }}>User Management</h3>
              </div>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/administration/all_consultants">
                  <FaArrowRight style={iconStyle} /> Consultants
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
                }}>Master Data</h3>
              </div>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/administration/banks">
                  <FaArrowRight style={iconStyle} /> Banks
                </Menu.Item>
                <Menu.Item as={Link} to="/administration/insurance_carriers">
                  <FaArrowRight style={iconStyle} /> Insurance Carriers
                </Menu.Item>
                <Menu.Item as={Link} to="/administration/professions">
                  <FaArrowRight style={iconStyle} /> Professions
                </Menu.Item>
                <Menu.Item as={Link} to="/administration/project_categories">
                  <FaArrowRight style={iconStyle} /> Project Categories
                </Menu.Item>
                <Menu.Item as={Link} to="/administration/task_categories">
                  <FaArrowRight style={iconStyle} /> Task Categories
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
                }}>System</h3>
              </div>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/administration/logs">
                  <FaArrowRight style={iconStyle} /> Logs
                </Menu.Item>
                <Menu.Item as={Link} to="/administration/access_history">
                  <FaArrowRight style={iconStyle} /> Access History
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

export default AdministrationRoot;
