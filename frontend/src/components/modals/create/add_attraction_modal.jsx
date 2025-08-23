// Built-ins
import { useState } from "react";
import "react-phone-number-input/style.css";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlinePlusSquare } from "react-icons/ai";
import { FaMinus } from "react-icons/fa";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";

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

const ADD_ATTRACTION = "http://localhost:8000/api/view/add_attraction/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";
const GET_AREAS = "http://localhost:8000/api/view/get_all_areas/";

const AttractionDescr = {
  HS: "Monuments, Landmarks, Ancient Ruins, and heritage sites.",
  MS: "Art Museums, History Museums, Science Museums, and Cultural Museums",
  TP: "Amusement parks with rides, shows, and entertainment.",
  NP: "National parks, wildlife reserves, and nature conservation areas.",
  ZA: "Places to observe and learn about animals and marine life.",
  BG: "Gardens with diverse plant collections and landscapes.",
  LM: "Iconic structures or sites that hold significance.",
  AM: "Unique and impressive architectural structures.",
  AG: "Spaces to showcase and appreciate various forms of art.",
  CF: "Celebrations of local traditions, music, and cuisine.",
  SA: "Stadiums and arenas for sporting events and concerts",
  BC: "Scenic shorelines for relaxation and water activities.",
  SD: "Vibrant markets, malls, and shopping streets.",
  AD: "Places for thrilling activities like zip-lining, rock climbing, and rope courses.",
  SC: "Interactive museums that explore science and technology.",
  OS: "Facilities for stargazing and learning about astronomy.",
  CP: "Historical royal residences and fortresses.",
  WV: " Historical royal residences and fortresses.",
  CT: "Food and beverage-related tours and tastings.",
  CD: "Cathedrals And Churches",
};

function AddAttractionModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [Type, setType] = useState("HS");
  const [latlng, setLatLng] = useState("");
  let [loaded, setLoaded] = useState(false);

  const [tel, setTel] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [showTel2, setShowTel2] = useState(false);
  const [showTel3, setShowTel3] = useState(false);
  const [email, setEmail] = useState("");

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

  const createNewAttraction = () => {
    axios({
      method: "post",
      url: ADD_ATTRACTION,
      headers: headers,
      data: {
        name: Name,
        type: Type,
        tel: tel,
        tel2: tel2,
        tel3: tel3,
        email: email,
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
            "/data_management/attraction/" + res.data.new_attraction_id;
        } else {
          props.set_agent(Name);
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
    axios
      .get(GET_AREAS, {
        headers: headers,
      })
      .then((res) => {
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
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          setType("HS");
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
        Create new Attraction
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Attraction </Modal.Title>
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
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    value={Name}
                    placeholder="Fontana Di Trevi"
                  />
                  <Form.Label>Type</Form.Label>
                  <select
                    className="form-control"
                    style={{ width: 400, marginLeft: 0 }}
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                  >
                    <option value="HS"> Historical Sites </option>
                    <option value="MS"> Museums </option>
                    <option value="TP"> Theme Parks </option>
                    <option value="NP"> Natural Parks </option>
                    <option value="ZA"> Zoos And Aquariums </option>
                    <option value="BG"> Botanical Gardens </option>
                    <option value="LM"> Landmarks </option>
                    <option value="AM"> Architectural Marvels </option>
                    <option value="AG"> Art Galleries </option>
                    <option value="CF"> Cultural Festivals </option>
                    <option value="SA"> Sport Arenas </option>
                    <option value="BC"> Beaches and Coastal Areas </option>
                    <option value="SD"> Shopping Districts </option>
                    <option value="AD"> Adventure Parks </option>
                    <option value="SC"> Science Centers </option>
                    <option value="OS"> Observatory </option>
                    <option value="CP"> Castles and Palaces </option>
                    <option value="WV"> Wineries and Vineyards </option>
                    <option value="CT"> Culinary Tours </option>
                    <option value="CD"> Cathedrals And Churches </option>
                  </select>
                  <small className="mr-auto">
                    <BsInfoSquare
                      style={{
                        color: "#F3702D",
                        fontSize: "1.5em",
                        marginRight: "0.5em",
                      }}
                    />
                    {AttractionDescr[Type]}
                  </small>
                  <hr />
                  <Form.Label>Email</Form.Label>
                    <Form.Control
                      maxLength="100"
                      style={{ width: 400, marginBottom: 20 }}
                      onChange={(e) => {
                        setEmail(e.target.value.toLowerCase());
                      }}
                      value={email}
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
                        style={{ width: 140, margin: 0 }}
                        filterOptions={Country ? undefined : filterOptions}
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
            All fields are required to create a attraction.
            {Name.length < 2 || !City || !isValidLatLng(latlng) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Name.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Name
                        Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!isValidLatLng(latlng) ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Lat / Lng Field.
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
              createNewAttraction();
            }}
            disabled={Name.length < 2 || !City || !isValidLatLng(latlng)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddAttractionModal;
