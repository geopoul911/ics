// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { apiGet, apiPut, apiPost, apiDelete, API_ENDPOINTS } from "../../../utils/api";
// Modules / Functions

import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoints
const ADD_PROVINCE = "http://localhost:8000/api/view/add_province/";
const GET_COUNTRIES = "http://localhost:8000/api/regions/all_countries/";

// Helpers
const onlyUpperLetters = (value) => value.replace(/[^A-Z]/g, "");
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

function AddProvinceModal() {
  const [show, setShow] = useState(false);
  const [countries, setCountries] = useState([]);

  const [title, setTitle] = useState("");
  const [provinceId, setProvinceId] = useState(""); // maps to province_id
  const [countryId, setCountryId] = useState(""); // maps to country_id
  const [orderindex, setOrderindex] = useState(""); // required small int

  const resetForm = () => {
    setTitle("");
    setProvinceId("");
    setCountryId("");
    setOrderindex("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isProvinceIdValid = provinceId.length >= 2 && provinceId.length <= 10;
  const isCountryIdValid = countryId.length > 0;
  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);

  const isFormValid = isTitleValid && isProvinceIdValid && isCountryIdValid && isOrderIndexValid;

  // Fetch countries for dropdown
  useEffect(() => {
    if (show) {
      apiGet(GET_COUNTRIES)
        .then((res) => {
          setCountries(res.data.all_countries || []);
        })
        .catch((e) => {
          console.error("Failed to fetch countries:", e);
        });
    }
  }, [show]);

  const createNewProvince = async () => {
    try {
      const res = await axios({
        method: "post",
        url: ADD_PROVINCE,
        headers,
        data: {
          title: title.trim(),
          province_id: provinceId,
          country_id: countryId,
          orderindex: Number(orderindex),
        },
      });

      const newId = res?.data?.model?.province_id || provinceId;
      window.location.href = "/regions/province/" + newId;
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Something went wrong while creating the province.";
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
        Create new Province
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Province</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    maxLength={40}
                    placeholder="e.g., ATTICA"
                    onChange={(e) =>
                      setTitle(clampLen(e.target.value.toUpperCase(), 40))
                    }
                    value={title}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Province Code (2–10 letters):</Form.Label>
                  <Form.Control
                    maxLength={10}
                    placeholder="e.g., ATT"
                    onChange={(e) =>
                      setProvinceId(
                        onlyUpperLetters(e.target.value.toUpperCase()).slice(0, 10)
                      )
                    }
                    value={provinceId}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country:</Form.Label>
                  <Form.Control
                    as="select"
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                  >
                    <option value="">Select a country...</option>
                    {countries.map((country) => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.country_id} - {country.title}
                      </option>
                    ))}
                  </Form.Control>
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
                {!isProvinceIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Province code must be 2–10 uppercase letters (A–Z).
                  </li>
                )}
                {!isCountryIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Country is required.
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
              createNewProvince();
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

export default AddProvinceModal; 