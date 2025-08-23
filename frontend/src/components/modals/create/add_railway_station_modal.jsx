// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
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

const ADD_RAILWAY_STATION =
  "http://localhost:8000/api/view/add_railway_station/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

function AddRailwayStationModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [latlng, setLatLng] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");

  let [AllCountries, setAllCountries] = useState([]);
  let [loaded, setLoaded] = useState(false);

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

  const createNewRailwayStation = () => {
    axios({
      method: "post",
      url: ADD_RAILWAY_STATION,
      headers: headers,
      data: {
        name: Name,
        code: code,
        lat_lng: latlng,
        country: country,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/railway_station/" +
            res.data.new_railway_station_id;
        } else {
          props.set_railway_station(Name + " - " + country);
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

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          setLatLng("");
          getCountries();
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Railway Station
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Railway Station </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    maxLength="63"
                    onChange={(e) => {
                      setName(e.target.value.toUpperCase());
                    }}
                    value={Name}
                  />
                  <Form.Label>Code:</Form.Label>
                  <Form.Control
                    maxLength="3"
                    onChange={(e) => {
                      setCode(allowAlpha(e.target.value.toUpperCase()));
                    }}
                    value={code}
                  />
                  <Form.Label>Lat / Lng</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength="80"
                    placeholder="37.984035, 23.728024"
                    onChange={(e) => {
                      setLatLng(e.target.value);
                    }}
                    value={latlng}
                    style={{ marginBottom: 10 }}
                  />
                  <Form.Label>Country</Form.Label>
                  <br />
                  <Autocomplete
                    options={AllCountries}
                    className={"select_airport"}
                    onChange={(e) => {
                      setCountry(e.target.innerText);
                    }}
                    getOptionLabel={(option) => option.name}
                    disabled={!loaded}
                    disableClearable
                    style={{ width: 300, margin: 0 }}
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
                      style={{ position: "fixed", marginTop: 20 }}
                    />
                  )}
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {Name.length < 2 ||
            code.length !== 3 ||
            country.length === 0 ||
            !isValidLatLng(latlng) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
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
                    {code.length !== 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The RailwayStation Code Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {country.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill the Country Field.
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
              createNewRailwayStation();
            }}
            disabled={
              Name.length < 2 ||
              code.length !== 3 ||
              !isValidLatLng(latlng) ||
              country === ""
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddRailwayStationModal;
