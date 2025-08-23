// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

// Global Variables
import { headers, isValidLatLng } from "../../global_vars";

// Custom Made Components
import AddRegionModal from "./add_region_modal";

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

const ADD_AIRPORT = "http://localhost:8000/api/view/add_airport/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";
const GET_AREAS = "http://localhost:8000/api/view/get_all_areas/";

const allowAlpha = (value) => {
  return value.replace(/[^\p{L}\s.\-/&\u4e00-\u9eff]/gu, "");
};

function AddAirportModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [latlng, setLatLng] = useState("");
  let [loaded, setLoaded] = useState(false);

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

  const createNewAirport = () => {
    axios({
      method: "post",
      url: ADD_AIRPORT,
      headers: headers,
      data: {
        name: Name,
        lat_lng: latlng,
        continent: Continent.name ? Continent.name : 'N/A',
        country: Country.name ? Country.name : 'N/A',
        state: State.name ? State.name : 'N/A',
        city: City.name ? City.name : 'N/A',
        area: Area.name ? Area.name : 'N/A',
      },
    })
    .then((res) => {
      if (props.redir) {
        window.location.href =
          "/data_management/airport/" + res.data.new_airport_name;
      } else {
        props.set_airport(Name);
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
    axios.get(GET_AREAS, {
      headers: headers,
    }).then((res) => {
      setAllAreas(res.data.all_areas);
      setLoaded(true);
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

  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
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
          setLatLng("");
          getContinents();
          getCountries();
          getStates();
          getCities();
          getAreas();
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Airport
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Airport </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Name: </Form.Label>
                  <Form.Control
                    maxLength="3"
                    style={{ width: 400 }}
                    onChange={(e) => {
                      setName(allowAlpha(e.target.value).toUpperCase());
                    }}
                    value={Name}
                    placeholder="ATH"
                  />
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
                  <br />
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
                        style={{ width: 138, margin: 0 }}
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
                        style={{ width: 138, margin: 0 }}
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
                          style={{ width: 138, margin: 0 }}
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
                        onChange={(event, value) => handleRegionChange(event, value, "City")}
                        value={City}
                        style={{ width: 138, margin: 0 }}
                        getOptionLabel={(option) =>
                          option.country
                            ? option.name + " - " + option.country.name
                            : option.name
                        }
                        filterOptions={Country ? undefined : filterOptions}
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
                        style={{ width: 138, margin: 0 }}
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
                    <div style={{ float: "right" }}>
                      <AddRegionModal
                        redir={false}
                        get_cities={() => getCities()}
                      />
                    </div>
                  </Grid>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {Name.length < 2 || !isValidLatLng(latlng) || !City ? (
              <>
                <ul style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  <li>
                    {Name.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Name Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!isValidLatLng(latlng) ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Lat / Lng Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!City ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select A City
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
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li> <AiOutlineCheckCircle style={checkStyle} /> Validated </li>
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
              createNewAirport();
            }}
            disabled={Name.length < 2 || !isValidLatLng(latlng) || !City}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddAirportModal;
