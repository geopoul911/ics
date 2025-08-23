// Built-ins
import React, { useState } from "react";

// Modules / Functions
import { Button } from "semantic-ui-react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import AddExtraField from "./add_extra_field";
import DatePicker from "react-datepicker";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Icons
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from "react-icons/ai";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const GET_AGENTS = "http://localhost:8000/api/view/get_all_agents/";
const GET_CLIENTS = "http://localhost:8000/api/view/get_all_clients/";
const GET_LEADERS = "http://localhost:8000/api/view/get_group_leaders/";
const GET_HOTELS = "http://localhost:8000/api/view/get_all_hotels/";
const GET_AIRLINES = "http://localhost:8000/api/view/get_all_airlines/";
const GET_GROUND_HANDLING_COMPANIES = "http://localhost:8000/api/view/get_all_dmcs/";
const GET_FERRY_TICKET_AGENCIES = "http://localhost:8000/api/view/get_all_ferry_ticket_agencies/";
const GET_CRUISING_COMPANIES = "http://localhost:8000/api/view/get_all_cruising_companies/";
const GET_TOUR_LEADERS = "http://localhost:8000/api/view/get_group_leaders/";
const GET_GUIDES = "http://localhost:8000/api/view/get_all_guides/";
const GET_RESTAURANTS = "http://localhost:8000/api/view/get_all_restaurants/";
const GET_ENTERTAINMENT_SUPPLIERS = "http://localhost:8000/api/view/get_all_entertainment_suppliers/";
const GET_SPORT_EVENT_SUPPLIERS = "http://localhost:8000/api/view/get_all_sport_event_suppliers/";
const GET_TELEFERIK_COMPANIES = "http://localhost:8000/api/view/get_all_teleferik_companies/";
const GET_THEATERS = "http://localhost:8000/api/view/get_all_theaters/";
const GET_TRAIN_TICKET_AGENCIES = "http://localhost:8000/api/view/get_all_train_ticket_agencies/";
const GET_COACH_OPERATORS = "http://localhost:8000/api/view/get_all_coach_operators/";
const ADD_TRAVELDAY_SERVICE = "http://localhost:8000/api/groups/create_travelday_service/";

function getRefcode(pathname) {
  return pathname.split("/")[3];
}

const ServiceOptions = [
  "Accommodation",
  "Air Ticket",
  "Ferry Ticket",
  "Local Guide",
  "Restaurant",
  "Shows & Entertainment",
  "Sightseeing",
  "Tour Leader",
  "Train Ticket",
  "Transfer",
];

const AllServiceOptions = [
  "Accommodation",
  "Air Ticket",
  "Airport Porterage",
  "Coach's Ferry Ticket",
  "Cruise",
  "Driver Accommodation",
  "Ferry Ticket",
  "Hotel Porterage",
  "Local Guide",
  "Restaurant",
  "Shows & Entertainment",
  "Sport Event",
  "Sightseeing",
  "Teleferik",
  "Theater",
  "Tolls",
  "Tour Leader",
  "Tour Leader's Accommodation",
  "Tour Leader's Air Ticket",
  "Train Ticket",
  "Transfer",
  "Other",
  "Permit",
];

let servicesIncludingHost = [
  "Accommodation",
  "Air Ticket",
  "Coach's Ferry Ticket",
  "Cruise",
  "Driver Accommodation",
  "Ferry Ticket",
  "Local Guide",
  "Restaurant",
  "Shows & Entertainment",
  "Sport Event",
  "Teleferik",
  "Theater",
  "Tour Leader's Accommodation",
  "Tour Leader's Air Ticket",
  "Train Ticket",
  "Permit",
]

let hostOptions = [
  'Agent',
  'Airline',
  'Airport',
  'Client',
  'Cruising Company',
  'DMC',
  'Entertainment Supplier',
  'Ferry Ticket Agency',
  'Group Leader',
  'Guide',
  'Hotel',
  'Restaurant',
  'Sport Event Supplier',
  'Teleferik Company',
  'Theater',
  'Train Ticket Agency',
]

