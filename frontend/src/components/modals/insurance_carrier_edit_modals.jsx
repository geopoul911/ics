// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for insurance carrier updates
const UPDATE_INSURANCE_CARRIER = "https://ultima.icsgr.com/api/administration/insurance_carrier/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);
const toSmallInt = (value) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n)); // Django SmallIntegerField range
};

// Validation helpers
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");

// Edit Insurance Carrier Title Modal
export function EditInsuranceCarrierTitleModal({ insurance_carrier, update_state }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setTitle(insurance_carrier.title || "");
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;

  const onSave = async () => {
    if (!isTitleValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Title",
        text: "Title must be 2-40 characters",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_INSURANCE_CARRIER}${insurance_carrier.insucarrier_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
        body: JSON.stringify({
          insucarrier_id: insurance_carrier.insucarrier_id,
          title: title.trim(),
          orderindex: insurance_carrier.orderindex,
          active: insurance_carrier.active
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedInsuranceCarrier = await res.json();
      update_state(updatedInsuranceCarrier);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Insurance carrier title updated successfully!",
      });
    } catch (e) {
      console.log('Error updating insurance carrier title:', e);
      
      let apiMsg = "Failed to update insurance carrier title.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.title) {
        apiMsg = e.response.data.title[0];
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Title">
        <FiEdit style={{ marginRight: 6 }} />
        Title
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insurance Carrier Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Public Insurance:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(validateTitle(clampLen(e.target.value, 40)))}
                  placeholder="Enter title (2-40 characters)"
                  isInvalid={title !== "" && !isTitleValid}
                />
                <Form.Control.Feedback type="invalid">
                  Title must be 2-40 characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isTitleValid ? "green" : "red" }}>
              {isTitleValid ? "Looks good." : "Title must be 2-40 characters."}
            </small>
            <div>
              <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button
                color="green"
                onClick={onSave}
                disabled={!isTitleValid}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Insurance Carrier Order by Modal
export function EditInsuranceCarrierOrderIndexModal({ insurance_carrier, update_state }) {
  const [show, setShow] = useState(false);
  const [orderindex, setOrderindex] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOrderindex(insurance_carrier.orderindex || "");
    setShow(true);
  };

  const isOrderIndexValid = orderindex !== "" && Number.isInteger(+orderindex);

  const onSave = async () => {
    if (!isOrderIndexValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Order by",
        text: "Please enter a valid order index",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_INSURANCE_CARRIER}${insurance_carrier.insucarrier_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
        body: JSON.stringify({
          insucarrier_id: insurance_carrier.insucarrier_id,
          title: insurance_carrier.title,
          orderindex: Number(orderindex),
          active: insurance_carrier.active
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedInsuranceCarrier = await res.json();
      update_state(updatedInsuranceCarrier);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Insurance carrier order index updated successfully!",
      });
    } catch (e) {
      console.log('Error updating insurance carrier order index:', e);
      
      let apiMsg = "Failed to update insurance carrier order index.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Order by">
        <FiEdit style={{ marginRight: 6 }} />
        Order by
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insurance Carrier Order by</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Order by:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  value={orderindex}
                  onChange={(e) => setOrderindex(toSmallInt(e.target.value))}
                  placeholder="Enter order index"
                  isInvalid={orderindex !== "" && !isOrderIndexValid}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid order index
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: isOrderIndexValid ? "green" : "red" }}>
              {isOrderIndexValid ? "Looks good." : "Order by is required and must be an integer."}
            </small>
            <div>
              <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button
                color="green"
                onClick={onSave}
                disabled={!isOrderIndexValid}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Insurance Carrier Active Modal
export function EditInsuranceCarrierActiveModal({ insurance_carrier, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setActive(insurance_carrier.active || false);
    setShow(true);
  };

  const onSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await fetch(`${UPDATE_INSURANCE_CARRIER}${insurance_carrier.insucarrier_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": currentHeaders["Authorization"]
        },
        body: JSON.stringify({
          insucarrier_id: insurance_carrier.insucarrier_id,
          title: insurance_carrier.title,
          orderindex: insurance_carrier.orderindex,
          active: active
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedInsuranceCarrier = await res.json();
      update_state(updatedInsuranceCarrier);
      setShow(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Insurance carrier ${active ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (e) {
      console.log('Error updating insurance carrier active status:', e);
      
      let apiMsg = "Failed to update insurance carrier active status.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.active) {
        apiMsg = e.response.data.active[0];
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
      <Button onClick={handleShow} size="tiny" basic title="Edit Active Status">
        <FiEdit style={{ marginRight: 6 }} />
        Active
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insurance Carrier Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Active:
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  label="Insurance carrier is active"
                />
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <small style={{ color: "green" }}>
              Ready to save.
            </small>
            <div>
              <Button color="red" onClick={handleClose} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button color="green" onClick={onSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
