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

const ADD_PORT = "http://localhost:8000/api/view/add_port/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

function AddPortModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [latlng, setLatLng] = useState("");
  const [Country, setCountry] = useState("");
  const [code, setCode] = useState("");
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

  const createNewPort = () => {
    axios({
      method: "post",
      url: ADD_PORT,
      headers: headers,
      data: {
        name: Name,
        nationality: Country,
        code: code,
        lat_lng: latlng,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/port/" + res.data.new_port_id;
        } else {
          props.set_port(Name + " - " + Country);
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
          setCountry("");
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Port
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Port </Modal.Title>
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
                  />
                  <Form.Label style={{ marginTop: 10 }}>Country</Form.Label>
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
                    style={{ width: 300, marginLeft: 0 }}
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
            Country.length === 0 ||
            code.length !== 3 ||
            !isValidLatLng(latlng) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, color: "red" }}
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
                    {Country.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select a Country.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {code.length !== 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Port Code Field.
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
              createNewPort();
            }}
            disabled={
              Name.length < 2 ||
              Country.length === 0 ||
              code.length !== 3 ||
              !isValidLatLng(latlng)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddPortModal;
