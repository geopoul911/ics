// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Global Variables
import { headers, isValidLatLng } from "../../global_vars";

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

const ADD_REGION = "http://localhost:8000/api/view/add_region/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";

function AddRegionModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [Continent, setContinent] = useState("");
  const [Country, setCountry] = useState("");
  const [State, setState] = useState("");
  const [City, setCity] = useState("");
  const [latlng, setLatLng] = useState("");

  const [regionType, setRegionType] = useState("Continent");

  let [AllContinents, setAllContinents] = useState([]);
  let [AllCountries, setAllCountries] = useState([]);
  let [AllStates, setAllStates] = useState([]);
  let [AllCities, setAllCities] = useState([]);

  let [countryOrState, setCountryOrState] = useState("Country");
  let [loaded, setLoaded] = useState(false);
  let [markup, setMarkup] = useState(0);

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

  const createNewRegion = () => {
    axios({
      method: "post",
      url: ADD_REGION,
      headers: headers,
      data: {
        name: name,
        region_type: regionType,
        lat_lng: latlng,
        continent: Continent,
        country: Country,
        state: State,
        city: City,
        markup: markup,
        country_or_state: countryOrState,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/region/" +
            res.data.new_region_type +
            "/" +
            res.data.new_region_id;
        } else {
          props.get_cities();
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

  const handleMarkup = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setMarkup(value);
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
        style={{ margin: 10 }}
        onClick={(e) => {
          e.preventDefault();
          handleShow();
          setLatLng("");
          getContinents();
          getCountries();
          getStates();
          getCities();
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Region
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Region </Modal.Title>
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
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                  <Form.Label>Type:</Form.Label>
                  <select
                    value={regionType}
                    onChange={(e) => setRegionType(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: 300, marginBottom: 10 }}
                  >
                    <option value="Continent">Continent</option>
                    <option value="Country">Country</option>
                    <option value="State">State</option>
                    <option value="City">City</option>
                    <option value="Area">Area</option>
                  </select>

                  {regionType === "Country" ? (
                    <>
                      <Form.Label>Continent:</Form.Label>
                      <br />
                      <Autocomplete
                        options={AllContinents}
                        className={"select_airport"}
                        disabled={!loaded}
                        maxLength="63"
                        onChange={(e) => {
                          setContinent(e.target.innerText);
                        }}
                        disableClearable
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300, margin: 0, marginBottom: 10 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Continent"
                            variant="outlined"
                          />
                        )}
                      />
                      {loaded ? (
                        ""
                      ) : (
                        <Spinner
                          animation="border"
                          variant="info"
                          size="sm"
                          style={{ position: "fixed", margin: 20 }}
                        />
                      )}
                      <br />
                    </>
                  ) : (
                    ""
                  )}

                  {regionType === "State" ? (
                    <>
                      <Form.Label>Country:</Form.Label>
                      <br />
                      <Autocomplete
                        options={AllCountries}
                        className={"select_airport"}
                        disabled={!loaded}
                        maxLength="63"
                        onChange={(e) => {
                          setCountry(e.target.innerText);
                        }}
                        disableClearable
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300, margin: 0, marginBottom: 10 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select country"
                            variant="outlined"
                          />
                        )}
                      />
                      {loaded ? (
                        ""
                      ) : (
                        <Spinner
                          animation="border"
                          variant="info"
                          size="sm"
                          style={{ position: "fixed", margin: 20 }}
                        />
                      )}
                      <br />
                    </>
                  ) : (
                    ""
                  )}

                  {regionType === "City" ? (
                    <>
                      <Form.Label>{countryOrState}</Form.Label>
                      <div style={{ marginBottom: 10 }}>
                        <Button
                          color={countryOrState === "Country" ? "green" : ""}
                          onClick={() => {
                            setCountryOrState("Country");
                          }}
                          type="button"
                        >
                          Country:
                        </Button>
                        <Button
                          color={countryOrState === "State" ? "green" : ""}
                          onClick={() => {
                            setCountryOrState("State");
                          }}
                          type="button"
                        >
                          State:
                        </Button>
                      </div>

                      {countryOrState === "Country" ? (
                        <>
                          <Form.Label>Country:</Form.Label>
                          <br />
                          <Autocomplete
                            options={AllCountries}
                            className={"select_airport"}
                            disabled={!loaded}
                            maxLength="63"
                            onChange={(e) => {
                              setCountry(e.target.innerText);
                            }}
                            disableClearable
                            getOptionLabel={(option) =>
                            option.country
                              ? option.name + " - " + option.country.name
                              : option.name
                            }
                            style={{ width: 300, margin: 0, marginBottom: 10 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select country"
                                variant="outlined"
                              />
                            )}
                          />
                          {loaded ? (
                            ""
                          ) : (
                            <Spinner
                              animation="border"
                              variant="info"
                              size="sm"
                              style={{ position: "fixed", margin: 20 }}
                            />
                          )}
                          <br />
                        </>
                      ) : (
                        <>
                          <Autocomplete
                            options={AllStates}
                            className={"select_airport"}
                            disabled={!loaded}
                            maxLength="63"
                            onChange={(e) => {
                              setState(e.target.innerText);
                            }}
                            disableClearable
                            getOptionLabel={(option) => option.name}
                            style={{ width: 300, margin: 0, marginBottom: 10 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select State"
                                variant="outlined"
                              />
                            )}
                          />
                          {loaded ? (
                            ""
                          ) : (
                            <Spinner
                              animation="border"
                              variant="info"
                              size="sm"
                              style={{ position: "fixed", margin: 20 }}
                            />
                          )}
                        </>
                      )}
                      <br />
                    </>
                  ) : (
                    ""
                  )}

                  {regionType === "Area" ? (
                    <>
                      <Form.Label>City:</Form.Label>
                      <br />
                      <Autocomplete
                        options={AllCities}
                        className={"select_airport"}
                        disabled={!loaded}
                        maxLength="63"
                        onChange={(e) => {
                          setCity(e.target.innerText.split(" - ")[0]);
                          // what if it is a state
                          setCountry(e.target.innerText.split(" - ")[1]);
                        }}
                        disableClearable
                        getOptionLabel={(option) =>
                          option.country ?  option.name + " - " + option.country.name : option.name + " - " + option.state.name
                        }
                        style={{ width: 300, margin: 0, marginBottom: 10 }}
                        filterOptions={filterOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select City"
                            variant="outlined"
                          />
                        )}
                      />
                      {loaded ? (
                        ""
                      ) : (
                        <Spinner
                          animation="border"
                          variant="info"
                          size="sm"
                          style={{ position: "fixed", margin: 20 }}
                        />
                      )}
                      <br />
                    </>
                  ) : (
                    ""
                  )}
                  <Form.Label>Lat / Lng:</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength="80"
                    regionholder="37.984035, 23.728024"
                    onChange={(e) => {
                      setLatLng(e.target.value);
                    }}
                    style={{ width: 300, margin: 0 }}
                    value={latlng}
                  />
                  <Form.Label style={{ marginTop: 10 }}>
                    Markup ( % ):
                  </Form.Label>
                  <input
                    type="number"
                    className="form-control"
                    value={markup}
                    onChange={handleMarkup}
                    min="0"
                    max="100"
                    step="1"
                    style={{ width: 100, marginTop: 10 }}
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
                fontSize: "1.4em",
                marginRight: "0.5em",
              }}
            />
            Tree: Continent {">>>"} Country {">>>"} State / City {">>>"} Area
            {name.length < 2 ||
            !isValidLatLng(latlng) ||
            (regionType === "Country" && !Continent) ||
            (regionType === "State" && !Country) ||
            (regionType === "City" && !Country && !State) ||
            (regionType === "Area" && !City) ||
            markup === "" ||
            markup < 0 ||
            markup > 100 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, color: "red" }}
                >
                  <li>
                    {name.length < 2 ? (
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
                        <AiOutlineWarning style={warningStyle} /> Fill The Lat /
                        Lng Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {regionType === "Country" && !Continent ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Continent Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {regionType === "State" && !Country ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Country Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {regionType === "City" && !Country && !State ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Country or State Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {regionType === "Area" && !City ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The City
                        Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {markup === "" || markup < 0 || markup > 100 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Markup Field
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
                  style={{ margin: 0, padding: 0, color: "green" }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
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
              createNewRegion();
            }}
            disabled={
              name.length < 2 ||
              !isValidLatLng(latlng) ||
              (regionType === "Country" && !Continent) ||
              (regionType === "State" && !Country) ||
              (regionType === "City" && !Country && !State) ||
              (regionType === "Area" && !City) ||
              markup === "" ||
              markup < 0 ||
              markup > 100
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddRegionModal;
