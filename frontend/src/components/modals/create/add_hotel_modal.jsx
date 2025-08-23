// Built-ins
import React, { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import {
  AiOutlineWarning,
  AiOutlineCheckCircle,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { FaMinus } from "react-icons/fa";

// Modules / Functions
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button, Checkbox, Icon, Grid } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";

// CSS
import "react-phone-number-input/style.css";

// Global Variables
import { headers, isValidLatLng } from "../../global_vars";

// Custom Made Components
import AddRegionModal from "./add_region_modal";
// import AddHotelCategoryModal from "../../data_management/hotel/hotel_overview/modals/add_hotel_category_modal";

// Variables
window.Swal = Swal;

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

const ADD_HOTEL = "http://localhost:8000/api/view/add_hotel/";
const CHECK_FOR_HOTEL_DUPLICATES = "http://localhost:8000/api/view/check_for_hotel_duplicates/";
const GET_HOTEL_CATEGORIES = "http://localhost:8000/api/view/get_all_hotel_categories/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";
const GET_AREAS = "http://localhost:8000/api/view/get_all_areas/";

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

let rating_options = {
  "No rating": 0,
  "1 Star": 10,
  "2 Stars": 20,
  "3 Stars": 30,
  "4 Stars": 40,
  "4 Stars plus": 45,
  "5 Stars": 50,
  "5 Stars plus": 55,
};

function AddHotelModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [Rating, setRating] = useState(0);
  const [Address, setAddress] = useState("");

  const [Address2, setAddress2] = useState("");
  const [showAddress2, setShowAddress2] = useState(false);
  const [postal, setPostal] = useState("");

  const [tel, setTel] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [showTel2, setShowTel2] = useState(false);
  const [showTel3, setShowTel3] = useState(false);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [latlng, setLatLng] = useState("");
  const [priority, setPriority] = useState(0);
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  let [loaded, setLoaded] = useState(false);

  let [addPaymentDetails, setAddPaymentDetails] = useState(false);
  const [company, setCompany] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");

  const [possibleDuplicates, setPossibleDuplicates] = useState([]);
  const [hasDuplicates, setHasDuplicates] = useState(false);

  const [Continent, setContinent] = useState("");
  const [Country, setCountry] = useState("");
  const [State, setState] = useState("");
  const [City, setCity] = useState("");
  const [Area, setArea] = useState("");

  let [AllContinents, setAllContinents] = useState([]);
  let [AllCountries, setAllCountries] = useState([]);
  let [AllStates, setAllStates] = useState([]);
  let [AllCities, setAllCities] = useState([]);
  let [AllAreas, setAllAreas] = useState([]);


  let [AllHotelCategories, setAllHotelCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);

  const handleCategoryChange = (category) => {
    setCheckedCategories((prevChecked) => {
      if (prevChecked.includes(category)) {
        return prevChecked.filter((c) => c !== category);
      } else {
        return [...prevChecked, category];
      }
    });
  };

  const handleCheckBox = () => {
    setAddPaymentDetails(!addPaymentDetails);
  };

  const createNewHotel = () => {
    axios({
      method: "post",
      url: CHECK_FOR_HOTEL_DUPLICATES,
      headers: headers,
      data: {
        name: Name,
        rating: Rating,
        address: Address,
        tel: tel,
        tel2: tel2,
        tel3: tel3,
        email: email,
        website: website,
        priority: priority,
        lat_lng: latlng,
        company: company,
        currency: currency,
        iban: iban,
        swift: swift,
        address2: Address2,
        continent: Continent.name ? Continent.name : 'N/A',
        country: Country.name ? Country.name : 'N/A',
        state: State.name ? State.name : 'N/A',
        city: City.name ? City.name : 'N/A',
        area: Area.name ? Area.name : 'N/A',
        postal: postal,
        number_of_rooms: numberOfRooms,
        checked_categories: checkedCategories,
      },
    })
      .then((res) => {
        if (res.data.possible_duplicates.length === 0) {
          axios({
            method: "post",
            url: ADD_HOTEL,
            headers: headers,
            data: {
              name: Name,
              rating: Rating,
              address: Address,
              tel: tel,
              tel2: tel2,
              tel3: tel3,
              email: email,
              website: website,
              priority: priority,
              lat_lng: latlng,
              company: company,
              currency: currency,
              iban: iban,
              swift: swift,
              address2: Address2,
              continent: Continent.name ? Continent.name : 'N/A',
              country: Country.name ? Country.name : 'N/A',
              state: State.name ? State.name : 'N/A',
              city: City.name ? City.name : 'N/A',
              area: Area.name ? Area.name : 'N/A',
              postal: postal,
              number_of_rooms: numberOfRooms,
              checked_categories: checkedCategories,
            },
          }).then((res) => {
            if (props.redir) {
              window.location.href =
                "/data_management/hotel/" + res.data.new_hotel_id;
            } else {
              props.set_hotel(Name);
            }
          });
        } else {
          setPossibleDuplicates(res.data.possible_duplicates);
          setHasDuplicates(true);
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  const addHotelAnyway = () => {
    axios({
      method: "post",
      url: ADD_HOTEL,
      headers: headers,
      data: {
        name: Name,
        rating: Rating,
        address: Address,
        tel: tel,
        tel2: tel2,
        tel3: tel3,
        email: email,
        website: website,
        lat_lng: latlng,
        priority: priority,
        company: company,
        currency: currency,
        iban: iban,
        swift: swift,
        address2: Address2,
        continent: Continent.name ? Continent.name : 'N/A',
        country: Country.name ? Country.name : 'N/A',
        state: State.name ? State.name : 'N/A',
        city: City.name ? City.name : 'N/A',
        area: Area.name ? Area.name : 'N/A',
        postal: postal,
        number_of_rooms: numberOfRooms,
        checked_categories: checkedCategories,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/hotel/" + res.data.new_hotel_id;
        } else {
          props.set_hotel(Name);
          setPossibleDuplicates([]);
          setHasDuplicates(false);
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
        setPossibleDuplicates([]);
        setHasDuplicates(false);
      });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    // Parse the input value as an integer
    value = parseInt(value);

    // Ensure the value is within the range [0, 100]
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > 100) {
      value = 100;
    }

    // Update the state with the new value
    setPriority(value.toString());
  };

  const handleChangeNOR = (e) => {
    let value = e.target.value;
    // Parse the input value as an integer
    value = parseInt(value);

    // Ensure the value is within the range [0, 100]
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > 999) {
      value = 999;
    }

    // Update the state with the new value
    setNumberOfRooms(value.toString());
  };

  const getContinents = () => {
    axios
      .get(GET_CONTINENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllContinents(res.data.all_continents);
        setLoaded(true);
      });
  };

  const getCountries = () => {
    axios
      .get(GET_COUNTRIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCountries(res.data.all_countries);
        setLoaded(true);
      });
  };

  const getStates = () => {
    axios
      .get(GET_STATES, {
        headers: headers,
      })
      .then((res) => {
        setAllStates(res.data.all_states);
        setLoaded(true);
      });
  };

  const getCities = () => {
    axios
      .get(GET_CITIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCities(res.data.all_cities);
        setLoaded(true);
      });
  };

  const getAreas = () => {
    axios
      .get(GET_AREAS, {
        headers: headers,
      })
      .then((res) => {
        setAllAreas(res.data.all_areas);
        setLoaded(true);
      });
  };

  const getHotelCategories = () => {
    axios
      .get(GET_HOTEL_CATEGORIES, {
        headers: headers,
      })
      .then((res) => {
        setAllHotelCategories(res.data.all_hotel_categories);
      });
  };

  const handleRegionChange = (event, value, type) => {
    // CASE 1 : CONTINENT
    if (type === "Continent") {
      setContinent(value || "");
      setCountry("");
      setState("");
      setCity("");
      setArea("");
    }

    // CASE 2 : COUNTRY
    else if (type === "Country") {
      setContinent(value && value.continent ? value.continent : "");
      setCountry(value || "");
      setState("");
      setCity("");
      setArea("");
    }

    // CASE 3: STATE
    else if (type === "State") {
      setContinent(
        value && value.country && value.country.continent
          ? value.country.continent
          : ""
      );
      setCountry(value && value.country ? value.country : "");
      setState(value || "");
      setCity("");
      setArea("");
    }

    // CASE 4 : CITY
    else if (type === "City") {
      if (value && value.state) {
        setCity(value || "");
        setContinent(
          value.state.country && value.state.country.continent
            ? value.state.country.continent
            : ""
        );
        setCountry(value.state.country ? value.state.country : "");
        setState(value.state || "");
        setArea("");
      } else {
        setCity(value || "");
        setContinent(
          value && value.country && value.country.continent
            ? value.country.continent
            : ""
        );
        setCountry(value && value.country ? value.country : "");
        setState(value && value.state ? value.state : "");
        setArea("");
      }
    }

    // CASE 5 : AREA
    else if (type === "Area") {
      if (value && value.city && value.city.country) {
        setCity(value.city || "");
        setContinent(value.city.country.continent || "");
        setCountry(value.city.country || "");
        setState(value.city.state || "");
        setArea(value || "");
      } else if (
        value &&
        value.city &&
        value.city.state &&
        value.city.state.country
      ) {
        setCity(value.city || "");
        setContinent(value.city.state.country.continent || "");
        setCountry(value.city.state.country || "");
        setState(value.city.state || "");
        setArea(value || "");
      } else {
        setCity("");
        setContinent("");
        setCountry("");
        setState("");
        setArea(value || "");
      }
    }
  };
  const getFilteredCountries = () => {
    if (Continent) {
      return AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      );
    } else {
      return AllCountries;
    }
  };

  const getFilteredStates = () => {
    if (Country) {
      return AllStates.filter(
        (state) => state.country && state.country.name === Country.name
      );
    } else if (Continent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      ).map((country) => country.name);
      return AllStates.filter(
        (state) => state.country && countryNames.includes(state.country.name)
      );
    } else {
      return AllStates;
    }
  };

  const getFilteredCities = () => {
    if (State) {
      return AllCities.filter(
        (city) => city.state && city.state.name === State.name
      );
    } else if (Country) {
      let citiesWithCountryParent = AllCities.filter(
        (city) => city.country && city.country.name === Country.name
      );
      let statesInCountry = AllStates.filter(
        (state) => state.country && state.country.name === Country.name
      );
      let citiesWithStateParent = AllCities.filter((city) =>
        statesInCountry.some(
          (state) => city.state && city.state.name === state.name
        )
      );
      return [...citiesWithCountryParent, ...citiesWithStateParent];
    } else if (Continent) {
      let countriesInContinent = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      );
      let countryNames = countriesInContinent.map((country) => country.name);

      let statesInContinent = AllStates.filter((state) =>
        countriesInContinent.some(
          (country) => country.name === state.country.name
        )
      );
      let stateNames = statesInContinent.map((state) => state.name);

      return AllCities.filter((city) => {
        if (city.country && countryNames.includes(city.country.name)) {
          return true;
        }
        if (city.state && stateNames.includes(city.state.name)) {
          return true;
        }
        return false;
      });
    } else {
      return AllCities;
    }
  };

  const getFilteredAreas = () => {
    if (Area) {
      return AllAreas.filter((area) => area.name === Area.name);
    } else if (City) {
      return AllAreas.filter(
        (area) => area.city && area.city.name === City.name
      );
    } else if (State) {
      return AllAreas.filter(
        (area) =>
          area.city && area.city.state && area.city.state.name === State.name
      );
    } else if (Country) {
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          area.city.country.name === Country.name
      );
    } else if (Continent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === Continent.name
      ).map((country) => country.name);
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          countryNames.includes(area.city.country.name)
      );
    } else {
      return AllAreas;
    }
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          setRating(0);
          setAddress("");
          setTel("");
          setTel2("");
          setTel3("");
          setEmail("");
          setWebsite("");
          setLatLng("");
          getContinents();
          getCountries();
          getStates();
          getCities();
          getAreas();
          getHotelCategories();
          setAddPaymentDetails(false);
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Hotel
      </Button>

      {possibleDuplicates.length > 0 ? (
        <>
          <Modal
            basic
            show={hasDuplicates}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="xl"
          >
            <Modal.Header closeButton>
              <Modal.Title> Possible Duplicates </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <b style={{ color: "red" }}>
                There is a chance this hotel already exists in group plan's
                database. Please check out the following entries to avoid adding
                a duplicate hotel.
              </b>
              <hr />
              <ul>
                <Grid
                  columns={2}
                  style={{ marginLeft: 10 }}
                  divided="vertically"
                >
                  {possibleDuplicates.map((hotelData) => (
                    <>
                      <Grid.Row>
                        <Grid.Column>
                          <a
                            basic
                            className="possible_duplicate"
                            href={
                              "/data_management/hotel/" + hotelData.hotel.id
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {hotelData.hotel.id}) {hotelData.hotel.name}
                          </a>
                        </Grid.Column>
                        <Grid.Column>
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            Criteria met: {hotelData.criteria.join(", ")}
                          </span>
                        </Grid.Column>
                      </Grid.Row>
                    </>
                  ))}
                </Grid>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <p className="mr-auto"> Create anyway?</p>
              <Button
                color="red"
                style={{ marginRight: 10 }}
                onClick={() => {
                  setHasDuplicates(false);
                  setPossibleDuplicates([]);
                }}
              >
                <Icon name="remove" /> No
              </Button>
              <Button
                color="green"
                onClick={() => {
                  setShow(false);
                  addHotelAnyway();
                  setHasDuplicates(false);
                }}
              >
                <Icon name="checkmark" /> Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            show={show}
            size="lg"
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title> Create new Hotel </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="justify-content-md-center">
                <Col>
                  <Form>
                    <Form.Group>
                      <Form.Label>Name:</Form.Label>
                      <Form.Control
                        maxLength="63"
                        style={{ width: 400 }}
                        onChange={(e) =>
                          setName(allowAlpha(e.target.value.toUpperCase()))
                        }
                        value={Name}
                      />
                      <Form.Label>Rating:</Form.Label>
                      <select
                        className="form-control"
                        style={{ width: 400, marginBottom: 10 }}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        {Object.keys(rating_options).map((e) => (
                          <option value={rating_options[e]}>{e}</option>
                        ))}
                      </select>
                      <Form.Label>Address Line 1: </Form.Label>
                      <Form.Control
                        type="text"
                        style={{ width: "90%", display: "inline" }}
                        onChange={(e) =>
                          setAddress(e.target.value.toUpperCase())
                        }
                        value={Address}
                      />
                      {!showAddress2 && (
                        <div style={{ float: "right" }}>
                          Add Address Line 2.
                          <AiOutlinePlusSquare
                            className="plus-icon"
                            onClick={() => setShowAddress2(true)}
                          />
                        </div>
                      )}
                      {showAddress2 && (
                        <>
                          <Form.Label>Address Line 2: </Form.Label>
                          <Form.Control
                            type="text"
                            style={{ width: "90%", display: "inline" }}
                            onChange={(e) =>
                              setAddress2(e.target.value.toUpperCase())
                            }
                            value={Address2}
                          />
                          <FaMinus
                            className="minus-icon"
                            onClick={() => setShowAddress2(false)}
                            style={{ float: "right" }}
                          />
                        </>
                      )}

                      <Form.Label>Postal / Zip code: </Form.Label>
                      <Form.Control
                        type="text"
                        style={{ width: 200 }}
                        onChange={(e) => setPostal(e.target.value.toUpperCase())}
                        value={postal}
                      />
                      <Form.Label>Region: </Form.Label>
                      <Grid columns={5}>
                        <Grid.Column>
                          <Autocomplete
                            options={AllContinents}
                            className="select_airport"
                            disabled={!loaded}
                            onChange={(event, value) =>
                              handleRegionChange(event, value, "Continent")
                            }
                            getOptionLabel={(option) => option.name}
                            value={Continent}
                            style={{ width: 140, margin: 0 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Continent"
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid.Column>
                        <Grid.Column>
                          <Autocomplete
                            options={getFilteredCountries()}
                            className="select_airport"
                            disabled={!loaded}
                            onChange={(event, value) =>
                              handleRegionChange(event, value, "Country")
                            }
                            value={Country}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 140, margin: 0 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Country"
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid.Column>

                        {getFilteredStates().length > 0 ? (
                          <Grid.Column>
                            <Autocomplete
                              options={getFilteredStates()}
                              className="select_airport"
                              disabled={!loaded}
                              onChange={(event, value) =>
                                handleRegionChange(event, value, "State")
                              }
                              value={State}
                              style={{ width: 140, margin: 0 }}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="State"
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid.Column>
                        ) : (
                          ""
                        )}
                        <Grid.Column>
                          <Autocomplete
                            options={getFilteredCities()}
                            className="select_airport"
                            disabled={!loaded}
                            onChange={(event, value) =>
                              handleRegionChange(event, value, "City")
                            }
                            value={City}
                            filterOptions={Country ? undefined : filterOptions}
                            style={{ width: 140, margin: 0 }}
                            getOptionLabel={(option) =>
                              option.country
                                ? option.name + " - " + option.country.name
                                : option.name
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="City"
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid.Column>
                        <Grid.Column>
                          <Autocomplete
                            options={getFilteredAreas()}
                            className="select_airport"
                            disabled={!loaded}
                            onChange={(event, value) =>
                              handleRegionChange(event, value, "Area")
                            }
                            value={Area}
                            style={{ width: 140, margin: 0 }}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Area"
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid.Column>
                      </Grid>

                      <div style={{ float: "right" }}>
                        <AddRegionModal
                          redir={false}
                          get_cities={() => getCities()}
                        />
                      </div>

                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        maxLength="100"
                        style={{ width: 400 }}
                        onChange={(e) => {
                          setEmail(e.target.value.toLowerCase());
                        }}
                        value={email}
                      />
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="URL"
                        maxLength={63}
                        style={{ width: 400, marginBottom: 20 }}
                        onChange={(e) => {
                          setWebsite(e.target.value.toLowerCase());
                        }}
                        value={website}
                      />

                      <Grid columns={2}>
                        <Grid.Row style={{ marginLeft: 0, paddingTop: 0 }}>
                          <Grid.Column style={{ paddingTop: 0 }}>
                            <Form.Label>Tel: </Form.Label>
                            <PhoneInput
                              international
                              maxLength={20}
                              defaultCountry="GR"
                              countryCallingCodeEditable={false}
                              key={Country}
                              country={
                                Country.code ? Country.code.toLowerCase() : ""
                              }
                              value={tel}
                              onChange={setTel}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            {!showTel2 && (
                              <div style={{ marginTop: 30 }}>
                                Add Tel 2.
                                <AiOutlinePlusSquare
                                  className="plus-icon"
                                  onClick={() => setShowTel2(true)}
                                />
                              </div>
                            )}
                          </Grid.Column>
                        </Grid.Row>

                        {showTel2 && (
                          <>
                            <Grid.Column style={{ margin: 0, paddingTop: 0 }}>
                              <Form.Label>Tel. 2: </Form.Label>
                              <PhoneInput
                                international
                                maxLength={20}
                                defaultCountry="GR"
                                countryCallingCodeEditable={false}
                                key={Country}
                                country={
                                  Country.code ? Country.code.toLowerCase() : ""
                                }
                                value={tel2}
                                onChange={setTel2}
                              />
                            </Grid.Column>
                            <Grid.Column>
                              {!showTel3 && (
                                <>
                                  <div style={{ marginTop: 16 }}>
                                    Remove Tel 2.
                                    <FaMinus
                                      className="minus-icon"
                                      style={{ marginRight: 50 }}
                                      onClick={() => setShowTel2(false)}
                                    />
                                    Add Tel 3.
                                    <AiOutlinePlusSquare
                                      className="plus-icon"
                                      onClick={() => setShowTel3(true)}
                                    />
                                  </div>
                                </>
                              )}
                            </Grid.Column>
                          </>
                        )}

                        {showTel3 && (
                          <>
                            <Grid.Column style={{ margin: 0, paddingTop: 0 }}>
                              <Form.Label>Tel. 3: </Form.Label>
                              <PhoneInput
                                international
                                maxLength={20}
                                defaultCountry="GR"
                                countryCallingCodeEditable={false}
                                key={Country}
                                country={
                                  Country.code ? Country.code.toLowerCase() : ""
                                }
                                value={tel3}
                                onChange={setTel3}
                              />
                            </Grid.Column>
                            <Grid.Column>
                              <div style={{ marginTop: 16 }}>
                                Remove Tel 3.
                                <FaMinus
                                  className="minus-icon"
                                  onClick={() => setShowTel3(false)}
                                />
                              </div>
                            </Grid.Column>
                          </>
                        )}
                      </Grid>

                      <Form.Label>Lat / Lng</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength="80"
                        style={{ width: 400 }}
                        placeholder="37.984035, 23.728024"
                        onChange={(e) => {
                          setLatLng(e.target.value);
                        }}
                        value={latlng}
                      />

                      <Form.Label style={{marginTop: 10}}>Markets: </Form.Label>
                      <br/>
                        {AllHotelCategories.map((hc) => (
                          <Form.Check
                            label={hc.name}
                            checked={checkedCategories.includes(hc)}
                            onChange={() => handleCategoryChange(hc)}
                            style={{
                              display: "block", // Change this to block to stack vertically
                              borderBottom: "1px solid grey",
                              width: 200,
                              marginBottom: "5px", // Optional: add space between items
                            }}
                          />
                        ))}
                      <br/>
                      {/* <div style={{ float: "right" }}>
                        <AddHotelCategoryModal
                          get_hotel_categories={() => getHotelCategories()}
                        />
                      </div> */}

                      <Form.Label>Priority:</Form.Label>
                      <Form.Control
                        type="number"
                        value={priority}
                        style={{ width: 120 }}
                        onChange={handleChange}
                        max={100}
                        min={0}
                      />

                      <Form.Label>Number Of Rooms:</Form.Label>
                      <Form.Control
                        type="number"
                        value={numberOfRooms}
                        style={{ width: 120 }}
                        onChange={handleChangeNOR}
                        max={999}
                        min={0}
                      />

                      <div style={{ marginTop: 10 }}>
                        <Checkbox
                          label={"Add Payment Details?"}
                          value={addPaymentDetails}
                          onChange={handleCheckBox}
                        />
                      </div>
                      {addPaymentDetails ? (
                        <>
                          <Form.Label>Company:</Form.Label>
                          <Form.Control
                            maxLength="255"
                            onChange={(e) => setCompany(e.currentTarget.value.toUpperCase())}
                            value={company}
                          />
                          <Form.Label>Currency:</Form.Label>
                          <select
                            className="form-control"
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ marginBottom: 10, width: "40%" }}
                          >
                            <option value="EUR"> € Euro (EUR) </option>
                            <option value="GBP">
                              £ Pound Sterling (GBP)
                            </option>
                            <option value="USD"> $ US Dollar (USD) </option>
                            <option value="CAD">
                              $ Canadian Dollar (CAD)
                            </option>
                            <option value="AUD">
                              $ Australian Dollar (AUD)
                            </option>
                            <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                            <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                            <option value="NZD">
                              $ New Zealand Dollar (NZD)
                            </option>
                            <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                            <option value="SGD">
                              $ Singapore Dollar (SGD)
                            </option>
                          </select>
                          <Form.Label>
                            {currency === "GBP" ? "Account Number" : "IBAN"} :
                          </Form.Label>
                          <Form.Control
                            maxLength="50"
                            onChange={(e) =>
                              setIban(e.currentTarget.value.toUpperCase())
                            }
                            value={iban}
                          />
                          <Form.Label>
                            {currency === "GBP" ? "Sort Code" : "Swift"} :
                          </Form.Label>
                          <Form.Control
                            maxLength="50"
                            onChange={(e) =>
                              setSwift(e.currentTarget.value.toUpperCase())
                            }
                            value={swift}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <small className="mr-auto">
                <BsInfoSquare
                  style={{
                    color: "#F3702D",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                All fields except Tel2 and Tel3 are required to create a hotel.
                {Name.length < 2 ||
                Address.length < 5 ||
                !tel ||
                !isValidLatLng(latlng) ||
                email.length < 2 ||
                website.length < 2 ||
                !postal ||
                checkedCategories.length === 0 ||
                !City ||
                (addPaymentDetails && !iban) ||
                (addPaymentDetails && !swift) ? (
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
                        {Name.length < 2 ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Fill The Name Field.
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {email.length < 2 ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Fill The Email Field.
                          </>
                        ) : (
                          ""
                        )}
                      </li>

                      <li>
                        {website.length < 2 ? (
                          <>
                            <AiOutlineWarning style={warningStyle} />
                            Fill The Website Field.
                          </>
                        ) : (
                          ""
                        )}
                      </li>

                      <li>
                        {Address.length < 5 ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Fill The
                            Address Field.
                          </>
                        ) : (
                          ""
                        )}
                      </li>

                      <li>
                        {!tel ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Fill The
                            Tel Field.
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {!isValidLatLng(latlng) ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Fill The
                            Lat / Lng Field
                          </>
                        ) : (
                          ""
                        )}
                      </li>

                      <li>
                        {checkedCategories.length === 0 ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Add At Least one hotel market.
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {!City ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Select A
                            City
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {!postal ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Fill The
                            Postal / Zip code Field.
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {addPaymentDetails && !iban ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Payment
                            Details must include an IBAN or Account Number.
                          </>
                        ) : (
                          ""
                        )}
                      </li>
                      <li>
                        {addPaymentDetails && !swift ? (
                          <>
                            <AiOutlineWarning style={warningStyle} /> Payment
                            Details must include either sort code or Swift.
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
                        <AiOutlineCheckCircle
                          style={checkStyle}
                        /> Validated
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
                onClick={() => {
                  handleClose();
                  createNewHotel();
                }}
                disabled={
                  Name.length < 2 ||
                  email.length < 2 ||
                  website.length < 2 ||
                  Address.length === 0 ||
                  checkedCategories.length === 0 ||
                  tel.length === 0 ||
                  !postal ||
                  !City ||
                  !isValidLatLng(latlng) ||
                  (addPaymentDetails && !iban) ||
                  (addPaymentDetails && !swift)
                }
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default AddHotelModal;
