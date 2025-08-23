// Built-ins
import React from "react";

// Custom Made Components
import AddNewServiceModal from "../../modals/create/add_new_service";
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AllServicesTable from "./service_tables/all_services";
import AccomodationServicesTable from "./service_tables/accomodation_services";
import AirTicketServicesTable from "./service_tables/air_ticket_services";
import AirportPorterageServicesTable from "./service_tables/airport_porterage_services";
import CoachFerryTicketServicesTable from "./service_tables/coach_ferry_ticket_services";
import CruiseServicesTable from "./service_tables/cruise_services";
import DriverAccomodationServicesTable from "./service_tables/driver_accomodation_services";
import FerryTicketServicesTable from "./service_tables/ferry_ticket_services";
import HotelPorterageServicesTable from "./service_tables/hotel_porterage_services";
import LocalGuideServicesTable from "./service_tables/local_guide_services";
import RestaurantServicesTable from "./service_tables/restaurant_services";
import SportEventServicesTable from "./service_tables/sport_event_services";
import TeleferikServicesTable from "./service_tables/teleferik_services";
import TheaterServicesTable from "./service_tables/theater_services";
import TollServicesTable from "./service_tables/toll_services";
import TourLeaderServicesTable from "./service_tables/tour_leader_services";
import TourLeaderAccomodationServicesTable from "./service_tables/tour_leader_accomodation_services";
import TourLeaderAirTicketServicesTable from "./service_tables/tour_leader_air_ticket_services";
import TrainTicketServicesTable from "./service_tables/train_ticket_services";
import TransferServicesTable from "./service_tables/transfer_services";
import OtherServicesTable from "./service_tables/other_services";
import PermitServicesTable from "./service_tables/permit_services";

// Modules / Functions
import { Card, ListGroup } from "react-bootstrap";
import axios from "axios";
import { Grid, Form, Radio, Button, Input } from "semantic-ui-react";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Swal from "sweetalert2";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-tabs/style/react-tabs.css";

// Icons / Images
import { BiHotel, BiFootball, BiTransfer, BiRestaurant } from "react-icons/bi";
import { BsKey } from "react-icons/bs";
import { MdToll } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi";
import { TiGroup } from "react-icons/ti";
import { MdLocalAirport, MdAirplaneTicket } from "react-icons/md";
import { FaHotel, FaTheaterMasks, FaRoute, FaSkiing } from "react-icons/fa";
import { GiTicket, GiShipWheel, GiCartwheel } from "react-icons/gi";
import { SiYourtraveldottv } from "react-icons/si";
import { WiTrain } from "react-icons/wi";
import { AiOutlineBorderlessTable } from "react-icons/ai";
import { BsTable, BsTablet, BsInfoSquare } from "react-icons/bs";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

window.Swal = Swal;

const GET_SERVICES = "http://localhost:8000/api/data_management/all_services/";
const GET_GROUPS = "http://localhost:8000/api/view/get_all_groups/";

const serviceTypes = {
  AC: "Accomodation",
  AT: "Air Ticket",
  AP: "Airport Porterage",
  CFT: "Coach's Ferry Ticket",
  CR: "Cruise",
  DA: "Driver Accomodation",
  FT: "Ferry Ticket",
  HP: "Hotel Porterage",
  LG: "Local Guide",
  RST: "Restaurant",
  SHT: "Sightseeing",
  SE: "Sport Event",
  TE: "Teleferik",
  TH: "Theater",
  TO: "Toll",
  TL: "Tour Leader",
  TLA: "Tour Leader's Accomodation",
  TLAT: "Tour Leader's Air Ticket",
  TT: "Train Ticket",
  TP: "Theme Park",
  TR: "Transfer",
  OTH: "Other",
  PRM: "Permit",
};

class AllServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {},
      is_loaded: false,
      groups_loaded: false,
      all_groups: [],
      all_services: [],
      selectedView: "table",
      selectedRefcode: null,
      currentPage: 1,
      servicesPerPage: 10,
      searchValue: "",
      totalFilteredServices: 0,
      lastClickTime: 0,
      showing: "All",
      forbidden: false,
    };
    this.change_showing = this.change_showing.bind(this);
    this.add_service = this.add_service.bind(this);
  }

  fetchServices() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(GET_SERVICES, {
        headers: headers,
      })

      .then((res) => {
        const allServices = res.data.all_services;
        const filteredServices = allServices.filter((service) =>
          service.refcode
            .toLowerCase()
            .includes(this.state.searchValue.toLowerCase())
        );
        this.setState({
          all_services: res.data.all_services,
          totalFilteredServices: filteredServices.length,
          is_loaded: true,
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

    axios
      .get(GET_GROUPS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_groups: res.data.all_groups,
          is_loaded: true,
          groups_loaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  componentDidMount() {
    this.fetchServices();
    if (window.innerWidth < 992) {
      this.setState({
        selectedView: "tablet",
      });
    } else {
      this.setState({
        selectedView: "table",
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchValue !== this.state.searchValue) {
      this.fetchServices();
    }
  }

  change_showing = (e) => {
    this.setState({
      showing: e.target.innerText,
    });
  };

  add_service() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(GET_SERVICES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_services: res.data.all_services,
          is_loaded: true,
        });
      });
  }

  setView = (view) => {
    this.setState({
      selectedView: view,
    });
  };

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  setSelectedRefcode = (refcode) => {
    this.setState({
      selectedRefcode: refcode,
    });
  };

  handleDoubleTap = (service_id) => {
    const { lastClickTime } = this.state;
    const currentTime = new Date().getTime();
    const tapTimeDifference = currentTime - lastClickTime;

    if (tapTimeDifference < 300) {
      window.location.href = "/group_management/group/" + service_id;
    }

    this.setState({ lastClickTime: currentTime });
  };

  render() {
    const { all_services, currentPage, searchValue, totalFilteredServices } =
      this.state;

    // Filter the all_services array based on the search term
    const filteredServices = all_services.filter((service) =>
      service.refcode.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Calculate the index range of services for the current page from the filtered array
    const indexOfLastService = currentPage * this.state.servicesPerPage;
    const indexOfFirstService = indexOfLastService - this.state.servicesPerPage;
    const currentServices = filteredServices.slice(
      indexOfFirstService,
      indexOfLastService
    );

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_services")}
          <div style={{ marginLeft: 20, width: 80, borderRadius: 10 }}>
            <Button
              id="table_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.state.selectedView === "table" ? "#e3e3e3" : "",
              }}
              onClick={() => this.setView("table")}
            >
              <BsTable
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
            <Button
              id="tablet_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.state.selectedView === "tablet" ? "#e3e3e3" : "",
              }}
              onClick={() => this.setView("tablet")}
            >
              <BsTablet
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
          </div>
          {this.state.forbidden ? (
            <>{forbidden("All Services")}</>
          ) : this.state.is_loaded ? (
            this.state.selectedView === "table" ? (
              <>
                <Grid columns={2} divided style={{ widht: "95%" }} stackable>
                  <Grid.Column
                    width={3}
                    style={{
                      marginLeft: 20,
                      marginRight: 10,
                      marginBottom: 20,
                    }}
                  >
                    <Form>
                      <ul>
                        <li>
                          <AiOutlineBorderlessTable
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="All"
                            name="radioGroup"
                            value="All"
                            checked={this.state.showing === "All"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <BiHotel
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Accomodation"
                            name="radioGroup"
                            value="Accomodation"
                            checked={this.state.showing === "Accomodation"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <MdAirplaneTicket
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Air Tickets"
                            name="Air Tickets"
                            value=""
                            checked={this.state.showing === "Air Tickets"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <MdLocalAirport
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Airport Porterage"
                            name="radioGroup"
                            value="Airport Porterage"
                            checked={this.state.showing === "Airport Porterage"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <GiTicket
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Coach's Ferry Tickets"
                            name="radioGroup"
                            value=""
                            checked={
                              this.state.showing === "Coach's Ferry Tickets"
                            }
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <GiShipWheel
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Cruises"
                            name="radioGroup"
                            value="Cruises"
                            checked={this.state.showing === "Cruises"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <GiCartwheel
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Driver's Accomodation"
                            name="radioGroup"
                            value="Driver's Accomodation"
                            checked={
                              this.state.showing === "Driver's Accomodation"
                            }
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <HiOutlineTicket
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Ferry Tickets"
                            name="radioGroup"
                            value="Ferry Tickets"
                            checked={this.state.showing === "Ferry Tickets"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <FaHotel
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Hotel Porterage"
                            name="radioGroup"
                            value="Hotel Porterage"
                            checked={this.state.showing === "Hotel Porterage"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <SiYourtraveldottv
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Local Guides"
                            name="radioGroup"
                            value="Local Guides"
                            checked={this.state.showing === "Local Guides"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <BiRestaurant
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Restaurants"
                            name="radioGroup"
                            value="Restaurants"
                            checked={this.state.showing === "Restaurants"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <BiFootball
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Sport Events"
                            name="radioGroup"
                            value="Sport Events"
                            checked={this.state.showing === "Sport Events"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <BiTransfer
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Teleferiks"
                            name="radioGroup"
                            value="Teleferiks"
                            checked={this.state.showing === "Teleferiks"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <FaTheaterMasks
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Theaters"
                            name="radioGroup"
                            value="Theaters"
                            checked={this.state.showing === "Theaters"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <MdToll
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Tolls"
                            name="radioGroup"
                            value="Tolls"
                            checked={this.state.showing === "Tolls"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <TiGroup
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Tour Leaders"
                            name="radioGroup"
                            value="Tour Leaders"
                            checked={this.state.showing === "Tour Leaders"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <BiHotel
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Tour Leader's Accomodation"
                            name="radioGroup"
                            value="Tour Leader's Accomodation"
                            checked={
                              this.state.showing ===
                              "Tour Leader's Accomodation"
                            }
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <MdAirplaneTicket
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Tour Leader's Air Tickets"
                            name="radioGroup"
                            value="Tour Leader's Air Tickets"
                            checked={
                              this.state.showing === "Tour Leader's Air Tickets"
                            }
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <WiTrain
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Train Tickets"
                            name="radioGroup"
                            value="Train Tickets"
                            checked={this.state.showing === "Train Tickets"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <FaRoute
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Transfers"
                            name="radioGroup"
                            value="Transfers"
                            checked={this.state.showing === "Transfers"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <BsKey
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Permits"
                            name="radioGroup"
                            value="Permits"
                            checked={this.state.showing === "Permits"}
                            onChange={this.change_showing}
                          />
                        </li>
                        <li>
                          <FaSkiing
                            style={{
                              fontSize: "1.2em",
                              marginBottom: 5,
                              color: "#F3702D",
                              marginRight: 10,
                            }}
                          />
                          <Radio
                            label="Other Services"
                            name="radioGroup"
                            value="Other Services"
                            checked={this.state.showing === "Other Services"}
                            onChange={this.change_showing}
                          />
                        </li>
                      </ul>
                    </Form>
                  </Grid.Column>

                  <Grid.Column width={12}>
                    {/* All */}
                    {this.state.showing === "All" ? (
                      <AllServicesTable
                        data={this.state.all_services}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Accomodation */}
                    {this.state.showing === "Accomodation" ? (
                      <AccomodationServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "AC"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Air Tickets */}
                    {this.state.showing === "Air Tickets" ? (
                      <AirTicketServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "AT"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Airport Porterage */}
                    {this.state.showing === "Airport Porterage" ? (
                      <AirportPorterageServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "AP"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Coach's Ferry Tickets */}
                    {this.state.showing === "Coach's Ferry Tickets" ? (
                      <CoachFerryTicketServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "CFT"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Cruises */}
                    {this.state.showing === "Cruises" ? (
                      <CruiseServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "CR"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Driver's Accomodation */}
                    {this.state.showing === "Driver's Accomodation" ? (
                      <DriverAccomodationServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "DA"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Ferry Tickets */}
                    {this.state.showing === "Ferry Tickets" ? (
                      <FerryTicketServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "FT"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Ferry Tickets */}
                    {this.state.showing === "Hotel Porterage" ? (
                      <HotelPorterageServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "HP"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Local Guides */}
                    {this.state.showing === "Local Guides" ? (
                      <LocalGuideServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "LG"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Restaurants */}
                    {this.state.showing === "Restaurants" ? (
                      <RestaurantServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "RST"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Sport Events */}
                    {this.state.showing === "Sport Events" ? (
                      <SportEventServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "SE"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Teleferiks */}
                    {this.state.showing === "Teleferiks" ? (
                      <TeleferikServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TE"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Theaters */}
                    {this.state.showing === "Theaters" ? (
                      <TheaterServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TH"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Tolls */}
                    {this.state.showing === "Tolls" ? (
                      <TollServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TO"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Tour Leaders */}
                    {this.state.showing === "Tour Leaders" ? (
                      <TourLeaderServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TL"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Tour Leader's Accomodation */}
                    {this.state.showing === "Tour Leader's Accomodation" ? (
                      <TourLeaderAccomodationServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TLA"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Tour Leader's Air Tickets */}
                    {this.state.showing === "Tour Leader's Air Tickets" ? (
                      <TourLeaderAirTicketServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TLAT"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Tour Leader's Air Tickets */}
                    {this.state.showing === "Train Tickets" ? (
                      <TrainTicketServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TT"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Transfers */}
                    {this.state.showing === "Transfers" ? (
                      <TransferServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "TR"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Other Services */}
                    {this.state.showing === "Other Services" ? (
                      <OtherServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "OTH"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}

                    {/* Permits */}
                    {this.state.showing === "Permits" ? (
                      <PermitServicesTable
                        data={this.state.all_services.filter(
                          (service) => service.service_type === "PRM"
                        )}
                        add_service={this.add_service}
                      />
                    ) : (
                      ""
                    )}
                    <AddNewServiceModal
                      add_service={this.add_service}
                      is_loaded={this.state.is_loaded}
                      all_services={this.state.all_services}
                      all_groups={this.state.all_groups}
                      loaded={this.state.groups_loaded}
                      redir={true}
                    />
                  </Grid.Column>
                </Grid>
              </>
            ) : (
              <>
                <div style={{ marginLeft: 20 }}>
                  <Input
                    icon="search"
                    placeholder="Search Name..."
                    style={{ margin: 0 }}
                    onChange={(e) =>
                      this.setState({ searchValue: e.target.value })
                    }
                    value={this.state.searchValue}
                  />
                </div>
                <Grid columns={2} stackable style={{ marginLeft: 20 }}>
                  <Grid.Row>
                    <Grid.Column width={6}>
                      {currentServices.map((service) => (
                        <>
                          <Button
                            color={
                              this.state.selectedRefcode === service.refcode
                                ? "blue"
                                : "vk"
                            }
                            onClick={(e) => {
                              this.setSelectedRefcode(e.target.innerText);
                              this.handleDoubleTap(service.refcode);
                            }}
                            style={{ width: 300, margin: 10 }}
                          >
                            {service.refcode}
                          </Button>
                          <br />
                        </>
                      ))}
                    </Grid.Column>
                    <Grid.Column width={6}>
                      {this.state.all_services
                        .filter(
                          (service) =>
                            service.refcode === this.state.selectedRefcode
                        )
                        .map((service) => (
                          <>
                            <Card width={4}>
                              <Card.Header>
                                <BsInfoSquare
                                  style={{
                                    color: "#F3702D",
                                    fontSize: "1.5em",
                                    marginRight: "0.5em",
                                  }}
                                />
                                Service Information
                              </Card.Header>
                              <Card.Body>
                                <ListGroup>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>ID</div>
                                    <div className={"info_span"}>
                                      <a
                                        href={
                                          "/data_management/service/" +
                                          service.id
                                        }
                                        basic
                                        id="cell_link"
                                      >
                                        {service.id}
                                      </a>
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Refcode</div>
                                    <div className={"info_span"}>
                                      {service.refcode}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Type</div>
                                    <div className={"info_span"}>
                                      {serviceTypes[service.service_type]}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Price</div>
                                    <div className={"info_span"}>
                                      {service.price === "" ||
                                      service.price === null
                                        ? "N/A"
                                        : service.price}
                                    </div>
                                  </ListGroup.Item>
                                  <ListGroup.Item>
                                    <div className={"info_descr"}>Date</div>
                                    <div className={"info_span"}>
                                      {moment(service.date).format(
                                        "DD/MM/yyyy"
                                      )}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Description
                                    </div>
                                    <div className={"info_span"}>
                                      {service.description}
                                    </div>
                                  </ListGroup.Item>

                                  <ListGroup.Item>
                                    <div className={"info_descr"}>
                                      Start Time
                                    </div>
                                    <div className={"info_span"}>
                                      {service.start_time
                                        ? service.start_time
                                        : "N/A"}
                                    </div>
                                  </ListGroup.Item>
                                </ListGroup>
                              </Card.Body>
                              <Card.Footer></Card.Footer>
                            </Card>
                          </>
                        ))}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <ReactPaginate
                  previousLabel={"<-"}
                  className="react-pagination"
                  nextLabel={"->"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={Math.ceil(
                    totalFilteredServices / this.state.servicesPerPage
                  )}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageChange}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages react-pagination"}
                  activeClassName={"active"}
                />
              </>
            )
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default AllServices;
