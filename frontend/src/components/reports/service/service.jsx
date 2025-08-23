// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import { BiHotel, BiFootball, BiTransfer, BiRestaurant } from "react-icons/bi";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { BsKey } from "react-icons/bs";
import { MdToll } from "react-icons/md";
import { Grid } from "semantic-ui-react";
import { HiOutlineTicket } from "react-icons/hi";
import { TiGroup } from "react-icons/ti";
import { MdLocalAirport, MdAirplaneTicket } from "react-icons/md";
import { FaHotel, FaTheaterMasks, FaRoute, FaSkiing } from "react-icons/fa";
import { GiTicket, GiShipWheel, GiCartwheel } from "react-icons/gi";
import { SiYourtraveldottv } from "react-icons/si";
import { WiTrain } from "react-icons/wi";
import { AiOutlineBorderlessTable } from "react-icons/ai";

// Custom Made Components
import MiniPieChart from "./mini_pie_chart";
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import axios from "axios";
import { ListGroup, Card } from "react-bootstrap";
import Swal from "sweetalert2";

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

const REPORTS_SERVICES = "http://localhost:8000/api/reports/services/";

let icon_style = {
  fontSize: "1.2em",
  marginBottom: 5,
  color: "#F3702D",
  marginRight: 10,
};

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
      .get(REPORTS_SERVICES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          first_card: res.data.first_card,
          second_card: res.data.second_card,
          third_card: res.data.third_card,
          fourth_card: res.data.fourth_card,
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
    const officeBasedData = [
      {
        title: "Accomodation",
        value: this.state.first_card["accomodation"],
        color: "#003300",
      },
      {
        title: "Air Tickets",
        value: this.state.first_card["air tickets"],
        color: "#004d00",
      },
      {
        title: "Airport Porterage",
        value: this.state.first_card["airport porterage"],
        color: "#006600",
      },
      {
        title: "Coach's Ferry Tickets",
        value: this.state.first_card["coach's ferry tickets"],
        color: "#008000",
      },
      {
        title: "Cruises",
        value: this.state.first_card["cruises"],
        color: "#009900",
      },
      {
        title: "Driver's Accomodation",
        value: this.state.first_card["driver's accomodation"],
        color: "#00b300",
      },
      {
        title: "Ferry Tickets",
        value: this.state.first_card["ferry tickets"],
        color: "#00cc00",
      },
      {
        title: "Hotel Porterage",
        value: this.state.first_card["hotel porterage"],
        color: "#00e600",
      },
      {
        title: "Local Guides",
        value: this.state.first_card["local guides"],
        color: "#00ff00",
      },
      {
        title: "Restaurants",
        value: this.state.first_card["restaurants"],
        color: "#00004d",
      },
      {
        title: "Sport Events",
        value: this.state.first_card["sport events"],
        color: "#000066",
      },
      {
        title: "Teleferiks",
        value: this.state.first_card["teleferiks"],
        color: "#000080",
      },
      {
        title: "Theaters",
        value: this.state.first_card["theaters"],
        color: "#000099",
      },
      {
        title: "Tolls",
        value: this.state.first_card["tolls"],
        color: "#0000cc",
      },
      {
        title: "Tour Leaders",
        value: this.state.first_card["tour leaders"],
        color: "#0000e6",
      },
      {
        title: "Tour Leader's Accomodation",
        value: this.state.first_card["tour leader's accomodation"],
        color: "#0000ff",
      },
      {
        title: "Tour Leader's Air Tickets",
        value: this.state.first_card["tour leader's air tickets"],
        color: "#1a1aff",
      },
      {
        title: "Train Tickets",
        value: this.state.first_card["train tickets"],
        color: "#4700b3",
      },
      {
        title: "Transfers",
        value: this.state.first_card["transfers"],
        color: "#5200cc",
      },
      {
        title: "Permits",
        value: this.state.first_card["permits"],
        color: "#5c00e6",
      },
      {
        title: "Other Services",
        value: this.state.first_card["other services"],
        color: "#6600ff",
      },
    ];

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_service")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Service")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={3} divided stackable>
                <Grid.Row style={{ marginLeft: 2 }}>
                  <Grid.Column width={5}>
                    <Card>
                      <Card.Header> Total Services Per Type</Card.Header>
                      <Card.Body>
                        <ul style={{ columns: 2 }}>
                          <li>
                            <ListGroup>
                              <ListGroup.Item>
                                <AiOutlineBorderlessTable style={icon_style} />
                                All :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["all services"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <BiHotel style={icon_style} /> Accomodation :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["accomodation"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <MdAirplaneTicket style={icon_style} /> Air
                                Tickets :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["air tickets"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <MdLocalAirport style={icon_style} /> Airport
                                Porterage :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["airport porterage"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <GiTicket style={icon_style} /> Coach's Ferry
                                Tickets :
                                <div style={{ float: "right" }}>
                                  {
                                    this.state.first_card[
                                      "coach's ferry tickets"
                                    ]
                                  }
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <GiShipWheel style={icon_style} />
                                Cruises :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["cruises"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <GiCartwheel style={icon_style} /> Driver's
                                Accomodation :
                                <div style={{ float: "right" }}>
                                  {
                                    this.state.first_card[
                                      "driver's accomodation"
                                    ]
                                  }
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <HiOutlineTicket style={icon_style} />
                                Ferry Tickets :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["ferry tickets"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <FaHotel style={icon_style} /> Hotel Porterage :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["hotel porterage"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <SiYourtraveldottv style={icon_style} /> Local
                                Guides :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["local guides"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <BiRestaurant style={icon_style} /> Restaurants
                                :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["restaurants"]}
                                </div>
                              </ListGroup.Item>
                            </ListGroup>
                          </li>
                          <li>
                            <ListGroup>
                              <ListGroup.Item>
                                <BiFootball style={icon_style} /> Sport Events :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["sport events"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <BiTransfer style={icon_style} />
                                Teleferiks :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["teleferiks"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <FaTheaterMasks style={icon_style} />
                                Theaters :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["theaters"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <MdToll style={icon_style} />
                                Tolls :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["tolls"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <TiGroup style={icon_style} />
                                Tour Leaders :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["tour leaders"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <BiHotel style={icon_style} />
                                Tour Leader's Acc. :
                                <div style={{ float: "right" }}>
                                  {
                                    this.state.first_card[
                                      "tour leader's accomodation"
                                    ]
                                  }
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <MdAirplaneTicket style={icon_style} /> Tour
                                Leader's Air Tickets
                                <div style={{ float: "right" }}>
                                  {
                                    this.state.first_card[
                                      "tour leader's air tickets"
                                    ]
                                  }
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <WiTrain style={icon_style} /> Train Tickets :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["train tickets"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <FaRoute style={icon_style} /> Transfers :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["transfers"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <BsKey style={icon_style} /> Permits :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["permits"]}
                                </div>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <FaSkiing style={icon_style} />
                                Other Services :
                                <div style={{ float: "right" }}>
                                  {this.state.first_card["other services"]}
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
                  <Grid.Column width={7}>
                    <Card>
                      <Card.Header> Chart</Card.Header>
                      <Card.Body>
                        <MiniPieChart data={officeBasedData} animate />
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted">
                          <ul style={{ columns: 4 }}>
                            {officeBasedData.map((color_V) => (
                              <li style={{ color: color_V["color"] }}>
                                {color_V["title"]}
                              </li>
                            ))}
                          </ul>
                        </small>
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card>
                      <Card.Header>Other stats</Card.Header>
                      <Card.Body>
                        <ListGroup>
                          <ListGroup.Item>
                            Lowest priced service :
                            <div style={{ float: "right" }}>
                              {this.state.second_card["lowest priced service"]}
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Highest priced service :
                            <div style={{ float: "right" }}>
                              {this.state.second_card["highest priced service"]
                                ? this.state.second_card[
                                    "highest priced service"
                                  ]
                                : "N/A"}
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Average price per service :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "average price per service"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount of services :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total amount of services"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Last service added :
                            <div style={{ float: "right" }}>
                              {this.state.second_card["last service added"]
                                ? this.state.second_card["last service added"]
                                : "N/A"}
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total cost of all services :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total cost of all services"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Most used service type :
                            <div style={{ float: "right" }}>
                              {this.state.second_card["most used service type"]}
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount of Single rooms :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total amount of single rooms"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount of Double rooms :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total amount of double rooms"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount of Twin rooms :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total amount of twin rooms"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount of Triple rooms :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total amount of triple rooms"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount of Quadrable rooms :
                            <div style={{ float: "right" }}>
                              {
                                this.state.second_card[
                                  "total amount of quadrable rooms"
                                ]
                              }
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                      <Card.Footer>
                        <small className="text-muted"></small>
                      </Card.Footer>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
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
