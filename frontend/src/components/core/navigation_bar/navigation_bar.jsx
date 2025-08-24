// Built-ins
import { Component } from "react";

// CSS
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "./navigation_bar.css";

// Modules / Functions
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import axios from "axios";
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
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa";

// Global Variables
import { headers } from "../../global_vars";

// Variables
let iconStyle = {
  color: "#2a9fd9",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

const LOGOUT = "http://localhost:8000/api/user/logout/";

// Navigation Bar has no url , it is included in all pages
class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataIsOpen: false,
      adminIsOpen: false,
      meIsOpen: false,
      reportIsOpen: false,
    };
    this.dataOpen = this.dataOpen.bind(this);
    this.dataClose = this.dataClose.bind(this);
    this.adminOpen = this.adminOpen.bind(this);
    this.adminClose = this.adminClose.bind(this);
    this.meOpen = this.meOpen.bind(this);
    this.meClose = this.meClose.bind(this);
    this.reportOpen = this.reportOpen.bind(this);
    this.reportClose = this.reportClose.bind(this);
  }

  // Logout
  handleLogout = ({ setUserToken }) => {
    axios({
      method: "post",
      url: LOGOUT,
      headers: headers,
    });
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

  // Close Data Management Dropdown
  reportClose = () => {
    this.setState({
      reportIsOpen: false,
    });
  };

  // Open Site Administration Dropdown
  adminOpen = () => {
    this.setState({
      adminIsOpen: true,
    });
  };

  // Close Site Administration Dropdown
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

              {/* Data Management */}
              <Nav.Link href="/data_management/root/" onMouseLeave={this.dataClose} onMouseOver={this.dataOpen}>
                <RiAdminLine style={iconStyle} />
                Data Management
                <Dropdown onMouseLeave={this.dataClose} onMouseOver={this.dataOpen}>
                  <Dropdown.Menu show={this.state.dataIsOpen} id="nav_admin_dropdown">
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Associated Clients</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>BankClientAccounts</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>BankProjectAccounts</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Banks</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Cash</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Cities</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>ClientContacts</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Clients</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Consultants</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Countries</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Documents</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Insurance Carriers</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Professionals</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Professions</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Project Categories</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Project Tasks</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Projects</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Properties</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Provinces</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>Task Categories</Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs"><FaArrowRight style={iconStyle}/>TaskComments</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Site Administration */}
              <Nav.Link href="/site_administration/root/" onMouseLeave={this.adminClose} onMouseOver={this.adminOpen}>
                <RiAdminLine style={iconStyle} />
                Site Administration
                <Dropdown onMouseLeave={this.adminClose} onMouseOver={this.adminOpen}>
                  <Dropdown.Menu show={this.state.adminIsOpen} id="nav_admin_dropdown">
                    <Dropdown.Item href="/site_administration/access_history">
                      <FaArrowRight style={iconStyle}/> Access History
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs">
                      <FaArrowRight style={iconStyle}/> Logs
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/all_users">
                      <FaArrowRight style={iconStyle}/> Users
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>


              {/* Reports */}
              <Nav.Link href="/reports/root/" onMouseLeave={this.reportClose} onMouseOver={this.reportOpen}>
                <RiAdminLine style={iconStyle} />
                Reports
                <Dropdown onMouseLeave={this.reportClose} onMouseOver={this.reportOpen}>
                  <Dropdown.Menu show={this.state.reportIsOpen} id="nav_admin_dropdown">
                    <Dropdown.Item href="/reports/access_history">
                      <FaArrowRight style={iconStyle}/> Clients
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/logs">
                      <FaArrowRight style={iconStyle}/> Projects  
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/all_users">
                      <FaArrowRight style={iconStyle}/> Tasks
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/all_users">
                      <FaArrowRight style={iconStyle}/> Properties
                    </Dropdown.Item>
                  <Dropdown.Item href="/reports/all_users">
                    <FaArrowRight style={iconStyle}/> Documents
                      </Dropdown.Item>
                  <Dropdown.Item href="/reports/all_users">
                    <FaArrowRight style={iconStyle}/> Cash
                      </Dropdown.Item>
                  <Dropdown.Item href="/reports/all_users">
                    <FaArrowRight style={iconStyle}/> Professionals
                      </Dropdown.Item>
                  <Dropdown.Item href="/reports/all_users">
                    <FaArrowRight style={iconStyle}/> Statistics
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
                <Nav.Link href={"/site_administration/user/" + localStorage.getItem("user_id")} onMouseLeave={this.meClose} onMouseOver={this.meOpen}>
                  <CgProfile style={iconStyle} /> {localStorage.getItem("user")}
                  <Dropdown onMouseLeave={this.meClose} onMouseOver={this.meOpen}>
                    <Dropdown.Menu  show={this.state.meIsOpen}  id="nav_me_dropdown">
                      <Dropdown.Item href={"/site_administration/user/" + localStorage.getItem("user_id")}>
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
