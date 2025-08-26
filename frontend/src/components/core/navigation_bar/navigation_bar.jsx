// Built-ins
import { Component } from "react";

// CSS
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "./navigation_bar.css";

import { apiPost, API_ENDPOINTS } from "../../../utils/api";

// Modules / Functions
import { Navbar, Nav, Dropdown } from "react-bootstrap";

import { Link } from "react-router-dom";

// Icons / Images
import Logo from "../../../images/core/logos/ultima_logo.png";
import {
  BiLogOutCircle,
  BiHelpCircle,
} from "react-icons/bi";
import {
  AiOutlineLogin,
  AiOutlineHome,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa";
import { 
  FaUsers, 
  FaFileAlt, 
  FaChartBar,
  FaCog,
  FaGlobe
} from "react-icons/fa";

// Variables
let iconStyle = {
  color: "#2a9fd9",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

// Navigation Bar has no url , it is included in all pages
class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIsOpen: false,
      adminIsOpen: false,
      meIsOpen: false,
      reportIsOpen: false,
      regionIsOpen: false,
    };
    this.dataOpen = this.dataOpen.bind(this);
    this.dataClose = this.dataClose.bind(this);
    this.adminOpen = this.adminOpen.bind(this);
    this.adminClose = this.adminClose.bind(this);
    this.meOpen = this.meOpen.bind(this);
    this.meClose = this.meClose.bind(this);
    this.reportOpen = this.reportOpen.bind(this);
    this.reportClose = this.reportClose.bind(this);
    this.regionOpen = this.regionOpen.bind(this);
    this.regionClose = this.regionClose.bind(this);
  }

  // Logout
  handleLogout = ({ setUserToken }) => {
    apiPost(API_ENDPOINTS.LOGOUT);
    localStorage.removeItem("userToken");
    setUserToken(null);
  };

  // Open Data Management Dropdown
  dataOpen = () => {
    this.setState({
      dataIsOpen: true,
    });
  };

  // Close Data Management Dropdown
  dataClose = () => {
    this.setState({
      dataIsOpen: false,
    });
  };

  // Open Report Dropdown
  reportOpen = () => {
    this.setState({
      reportIsOpen: true,
    });
  };

  // Close Report Dropdown
  reportClose = () => {
    this.setState({
      reportIsOpen: false,
    });
  };

  // Open Administration Dropdown
  adminOpen = () => {
    this.setState({
      adminIsOpen: true,
    });
  };

  // Close Administration Dropdown
  adminClose = () => {
    this.setState({
      adminIsOpen: false,
    });
  };

  // Open Me Dropdown
  meOpen = () => {
    this.setState({
      meIsOpen: true,
    });
  };

  // Close Me Dropdown
  meClose = () => {
    this.setState({
      meIsOpen: false,
    });
  };

  // Open Region Dropdown
  regionOpen = () => {
    this.setState({
      regionIsOpen: true,
    });
  };

  // Close Region Dropdown
  regionClose = () => {
    this.setState({
      regionIsOpen: false,
    });
  };

  render() {
    /* Ternary operator to determine if user is logged in or not */
    let isLoggedIn = localStorage.getItem("userToken") ? true : false;
    return (
      <>
        <Navbar expand="lg" variant="dark">
          <Link to="/">
            <img src={Logo} alt="logo" className="navLogo" />
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="mr-auto">
              {/* Home */}
              <Nav.Link href="/">
                <AiOutlineHome style={iconStyle} /> Home
              </Nav.Link>

              {/* Dashboard */}
              <Nav.Link href="/dashboard">
                <FaChartBar style={iconStyle} /> Dashboard
              </Nav.Link>

              {/* Data Management */}
              <Nav.Link href="/data_management/root/" onMouseLeave={this.dataClose} onMouseOver={this.dataOpen}>
                <FaUsers style={iconStyle} />
                Data Management
                <Dropdown onMouseLeave={this.dataClose} onMouseOver={this.dataOpen}>
                  <Dropdown.Menu show={this.state.dataIsOpen} id="nav_data_dropdown">
                    {/* Clients & Contacts */}
                    <Dropdown.Header>Clients & Contacts</Dropdown.Header>
                    <Dropdown.Item href="/data_management/clients">
                      <FaArrowRight style={iconStyle}/> Clients
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/client_contacts">
                      <FaArrowRight style={iconStyle}/> Client Contacts
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/bank_client_accounts">
                      <FaArrowRight style={iconStyle}/> Bank Client Accounts
                    </Dropdown.Item>
                    
                    {/* Projects & Tasks */}
                    <Dropdown.Divider />
                    <Dropdown.Header>Projects & Tasks</Dropdown.Header>
                    <Dropdown.Item href="/data_management/projects">
                      <FaArrowRight style={iconStyle}/> Projects
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/associated_clients">
                      <FaArrowRight style={iconStyle}/> Associated Clients
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/project_tasks">
                      <FaArrowRight style={iconStyle}/> Project Tasks
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/task_comments">
                      <FaArrowRight style={iconStyle}/> Task Comments
                    </Dropdown.Item>
                    
                    {/* Documents */}
                    <Dropdown.Divider />
                    <Dropdown.Header>Documents</Dropdown.Header>
                    <Dropdown.Item href="/data_management/documents">
                      <FaArrowRight style={iconStyle}/> Documents
                    </Dropdown.Item>
                    
                    {/* Properties */}
                    <Dropdown.Divider />
                    <Dropdown.Header>Properties</Dropdown.Header>
                    <Dropdown.Item href="/data_management/properties">
                      <FaArrowRight style={iconStyle}/> Properties
                    </Dropdown.Item>
                    
                    {/* Financial */}
                    <Dropdown.Divider />
                    <Dropdown.Header>Financial</Dropdown.Header>
                    <Dropdown.Item href="/data_management/cash">
                      <FaArrowRight style={iconStyle}/> Cash
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/bank_project_accounts">
                      <FaArrowRight style={iconStyle}/> Bank Project Accounts
                    </Dropdown.Item>
                    
                    {/* Directory */}
                    <Dropdown.Divider />
                    <Dropdown.Header>Directory</Dropdown.Header>
                    <Dropdown.Item href="/data_management/professionals">
                      <FaArrowRight style={iconStyle}/> Professionals
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/taxation_projects">
                      <FaArrowRight style={iconStyle}/> Taxation Projects
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>


              {/* Reports */}
              <Nav.Link href="/reports/root/" onMouseLeave={this.reportClose} onMouseOver={this.reportOpen}>
                <FaFileAlt style={iconStyle} />
                Reports
                <Dropdown onMouseLeave={this.reportClose} onMouseOver={this.reportOpen}>
                  <Dropdown.Menu show={this.state.reportIsOpen} id="nav_report_dropdown">
                    <Dropdown.Header> Reports </Dropdown.Header>
                    <Dropdown.Item href="/reports/clients">
                      <FaArrowRight style={iconStyle}/> Clients
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/projects">
                      <FaArrowRight style={iconStyle}/> Projects
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/tasks">
                      <FaArrowRight style={iconStyle}/> Tasks
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/properties">
                      <FaArrowRight style={iconStyle}/> Properties
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/documents">
                      <FaArrowRight style={iconStyle}/> Documents
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/cash">
                      <FaArrowRight style={iconStyle}/> Cash
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/professionals">
                      <FaArrowRight style={iconStyle}/> Professionals
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/statistics">
                      <FaArrowRight style={iconStyle}/> Statistics
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Regions */}
              <Nav.Link href="/regions/root/" onMouseLeave={this.regionClose} onMouseOver={this.regionOpen}>
                <FaGlobe style={iconStyle} />
                Regions
                <Dropdown onMouseLeave={this.regionClose} onMouseOver={this.regionOpen}>
                  <Dropdown.Menu show={this.state.regionIsOpen} id="nav_data_dropdown">
                    <Dropdown.Header> Regions </Dropdown.Header>
                    <Dropdown.Item href="/regions/all_countries">
                      <FaArrowRight style={iconStyle}/> Countries
                    </Dropdown.Item>
                    <Dropdown.Item href="/regions/all_provinces">
                      <FaArrowRight style={iconStyle}/> Provinces
                    </Dropdown.Item>
                    <Dropdown.Item href="/regions/all_cities">
                      <FaArrowRight style={iconStyle}/> Cities
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Administration */}
              <Nav.Link href="/administration/root/" onMouseLeave={this.adminClose} onMouseOver={this.adminOpen}>
                <FaCog style={iconStyle} />
                Administration
                <Dropdown onMouseLeave={this.adminClose} onMouseOver={this.adminOpen}>
                  <Dropdown.Menu show={this.state.adminIsOpen} id="nav_admin_dropdown">
                    {/* User Management */}
                    <Dropdown.Header>User Management</Dropdown.Header>
                    <Dropdown.Item href="/administration/consultants">
                      <FaArrowRight style={iconStyle}/> Consultants
                    </Dropdown.Item>
                    
                    {/* Master Data */}
                    <Dropdown.Divider />
                    <Dropdown.Header>Master Data</Dropdown.Header>
                    <Dropdown.Item href="/administration/countries">
                      <FaArrowRight style={iconStyle}/> Countries
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/provinces">
                      <FaArrowRight style={iconStyle}/> Provinces
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/cities">
                      <FaArrowRight style={iconStyle}/> Cities
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/banks">
                      <FaArrowRight style={iconStyle}/> Banks
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/insurance_carriers">
                      <FaArrowRight style={iconStyle}/> Insurance Carriers
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/professions">
                      <FaArrowRight style={iconStyle}/> Professions
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/project_categories">
                      <FaArrowRight style={iconStyle}/> Project Categories
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/task_categories">
                      <FaArrowRight style={iconStyle}/> Task Categories
                    </Dropdown.Item>
                    
                    {/* System */}
                    <Dropdown.Divider />
                    <Dropdown.Header>System</Dropdown.Header>
                    <Dropdown.Item href="/administration/logs">
                      <FaArrowRight style={iconStyle}/> Logs
                    </Dropdown.Item>
                    <Dropdown.Item href="/administration/access_history">
                      <FaArrowRight style={iconStyle}/> Access History
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>
            </Nav>

            {!isLoggedIn ? (
              /* If user is not logged in, show login button */
              <a href="/login" className="auth_button">
                <AiOutlineLogin style={iconStyle} /> Login
              </a>
            ) : (
              /* Else get profile's dropdown  with "Me, Help, Useful links" */
              <>
                <Nav.Link href={"/administration/user/" + localStorage.getItem("user_id")} onMouseLeave={this.meClose} onMouseOver={this.meOpen}>
                  <CgProfile style={iconStyle} /> {localStorage.getItem("user")}
                  <Dropdown onMouseLeave={this.meClose} onMouseOver={this.meOpen}>
                    <Dropdown.Menu show={this.state.meIsOpen} id="nav_me_dropdown">
                      <Dropdown.Item href={"/administration/user/" + localStorage.getItem("user_id")}>
                        <CgProfile /> My profile
                      </Dropdown.Item>
                      <Dropdown.Item href="/help">
                        <BiHelpCircle /> Help
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Link>
                <a href="/" onClick={this.handleLogout} className="auth_button">
                  <BiLogOutCircle style={iconStyle} /> Logout
                </a>
              </>
            )}
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export default NavigationBar;
