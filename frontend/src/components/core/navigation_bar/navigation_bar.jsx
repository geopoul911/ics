// Built-ins
import React, { Component } from "react";

// CSS
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "./navigation_bar.css";

// Modules / Functions
import { Navbar, Nav, Spinner, Dropdown } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

// Icons / Images
import Logo from "../../../images/core/navigation_bar/group_plan_logo_new.png";
import {
  BiLogOutCircle,
  BiBriefcase,
  BiMailSend,
  BiRestaurant,
  BiFootball,
  BiStats,
  BiAnchor,
  BiTransfer,
  BiUser,
  BiHelpCircle,
} from "react-icons/bi";
import {
  AiOutlineSetting,
  AiOutlineLogin,
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFileSearch,
  AiOutlineWarning,
} from "react-icons/ai";
import { HiOutlineDocumentReport, HiDocumentSearch } from "react-icons/hi";
import { TiGroupOutline, TiGroup } from "react-icons/ti";
import {
  MdSupportAgent,
  MdLocalAirport,
  MdAccessTime,
  MdOutlineIncompleteCircle,
  MdLocalOffer,
  MdEventAvailable,
  MdPendingActions,
  MdTravelExplore,
} from "react-icons/md";
import {
  FaHotel,
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaMapMarkedAlt,
  FaScrewdriver,
  FaTheaterMasks,
  FaDatabase,
  FaParking,
  FaPiggyBank,
  FaCar,
  FaIdeal,
} from "react-icons/fa";
import {
  GiSteeringWheel,
  GiBus,
  GiBattleship,
  GiShipWheel,
  GiEarthAmerica,
  GiRailway,
  GiConvergenceTarget,
  GiMagickTrick,
  GiCommercialAirplane,
} from "react-icons/gi";
import { BsBank } from "react-icons/bs";
import { RiAdminLine, RiGuideLine, RiAdvertisementFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { SiChinasouthernairlines } from "react-icons/si";
import { WiTrain } from "react-icons/wi";
import { BsFillPinMapFill, BsFillPuzzleFill } from "react-icons/bs";
import { MdGroup, MdOutlinePlaylistAdd } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { FaFileContract } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import { MdFolderShared } from "react-icons/md";

// Global Variables
import { headers } from "../../global_vars";

// Variables
let iconStyle = {
  color: "#93ab3c",
  fontSize: "1.5em",
  marginRight: "0.5em",
};

const LOGOUT = "http://localhost:8000/api/user/logout/";

// Gets navigation's notifications
const GET_NAV_NOTIFICATIONS =
  "http://localhost:8000/api/view/get_nav_notifications/";

// Navigation Bar has no url , it is included in all pages
class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expired_documents: 0,
      conflicts: 0,
      groups_data: 0,
      incomplete_data: 0,
      groupIsOpen: false,
      reportIsOpen: false,
      dataIsOpen: false,
      mapIsOpen: false,
      financialIsOpen: false,
      adminIsOpen: false,
      meIsOpen: false,
    };
    this.groupOpen = this.groupOpen.bind(this);
    this.groupClose = this.groupClose.bind(this);
    this.reportOpen = this.reportOpen.bind(this);
    this.reportClose = this.reportClose.bind(this);
    this.dataOpen = this.dataOpen.bind(this);
    this.dataClose = this.dataClose.bind(this);
    this.mapOpen = this.mapOpen.bind(this);
    this.mapClose = this.mapClose.bind(this);
    this.adminOpen = this.adminOpen.bind(this);
    this.adminClose = this.adminClose.bind(this);
    this.meOpen = this.meOpen.bind(this);
    this.meClose = this.meClose.bind(this);
    this.financialOpen = this.financialOpen.bind(this);
    this.financialClose = this.financialClose.bind(this);
  }

  componentDidMount() {
    axios
      .get(GET_NAV_NOTIFICATIONS, {
        headers: headers,
      })
      .then((res) => {
        localStorage.setItem("expired_documents", res.data.expired_documents);
        localStorage.setItem("conflicts", res.data.conflicts);
        localStorage.setItem("groups_data", res.data.groups_data);
        localStorage.setItem("incomplete_data", res.data.incomplete_data);
      });
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

  // Open Group Management Dropdown
  groupOpen = () => {
    this.setState({
      groupIsOpen: true,
    });
  };

  // Close Group Management Dropdown
  groupClose = () => {
    this.setState({
      groupIsOpen: false,
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

  mapOpen = () => {
    this.setState({
      mapIsOpen: true,
    });
  };

  // Close Data Management Dropdown
  mapClose = () => {
    this.setState({
      mapIsOpen: false,
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

  financialOpen = () => {
    this.setState({
      financialIsOpen: true,
    });
  };

  // Close Data Management Dropdown
  financialClose = () => {
    this.setState({
      financialIsOpen: false,
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
              {/* Group Management */}
              <Nav.Link href="/group_management/root" onMouseLeave={this.groupClose} onMouseOver={this.groupOpen}>
                <MdGroup style={iconStyle} /> Group Management
                {isLoggedIn ? (
                  Number(localStorage.getItem("groups_data")) === 0 ? (
                    ""
                  ) : Number(localStorage.getItem("groups_data")) > 0 ? (
                    <Badge
                      title={"Pending Groups"}
                      className="notificationBadge"
                    >
                      {localStorage.getItem("groups_data")}
                    </Badge>
                  ) : (
                    <Spinner
                      animation="border"
                      variant="danger"
                      size="sm"
                      style={{ marginLeft: 10, padding: 5 }}
                    />
                  )
                ) : (
                  ""
                )}
                <Dropdown onMouseLeave={this.groupClose} onMouseOver={this.groupOpen}>
                  <Dropdown.Menu show={this.state.groupIsOpen} id="nav_group_dropdown">
                    <Dropdown.Item href="/group_management/all_groups">
                      <TiGroup /> Groups
                    </Dropdown.Item>
                    <Dropdown.Item href="/group_management/all_group_offers">
                      <MdLocalOffer /> Offers
                    </Dropdown.Item>
                    <Dropdown.Item href="/group_management/availability">
                      <MdEventAvailable /> Availability
                    </Dropdown.Item>
                    <Dropdown.Item href="/group_management/pending_groups">
                      <MdPendingActions /> Pending Groups
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Data Management */}
              <Nav.Link href="/data_management/root/" onMouseLeave={this.dataClose} onMouseOver={this.dataOpen}>
                <FaDatabase style={{ color: "#93ab3c", fontSize: "1.2em", marginRight: "0.5em" }}/>
                Data Management
                <Dropdown onMouseLeave={this.dataClose} onMouseOver={this.dataOpen}>
                  <Dropdown.Menu show={this.state.dataIsOpen} id="nav_data_dropdown">
                    <Dropdown.Item href="/data_management/all_advertisement_companies">
                      <RiAdvertisementFill /> Advertisement Companies
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_agents">
                      <BiBriefcase /> Agents
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_aircrafts">
                      <GiCommercialAirplane /> Aircrafts
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_airlines">
                      <SiChinasouthernairlines /> Airlines
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_airports">
                      <MdLocalAirport /> Airports
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_attractions">
                      <FaMapMarkedAlt /> Museum & Attractions
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_car_hire_companies">
                      <FaCar /> Car Hire
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_charter_brokers">
                      <FaIdeal /> Charter Airlines & Brokers
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_coaches">
                      <GiBus /> Coaches
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_coach_operators">
                      <MdSupportAgent /> Coach Operators
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_clients">
                      <FaSuitcaseRolling /> Clients
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_contracts">
                      <FaFileContract /> Contracts
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_cruising_companies">
                      <GiShipWheel /> Cruising Companies
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_dmcs">
                      <GiEarthAmerica /> DMCs
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_drivers">
                      <GiSteeringWheel /> Drivers
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_entertainment_suppliers">
                      <GiMagickTrick /> Shows & Entertainment Suppliers
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_ferry_ticket_agencies">
                      <GiBattleship /> Ferry Ticket agencies
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_group_leaders">
                      <TiGroupOutline /> Group Leaders
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_guides">
                      <RiGuideLine /> Local Guides
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_hotels">
                      <FaHotel /> Hotels
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_parking_lots">
                      <FaParking /> Parking Lots
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_ports">
                      <BiAnchor /> Ports
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_railway_stations/">
                      <GiRailway /> Railway Stations
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_regions/">
                      <GiConvergenceTarget /> Regions
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_repair_shops">
                      <FaScrewdriver /> Repair shops
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_restaurants">
                      <BiRestaurant /> Restaurants
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_services">
                      <AiOutlineSetting /> Services
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_sport_event_suppliers">
                      <BiFootball /> Sport Event Suppliers
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_teleferik_companies">
                      <BiTransfer /> Teleferik Companies
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_text_templates">
                      <BsFillPuzzleFill /> Text Templates
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_theaters">
                      <FaTheaterMasks /> Theaters
                    </Dropdown.Item>
                    <Dropdown.Item href="/data_management/all_train_ticket_agencies">
                      <WiTrain /> Train Ticket Agencies
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Maps*/}
              <Nav.Link
                href="/maps/root"
                onMouseLeave={this.mapClose}
                onMouseOver={this.mapOpen}
              >
                <BsFillPinMapFill style={iconStyle} /> Maps
                <Dropdown
                  onMouseLeave={this.mapClose}
                  onMouseOver={this.mapOpen}
                >
                  <Dropdown.Menu
                    show={this.state.mapIsOpen}
                    id="nav_group_dropdown"
                  >
                    <Dropdown.Item href="/maps/explore">
                      <MdTravelExplore /> Explore
                    </Dropdown.Item>
                    <Dropdown.Item href="/maps/daily_status">
                      <FaMapMarkerAlt /> Daily Status
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Site Administration */}
              <Nav.Link href="/site_administration/root/" onMouseLeave={this.adminClose} onMouseOver={this.adminOpen}>
                <RiAdminLine style={iconStyle} />
                Site Administration
                {isLoggedIn ? (
                  Number(localStorage.getItem("conflicts")) === 0 ? (
                    ""
                  ) : Number(localStorage.getItem("conflicts")) > 0 ? (
                    <Badge title={"Driver / Coach Conflicts"} className="notificationBadge">
                      {Number(localStorage.getItem("conflicts")) +
                        Number(localStorage.getItem("incomplete_data"))}
                    </Badge>
                  ) : (
                    <Spinner
                      animation="border"
                      variant="danger"
                      size="sm"
                      style={{ marginLeft: 10, padding: 5 }}
                    />
                  )
                ) : (
                  ""
                )}
                <Dropdown onMouseLeave={this.adminClose} onMouseOver={this.adminOpen}>
                  <Dropdown.Menu show={this.state.adminIsOpen} id="nav_admin_dropdown">
                    <Dropdown.Item href="/site_administration/access_history">
                      <MdAccessTime /> Access History
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/conflicts">
                      <AiOutlineWarning /> Conflicts
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/incomplete_data">
                      <MdOutlineIncompleteCircle /> Incomplete Data
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/logs">
                      <AiOutlineFileSearch /> Logs
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/all_users">
                      <BiUser /> Users
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/user_permissions">
                      <RiAdminLine /> User permissions
                    </Dropdown.Item>
                    <Dropdown.Item href="/site_administration/nas_folders">
                      <MdFolderShared /> NAS Folders
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Financial */}
              <Nav.Link href="/financial/root" onMouseLeave={this.financialClose} onMouseOver={this.financialOpen}>
                <FaChartLine style={iconStyle} /> Financial
                <Dropdown onMouseLeave={this.financialClose} onMouseOver={this.financialOpen}>
                  <Dropdown.Menu show={this.state.financialIsOpen} id="nav_group_dropdown">
                    <Dropdown.Item href="/financial/payment_orders">
                      <MdOutlinePlaylistAdd /> Payment Orders
                    </Dropdown.Item>
                    <Dropdown.Item href="/financial/all_payments">
                      <BsBank /> All Payments
                    </Dropdown.Item>
                    <Dropdown.Item href="/financial/all_deposits">
                      <FaPiggyBank /> All Deposits
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              {/* Reports */}
              <Nav.Link href="/reports/root/" onMouseLeave={this.reportClose} onMouseOver={this.reportOpen}>
                <HiOutlineDocumentReport style={iconStyle} /> Reports
                {isLoggedIn ? (
                  Number(localStorage.getItem("expired_documents")) === 0 ? (
                    ""
                  ) : Number(localStorage.getItem("expired_documents")) > 0 ? (
                    <Badge title={"Expired Documents pending"} className="notificationBadge">
                      {localStorage.getItem("expired_documents")}
                    </Badge>
                  ) : (
                    <Spinner
                      animation="border"
                      variant="danger"
                      size="sm"
                      style={{ marginLeft: 10, padding: 5 }}
                    />
                  )
                ) : (
                  ""
                )}
                <Dropdown onMouseLeave={this.reportClose} onMouseOver={this.reportOpen}>
                  <Dropdown.Menu show={this.state.reportIsOpen} id="nav_report_dropdown">
                    <Dropdown.Item href="/reports/agent">
                      <BiBriefcase /> Agents
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/airport">
                      <MdLocalAirport /> Airports
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/client">
                      <FaSuitcaseRolling /> Clients
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/coach_operator">
                      <MdSupportAgent /> Coach Operators
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/driver">
                      <GiSteeringWheel /> Drivers
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/expiring_documents">
                      <HiDocumentSearch /> Expiring Documents
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/group_leader">
                      <TiGroupOutline /> Group Leaders
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/group_stats">
                      <BiStats /> Group Stats
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/hotel">
                      <FaHotel /> Hotels
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/sent_emails">
                      <BiMailSend /> Sent Emails
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/service">
                      <AiOutlineSetting /> Services
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/site_statistics">
                      <BiStats /> Site Statistics
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/user">
                      <AiOutlineUser /> Users
                    </Dropdown.Item>
                    <Dropdown.Item href="/reports/option_dates">
                      <IoIosOptions /> Option Dates
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Link>

              <Nav.Link href="/maps/explore/">
                <BiMailSend
                  style={{
                    color: "#93ab3c",
                    fontSize: "1.2em",
                    marginRight: "0.5em",
                  }}
                />
                Mass Mailing
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
                      <Dropdown.Item href="/help/useful_links">
                        <ImBooks /> Useful Links
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
