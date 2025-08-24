// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdAccessTime } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { GiConvergenceTarget } from "react-icons/gi";


// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { pageHeader } from "../../global_vars";

// Variables
let icon_style = { color: "#2a9fd9", fontSize: "1.5em", marginRight: 20 };

class SiteAdministrationRoot extends React.Component {
  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("site_admin_root")}
          <Menu vertical className="rootMenu">
            <Menu.Item as={Link} to="/site_administration/access_history">
              <MdAccessTime style={icon_style} /> Access History
            </Menu.Item>
            <Menu.Item as={Link} to="/site_administration/logs">
              <AiOutlineFileSearch style={icon_style} /> Logs
            </Menu.Item>
            <Menu.Item as={Link} to="/site_administration/all_users">
              <BiUser style={icon_style} /> Users
            </Menu.Item>
            <Menu.Item as={Link} to="/site_administration/user_permissions">
              <RiAdminLine style={icon_style} /> User permissions
            </Menu.Item>

            <Menu.Item as={Link} to="/site_administration/all_regions">
              <GiConvergenceTarget style={icon_style} /> Regions
            </Menu.Item>

          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default SiteAdministrationRoot;
