// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoints
const ADD_BANK = "http://localhost:8000/api/administration/all_banks/";
const GET_COUNTRIES = "http://localhost:8000/api/regions/all_countries/";

// Helpers
const onlyAlphanumeric = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Validation helpers
const validateInstitutionNumber = (value) => value.replace(/[^\d]/g, "");
const validateSwiftCode = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

function AddBankModal() {
  const [show, setShow] = useState(false);
  const [countries, setCountries] = useState([]);

  const [bankId, setBankId] = useState(""); // maps to bank_id
  const [bankname, setBankname] = useState(""); // required
  const [country, setCountry] = useState(""); // required - this will store country_id
  const [orderindex, setOrderindex] = useState(""); // required
  const [institutionnumber, setInstitutionnumber] = useState(""); // required
  const [swiftcode, setSwiftcode] = useState(""); // required
  const [active, setActive] = useState(true); // optional, default true

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(GET_COUNTRIES, { headers: currentHeaders });
        if (response.data && response.data.all_countries) {
          setCountries(response.data.all_countries);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const resetForm = () => {
    setBankId("");
    setBankname("");
    setCountry("");
    setOrderindex(0);
    setInstitutionnumber("");
    setSwiftcode("");
    setActive(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const isBankIdValid = bankId.length >= 2 && bankId.length <= 10;
  const isBanknameValid = bankname.trim().length >= 2 && bankname.trim().length <= 40;
  const isCountryValid = country !== "";
  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);
  const isInstitutionNumberValid = institutionnumber.length === 3 && /^\d{3}$/.test(institutionnumber);
  const isSwiftCodeValid = swiftcode.length >= 8 && swiftcode.length <= 11 && /^[A-Z0-9]{8,11}$/.test(swiftcode);

  const isFormValid = isBankIdValid && isBanknameValid && isCountryValid && 
                     isOrderIndexValid && isInstitutionNumberValid && isSwiftCodeValid;

  const createNewBank = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios({
        method: "post",
        url: ADD_BANK,
        headers: currentHeaders,
        data: {
          bank_id: bankId,
          bankname: bankname.trim(),
          country_id: country, // This will be the country_id
          orderindex: Number(orderindex),
          institutionnumber: institutionnumber,
          swiftcode: swiftcode,
          active: active,
        },
      });

      const newId =
        res?.data?.bank_id ||
        res?.data?.id ||
        bankId;

      window.location.href = "/administration/bank/" + newId;
    } catch (e) {
      console.error("Error creating bank:", e);

      let apiMsg = "An unknown error occurred.";

      if (e?.response?.data?.error) {
        // Custom error message from our API
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.bank_id) {
        // Serializer validation error for bank_id
        apiMsg = e.response.data.bank_id[0];
      } else if (e?.response?.data?.bankname) {
        // Serializer validation error for bankname
        apiMsg = e.response.data.bankname[0];
      } else if (e?.response?.data?.country) {
        // Serializer validation error for country
        apiMsg = e.response.data.country[0];
      } else if (e?.response?.data?.orderindex) {
        // Serializer validation error for orderindex
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.institutionnumber) {
        // Serializer validation error for institutionnumber
        apiMsg = e.response.data.institutionnumber[0];
      } else if (e?.response?.data?.swiftcode) {
        // Serializer validation error for swiftcode
        apiMsg = e.response.data.swiftcode[0];
      } else if (e?.response?.data?.detail) {
        // Generic DRF error
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Bank
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={bankId}
                    onChange={(e) => setBankId(onlyAlphanumeric(clampLen(e.target.value, 10)))}
                    placeholder="Enter bank ID (2-10 alphanumeric characters)"
                    isInvalid={bankId !== "" && !isBankIdValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Bank ID must be 2-10 alphanumeric characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank *</Form.Label>
                  <Form.Control
                    type="text"
                    value={bankname}
                    onChange={(e) => setBankname(clampLen(e.target.value, 40))}
                    placeholder="Enter bank name (2-40 characters)"
                    isInvalid={bankname !== "" && !isBanknameValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Bank name must be 2-40 characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Country *</Form.Label>
                  <Form.Control
                    as="select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    isInvalid={country !== "" && !isCountryValid}
                  >
                    <option value="">Select country</option>
                    {countries.map((countryOption) => (
                      <option key={countryOption.country_id} value={countryOption.country_id}>
                        {countryOption.title}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Please select a country
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Order by *</Form.Label>
                  <Form.Control
                    type="number"
                    value={orderindex}
                    onChange={(e) => setOrderindex(toSmallInt(e.target.value))}
                    placeholder="Enter order index"
                    isInvalid={!isOrderIndexValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Order by is required and must be an integer
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bank code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={institutionnumber}
                    onChange={(e) => setInstitutionnumber(validateInstitutionNumber(clampLen(e.target.value, 3)))}
                    placeholder="Enter institution number (3 digits)"
                    isInvalid={institutionnumber !== "" && !isInstitutionNumberValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Institution number must be exactly 3 digits
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Swift code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={swiftcode}
                    onChange={(e) => setSwiftcode(validateSwiftCode(clampLen(e.target.value, 11)))}
                    placeholder="Enter SWIFT code (8-11 characters)"
                    isInvalid={swiftcode !== "" && !isSwiftCodeValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    SWIFT code must be 8-11 alphanumeric characters
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    label="Active"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isBankIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Bank ID is required (2–10 chars).
                  </li>
                )}
                {!isBanknameValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Bank name is required (2–40 chars).
                  </li>
                )}
                {!isCountryValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Country is required.
                  </li>
                )}
                {!isOrderIndexValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Order by is required and must be an integer.
                  </li>
                )}
                {!isInstitutionNumberValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Bank code is required (3 digits).
                  </li>
                )}
                {!isSwiftCodeValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Swift code is required (8–11 alphanumeric chars).
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                All fields are valid!
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={createNewBank}
            disabled={!isFormValid}
          >
            Create Bank
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddBankModal;
