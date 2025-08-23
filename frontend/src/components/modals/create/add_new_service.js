// Built-ins
import React, { useState } from "react";

// Icons / Images
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// CSS
import "rc-time-picker/assets/index.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

// Custom Made Components
import { AddExtraField } from "./add_extra_field";

// Modules / Functions
import { Button } from "semantic-ui-react";
import { Modal, Spinner } from "react-bootstrap";
import moment from "moment";
import TimePicker from "rc-time-picker";
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Global Variables
import { headers } from "../../global_vars";

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

const now = moment().hour(0).minute(0);

const GET_HOTELS = "http://localhost:8000/api/view/get_all_hotels/";
const GET_AIRLINES = "http://localhost:8000/api/view/get_all_airlines/";
const GET_GROUND_HANDLING_COMPANIES =
  "http://localhost:8000/api/view/get_all_dmcs/";
const GET_FERRY_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_ferry_ticket_agencies/";
const GET_CRUISING_COMPANIES =
  "http://localhost:8000/api/view/get_all_cruising_companies/";
const GET_GUIDES = "http://localhost:8000/api/view/get_all_guides/";
const GET_RESTAURANTS = "http://localhost:8000/api/view/get_all_restaurants/";
const GET_SPORT_EVENT_SUPPLIERS =
  "http://localhost:8000/api/view/get_all_sport_event_suppliers/";
const GET_TELEFERIK_COMPANIES =
  "http://localhost:8000/api/view/get_all_teleferik_companies/";
const GET_THEATERS = "http://localhost:8000/api/view/get_all_theaters/";
const GET_TRAIN_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_train_ticket_agencies/";
const CREATE_TRAVELDAY_SERVICE_API =
  "http://localhost:8000/api/groups/create_travelday_service/";
const GET_GROUP_DAYS = "http://localhost:8000/api/view/get_group_days/";

const ServiceOptions = [
  "Accomodation",
  "Air Ticket",
  "Airport Porterage",
  "Coach's Ferry Ticket",
  "Cruise",
  "Driver Accomodation",
  "Ferry Ticket",
  "Hotel Porterage",
  "Local Guide",
  "Restaurant",
  "Sport Event",
  "Teleferik",
  "Theater",
  "Toll",
  "Tour Leader",
  "Tour Leader's Accomodation",
  "Tour Leader's Air Ticket",
  "Train Ticket",
  "Transfer",
  "Other",
  "Permit",
];

let AllHotels = [];
let AllAirlines = [];
let AllDMCs = [];
let AllFerryTicketAgencies = [];
let AllCruisingCompanies = [];
let AllGuides = [];
let AllRestaurants = [];
let AllSportEventSuppliers = [];
let AllTeleferikCompanies = [];
let AllTheaters = [];
let AllTourLeaders = [];
let AllTrainTicketAgencies = [];

const resetArrays = () => {
  AllHotels.length = 0;
  AllAirlines.length = 0;
  AllDMCs.length = 0;
  AllFerryTicketAgencies.length = 0;
  AllCruisingCompanies.length = 0;
  AllGuides.length = 0;
  AllRestaurants.length = 0;
  AllSportEventSuppliers.length = 0;
  AllTeleferikCompanies.length = 0;
  AllTheaters.length = 0;
  AllTourLeaders.length = 0;
  AllTrainTicketAgencies.length = 0;
  return;
};

