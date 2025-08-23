// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import {
  AiOutlineWarning,
  AiOutlineCheckCircle,
  AiOutlineUnorderedList,
} from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";

// CSS
import "react-phone-number-input/style.css";

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

const ADD_TEXT_TEMPLATE = "http://localhost:8000/api/view/add_text_template/";

let btnStyle = {
  paddingTop: 5,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 5,
  margin: 4,
};

let flagStyle = { width: "2.5em", height: "2.5em" };

let country_codes = [
  "GR",
  "GB",
  "FR",
  "DE",
  "IT",
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "HU",
  "IE",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "CH",
  "UA",
  "RU",
  "NO",
];

let codes_to_full_name = {
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czechia",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LV: "Latvia",
  LT: "Lithuania",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SK: "Slovakia",
  SI: "Slovenia",
  ES: "Spain",
  SE: "Sweden",
  GB: "United Kingdom",
  CH: "Switzerland",
  UA: "Ukraine",
  RU: "Russia",
  NO: "Norway",
};

function AddTextTemplateModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Text, setText] = useState("");
  const [Type, setType] = useState("AI");
  const [selectedCountries, setSelectedCountries] = useState(["GN"]); // Initialize with default value

  const toggleCountrySelection = (code) => {
    if (selectedCountries.includes(code)) {
      // If the code is already selected, remove it
      setSelectedCountries(selectedCountries.filter((c) => c !== code));
    } else {
      // If the code is not selected, add it to the list
      setSelectedCountries([...selectedCountries, code]);
    }
  };

  const createNewTextTemplate = () => {
    axios({
      method: "post",
      url: ADD_TEXT_TEMPLATE,
      headers: headers,
      data: {
        text: Text,
        type: Type,
        countries: selectedCountries,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/text_template/" + res.data.new_text_template_id;
        } else {
          props.remount();
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
          setText("");
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Text Template
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Text Template </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Text:</Form.Label>
                  <textarea
                    className="form-control"
                    value={Text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Form.Label>Type:</Form.Label>
                  <select
                    className="form-control"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value={"AI"}> Additional Information </option>
                    <option value={"I"}> Included </option>
                    <option value={"NI"}> Not Included </option>
                    <option value={"N"}> Notes </option>
                    <option value={"EP"}> Entry Price </option>
                    <option value={"PC"}>
                      Payment & Cancellation Policy
                    </option>
                    <option value={"CP"}> Children Policy </option>
                    <option value={"EL"}> Epilogue </option>
                  </select>
                  <Form.Label>Countries:</Form.Label>
                  <Button
                    style={btnStyle}
                    color={selectedCountries.includes("GN") ? "blue" : ""}
                    onClick={() => toggleCountrySelection("GN")}
                    title="Generic"
                  >
                    <AiOutlineUnorderedList style={flagStyle} />
                  </Button>
                  {country_codes.map((code) => (
                    <Button
                      key={code}
                      style={btnStyle}
                      color={selectedCountries.includes(code) ? "blue" : ""}
                      onClick={(event) => {
                        event.preventDefault();
                        toggleCountrySelection(code);
                      }}
                    >
                      <ReactCountryFlag
                        countryCode={code}
                        value={code}
                        style={flagStyle}
                        svg
                        title={codes_to_full_name[code]}
                      />
                    </Button>
                  ))}
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
            Text Templates are used on creating offers.
            {Text.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Text.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Text
                        Field.
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
              createNewTextTemplate();
              setType("AI");
            }}
            disabled={Text.length === 0}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTextTemplateModal;
