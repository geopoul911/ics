// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { HiDocumentSearch } from "react-icons/hi";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { Badge, Spinner } from "react-bootstrap";
import { IoIosOptions } from "react-icons/io";

// Icons / Images
import { TiGroupOutline } from "react-icons/ti";
import { BiBriefcase, BiMailSend, BiStats } from "react-icons/bi";
import { GiSteeringWheel } from "react-icons/gi";
import { MdSupportAgent, MdLocalAirport } from "react-icons/md";
import { FaHotel, FaSuitcaseRolling } from "react-icons/fa";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";

// Global Variables
import { pageHeader } from "../../global_vars";

// Variables
let iconStyle = { color: "#F3702D", fontSize: "1.5em", marginRight: 20 };

class ReportsRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_root")}
          <Grid divided stackable columns={3}>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/reports/agent">
                  <BiBriefcase style={iconStyle} /> Agents
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/airport">
                  <MdLocalAirport style={iconStyle} /> Airports
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/client">
                  <FaSuitcaseRolling style={iconStyle} /> Clients
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/coach_operator">
                  <MdSupportAgent style={iconStyle} /> Coach Operators
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/driver">
                  <GiSteeringWheel style={iconStyle} /> Drivers
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/reports/expiring_documents">
                  <HiDocumentSearch style={iconStyle} /> Expiring Documents
                  {Number(localStorage.getItem("expired_documents")) === 0 ? (
                    ""
                  ) : Number(localStorage.getItem("expired_documents")) > 0 ? (
                    <Badge
                      title={"Expired Documents pending"}
                      style={{
                        backgroundColor: "red",
                        marginLeft: 10,
                        padding: 5,
                        color: "white",
                      }}
                    >
                      {localStorage.getItem("expired_documents")}
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
                <Menu.Item as={Link} to="/reports/group_leader">
                  <TiGroupOutline style={iconStyle} /> Group Leaders
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/group_stats">
                  <BiStats style={iconStyle} /> Group Stats
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/hotel">
                  <FaHotel style={iconStyle} /> Hotels
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/sent_emails">
                  <BiMailSend style={iconStyle} /> Sent Emails
                </Menu.Item>
              </Menu>
            </Grid.Column>
            <Grid.Column>
              <Menu vertical className="dmRootMenu">
                <Menu.Item as={Link} to="/reports/service">
                  <AiOutlineSetting style={iconStyle} /> Services
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/site_statistics">
                  <BiStats style={iconStyle} /> Site Statistics
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/user">
                  <AiOutlineUser style={iconStyle} /> Users
                </Menu.Item>
                <Menu.Item as={Link} to="/reports/option_dates">
                  <IoIosOptions style={iconStyle} /> Option Dates
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