function AddNewService(props) {
  let [AllGroupDays, setAllGroupDays] = React.useState([]);

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

  const getGroupDays = (refcode) => {
    axios
      .get(GET_GROUP_DAYS, {
        headers: headers,
        params: {
          refcode: refcode,
        },
      })
      .then((res) => {
        setAllGroupDays(res.data.all_group_days);
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
  const [refcode, setRefcode] = useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const handleSetSelectedDate = (e) => {
    setSelectedDate(e.target.value);
  };
  const [selectedServiceType, setSelectedServiceType] = React.useState("");
  const handleSelectedServiceType = (e) => {
    setSelectedServiceType(e.target.value);
  };
  const [price, setPrice] = React.useState(0);
  const [Time, setTime] = useState(new Date());

  const [Description, setDescription] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [Hotel, setHotel] = useState("");
  const [single, setSingle] = useState(0);
  const [double, setDouble] = useState(0);
  const [triple, setTriple] = useState(0);
  const [twin, setTwin] = useState(0);
  const [quadrable, setQuadrable] = useState(0);
  const [mealDescription, setMealDescription] = useState("");
  const [Airline, setAirline] = useState("");
  const [groundHandlingCompany, setDMC] = useState("");
  const [ferryTicketAgency, setFerryTicketAgency] = useState("");
  const [cruisingCompany, setCruisingCompany] = useState("");
  const [guide, setGuide] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [sportEventSupplier, setSportEventSupplier] = useState("");
  const [teleferikCompany, setTeleferikCompany] = useState("");

  const [theater, setTheater] = useState("");
  const [tourLeader, setTourLeader] = useState("");
  const [trainTicketAgency, setTrainTicketAgency] = useState("");

  const AddTraveldayService = () => {
    axios({
      method: "post",
      url: CREATE_TRAVELDAY_SERVICE_API,
      headers: headers,
      data: {
        way: "data_management",
        td_id: selectedDate,
        service_type: selectedServiceType,
        start_time: moment(Time).format("hh:mm a"),
        refcode: refcode,
        price: price,
        description: Description,
        hotel: Hotel,
        single: single,
        double: double,
        triple: triple,
        twin: twin,
        quadrable: quadrable,
        meal_desc: mealDescription,
        airline: Airline,
        dmc: groundHandlingCompany,
        ferry_ticket_agency: ferryTicketAgency,
        cruising_company: cruisingCompany,
        guide: guide,
        restaurant: restaurant,
        sport_event_supplier: sportEventSupplier,
        teleferik_company: teleferikCompany,
        theater: theater,
        tour_leader: tourLeader,
        train_ticket_agency: trainTicketAgency,
      },
    })
      .then((res) => {
        props.add_service(res.data.group);
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
          getAllSportEventSuppliers();
          getAllTeleferikCompanies();
          getAllTheaters();
          getAllTrainTicketAgencies();
          handleShow();
        }}
      >
        Create new Service
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
          <Modal.Title>Add a new service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            options={props.all_groups}
            className={"select_airport"}
            onChange={(e) => {
              setRefcode(e.target.innerText);
              getGroupDays(e.target.innerText);
            }}
            disabled={!props.loaded}
            getOptionLabel={(option) => option}
            disableClearable
            style={{ width: 500, margin: 0 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Group" variant="outlined" />
            )}
          />
          {props.loaded ? (
            ""
          ) : (
            <Spinner
              animation="border"
              variant="info"
              size="sm"
              style={{ position: "fixed", margin: 20 }}
            />
          )}
          <hr />
          <label htmlFor="groupsPerPageSelect">Select date</label>
          <select
            className="form-control add_service_input"
            onChange={(e) => handleSetSelectedDate(e)}
            disabled={refcode === ""}
          >
            <option selected disabled hidden>
              Choose from available dates
            </option>

            {props.is_loaded
              ? AllGroupDays.map((j, k) => (
                  <option key={k} value={j.id}>
                    {j.date}
                  </option>
                ))
              : ""}
          </select>
          <hr />

          <label style={{ paddingTop: 5 }}>Select Service type</label>
          <select
            className="form-control add_service_input"
            defaultValue={props.defaultValue}
            onChange={(e) => handleSelectedServiceType(e)}
          >
            <option selected disabled hidden>
              Choose from available types
            </option>
            {ServiceOptions.map((j, k) => (
              <option key={k} value={j.id}>
                {j}
              </option>
            ))}
          </select>
          <hr />
          <AddExtraField
            AllHotels={AllHotels}
            AllAirlines={AllAirlines}
            AllDMCs={AllDMCs}
            AllFerryTicketAgencies={AllFerryTicketAgencies}
            AllCruisingCompanies={AllCruisingCompanies}
            AllGuides={AllGuides}
            AllRestaurants={AllRestaurants}
            AllSportEventSuppliers={AllSportEventSuppliers}
            AllTeleferikCompanies={AllTeleferikCompanies}
            AllTheaters={AllTheaters}
            AllTourLeaders={AllTourLeaders}
            AllTrainTicketAgencies={AllTrainTicketAgencies}
            hotel={Hotel}
            setHotel={setHotel}
            single={single}
            setSingle={setSingle}
            double={double}
            setDouble={setDouble}
            triple={triple}
            setTriple={setTriple}
            twin={twin}
            setTwin={setTwin}
            quadrable={quadrable}
            setQuadrable={setQuadrable}
            setMealDescription={setMealDescription}
            setAirline={setAirline}
            setDMC={setDMC}
            setFerryTicketAgency={setFerryTicketAgency}
            setCruisingCompany={setCruisingCompany}
            setGuide={setGuide}
            setRestaurant={setRestaurant}
            setSportEventSupplier={setSportEventSupplier}
            setTeleferikCompany={setTeleferikCompany}
            setTheater={setTheater}
            setTourLeader={setTourLeader}
            setTrainTicketAgency={setTrainTicketAgency}
            service_type={selectedServiceType}
          />

          <span>Set service start time</span>
          <TimePicker
            showSecond={false}
            defaultValue={now}
            className="add_service_input"
            onChange={(e) => setTime(e)}
            format={"hh:mm a"}
            inputReadOnly
            clearIcon={true}
          />
          <hr />

          <div style={{ height: 35 }}>
            <label style={{ paddingTop: 5 }}> Enter Price: </label>
            <input
              type="number"
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 3);
              }}
              value={price}
              className="form-control add_service_input"
              onChange={(e) => setPrice(e.currentTarget.value)}
            ></input>
          </div>
          <hr />
          <div>
            <label style={{ paddingTop: 25 }}> Add Service description </label>
            <textarea
              className="add_service_input"
              rows={4}
              cols={50}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {selectedDate === "" || selectedServiceType === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {selectedDate === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select at least one date
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {selectedServiceType === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select a service type
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
            disabled={selectedDate === "" || selectedServiceType === ""}
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
