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

class RegionRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("region_root")}
          <Grid stackable columns={3}>
            <Grid.Column>
                             <div style={{ 
                 backgroundColor: "black", 
                 color: "#2a9fd9", 
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
                 }}>Geographic Data</h3>
               </div>
              <Menu vertical className="dmRootMenu">
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
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
          </Grid>
        </div>
        <Footer />
      </>
    );
  }
}

export default RegionRoot;
