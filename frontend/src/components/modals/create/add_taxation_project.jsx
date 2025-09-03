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
const ADD_TAXATION_PROJECT = "http://localhost:8000/api/data_management/taxation_projects/";
const GET_ALL_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";
const GET_ALL_CONSULTANTS = "http://localhost:8000/api/administration/all_consultants/";

// Helpers
const onlyAlphanumeric = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);

function AddTaxationProjectModal({ onCreated }) {
  const [show, setShow] = useState(false);

  // Dropdown data
  const [clients, setClients] = useState([]);
  const [consultants, setConsultants] = useState([]);

  // Form state
  const [taxProjId, setTaxProjId] = useState(""); // taxproj_id
  const [clientId, setClientId] = useState(""); // required
  const [consultantId, setConsultantId] = useState(""); // required
  const [taxUse, setTaxUse] = useState(""); // required (integer)
  const [deadline, setDeadline] = useState(""); // optional
  const [declaredOne, setDeclaredOne] = useState(false); // optional, default false
  const [declarationDate, setDeclarationDate] = useState(""); // optional
  const [comment, setComment] = useState(""); // optional

  const resetForm = () => {
    setTaxProjId("");
    setClientId("");
    setConsultantId("");
    setTaxUse("");
    setDeadline("");
    setDeclaredOne(false);
    setDeclarationDate("");
    setComment("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  // Load dropdowns on open
  useEffect(() => {
    if (show) {
      loadDropdowns();
    }
  }, [show]);

  // Clear declaration date when declaredOne is unchecked
  useEffect(() => {
    if (!declaredOne) {
      setDeclarationDate("");
    }
  }, [declaredOne]);

  const loadDropdowns = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const [clientsRes, consultantsRes] = await Promise.all([
        axios.get(GET_ALL_CLIENTS, { headers: currentHeaders }),
        axios.get(GET_ALL_CONSULTANTS, { headers: currentHeaders }),
      ]);

      setClients(clientsRes?.data?.all_clients || []);
      setConsultants(consultantsRes?.data?.all_consultants || []);
    } catch (error) {
      console.error("Error loading dropdowns:", error);
      setClients([]);
      setConsultants([]);
    }
  };

  // Validation
  const isIdValid = taxProjId.length >= 2 && taxProjId.length <= 10;
  const isClientValid = clientId !== "";
  const isConsultantValid = consultantId !== "";
  const isTaxUseValid = /^\d+$/.test(taxUse) && taxUse.length <= 6; // basic numeric check
  const isFormValid = isIdValid && isClientValid && isConsultantValid && isTaxUseValid;

  const createNew = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };

      const payload = {
        taxproj_id: taxProjId,
        client_id: clientId,
        consultant_id: consultantId,
        taxuse: taxUse ? parseInt(taxUse, 10) : null,
        deadline: deadline || null,
        declaredone: declaredOne,
        declarationdate: declarationDate || null,
        comment: comment.trim() || null,
      };

      const res = await axios.post(ADD_TAXATION_PROJECT, payload, { headers: currentHeaders });
      if (res.status === 201) {
        Swal.fire({ icon: "success", title: "Success!", text: "Taxation project created successfully." });
        handleClose();
        onCreated && onCreated();
      }
    } catch (e) {
      console.error("Create taxation project error:", e);
      let errorMessage = "An error occurred while creating the taxation project.";
      if (e.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e.response?.data) {
        const errors = e.response.data;
        errorMessage = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
      }
      Swal.fire({ icon: "error", title: "Error", text: errorMessage });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }} />
        Create new Taxation Project
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create new Taxation Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Taxation Project ID *:</Form.Label>
                  <Form.Control
                    maxLength={10}
                    placeholder="e.g., TXP001"
                    value={taxProjId}
                    onChange={(e) => setTaxProjId(clampLen(onlyAlphanumeric(e.target.value), 10))}
                    isInvalid={taxProjId.length > 0 && !isIdValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    ID must be 2–10 alphanumeric characters.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tax Use *:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 2024 or code"
                    value={taxUse}
                    onChange={(e) => setTaxUse(e.target.value.replace(/[^0-9]/g, ""))}
                    isInvalid={taxUse.length > 0 && !isTaxUseValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter a numeric value.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Client *:</Form.Label>
                  <Form.Control as="select" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                    <option value="">Select Client</option>
                    {Array.isArray(clients) && clients.map((c) => (
                      <option key={c.client_id} value={c.client_id}>{c.client_id} - {c.fullname}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultant *:</Form.Label>
                  <Form.Control as="select" value={consultantId} onChange={(e) => setConsultantId(e.target.value)}>
                    <option value="">Select Consultant</option>
                    {Array.isArray(consultants) && consultants.map((u) => (
                      <option key={u.consultant_id} value={u.consultant_id}>{u.consultant_id} - {u.fullname}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Deadline:</Form.Label>
                  <Form.Control type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="declared-switch"
                    label="Declared"
                    checked={declaredOne}
                    onChange={(e) => setDeclaredOne(e.target.checked)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Declaration Date:</Form.Label>
                  <Form.Control type="date" value={declarationDate} onChange={(e) => setDeclarationDate(e.target.value)} disabled={!declaredOne} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Comment:</Form.Label>
              <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Notes/comments (optional)" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {!isIdValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> ID is required (2–10 alphanumeric chars).</li>
                )}
                {!isTaxUseValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Tax Use is required and must be numeric.</li>
                )}
                {!isClientValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Client is required.</li>
                )}
                {!isConsultantValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Consultant is required.</li>
                )}
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li><AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} /> Validated</li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>Close</Button>
          <Button color="green" onClick={createNew} disabled={!isFormValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTaxationProjectModal;
