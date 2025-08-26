// Built-ins
import { useState } from "react";

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

// API endpoint
const ADD_COUNTRY = "http://localhost:8000/api/view/add_country/";

// Helpers
const onlyUpperLetters = (value) => value.replace(/[^A-Z]/g, "");
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

function AddCountryModal() {
  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [countryId, setCountryId] = useState(""); // maps to country_id
  const [currency, setCurrency] = useState("");   // optional
  const [orderindex, setOrderindex] = useState(""); // required small int

  const resetForm = () => {
    setTitle("");
    setCountryId("");
    setCurrency("");
    setOrderindex("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isCountryIdValid = countryId.length >= 2 && countryId.length <= 3; // ✅ allow 2 or 3 chars
  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);

  const isFormValid = isTitleValid && isCountryIdValid && isOrderIndexValid;

  const createNewCountry = async () => {
    try {
      const res = await axios({
        method: "post",
        url: ADD_COUNTRY,
        headers,
        data: {
          title: title.trim(),
          country_id: countryId,        // ✅ field name matches Django model
          currency: currency || null,   // optional
          orderindex: Number(orderindex),
        },
      });

      const newId =
        res?.data?.new_country_id ||
        res?.data?.country_id ||
        countryId;

      window.location.href = "/regions/country/" + newId;
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Something went wrong while creating the country.";
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
        Create new Country
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Country</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    maxLength={40}
                    placeholder="e.g., GREECE"
                    onChange={(e) =>
                      setTitle(clampLen(e.target.value.toUpperCase(), 40))
                    }
                    value={title}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country Code (2–3 letters):</Form.Label>
                  <Form.Control
                    maxLength={3}
                    placeholder="e.g., GR or GRC"
                    onChange={(e) =>
                      setCountryId(
                        onlyUpperLetters(e.target.value.toUpperCase()).slice(
                          0,
                          3
                        )
                      )
                    }
                    value={countryId}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Currency (optional):</Form.Label>
                  <Form.Control
                    maxLength={10}
                    placeholder="e.g., EUR"
                    onChange={(e) =>
                      setCurrency(clampLen(e.target.value.toUpperCase(), 10))
                    }
                    value={currency}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Order Index:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 1"
                    onChange={(e) =>
                      setOrderindex(toSmallInt(e.target.value).toString())
                    }
                    value={orderindex}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isTitleValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title is required (2–40 chars).
                  </li>
                )}
                {!isCountryIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Country code must be 2 or 3 uppercase letters (A–Z).
                  </li>
                )}
                {!isOrderIndexValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Order index is required and must be an integer.
                  </li>
                )}
              </ul>
            ) : (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "green" }}
              >
                <li>
                  <AiOutlineCheckCircle
                    style={{ fontSize: 18, marginRight: 6 }}
                  />
                  Validated
                </li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewCountry();
            }}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCountryModal;