let AllHotels = [];
let AllAirlines = [];
let AllDMCs = [];
let AllFerryTicketAgencies = [];
let AllCruisingCompanies = [];
let AllGuides = [];
let AllRestaurants = [];
let AllEntertainmentSuppliers = [];
let AllSportEventSuppliers = [];
let AllTeleferikCompanies = [];
let AllTheaters = [];
let AllTrainTicketAgencies = [];
let AllTourLeaders = [];
let AllCoachOperators = [];
let AllAgents = [];
let AllClients = [];
let AllLeaders = [];

const resetArrays = () => {
  AllHotels.length = 0;
  AllAirlines.length = 0;
  AllDMCs.length = 0;
  AllFerryTicketAgencies.length = 0;
  AllCruisingCompanies.length = 0;
  AllGuides.length = 0;
  AllRestaurants.length = 0;
  AllEntertainmentSuppliers.length = 0;
  AllSportEventSuppliers.length = 0;
  AllTeleferikCompanies.length = 0;
  AllTheaters.length = 0;
  AllTrainTicketAgencies.length = 0;
  AllTourLeaders.length = 0;
  AllCoachOperators.length = 0;
  AllAgents.length = 0;
  AllClients.length = 0;
  AllLeaders.length = 0;
  return;
};

function AddNewService(props) {
  const getAllHotels = () => {
    axios
      .get(GET_HOTELS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_hotels.map((hotel) => AllHotels.push(hotel));
      });
  };

  const getAllAirlines = () => {
    axios
      .get(GET_AIRLINES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_airlines.map((airline) => AllAirlines.push(airline));
      });
  };

  const getAllTourLeaders = () => {
    axios
      .get(GET_TOUR_LEADERS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_leaders.map((leader) => AllTourLeaders.push(leader));
      });
  };

  const getAllDMCs = () => {
    axios
      .get(GET_GROUND_HANDLING_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_dmcs.map((dmc) => AllDMCs.push(dmc));
      });
  };

  const getAllFerryTicketAgencies = () => {
    axios
      .get(GET_FERRY_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_ferry_ticket_agencies.map((ferry_ticket_agency) =>
          AllFerryTicketAgencies.push(ferry_ticket_agency)
        );
      });
  };

  const getAllCruisingCompanies = () => {
    axios
      .get(GET_CRUISING_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_cruising_companies.map((cruising_company) =>
          AllCruisingCompanies.push(cruising_company)
        );
      });
  };

  const getAllGuides = () => {
    axios
      .get(GET_GUIDES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_guides.map((guide) => AllGuides.push(guide));
      });
  };

  const getAllRestaurants = () => {
    axios
      .get(GET_RESTAURANTS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_restaurants.map((restaurant) =>
          AllRestaurants.push(restaurant)
        );
      });
  };

  const getAllSportEventSuppliers = () => {
    axios
      .get(GET_SPORT_EVENT_SUPPLIERS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_sport_event_suppliers.map((sport_event_supplier) =>
          AllSportEventSuppliers.push(sport_event_supplier)
        );
      });
  };

  const getAllEntertainmentSuppliers = () => {
    axios
      .get(GET_ENTERTAINMENT_SUPPLIERS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_entertainment_suppliers.map((entertainment_supplier) =>
          AllEntertainmentSuppliers.push(entertainment_supplier)
        );
      });
  };

  const getAllTeleferikCompanies = () => {
    axios
      .get(GET_TELEFERIK_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_teleferik_companies.map((teleferik_company) =>
          AllTeleferikCompanies.push(teleferik_company)
        );
      });
  };

  const getAllTheaters = () => {
    axios
      .get(GET_THEATERS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_theaters.map((theater) => AllTheaters.push(theater));
      });
  };

  const getAllTrainTicketAgencies = () => {
    axios
      .get(GET_TRAIN_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_train_ticket_agencies.map((train_ticket_agency) =>
          AllTrainTicketAgencies.push(train_ticket_agency)
        );
      });
  };

  const getAllCoachOperators = () => {
    axios
      .get(GET_COACH_OPERATORS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_coach_operators.map((coach_operator) =>
          AllCoachOperators.push(coach_operator)
        );
      });
  };

  const getAllAgents = () => {
    axios
      .get(GET_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_agents.map((agent) =>
          AllAgents.push(agent)
        );
      });
  };
  const getAllClients = () => {
    axios
      .get(GET_CLIENTS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_clients.map((client) =>
          AllClients.push(client)
        );
      });
  };
  const getAllLeaders = () => {
    axios
      .get(GET_LEADERS, {
        headers: headers,
      })
      .then((res) => {
        res.data.all_leaders.map((leader) =>
          AllLeaders.push(leader)
        );
      });
  };


  const [showAll, setShowAll] = React.useState(false);
  const [selectedServiceType, setSelectedServiceType] = React.useState("");
  const handleSelectedServiceType = (e) => {
    setSelectedServiceType(e.target.value);
  };
  const [Description, setDescription] = useState("");
  let [startTime, setStartTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currency, setCurrency] = useState("EUR");
  const [price, setPrice] = useState(0);
  const [Hotel, setHotel] = useState();
  const [airline, setAirline] = useState();
  const [dmc, setDMC] = useState();
  const [ferryTicketAgency, setFerryTicketAgency] = useState();
  const [tourLeader, setTourLeader] = useState();
  const [cruisingCompany, setCruisingCompany] = useState();
  const [guide, setGuide] = useState();
  const [restaurant, setRestaurant] = useState();
  const [entertainmentSupplier, setEntertainmentSupplier] = useState();
  const [sportEventSupplier, setSportEventSupplier] = useState();
  const [product, setProduct] = useState('');
  const [teleferikCompany, setTeleferikCompany] = useState();
  const [theater, setTheater] = useState();
  const [trainTicketAgency, setTrainTicketAgency] = useState();
  const [coachOperator, setCoachOperator] = useState();
  const [route, setRoute] = useState();
  const [bookingRef, setBookingRef] = useState();
  const [hostType, setHostType] = useState();
  const [hostName, setHostName] = useState();

  const getHostOptions = (host) => {
    if (host === 'Agent') {
      return AllAgents
    } else if (host === 'Airline') {
      return AllAirlines
    } else if (host === 'Airport') {
      return AllCoachOperators
    } else if (host === 'Client') {
      return AllClients
    } else if (host === 'Cruising Company') {
      return AllCruisingCompanies
    } else if (host === 'DMC') {
      return AllDMCs
    } else if (host === 'Entertainment Supplier') {
      return AllEntertainmentSuppliers
    } else if (host === 'Ferry Ticket Agency') {
      return AllFerryTicketAgencies
    } else if (host === 'Group Leader') {
      return AllLeaders
    } else if (host === 'Guide') {
      return AllGuides
    } else if (host === 'Hotel') {
      return AllHotels
    } else if (host === 'Restaurant') {
      return AllRestaurants
    } else if (host === 'Sport Event Supplier') {
      return AllSportEventSuppliers
    } else if (host === 'Teleferik Company') {
      return AllTeleferikCompanies
    } else if (host === 'Theater') {
      return AllTheaters
    } else if (host === 'Train Ticket Agency') {
      return AllTrainTicketAgencies
    }
    return [];
  }

  const AddTraveldayService = () => {

    axios({
      method: "post",
      url: ADD_TRAVELDAY_SERVICE,
      headers: headers,
      data: {
        dates: props.dates,
        time: moment(startTime).format("HH:mm"),
        refcode: getRefcode(window.location.pathname),
        service_type: selectedServiceType,
        description: Description,
        price: price,
        currency: currency,
        entertainment_product: product,
        hotel: Hotel,
        airline: airline,
        dmc: dmc,
        tour_leader: tourLeader,
        ferry_ticket_agency: ferryTicketAgency,
        cruising_company: cruisingCompany,
        guide: guide,
        restaurant: restaurant,
        sport_event_supplier: sportEventSupplier,
        teleferik_company: teleferikCompany,
        theater: theater,
        train_ticket_agency: trainTicketAgency,
        coach_operator: coachOperator,
        route:  route,
        booking_ref: bookingRef,
        entertainment_supplier: entertainmentSupplier,
        host_name: hostName,
        host_type: hostType,
      },
    })
    .then((res) => {
      props.update_state(res.data.model);
      setSelectedServiceType("");
    })
    .catch((e) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.response.data.errormsg,
      });
    });
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          getAllHotels();
          getAllAirlines();
          getAllDMCs();
          getAllFerryTicketAgencies();
          getAllCruisingCompanies();
          getAllGuides();
          getAllRestaurants();
          getAllEntertainmentSuppliers();
          getAllSportEventSuppliers();
          getAllTeleferikCompanies();
          getAllTheaters();
          getAllTrainTicketAgencies();
          getAllTourLeaders();
          getAllCoachOperators();
          getAllAgents();
          getAllClients();
          getAllLeaders();
          setDescription("");
          setSelectedServiceType("");
          setStartTime(new Date());
          setCurrency("EUR");
          setPrice(0);
          setHotel();
          setAirline();
          setDMC();
          setFerryTicketAgency();
          setTourLeader();
          setCruisingCompany();
          setGuide();
          setRestaurant();
          setSportEventSupplier();
          setProduct();
          setTeleferikCompany();
          setTheater();
          setTrainTicketAgency();
          setCoachOperator();
          setRoute();
          handleShow();
        }}
      >
        Create New Service
      </Button>
      <Modal
        show={show}
        onHide={() => {
          resetArrays();
          handleClose();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add a new service for {getRefcode(window.location.pathname)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Select dates:
            </Form.Label>
            <Col sm="10">
              <ul style={{ columns: 4 }}>
                {props.is_loaded && props.group.group_travelday.length > 0 ? (
                  <>
                    <label>
                      <Form.Check
                        onChange={props.toggle_all_days}
                        type={"checkbox"}
                      />
                    </label>
                    All Dates
                  </>
                ) : (
                  ""
                )}
                {props.is_loaded
                  ? props.group.group_travelday.map((j, k) => (
                      <li key={j.id} value={j.id}>
                        <label>
                          <Form.Check
                            onChange={props.toggle_amenity_check_box}
                            type={"checkbox"}
                            name={j.date}
                            checked={props.dates[j.date]}
                          />
                        </label>
                        {j.date}
                      </li>
                    ))
                  : ""}
              </ul>
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Select Type:
            </Form.Label>
            <Col sm="10">
              {showAll ? (
                <>
                  <select
                    className="form-control"
                    style={{ width: "50%", display: "inline" }}
                    defaultValue={props.defaultValue}
                    onChange={(e) => handleSelectedServiceType(e)}
                  >
                    <option selected disabled hidden>
                      Choose from available types
                    </option>
                    {AllServiceOptions.map((j, k) => (
                      <option key={j.id} value={j.id}>
                        {j}
                      </option>
                    ))}
                  </select>
                  <AiOutlineMinusSquare
                    onClick={() => setShowAll(false)}
                    title="show all service types"
                    style={{
                      float: "right",
                      color: "#F3702D",
                      fontSize: "1.5em",
                      margin: 5,
                      fontWeight: "bold",
                    }}
                  />
                  <small style={{ float: "right", margin: 8 }}>Show Less</small>
                </>
              ) : (
                <>
                  <select
                    className="form-control"
                    style={{ width: "50%", display: "inline" }}
                    defaultValue={props.defaultValue}
                    onChange={(e) => handleSelectedServiceType(e)}
                  >
                    <option selected disabled hidden>
                      Choose from available types
                    </option>
                    {ServiceOptions.map((j, k) => (
                      <option key={j.id} value={j.id}>
                        {j}
                      </option>
                    ))}
                  </select>
                  <AiOutlinePlusSquare
                    onClick={() => setShowAll(true)}
                    title="show all service types"
                    style={{
                      float: "right",
                      color: "#F3702D",
                      fontSize: "1.5em",
                      margin: 5,
                      fontWeight: "bold",
                    }}
                  />
                  <small style={{ float: "right", margin: 8 }}>Show More</small>
                </>
              )}
            </Col>
            <div className="grey-powerline"></div>

            {servicesIncludingHost.includes(selectedServiceType) ? (
              <>
                <Form.Label column sm="2">
                  Host Type:
                </Form.Label>
                <Col sm="10">
                  <select
                    className="form-control"
                    style={{ width: "50%", display: "inline" }}
                    onChange={(e) => setHostType(e.target.value)}
                  >
                    <option selected disabled hidden>
                      Choose from available host types
                    </option>
                    {hostOptions.map((j, k) => (
                      <option key={j.id} value={j.id}>
                        {j}
                      </option>
                    ))}
                  </select>
                </Col>
                <Form.Label column sm="2">
                  Host:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={getHostOptions(hostType)}
                    disableClearable
                    onChange={(e) => {
                      setHostName(e.target.innerText);
                    }}
                    style={{ width: 300, marginTop: 10 }}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Host" variant="outlined" />
                    )}
                  />
                </Col>
                <div className="grey-powerline"></div>
              </>
            ) : (
              ""
            )}










            {selectedServiceType !== "" ? (
              <>
                <Form.Label column sm="2">
                  Supplier:
                </Form.Label>
                <Col sm="10">
                  <AddExtraField
                    AllHotels={AllHotels}
                    AllAirlines={AllAirlines}
                    AllDMCs={AllDMCs}
                    AllFerryTicketAgencies={AllFerryTicketAgencies}
                    AllCruisingCompanies={AllCruisingCompanies}
                    AllGuides={AllGuides}
                    AllRestaurants={AllRestaurants}
                    AllSportEventSuppliers={AllSportEventSuppliers}
                    AllEntertainmentSuppliers={AllEntertainmentSuppliers}
                    AllTeleferikCompanies={AllTeleferikCompanies}
                    AllTheaters={AllTheaters}
                    AllTrainTicketAgencies={AllTrainTicketAgencies}
                    AllTourLeaders={AllTourLeaders}
                    AllCoachOperators={AllCoachOperators}
                    hotel={Hotel}
                    entertainmentSupplier={entertainmentSupplier}
                    setHotel={setHotel}
                    setCoachOperator={setCoachOperator}
                    setAirline={setAirline}
                    setDMC={setDMC}
                    setFerryTicketAgency={setFerryTicketAgency}
                    setCruisingCompany={setCruisingCompany}
                    setGuide={setGuide}
                    setRestaurant={setRestaurant}
                    setEntertainmentSupplier={setEntertainmentSupplier}
                    setSportEventSupplier={setSportEventSupplier}
                    setProduct={setProduct}
                    setTeleferikCompany={setTeleferikCompany}
                    setTheater={setTheater}
                    setTrainTicketAgency={setTrainTicketAgency}
                    setTourLeader={setTourLeader}
                    service_type={selectedServiceType}
                  />
                </Col>
                <div className="grey-powerline"></div>
              </>
            ) : (
              ""
            )}


              {AllFerryTicketAgencies.filter(agency => agency.name === ferryTicketAgency).length > 0 ? 
                AllFerryTicketAgencies.filter(agency => agency.name === ferryTicketAgency)[0].ferry_ticket_agency_route.length > 0 ? 
                <>
                  <Form.Label column sm="2">
                    Select Route:
                  </Form.Label>
                  <Col sm="10">
                    <Autocomplete
                      options={AllFerryTicketAgencies.filter(agency => agency.name === ferryTicketAgency)[0].ferry_ticket_agency_route}
                      disableClearable
                      onChange={(e) => {setRoute(e.target.innerText);}}
                      getOptionLabel={(option) => option.source  + ' --> ' + option.destination}
                      style={{ width: 320 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Route"
                          variant="outlined"
                        />
                      )}
                    />
                  </Col>
                  <div className="grey-powerline"></div>
                  <Form.Label column sm="2">
                    Booking Ref:
                  </Form.Label>
                  <Col sm="10">
                    <input
                      type="text"
                      maxLength={120}
                      value={bookingRef}
                      className="form-control"
                      onChange={(e) =>
                        setBookingRef(e.target.value)
                      }
                    ></input>
                  </Col>
                  <div className="grey-powerline"></div>
                </>
                :
                ""
              :
              ""
              }
            <Form.Label column sm="2">
              Add Time:
            </Form.Label>
            <Col sm="10">
              <DatePicker
                selected={startTime}
                onChange={(e) => {
                  setStartTime(e);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeFormat="HH:mm"
                timeCaption="Time"
                dateFormat="HH:mm"
                locale="pt-GR"
              />
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Add Price:
            </Form.Label>
            <Col sm="10">
              <input
                style={{ width: 200 }}
                type="text"
                value={price}
                onInput={(e) => {
                  // Allow only numbers and up to 2 decimal places
                  e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                  e.target.value = e.target.value.replace(/(\.\d{2}).*$/, "$1"); // Keep only up to 2 decimal places
                }}
                className="form-control"
                onChange={(e) => setPrice(e.currentTarget.value)}
              />
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Add Currency:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setCurrency(e.target.value)}
                style={{ marginBottom: 10, width: "40%" }}
              >
                <option value="EUR"> € Euro (EUR) </option>
                <option value="GBP"> £ Pound Sterling (GBP) </option>
                <option value="USD"> $ US Dollar (USD) </option>
                <option value="CAD"> $ Canadian Dollar (CAD) </option>
                <option value="AUD"> $ Australian Dollar (AUD) </option>
                <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                <option value="NZD"> $ New Zealand Dollar (NZD) </option>
                <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                <option value="SGD"> $ Singapore Dollar (SGD) </option>
              </select>
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Add Description:
            </Form.Label>
            <Col sm="10">
              <textarea
                className="add_service_input form-control"
                rows={4}
                cols={40}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
              ></textarea>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!Object.values(props.dates).includes(true) ||
            selectedServiceType === "" ||
            price < 1 ||
            (selectedServiceType === "Accommodation" && !Hotel) ||
            (selectedServiceType === "Air Ticket" && !airline) ||
            (selectedServiceType === "Airport Porterage" && !dmc) ||
            (selectedServiceType === "Coach's Ferry Ticket" &&
              !ferryTicketAgency) ||
            (selectedServiceType === "Cruise" && !cruisingCompany) ||
            (selectedServiceType === "Driver Accommodation" && !Hotel) ||
            (selectedServiceType === "Ferry Ticket" && !ferryTicketAgency) ||
            (selectedServiceType === "Hotel Porterage" && !Hotel) ||
            (selectedServiceType === "Local Guide" && !guide) ||
            (selectedServiceType === "Restaurant" && !restaurant) ||
            (selectedServiceType === "Sport Event" && !sportEventSupplier) ||
            // (selectedServiceType === 'Sightseeing' && !Hotel) ||
            (selectedServiceType === "Teleferik" && !teleferikCompany) ||
            (selectedServiceType === "Theater" && !theater) ||
            // (selectedServiceType === 'Tolls' && !Hotel) ||
            (selectedServiceType === "Tour Leader" && !tourLeader) ||
            (selectedServiceType === "Tour Leader's Accommodation" && !Hotel) ||
            (selectedServiceType === "Tour Leader's Air Ticket" && !airline) ||
            (selectedServiceType === "Train Ticket" && !trainTicketAgency) ||
            (selectedServiceType === "Transfer" && !coachOperator) ? (
              // (selectedServiceType === 'Other' && !Hotel) ||
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!Object.values(props.dates).includes(true) ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select at
                        least one date
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select a
                        service type
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Accommodation" && !Hotel ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Hotel
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Air Ticket" && !airline ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select An
                        Airline
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Airport Porterage" && !dmc ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A DMC
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Coach's Ferry Ticket" &&
                    !ferryTicketAgency ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Ferry
                        Ticket Agency
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Cruise" && !cruisingCompany ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A
                        Cruising Company
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Driver Accommodation" &&
                    !Hotel ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Hotel{" "}
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Ferry Ticket" &&
                    !ferryTicketAgency ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Ferry
                        Ticket Agency
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Hotel Porterage" && !Hotel ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Hotel
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Local Guide" && !guide ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Guide
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Restaurant" && !restaurant ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A
                        Restaurant
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Sport Event" &&
                    !sportEventSupplier ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Sport
                        Event Supplier
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Shows & Entertainment" &&
                    !entertainmentSupplier ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select An Entertainment Supplier
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Teleferik" && !teleferikCompany ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Teleferik Company
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Theater" && !theater ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Theater
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Tour Leader" && !tourLeader ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Tour Leader
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Tour Leader's Accommodation" && !Hotel ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Hotel
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Tour Leader's Air Ticket" &&
                    !airline ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select An
                        Airline
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Train Ticket" &&
                    !trainTicketAgency ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Train
                        Ticket Agency
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "Transfer" && !coachOperator ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A Coach
                        Operator
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {price === "" || price < 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Add Service
                        Price
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} />
                    Validated
                  </li>
                </ul>
              </>
            )}
          </small>
          <Button
            color="red"
            onClick={() => {
              resetArrays();
              handleClose();
            }}
          >
            Close
          </Button>
          <Button
            color="green"
            disabled={
              !Object.values(props.dates).includes(true) ||
              price === "" ||
              price < 0 ||
              selectedServiceType === "" ||
              (selectedServiceType === "Accommodation" && !Hotel) ||
              (selectedServiceType === "Air Ticket" && !airline) ||
              (selectedServiceType === "Airport Porterage" && !dmc) ||
              (selectedServiceType === "Coach's Ferry Ticket" &&
                !ferryTicketAgency) ||
              (selectedServiceType === "Cruise" && !cruisingCompany) ||
              (selectedServiceType === "Driver Accommodation" && !Hotel) ||
              (selectedServiceType === "Ferry Ticket" && !ferryTicketAgency) ||
              (selectedServiceType === "Hotel Porterage" && !Hotel) ||
              (selectedServiceType === "Local Guide" && !guide) ||
              (selectedServiceType === "Restaurant" && !restaurant) ||
              (selectedServiceType === "Sport Event" && !sportEventSupplier) ||
              (selectedServiceType === "Shows & Entertainment" && !entertainmentSupplier) ||
              (selectedServiceType === "Teleferik" && !teleferikCompany) ||
              (selectedServiceType === "Theater" && !theater) ||
              (selectedServiceType === "Tour Leader" && !tourLeader) ||
              (selectedServiceType === "Tour Leader's Accommodation" &&
                !Hotel) ||
              (selectedServiceType === "Tour Leader's Air Ticket" &&
                !airline) ||
              (selectedServiceType === "Train Ticket" && !trainTicketAgency) ||
              (selectedServiceType === "Transfer" && !coachOperator)

              // need suppliers for these:
              // (selectedServiceType === 'Tolls' && !Hotel) ||
              // (selectedServiceType === 'Sightseeing' && !Hotel) ||
              // (selectedServiceType === 'Other' && !Hotel) ||
              // (selectedServiceType === 'Permit' && !Hotel)
            }
            onClick={() => {
              handleClose();
              resetArrays();
              AddTraveldayService();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddNewService;
