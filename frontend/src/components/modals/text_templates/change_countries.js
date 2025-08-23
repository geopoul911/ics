import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineUnorderedList } from "react-icons/ai";

// Modules / Functions
import { Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import ReactCountryFlag from "react-country-flag";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_TEMPLATE_COUNTRIES =
  "http://localhost:8000/api/data_management/change_template_countries/";

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

function ChangeTemplateCountries(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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

  const update_Type = () => {
    axios({
      method: "post",
      url: CHANGE_TEMPLATE_COUNTRIES,
      headers: headers,
      data: {
        text_template_id: props.object_id,
        countries: selectedCountries,
      },
    })
      .then((res) => {
        props.update_state(res.data.text_template);
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
        title={"edit text_template's type"}
        id={"edit_text_template_name"}
        onClick={() => {
          handleShow();
          setSelectedCountries(["GN"]);
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
            Change Countries for Template with id : {props.object_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Countries:
            </Form.Label>
            <Col sm="10">
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
                  onClick={() => toggleCountrySelection(code)}
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
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Type();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeTemplateCountries;
