// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { RiAdminLine } from "react-icons/ri";
import { AiOutlineFileSearch, AiOutlineWarning } from "react-icons/ai";
import { MdAccessTime, MdOutlineIncompleteCircle } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";

// Modules / Functions
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Badge, Spinner } from "react-bootstrap";
import { pageHeader } from "../../global_vars";

// Variables
let icon_style = { color: "#F3702D", fontSize: "1.5em", marginRight: 20 };

class SiteAdministrationRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conflicts: 0,
      incomplete_data: 0,
    };
  }

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
            <Menu.Item as={Link} to="/site_administration/conflicts">
              <AiOutlineWarning style={icon_style} /> Conflicts
              {Number(localStorage.getItem("conflicts")) === 0 ? (
                ""
              ) : Number(localStorage.getItem("conflicts")) > 0 ? (
                <Badge
                  title={"Driver / Coach Conflicts"}
                  style={{
                    backgroundColor: "red",
                    marginLeft: 10,
                    padding: 5,
                    color: "white",
                  }}
                >
                  {localStorage.getItem("conflicts")}
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
            <Menu.Item as={Link} to="/site_administration/incomplete_data">
              <MdOutlineIncompleteCircle style={icon_style} /> Incomplete Data
              {Number(localStorage.getItem("incomplete_data")) === 0 ? (
                ""
              ) : Number(localStorage.getItem("incomplete_data")) > 0 ? (
                <Badge
                  title={"Incomplete Data"}
                  style={{
                    backgroundColor: "red",
                    marginLeft: 10,
                    padding: 5,
                    color: "white",
                  }}
                >
                  {localStorage.getItem("incomplete_data")}
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
            <Menu.Item as={Link} to="/site_administration/logs">
              <AiOutlineFileSearch style={icon_style} /> Logs
            </Menu.Item>
            <Menu.Item as={Link} to="/site_administration/all_users">
              <BiUser style={icon_style} /> Users
            </Menu.Item>
            <Menu.Item as={Link} to="/site_administration/user_permissions">
              <RiAdminLine style={icon_style} /> User permissions
            </Menu.Item>
            <Menu.Item as={Link} to="/site_administration/nas_folders">
              <FaFolder style={icon_style} /> NAS Folders
            </Menu.Item>
          </Menu>
        </div>
        <Footer />
      </>
    );
  }
}

export default SiteAdministrationRoot;
