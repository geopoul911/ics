// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import {
  Modal,
  Form,
} from "react-bootstrap";
import { Button, Grid,  } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Global Variables
import { headers } from "../../global_vars";

// Custom Made Components
import AddRegionModal from "../../modals/create/add_region_modal";

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

const ADD_ROUTE = "http://localhost:8000/api/data_management/add_route/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";
const GET_AREAS = "http://localhost:8000/api/view/get_all_areas/";

function AddRoute(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [srcContinent, setSrcContinent] = useState("");
  const [srcCountry, setSrcCountry] = useState("");
  const [srcState, setSrcState] = useState("");
  const [srcCity, setSrcCity] = useState("");
  const [srcArea, setSrcArea] = useState("");

  const [dstContinent, setDstContinent] = useState("");
  const [dstCountry, setDstCountry] = useState("");
  const [dstState, setDstState] = useState("");
  const [dstCity, setDstCity] = useState("");
  const [dstArea, setDstArea] = useState("");
  
  let [loaded, setLoaded] = useState(false);
  
  let [AllContinents, setAllContinents] = useState([]);
  let [AllCountries, setAllCountries] = useState([]);
  let [AllStates, setAllStates] = useState([]);
  let [AllCities, setAllCities] = useState([]);
  let [AllAreas, setAllAreas] = useState([]);


  console.log(srcCity)

  const createRoute = () => {
    axios({
      method: "post",
      url: ADD_ROUTE,
      headers: headers,
      data: {
        fta_id: props.fta_id,
        src: srcCity.name + ' - ' + srcCountry.name,
        dst: dstCity.name + ' - ' + dstCountry.name,
      },
    })
    .then((res) => {
      props.update_state(res.data.ferry_ticket_agency);
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
    axios
      .get(GET_AREAS, {
        headers: headers,
      })
      .then((res) => {
        setAllAreas(res.data.all_areas);
        setLoaded(true);
      });
  };

  const handleSrcRegionChange = (event, value, type) => {
    // CASE 1 : CONTINENT
    if (type === "Continent") {
      setSrcContinent(value || "");
      setSrcCountry("");
      setSrcState("");
      setSrcCity("");
      setSrcArea("");
    }

    // CASE 2 : COUNTRY
    else if (type === "Country") {
      setSrcContinent(value && value.continent ? value.continent : "");
      setSrcCountry(value || "");
      setSrcState("");
      setSrcCity("");
      setSrcArea("");
    }

    // CASE 3: STATE
    else if (type === "State") {
      setSrcContinent(
        value && value.country && value.country.continent
          ? value.country.continent
          : ""
      );
      setSrcCountry(value && value.country ? value.country : "");
      setSrcState(value || "");
      setSrcCity("");
      setSrcArea("");
    }

    // CASE 4 : CITY
    else if (type === "City") {
      if (value && value.state) {
        setSrcCity(value || "");
        setSrcContinent(
          value.state.country && value.state.country.continent
            ? value.state.country.continent
            : ""
        );
        setSrcCountry(value.state.country ? value.state.country : "");
        setSrcState(value.state || "");
        setSrcArea("");
      } else {
        setSrcCity(value || "");
        setSrcContinent(
          value && value.country && value.country.continent
            ? value.country.continent
            : ""
        );
        setSrcCountry(value && value.country ? value.country : "");
        setSrcState(value && value.state ? value.state : "");
        setSrcArea("");
      }
    }

    // CASE 5 : AREA
    else if (type === "Area") {
      if (value && value.city && value.city.country) {
        setSrcCity(value.city || "");
        setSrcContinent(value.city.country.continent || "");
        setSrcCountry(value.city.country || "");
        setSrcState(value.city.state || "");
        setSrcArea(value || "");
      } else if (
        value &&
        value.city &&
        value.city.state &&
        value.city.state.country
      ) {
        setSrcCity(value.city || "");
        setSrcContinent(value.city.state.country.continent || "");
        setSrcCountry(value.city.state.country || "");
        setSrcState(value.city.state || "");
        setSrcArea(value || "");
      } else {
        setSrcCity("");
        setSrcContinent("");
        setSrcCountry("");
        setSrcState("");
        setSrcArea(value || "");
      }
    }
  };



  const handleDstRegionChange = (event, value, type) => {
    // CASE 1 : CONTINENT
    if (type === "Continent") {
      setDstContinent(value || "");
      setDstCountry("");
      setDstState("");
      setDstCity("");
      setDstArea("");
    }

    // CASE 2 : COUNTRY
    else if (type === "Country") {
      setDstContinent(value && value.continent ? value.continent : "");
      setDstCountry(value || "");
      setDstState("");
      setDstCity("");
      setDstArea("");
    }

    // CASE 3: STATE
    else if (type === "State") {
      setDstContinent(
        value && value.country && value.country.continent
          ? value.country.continent
          : ""
      );
      setDstCountry(value && value.country ? value.country : "");
      setDstState(value || "");
      setDstCity("");
      setDstArea("");
    }

    // CASE 4 : CITY
    else if (type === "City") {
      if (value && value.state) {
        setDstCity(value || "");
        setDstContinent(
          value.state.country && value.state.country.continent
            ? value.state.country.continent
            : ""
        );
        setDstCountry(value.state.country ? value.state.country : "");
        setDstState(value.state || "");
        setDstArea("");
      } else {
        setDstCity(value || "");
        setDstContinent(
          value && value.country && value.country.continent
            ? value.country.continent
            : ""
        );
        setDstCountry(value && value.country ? value.country : "");
        setDstState(value && value.state ? value.state : "");
        setDstArea("");
      }
    }

    // CASE 5 : AREA
    else if (type === "Area") {
      if (value && value.city && value.city.country) {
        setDstCity(value.city || "");
        setDstContinent(value.city.country.continent || "");
        setDstCountry(value.city.country || "");
        setDstState(value.city.state || "");
        setDstArea(value || "");
      } else if (
        value &&
        value.city &&
        value.city.state &&
        value.city.state.country
      ) {
        setDstCity(value.city || "");
        setDstContinent(value.city.state.country.continent || "");
        setDstCountry(value.city.state.country || "");
        setDstState(value.city.state || "");
        setDstArea(value || "");
      } else {
        setSrcCity("");
        setSrcContinent("");
        setSrcCountry("");
        setSrcState("");
        setSrcArea(value || "");
      }
    }
  };


  const getFilteredSrcCountries = () => {
    if (srcContinent) {
      return AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === srcContinent.name
      );
    } else {
      return AllCountries;
    }
  };

  const getFilteredSrcStates = () => {
    if (srcCountry) {
      return AllStates.filter(
        (state) => state.country && state.country.name === srcCountry.name
      );
    } else if (srcContinent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === srcContinent.name
      ).map((country) => country.name);
      return AllStates.filter(
        (state) => state.country && countryNames.includes(state.country.name)
      );
    } else {
      return AllStates;
    }
  };

  const getFilteredSrcCities = () => {
    if (srcState) {
      return AllCities.filter(
        (city) => city.state && city.state.name === srcState.name
      );
    } else if (srcCountry) {
      let citiesWithCountryParent = AllCities.filter(
        (city) => city.country && city.country.name === srcCountry.name
      );
      let statesInCountry = AllStates.filter(
        (state) => state.country && state.country.name === srcCountry.name
      );
      let citiesWithStateParent = AllCities.filter((city) =>
        statesInCountry.some(
          (state) => city.state && city.state.name === state.name
        )
      );
      return [...citiesWithCountryParent, ...citiesWithStateParent];
    } else if (srcContinent) {
      let countriesInContinent = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === srcContinent.name
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

  const getFilteredSrcAreas = () => {
    if (srcArea) {
      return AllAreas.filter((area) => area.name === srcArea.name);
    } else if (srcCity) {
      return AllAreas.filter(
        (area) => area.city && area.city.name === srcCity.name
      );
    } else if (srcState) {
      return AllAreas.filter(
        (area) =>
          area.city && area.city.state && area.city.state.name === srcState.name
      );
    } else if (srcCountry) {
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          area.city.country.name === srcCountry.name
      );
    } else if (srcContinent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === srcContinent.name
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



  const getFilteredDstCountries = () => {
    if (dstContinent) {
      return AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === dstContinent.name
      );
    } else {
      return AllCountries;
    }
  };

  const getFilteredDstStates = () => {
    if (dstCountry) {
      return AllStates.filter(
        (state) => state.country && state.country.name === dstCountry.name
      );
    } else if (dstContinent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === dstContinent.name
      ).map((country) => country.name);
      return AllStates.filter(
        (state) => state.country && countryNames.includes(state.country.name)
      );
    } else {
      return AllStates;
    }
  };

  const getFilteredDstCities = () => {
    if (dstState) {
      return AllCities.filter(
        (city) => city.state && city.state.name === dstState.name
      );
    } else if (dstCountry) {
      let citiesWithCountryParent = AllCities.filter(
        (city) => city.country && city.country.name === dstCountry.name
      );
      let statesInCountry = AllStates.filter(
        (state) => state.country && state.country.name === dstCountry.name
      );
      let citiesWithStateParent = AllCities.filter((city) =>
        statesInCountry.some(
          (state) => city.state && city.state.name === state.name
        )
      );
      return [...citiesWithCountryParent, ...citiesWithStateParent];
    } else if (dstContinent) {
      let countriesInContinent = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === dstContinent.name
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

  const getFilteredDstAreas = () => {
    if (dstArea) {
      return AllAreas.filter((area) => area.name === dstArea.name);
    } else if (dstCity) {
      return AllAreas.filter(
        (area) => area.city && area.city.name === dstCity.name
      );
    } else if (dstState) {
      return AllAreas.filter(
        (area) =>
          area.city && area.city.state && area.city.state.name === dstState.name
      );
    } else if (dstCountry) {
      return AllAreas.filter(
        (area) =>
          area.city &&
          area.city.country &&
          area.city.country.name === dstCountry.name
      );
    } else if (dstContinent) {
      let countryNames = AllCountries.filter(
        (country) =>
          country.continent && country.continent.name === dstContinent.name
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




  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  return (
    <>
      <Button color="green" onClick={() => {
        handleShow();
        getContinents();
        getCountries();
        getStates();
        getCities();
        getAreas();
      }}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}/>
        Add a new route
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Add a new route </Modal.Title>
        </Modal.Header>
        <Modal.Body>


        <Form.Group>
          <Form.Label>Source: </Form.Label>
          <Grid columns={5}>
            <Grid.Column>
              <Autocomplete
                options={AllContinents}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleSrcRegionChange(event, value, "Continent")
                }
                getOptionLabel={(option) => option.name}
                value={srcContinent}
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
                options={getFilteredSrcCountries()}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleSrcRegionChange(event, value, "Country")
                }
                value={srcCountry}
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

            {getFilteredSrcStates().length > 0 ? (
              <Grid.Column>
                <Autocomplete
                  options={getFilteredSrcStates()}
                  className="select_airport"
                  disabled={!loaded}
                  onChange={(event, value) =>
                    handleSrcRegionChange(event, value, "State")
                  }
                  value={srcState}
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
                options={getFilteredSrcCities()}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleSrcRegionChange(event, value, "City")
                }
                value={srcCity}
                filterOptions={srcCountry ? undefined : filterOptions}
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
                options={getFilteredSrcAreas()}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleSrcRegionChange(event, value, "Area")
                }
                value={srcArea}
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

          <hr/>

          <Form.Label>Destination: </Form.Label>
          <Grid columns={5}>
            <Grid.Column>
              <Autocomplete
                options={AllContinents}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleDstRegionChange(event, value, "Continent")
                }
                getOptionLabel={(option) => option.name}
                value={dstContinent}
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
                options={getFilteredDstCountries()}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleDstRegionChange(event, value, "Country")
                }
                value={dstCountry}
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

            {getFilteredDstStates().length > 0 ? (
              <Grid.Column>
                <Autocomplete
                  options={getFilteredDstStates()}
                  className="select_airport"
                  disabled={!loaded}
                  onChange={(event, value) =>
                    handleDstRegionChange(event, value, "State")
                  }
                  value={dstState}
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
                options={getFilteredDstCities()}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleDstRegionChange(event, value, "City")
                }
                value={dstCity}
                filterOptions={dstCountry ? undefined : filterOptions}
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
                options={getFilteredDstAreas()}
                className="select_airport"
                disabled={!loaded}
                onChange={(event, value) =>
                  handleDstRegionChange(event, value, "Area")
                }
                value={dstArea}
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
          <hr/>
          <div style={{ float: "right" }}>
            <AddRegionModal
              redir={false}
              get_cities={() => getCities()}
            />
          </div>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!srcCity && !dstCity ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!srcCity ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Source Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>

                  <li>
                    {!dstCity ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Destination Field.
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
            onClick={() => {
              handleClose();
              createRoute();
            }}
            disabled={!srcCity && !dstCity}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddRoute;
