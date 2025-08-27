// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for creating insurance carriers
const CREATE_INSURANCE_CARRIER = "http://localhost:8000/api/administration/all_insurance_carriers/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Validation helpers
const validateInsuranceCarrierId = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");

export default function AddInsuranceCarrierModal({ onInsuranceCarrierCreated }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    insucarrier_id: "",
    title: "",
    orderindex: "",
    active: true,
  });

  const handleClose = () => {
    setShow(false);
    setFormData({
      insucarrier_id: "",
      title: "",
      orderindex: "",
      active: true,
    });
  };

  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.insucarrier_id.trim().length >= 1 &&
      formData.insucarrier_id.trim().length <= 10 &&
      formData.title.trim().length >= 2 &&
      formData.title.trim().length <= 40 &&
      formData.orderindex !== "" &&
      Number.isInteger(+formData.orderindex)
    );
  };

  const createNewInsuranceCarrier = async () => {
    if (!isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Form",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        insucarrier_id: formData.insucarrier_id.trim().toUpperCase(),
        title: formData.title.trim(),
        orderindex: Number(formData.orderindex),
        active: formData.active,
      };

      const res = await axios.post(CREATE_INSURANCE_CARRIER, payload, { headers: currentHeaders });
      
      const newId = res.data.insucarrier_id;
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Insurance carrier created successfully!",
      });

      handleClose();
      
      // Redirect to the new insurance carrier's overview page
      window.location.href = `/administration/insurance_carrier/${newId}`;
      
    } catch (e) {
      console.log('Error creating insurance carrier:', e);
      
      let apiMsg = "Failed to create insurance carrier.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.insucarrier_id) {
        apiMsg = e.response.data.insucarrier_id[0];
      } else if (e?.response?.data?.title) {
        apiMsg = e.response.data.title[0];
      } else if (e?.response?.data?.orderindex) {
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.detail) {
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
      <Button onClick={handleShow} color="green" style={{ margin: 20 }}>
        <BiPlus style={{ marginRight: 6 }} />
        New Insurance Carrier
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Insurance Carrier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Insurance Carrier ID:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="insucarrier_id"
                  value={formData.insucarrier_id}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    insucarrier_id: validateInsuranceCarrierId(clampLen(e.target.value, 10))
                  }))}
                  placeholder="Enter insurance carrier ID (1-10 alphanumeric characters)"
                  isInvalid={
                    formData.insucarrier_id !== "" &&
                    (formData.insucarrier_id.trim().length < 1 || formData.insucarrier_id.trim().length > 10)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Insurance carrier ID must be 1-10 alphanumeric characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Title:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: validateTitle(clampLen(e.target.value, 40))
                  }))}
                  placeholder="Enter insurance carrier title (2-40 characters)"
                  isInvalid={
                    formData.title !== "" &&
                    (formData.title.trim().length < 2 || formData.title.trim().length > 40)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Title must be 2-40 characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Order Index:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  name="orderindex"
                  value={formData.orderindex}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    orderindex: toSmallInt(e.target.value)
                  }))}
                  placeholder="Enter order index"
                  isInvalid={
                    formData.orderindex !== "" &&
                    !Number.isInteger(+formData.orderindex)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid order index
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Active:
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  label="Insurance carrier is active"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid() ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {formData.insucarrier_id.trim().length < 1 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Insurance Carrier ID is required (1–10 chars).
                  </li>
                )}
                {formData.insucarrier_id.trim().length > 10 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Insurance Carrier ID must be 1–10 chars.
                  </li>
                )}
                {formData.title.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title is required (2–40 chars).
                  </li>
                )}
                {formData.title.trim().length > 40 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title must be 2–40 chars.
                  </li>
                )}
                {formData.orderindex === "" && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Order Index is required (valid number).
                  </li>
                )}
                {formData.orderindex !== "" && !Number.isInteger(+formData.orderindex) && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Order Index must be a valid number.
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
            onClick={createNewInsuranceCarrier}
            disabled={!isFormValid()}
          >
            Create Insurance Carrier
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
