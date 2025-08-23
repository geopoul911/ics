// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Modules / Functions
import axios from "axios";
import { ListGroup, Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Icons / Images
import {
  BiBriefcase,
  BiRestaurant,
  BiFootball,
  BiAnchor,
  BiTransfer,
  BiNote,
} from "react-icons/bi";
import {
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineFileSearch,
  AiOutlineWarning,
  AiFillTool,
} from "react-icons/ai";
import {
  HiDocumentSearch,
  HiPhotograph,
  HiOutlineDocument,
} from "react-icons/hi";
import { TiGroupOutline, TiGroup } from "react-icons/ti";
import {
  MdSupportAgent,
  MdLocalAirport,
  MdLocalOffer,
  MdPendingActions,
  MdOutlineAdminPanelSettings,
  MdPlace,
  MdLanguage,
} from "react-icons/md";
import {
  BsTerminal,
  BsFillFlagFill,
  BsFillKeyFill,
  BsCpu,
} from "react-icons/bs";
import { SiVirtualbox } from "react-icons/si";
import { GoServer } from "react-icons/go";
import {
  FaHotel,
  FaSuitcaseRolling,
  FaMapMarkedAlt,
  FaTint,
  FaScrewdriver,
  FaTheaterMasks,
  FaMemory,
} from "react-icons/fa";
import {
  GiSteeringWheel,
  GiBus,
  GiBattleship,
  GiShipWheel,
  GiEarthAmerica,
  GiSandsOfTime,
} from "react-icons/gi";
import { RiGuideLine, RiDatabase2Fill } from "react-icons/ri";
import { SiChinasouthernairlines } from "react-icons/si";
import { WiTrain } from "react-icons/wi";
import { FiHardDrive } from "react-icons/fi";

// Custom Made Components
import Timer from "./timer";
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const REPORTS_SITE_STATISTICS =
  "http://localhost:8000/api/reports/site_statistics/";

let icon_style = { color: "#F3702D", fontSize: "1.2em" };

class ReportsSiteStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_card: [],
      second_card: [],
      third_card: [],
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(REPORTS_SITE_STATISTICS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          first_card: res.data.first_card,
          second_card: res.data.second_card,
          third_card: res.data.third_card,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_site_statistics")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Site Statistics")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={4} divided stackable>
                <Grid.Column width={6}>
                  <Card>
                    <Card.Header> Total number of each Model</Card.Header>
                    <Card.Body>
                      <ul style={{ columns: 2 }}>
                        <li>
                          <ListGroup>
                            <ListGroup.Item>
                              <TiGroup style={icon_style} /> Groups :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["groups"]}
                              </div>
                            </ListGroup.Item>

                            <ListGroup.Item>
                              <BiBriefcase style={icon_style} /> Agents :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["agents"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <SiChinasouthernairlines style={icon_style} />
                              Airlines :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["airlines"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FaSuitcaseRolling style={icon_style} /> Clients :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["clients"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <GiBus style={icon_style} /> Coaches :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["coaches"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <MdSupportAgent style={icon_style} /> Coach
                              Operators :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["coach operators"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <GiShipWheel style={icon_style} /> Cruising
                              Companies :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["cruising companies"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <GiSteeringWheel style={icon_style} /> Drivers :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["drivers"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <GiBattleship style={icon_style} /> Ferry Ticket
                              agencies :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["ferry ticket agencies"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <GiEarthAmerica style={icon_style} /> DMCs :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["dmcs"]}
                              </div>
                            </ListGroup.Item>
                          </ListGroup>
                        </li>
                        <li>
                          <ListGroup>
                            <ListGroup.Item>
                              <TiGroupOutline style={icon_style} /> Group
                              Leaders :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["group leaders"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <RiGuideLine style={icon_style} /> Guides :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["guides"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FaHotel style={icon_style} /> Hotels :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["hotels"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FaScrewdriver style={icon_style} /> Repair shops
                              :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["repair shops"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <BiRestaurant style={icon_style} /> Restaurants :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["restaurants"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <BiFootball style={icon_style} /> Sport Event
                              Suppliers :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["sport event suppliers"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <BiTransfer style={icon_style} /> Teleferik
                              Companies :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["teleferik companies"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FaTheaterMasks style={icon_style} /> Theaters :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["theaters"]}
                              </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <WiTrain style={icon_style} /> Train Ticket
                              Agencies :
                              <div style={{ float: "right" }}>
                                {this.state.first_card["train ticket agencies"]}
                              </div>
                            </ListGroup.Item>
                          </ListGroup>
                        </li>
                      </ul>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted"></small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Card>
                    <Card.Header> Related Entries</Card.Header>
                    <Card.Body style={{ minHeight: 490 }}>
                      <ListGroup>
                        <ListGroup.Item>
                          <BsTerminal style={icon_style} /> Terminals :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["terminals"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <MdLocalOffer style={icon_style} /> Offers :
                          <div style={{ float: "right" }}>
                            {this.state.first_card["offers"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <BiNote style={icon_style} /> Notes :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["notes"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <HiPhotograph style={icon_style} /> Photos :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["photos"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <HiOutlineDocument style={icon_style} /> Documents :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["documents"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FaMapMarkedAlt style={icon_style} /> Attractions :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["attractions"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <MdLocalAirport style={icon_style} /> Airports :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["airports"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <BiAnchor style={icon_style} /> Ports :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["ports"]}
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted"></small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Card>
                    <Card.Header> General Stats</Card.Header>
                    <Card.Body style={{ minHeight: 490 }}>
                      <ListGroup>
                        <ListGroup.Item>
                          <AiOutlineUser style={icon_style} /> Users :
                          <div style={{ float: "right" }}>
                            {this.state.third_card["users"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <BsFillKeyFill style={icon_style} /> Staff :
                          <div style={{ float: "right" }}>
                            {this.state.third_card["staff"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <MdOutlineAdminPanelSettings style={icon_style} />
                          Super Users :
                          <div style={{ float: "right" }}>
                            {this.state.third_card["super users"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <AiOutlineWarning style={icon_style} /> Conflicts :
                          <div style={{ float: "right" }}>
                            {Number(localStorage.getItem("conflicts"))}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <MdPendingActions style={icon_style} /> Pending Groups
                          :
                          <div style={{ float: "right" }}>
                            {Number(localStorage.getItem("groups_data"))}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <HiDocumentSearch style={icon_style} /> Expired
                          Documents :
                          <div style={{ float: "right" }}>
                            {Number(localStorage.getItem("expired_documents"))}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <AiOutlineFileSearch style={icon_style} /> Total
                          Actions Taken :
                          <div style={{ float: "right" }}>
                            {this.state.third_card["total actions taken"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <BsFillFlagFill style={icon_style} /> Countries :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["countries"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FaTint style={icon_style} /> Repair types :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["repair types"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <AiOutlineSetting style={icon_style} /> Services :
                          <div style={{ float: "right" }}>
                            {this.state.second_card["services"]}
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted"></small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Card>
                    <Card.Header>Server's Hardware / Stats :</Card.Header>
                    <Card.Body style={{ minHeight: 490 }}>
                      <ListGroup>
                        <ListGroup.Item>
                          <GoServer style={icon_style} /> Operation System :
                          <div style={{ float: "right" }}>
                            Debian 11 Bullseye
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <SiVirtualbox style={icon_style} /> Type :
                          <div style={{ float: "right" }}> Virtual </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <AiFillTool style={icon_style} /> Uptime :
                          <div style={{ float: "right" }}>
                            <Timer time={this.state.third_card["uptime"]} />
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <BsCpu style={icon_style} /> Number of CPU Cores :
                          <div style={{ float: "right" }}>4</div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <RiDatabase2Fill style={icon_style} />
                          Last Database Backup :
                          <div style={{ float: "right" }}>
                            {this.state.third_card["last database backup"]}
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FaMemory style={icon_style} /> Memory :
                          <div style={{ float: "right" }}> 16 Gb </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FiHardDrive style={icon_style} /> Hard Drive Space :
                          <div style={{ float: "right" }}> 500 Gb </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <MdPlace style={icon_style} /> Locale :
                          <div style={{ float: "right" }}> Greece </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <MdLanguage style={icon_style} /> Language :
                          <div style={{ float: "right" }}> English </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <GiSandsOfTime style={icon_style} /> Time Zone :
                          <div style={{ float: "right" }}>
                            Eastern European Time UTC +2
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted"></small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
              <hr />
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default ReportsSiteStats;
