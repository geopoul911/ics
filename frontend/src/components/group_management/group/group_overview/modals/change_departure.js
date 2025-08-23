// Built-ins
import { useState, useEffect } from "react";

// CSS
import "react-datepicker/dist/react-datepicker.css";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, ListGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";
import { Button } from "semantic-ui-react";

// Custom Made Components
import AddAirportModal from "../../../../modals/create/add_airport_modal";
import AddAirlineModal from "../../../../modals/create/add_airline_modal";
import AddPortModal from "../../../../modals/create/add_port_modal";
import AddFerryTicketAgencyModal from "../../../../modals/create/add_ferry_ticket_agency_modal";
import AddRailwayStationModal from "../../../../modals/create/add_railway_station_modal";
import AddTrainTicketAgencyModal from "../../../../modals/create/add_train_ticket_agency_modal";

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

const CHANGE_DEPARTURE_FLIGHT =
  "http://localhost:8000/api/groups/change_departure_flight/";
const GET_AIRPORTS = "http://localhost:8000/api/view/get_all_airports_raw/";
const GET_AIRPORT_TERMINALS = "http://localhost:8000/api/view/get_airport_terminals/";
const GET_AIRLINES = "http://localhost:8000/api/view/get_all_airlines/";
const GET_PORTS = "http://localhost:8000/api/view/get_all_ports/";
const GET_FERRY_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_ferry_ticket_agencies/";
const GET_RAILWAY_STATIONS =
  "http://localhost:8000/api/view/get_all_railway_stations/";
const GET_TRAIN_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_train_ticket_agencies/";

