// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Col, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import { BsInfoSquare } from "react-icons/bs";
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

const CHANGE_PARENT_REGION =
  "http://localhost:8000/api/data_management/change_parent_region/";
const GET_CONTINENTS = "http://localhost:8000/api/view/get_all_continents/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";
const GET_STATES = "http://localhost:8000/api/view/get_all_states/";
const GET_CITIES = "http://localhost:8000/api/view/get_all_cities/";

function ChangeLandmark(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [Continent, setContinent] = useState("");
  const [Country, setCountry] = useState("");
  const [State, setState] = useState("");
  const [City, setCity] = useState("");

  let [AllContinents, setAllContinents] = useState([]);
  let [AllCountries, setAllCountries] = useState([]);
  let [AllStates, setAllStates] = useState([]);
  let [AllCities, setAllCities] = useState([]);

  let [countryOrState, setCountryOrState] = useState("country");
  let [loaded, setLoaded] = useState(false);

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

  const updateParentRegion = () => {
    axios({
      method: "post",
      url: CHANGE_PARENT_REGION,
      headers: headers,
      data: {
        region_id: props.object_id,
        object_type: props.object_type,
        continent: Continent,
        country: Country,
        state: State,
        city: City,
        country_or_state: countryOrState,
      },
    })
      .then((res) => {
        props.update_state(res.data.object);
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
      <FiEdit2
        title={"edit parent region"}
        id={"edit_place_name"}
        onClick={() => {
          handleShow();
          getContinents();
          getCountries();
          getStates();
          getCities();
          setContinent("");
          setCountry("");
          setState("");
          setCity("");
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change Parent Region for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Type:
            </Form.Label>
            <Col sm="10">
              <select
                disabled
                className="form-control"
                style={{ width: 300, marginBottom: 10 }}
              >
                <option>{`${props.object_type
                  .charAt(0)
                  .toUpperCase()}${props.object_type.slice(1)}`}</option>
              </select>
            </Col>

            {props.object_type === "country" ? (
              <>
                <Form.Label column sm="2">
                  Continent:
                </Form.Label>
                <Col sm="10">
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
                </Col>
              </>
            ) : (
              ""
            )}

            {props.object_type === "state" ? (
              <>
                <Form.Label column sm="2">
                  Country:
                </Form.Label>
                <Col sm="10">
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
                </Col>
              </>
            ) : (
              ""
            )}

            {props.object_type === "city" ? (
              <>
                <Form.Label column sm="2">
                  {countryOrState}
                </Form.Label>
                <Col sm="10">
                  <div style={{ marginBottom: 10 }}>
                    <Button
                      color={countryOrState === "country" ? "green" : ""}
                      onClick={() => {
                        setCountryOrState("country");
                        setCountry("");
                        setState("");
                      }}
                    >
                      Country:
                    </Button>
                    <Button
                      color={countryOrState === "state" ? "green" : ""}
                      onClick={() => {
                        setCountryOrState("state");
                        setCountry("");
                        setState("");
                      }}
                    >
                      State:
                    </Button>
                  </div>

                  {countryOrState === "country" ? (
                    <>
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
                </Col>
              </>
            ) : (
              ""
            )}

            {props.object_type === "area" ? (
              <>
                <Form.Label column sm="2">
                  City:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={AllCities}
                    className={"select_airport"}
                    disabled={!loaded}
                    maxLength="63"
                    onChange={(e) => {
                      setCity(e.target.innerText);
                    }}
                    disableClearable
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300, margin: 0, marginBottom: 10 }}
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
                </Col>
              </>
            ) : (
              ""
            )}
          </Form.Group>
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
            Tree: Continent {">>>"} Country {">>>"} State / City {">>>"} Area
            {(props.object_type === "country" && !Continent) ||
            (props.object_type === "state" && !Country) ||
            (props.object_type === "city" && !Country && !State) ||
            (props.object_type === "area" && !City) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, color: "red" }}
                >
                  <li>
                    {props.object_type === "country" && !Continent ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Continent Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {props.object_type === "state" && !Country ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Country Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {props.object_type === "city" && !Country && !State ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Country or State Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {props.object_type === "area" && !City ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The City
                        Field
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
            disabled={
              (props.object_type === "country" && !Continent) ||
              (props.object_type === "state" && !Country) ||
              (props.object_type === "city" && !Country && !State) ||
              (props.object_type === "area" && !City)
            }
            onClick={() => {
              handleClose();
              updateParentRegion();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeLandmark;
