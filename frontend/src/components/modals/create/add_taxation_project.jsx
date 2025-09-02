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
const ADD_TAXATION = "http://localhost:8000/api/data_management/taxation_projects/";
const ALL_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";
const ALL_CONSULTANTS = "http://localhost:8000/api/administration/all_consultants/";

function AddTaxationProjectModal({ onTaxationProjectCreated }) {
  const [show, setShow] = useState(false);

  // Form state
  const [taxproj_id, setTaxproj_id] = useState("");
  const [client_id, setClient_id] = useState("");
  const [consultant_id, setConsultant_id] = useState("");
  const [taxuse, setTaxuse] = useState("");
  const [deadline, setDeadline] = useState("");
  const [declaredone, setDeclaredone] = useState(false);
  const [declarationdate, setDeclarationdate] = useState("");
  const [comment, setComment] = useState("");

  // Dropdown data
  const [clients, setClients] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const resetForm = () => {
    setTaxproj_id("");
    setClient_id("");
    setConsultant_id("");
    setTaxuse("");
    setDeadline("");
    setDeclaredone(false);
    setDeclarationdate("");
    setComment("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  useEffect(() => {
    if (show) {
      loadDropdownData();
    }
  }, [show]);

  const loadDropdownData = async () => {
    try {
      const clientsRes = await axios.get(ALL_CLIENTS, { headers });
      setClients(clientsRes.data.all_clients || []);
      const consultantsRes = await axios.get(ALL_CONSULTANTS, { headers });
      setConsultants(consultantsRes.data.all_consultants || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Validation
  const isIdValid = taxproj_id.trim().length >= 2 && taxproj_id.trim().length <= 10;
  const isClientValid = client_id !== "";
  const isConsultantValid = consultant_id !== "";
  const isTaxuseValid = taxuse !== "";
  const isFormValid = isIdValid && isClientValid && isConsultantValid && isTaxuseValid;

  const createNewTaxationProject = async () => {
    if (!isFormValid) return;
    try {
      await axios.post(
        ADD_TAXATION,
        { taxproj_id, client_id, consultant_id, taxuse, deadline, declaredone, declarationdate, comment },
        { headers }
      );

      Swal.fire("Success", "Taxation Project created successfully", "success");
      if (onTaxationProjectCreated) onTaxationProjectCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating taxation project:", error);
      const errorMessage = error.response?.data?.error || "Failed to create taxation project";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }} />
        Create new Taxation Project
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Create new Taxation Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <h6 className="mb-3">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Taxation ID *:</Form.Label>
                      <Form.Control maxLength={10} onChange={(e) => setTaxproj_id(e.target.value.toUpperCase())} value={taxproj_id} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tax Use *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setTaxuse(e.target.value)} value={taxuse}>
                        <option value="">Select</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Links</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setClient_id(e.target.value)} value={client_id}>
                        <option value="">Select Client</option>
                        {Array.isArray(clients) && clients.map((c) => (
                          <option key={c.client_id} value={c.client_id}>
                            {c.fullname || `${c.surname} ${c.name}`}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Consultant *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setConsultant_id(e.target.value)} value={consultant_id}>
                        <option value="">Select Consultant</option>
                        {Array.isArray(consultants) && consultants.map((u) => (
                          <option key={u.consultant_id} value={u.consultant_id}>{u.fullname}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Dates & Status</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Deadline:</Form.Label>
                      <Form.Control type="date" onChange={(e) => setDeadline(e.target.value)} value={deadline} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check type="switch" id="declaredone-switch" label="Declared" checked={declaredone} onChange={(e) => setDeclaredone(e.target.checked)} />
                    </Form.Group>
                  </Col>
                </Row>

                {declaredone && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Declaration Date:</Form.Label>
                        <Form.Control type="date" onChange={(e) => setDeclarationdate(e.target.value)} value={declarationdate} />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <h6 className="mb-3 mt-4">Comment</h6>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Control as="textarea" rows={3} onChange={(e) => setComment(e.target.value)} value={comment} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {!isIdValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Taxation ID is required (2–10 chars).</li>)}
                {!isTaxuseValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Tax Use is required.</li>)}
                {!isClientValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Client is required.</li>)}
                {!isConsultantValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Consultant is required.</li>)}
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li><AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} /> Validated</li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>Close</Button>
          <Button color="green" onClick={createNewTaxationProject} disabled={!isFormValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTaxationProjectModal;