function ChangeDepartureFlight(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [arrType, setArrType] = useState(props.group.departure_type);
  const [ArrDate, setArrDate] = useState(new Date());

  const [Airport, setAirport] = useState("");
  
  const [Airline, setAirline] = useState("");

  const parseDepartureInfo = (departure, type) => {
    if (type !== 'AIR' || typeof departure !== 'string') return { abbr: "", flight: "" };
  
    const parts = departure.split(" - ");
    if (parts.length < 2) return { abbr: "", flight: "" };
  
    const flightTokens = parts[1].trim().split(" ");
    return {
      abbr: flightTokens[0] || "",
      flight: flightTokens[1] || ""
    };
  };
  
  const { abbr: departureAbbr, flight: departureFlight } = parseDepartureInfo(props.group.departure, props.group.departure_type);
  
  const [flightAbbr, setFlightAbbr] = useState(departureAbbr);
  const [Flight, setFlight] = useState(departureFlight);
  const [Terminal, setTerminal] = useState("No Terminal");

  const [Terminals, setTerminals] = useState([]);

  let [AllAirports, setAllAirports] = useState([]);
  let [airportsLoaded, setAirportsLoaded] = useState(false);

  let [AllAirlines, setAllAirlines] = useState([]);
  let [airlinesLoaded, setAirlinesLoaded] = useState(false);

  const [Port, setPort] = useState("");
  const [FerryTicketAgency, setFerryTicketAgency] = useState("");
  const [shipName, setShipName] = useState("");

  const [RailwayStation, setRailwayStation] = useState("");
  const [TrainTicketAgency, setTrainTicketAgency] = useState("");
  const [route, setRoute] = useState("");

  let [AllPorts, setAllPorts] = useState([]);
  let [portsLoaded, setPortsLoaded] = useState(false);

  let [AllFerryTicketAgencies, setAllFerryTicketAgencies] = useState([]);
  let [ferryTicketAgenciesLoaded, setFerryTicketAgenciesLoaded] =
    useState(false);

  let [AllRailwayStations, setAllRailwayStations] = useState([]);
  let [railwayStationsLoaded, setRailwayStationsLoaded] = useState(false);

  let [AllTrainTicketAgencies, setAllTrainTicketAgencies] = useState([]);
  let [trainTicketAgenciesLoaded, setTrainTicketAgenciesLoaded] =
    useState(false);

  const getAllAirports = () => {
    axios
      .get(GET_AIRPORTS, {
        headers: headers,
      })
      .then((res) => {
        setAirportsLoaded(true);
        setAllAirports(res.data.all_airports.map((airport) => 
          `${airport.name}, ${airport.location}`
        ));
      });
  };

  const getAirportsTerminals = (airport) => {
    axios
    .get(GET_AIRPORT_TERMINALS, {
      headers: headers,
      params:{
        airport: airport,
      }
    })
    .then((res) => {
      setTerminals(res.data.all_terminals);
    });
  };

  const getAllAirlines = () => {
    axios
      .get(GET_AIRLINES, {
        headers: headers,
      })
      .then((res) => {
        setAllAirlines(
          res.data.all_airlines.map(
            (airline) => airline.name + ", " + airline.abbreviation
          )
        );
        setAirlinesLoaded(true);
      });
  };

  const getAllPorts = () => {
    axios
      .get(GET_PORTS, {
        headers: headers,
      })
      .then((res) => {
        setAllPorts(
          res.data.all_ports.map(
            (port) => port.name + " - " + port.nationality.name
          )
        );
        setPortsLoaded(true);
      });
  };

  const getAllRailwayStations = () => {
    axios
      .get(GET_RAILWAY_STATIONS, {
        headers: headers,
      })
      .then((res) => {
        setAllRailwayStations(
          res.data.all_railway_stations.map(
            (railway_station) =>
              railway_station.name + " - " + railway_station.nationality.name
          )
        );
        setRailwayStationsLoaded(true);
      });
  };

  const getAllFerryTicketAgencies = () => {
    axios
      .get(GET_FERRY_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        setAllFerryTicketAgencies(
          res.data.all_ferry_ticket_agencies.map(
            (FerryTicketAgency) => FerryTicketAgency.name
          )
        );
        setFerryTicketAgenciesLoaded(true);
      });
  };

  const getAllTrainTicketAgencies = () => {
    axios
      .get(GET_TRAIN_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        setAllTrainTicketAgencies(
          res.data.all_train_ticket_agencies.map(
            (TrainTicketAgency) => TrainTicketAgency.name
          )
        );
        setTrainTicketAgenciesLoaded(true);
      });
  };

  const updateDepartureFlight = () => {
    axios({
      method: "post",
      url: CHANGE_DEPARTURE_FLIGHT + props.group.refcode,
      headers: headers,
      data: {
        transport_type: arrType,
        departure_date: ArrDate.toString(),
        airport: Airport,
        flight: Flight,
        terminal: Terminal,
        airline: Airline,
        flightAbbr: flightAbbr,
        port: Port,
        railway_station: RailwayStation,
        ferry_ticket_agency: FerryTicketAgency,
        train_ticket_agency: TrainTicketAgency,
        ship_name: shipName,
        route: route,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  useEffect(() => {
      const rawDeparture = props.group.departure || "";
      const departureParts = rawDeparture.split(" - ");
  
      // Safely parse date
      const rawDate = departureParts[0] || "";
      const parsedDate = new Date(rawDate);
      setArrDate(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
  
      // Parse airline and flight number safely
      const airlineFlightParts = (departureParts[1] || "").trim().split(" ");
      const airlineAbbr = airlineFlightParts[0] || "";
      const flightNum = airlineFlightParts[1] || "";
  
      setFlightAbbr(airlineAbbr);
      setFlight(flightNum);
  
      // Airport and terminal (safe fallback)
      const airportLocation = departureParts[2] || "";
      const terminal = departureParts[3] || "No Terminal";
      setTerminal(terminal);
  
      // Set airline from list, based on abbreviation
      const airline = AllAirlines.find(a => a.split(", ")[1] === airlineAbbr);
      if (airline) {
        setAirline(airline);
      } else {
        setAirline(""); // Optional: fallback or message
      }
  
      // Get terminals for the selected airport
      if (airportLocation) {
        getAirportsTerminals(airportLocation);
      }
  
  }, [props.group.departure, props.group.departure_type, AllAirlines]);
  
  // Add new useEffect to handle setting airport after airports are loaded
  useEffect(() => {
    if (airportsLoaded && props.group.departure_type === 'AIR') {
      const departureParts = props.group.departure.split(" - ");
      const airportLocation = departureParts[2];
      const airportCode = airportLocation.split(" - ")[0];
      
      // Find the matching airport in AllAirports
      const matchingAirport = AllAirports.find(airport => 
        airport.startsWith(airportCode)
      );
      
      if (matchingAirport) {
        setAirport(matchingAirport);
      }
    }
  }, [airportsLoaded, props.group.departure, props.group.departure_type, AllAirports]);

  // Add useEffect to load data when modal opens
  useEffect(() => {
    if (show) {
      getAllAirports();
      getAllAirlines();
      getAllPorts();
      getAllRailwayStations();
      getAllFerryTicketAgencies();
      getAllTrainTicketAgencies();
    }
  }, [show]);

  return (
    <>
      <FiEdit2
        title={"edit departure flight"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getAllAirports();
          getAirportsTerminals();
          getAllAirlines();
          getAllFerryTicketAgencies();
          getAllTrainTicketAgencies();
          getAllPorts();
          getAllRailwayStations();
        }}
      />
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Departure for {props.group.refcode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item>
              <div className="button-container">
                <label>Select Transport Type: </label>
                <ul
                  style={{
                    padding: 0,
                    margin: 10,
                    display: "inline",
                    width: "78%",
                  }}
                >
                  <li style={{ display: "inline-block", marginRight: 10 }}>
                    <Button
                      onClick={() => {
                        setArrType("NA");
                      }}
                      color={arrType === "NA" ? "blue" : "grey"}
                    >
                      Unknown
                    </Button>
                  </li>
                  <li style={{ display: "inline-block", marginRight: 10 }}>
                    <Button
                      onClick={() => {
                        setArrType("AIR");
                      }}
                      color={arrType === "AIR" ? "blue" : "grey"}
                    >
                      Air
                    </Button>
                  </li>
                  <li style={{ display: "inline-block", marginRight: 10 }}>
                    <Button
                      onClick={() => {
                        setArrType("SEA");
                      }}
                      color={arrType === "SEA" ? "blue" : "grey"}
                    >
                      Sea
                    </Button>
                  </li>
                  <li style={{ display: "inline-block", marginRight: 10 }}>
                    <Button
                      onClick={() => {
                        setArrType("TRN");
                      }}
                      color={arrType === "TRN" ? "blue" : "grey"}
                    >
                      Train
                    </Button>
                  </li>
                  <li style={{ display: "inline-block", marginRight: 10 }}>
                    <Button
                      onClick={() => {
                        setArrType("CCH");
                      }}
                      color={arrType === "CCH" ? "blue" : "grey"}
                    >
                      Coach
                    </Button>
                  </li>
                </ul>
              </div>
            </ListGroup.Item>

            {arrType === "AIR" ? (
              <>
                <ListGroup.Item>
                  <label style={{ marginTop: 30 }}> Airport : </label>
                  <Autocomplete
                    options={AllAirports}
                    className={"select_airport"}
                    style={{ width: "40%", margin: 10 }}
                    value={Airport}
                    disabled={!airportsLoaded}
                    disableClearable
                    onChange={(e, newValue) => {
                      if (newValue) {
                        setAirport(newValue);
                        const airportName = newValue.split(", ")[1];
                        getAirportsTerminals(airportName);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Airport"
                      />
                    )}
                  />
                  <div style={{ float: "right" }}>
                    <AddAirportModal
                      redir={false}
                      set_airport={(e) => setAirport(e)}
                    />
                  </div>

                  {airportsLoaded ? (
                    ""
                  ) : (
                    <Spinner
                      animation="border"
                      variant="info"
                      size="sm"
                      style={{ position: "fixed", marginTop: 37 }}
                    />
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <label style={{ marginTop: 30 }}>Airline :</label>
                  <Autocomplete
                    options={AllAirlines}
                    className={"select_airport"}
                    style={{ width: "40%", margin: 10 }}
                    disabled={!airlinesLoaded}
                    disableClearable
                    value={Airline}
                    onChange={(e) => {
                      if (e.target.innerText == null) {
                        setAirline("");
                        setFlightAbbr("");
                      } else {
                        setAirline(e.target.innerText);
                        setFlightAbbr(e.target.innerText.split(", ")[1]);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Airline"
                        variant="outlined"
                      />
                    )}
                  />
                  <div style={{ float: "right" }}>
                    <AddAirlineModal
                      redir={false}
                      set_airline={(e) => setAirline(e)}
                      set_abbr={(e) => setFlightAbbr(e)}
                    />
                  </div>
                  {airlinesLoaded ? (
                    ""
                  ) : (
                    <Spinner
                      animation="border"
                      variant="info"
                      size="sm"
                      style={{ position: "fixed", marginTop: 37 }}
                    />
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <label>Flight :</label>
                  <input
                    type="text"
                    style={{ width: 45, display: "inline", marginLeft: 20 }}
                    required
                    className="form-control flight_input"
                    disabled
                    value={flightAbbr}
                    maxLength="2"
                  ></input>
                  <input
                    type="number"
                    value={Flight}
                    style={{ width: 80, display: "inline", marginLeft: 10 }}
                    required
                    className="form-control flight_input"
                    onInput={(e) => {
                      e.target.value = Math.max(0, parseInt(e.target.value))
                        .toString()
                        .slice(0, 4);
                    }}
                    onChange={(e) => {
                      setFlight(e.currentTarget.value);
                    }}
                    maxLength="4"
                  ></input>
                </ListGroup.Item>

                {Terminals.length > 0 ? (
                  <ListGroup.Item>
                    <label style={{ marginTop: 30 }}>Terminal : </label>
                    <Autocomplete
                      options={Terminals}
                      className={"select_airport"}
                      onChange={(e) => {
                        setTerminal(e.target.innerText);
                      }}
                      getOptionLabel={(option) => option.name}
                      style={{ width: 300, margin: 10 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Terminal"
                          variant="outlined"
                        />
                      )}
                    />
                  </ListGroup.Item>
                ) : null}
              </>
            ) : (
              <></>
            )}

            {arrType === "SEA" ? (
              <>
                <ListGroup.Item>
                  <label style={{ marginTop: 30 }}> Port : </label>
                  <Autocomplete
                    options={AllPorts}
                    className={"select_airport"}
                    style={{ width: "40%", margin: 10 }}
                    disabled={!portsLoaded}
                    value={Port}
                    disableClearable
                    onChange={(e) => {
                      setPort(e.target.innerText);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Port"
                        variant="outlined"
                      />
                    )}
                  />

                  <div style={{ float: "right" }}>
                    <AddPortModal redir={false} set_port={(e) => setPort(e)} />
                  </div>

                  {portsLoaded ? (
                    ""
                  ) : (
                    <Spinner
                      animation="border"
                      variant="info"
                      size="sm"
                      style={{ position: "fixed", marginTop: 37 }}
                    />
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <label style={{ marginTop: 30 }}>Ferry Ticket Agency :</label>
                  <Autocomplete
                    options={AllFerryTicketAgencies}
                    className={"select_airport"}
                    style={{ width: "35%", margin: 10 }}
                    disabled={!ferryTicketAgenciesLoaded}
                    value={FerryTicketAgency}
                    disableClearable
                    onChange={(e) => {
                      setFerryTicketAgency(e.target.innerText);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Ferry Ticket Agency"
                        variant="outlined"
                      />
                    )}
                  />

                  <div style={{ float: "right" }}>
                    <AddFerryTicketAgencyModal
                      redir={false}
                      set_ferry_ticket_agency={(e) => setFerryTicketAgency(e)}
                    />
                  </div>

                  {ferryTicketAgenciesLoaded ? (
                    ""
                  ) : (
                    <Spinner
                      animation="border"
                      variant="info"
                      size="sm"
                      style={{ position: "fixed", marginTop: 37 }}
                    />
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <label>Ship Name :</label>
                  <input
                    type="text"
                    value={shipName}
                    style={{ width: "40%", display: "inline", marginLeft: 10 }}
                    required
                    title="Not Required"
                    className="form-control flight_input"
                    placeholder="e.g. OLYMPIC CHAMPION"
                    onChange={(e) => {
                      setShipName(e.currentTarget.value.toUpperCase());
                    }}
                    maxLength="64"
                  ></input>
                </ListGroup.Item>
              </>
            ) : (
              <></>
            )}

            {arrType === "TRN" ? (
              <>
                <ListGroup.Item>
                  <label style={{ marginTop: 30 }}> Railway Station : </label>
                  <Autocomplete
                    options={AllRailwayStations}
                    className={"select_airport"}
                    style={{ width: "40%", margin: 10 }}
                    disabled={!railwayStationsLoaded}
                    value={RailwayStation}
                    disableClearable
                    onChange={(e) => {
                      setRailwayStation(e.target.innerText);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Railway Station"
                        variant="outlined"
                      />
                    )}
                  />

                  <div style={{ float: "right" }}>
                    <AddRailwayStationModal
                      redir={false}
                      set_railway_station={(e) => setRailwayStation(e)}
                    />
                  </div>

                  {railwayStationsLoaded ? (
                    ""
                  ) : (
                    <Spinner
                      animation="border"
                      variant="info"
                      size="sm"
                      style={{ position: "fixed", marginTop: 37 }}
                    />
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <label style={{ marginTop: 30 }}>Train Ticket Agency :</label>
                  <Autocomplete
                    options={AllTrainTicketAgencies}
                    className={"select_airport"}
                    style={{ width: "35%", margin: 10 }}
                    value={TrainTicketAgency}
                    disabled={!trainTicketAgenciesLoaded}
                    disableClearable
                    onChange={(e) => {
                      setTrainTicketAgency(e.target.innerText);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Train Ticket Agency"
                        variant="outlined"
                      />
                    )}
                  />

                  <div style={{ float: "right" }}>
                    <AddTrainTicketAgencyModal
                      redir={false}
                      set_train_ticket_agency={(e) => setTrainTicketAgency(e)}
                    />
                  </div>

                  {trainTicketAgenciesLoaded ? (
                    ""
                  ) : (
                    <Spinner
                      animation="border"
                      variant="info"
                      size="sm"
                      style={{ position: "fixed", marginTop: 37 }}
                    />
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <label>Route :</label>
                  <input
                    type="text"
                    value={route}
                    style={{ width: "66%", display: "inline", marginLeft: 10 }}
                    required
                    className="form-control flight_input"
                    placeholder={"eg. THA 9428"}
                    onChange={(e) => {
                      setRoute(e.currentTarget.value.toUpperCase());
                    }}
                    maxLength="64"
                  ></input>
                </ListGroup.Item>
              </>
            ) : (
              <></>
            )}

            <ListGroup.Item>
              <label>Date & time : </label>
              <DatePicker
                className={"react_dp_input"}
                selected={ArrDate}
                onChange={(e) => {
                  setArrDate(e);
                }}
                showTimeSelect
                locale="pt-GR"
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
              />
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          {arrType === "AIR" ? (
            <>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Departure flight is formed by date, time, airline's abbreviation,
                flight number,
                <br />
                airport 3 letter code, airport location, and terminal.
                {Airport === null ? (
                  <>
                    <ul
                      className="mr-auto"
                      style={{
                        margin: 0,
                        padding: 0,
                        marginTop: 10,
                        color: "red",
                      }}
                    >
                      <li>
                        {Airport === null ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Select an Airport.
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
              <Button color="red" onClick={handleClose}>
                Close
              </Button>
              <Button
                color="green"
                disabled={Airport === null}
                onClick={() => {
                  handleClose();
                  updateDepartureFlight();
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <></>
          )}

          {arrType === "SEA" ? (
            <>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Departure is formed by date, time, port, country, ferry ticket
                agency name, and ship name.
                {Port === "" || FerryTicketAgency === "" ? (
                  <>
                    <ul
                      className="mr-auto"
                      style={{
                        margin: 0,
                        padding: 0,
                        marginTop: 10,
                        color: "red",
                      }}
                    >
                      <li>
                        {Port === "" ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Select an Port.
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {FerryTicketAgency === "" ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Select an Ferry Ticket Agency.
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
              <Button color="red" onClick={handleClose}>
                Close
              </Button>
              <Button
                color="green"
                disabled={Port === "" || FerryTicketAgency === ""}
                onClick={() => {
                  handleClose();
                  updateDepartureFlight();
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <></>
          )}
          {arrType === "TRN" ? (
            <>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Departure is formed by date, time, railway station, country, train
                ticket agency name, and route.
                {RailwayStation === "" ? (
                  <>
                    <ul
                      className="mr-auto"
                      style={{
                        margin: 0,
                        padding: 0,
                        marginTop: 10,
                        color: "red",
                      }}
                    >
                      <li>
                        {RailwayStation === "" ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Select a Railway Station
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
              <Button color="red" onClick={handleClose}>
                Close
              </Button>
              <Button
                color="green"
                disabled={RailwayStation === ""}
                onClick={() => {
                  handleClose();
                  updateDepartureFlight();
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <></>
          )}
          {arrType === "NA" ? (
            <>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Departure is formed by date and time
              </small>
              <Button color="red" onClick={handleClose}>
                Close
              </Button>
              <Button
                color="green"
                onClick={() => {
                  handleClose();
                  updateDepartureFlight();
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <></>
          )}

          {arrType === "CCH" ? (
            <>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Departure is formed by date and time
              </small>
              <Button color="red" onClick={handleClose}>
                Close
              </Button>
              <Button
                color="green"
                onClick={() => {
                  handleClose();
                  updateDepartureFlight();
                }}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <></>
          )}

        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeDepartureFlight;
