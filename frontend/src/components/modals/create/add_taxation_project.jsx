// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// API endpoint
const ADD_TAXATION_PROJECT = "http://localhost:8000/api/data_management/taxation_projects/";

function AddTaxationProjectModal({ refreshData, defaultConsultantId, lockConsultant = false }) {
  const [show, setShow] = useState(false);

  const [taxproj_id, setTaxprojId] = useState("");
  const [client_id, setClientId] = useState("");
  const [consultant_id, setConsultantId] = useState("");
  const [taxuse, setTaxuse] = useState("");
  const [deadline, setDeadline] = useState("");
  const [declaredone, setDeclaredone] = useState(false);
  const [declarationdate, setDeclarationdate] = useState("");
  const [comment, setComment] = useState("");

  const [clients, setClients] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const resetForm = () => {
    setTaxprojId("");
    setClientId("");
    setConsultantId("");
    setTaxuse("");
    setDeadline("");
    setDeclaredone(false);
    setDeclarationdate("");
    setComment("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    if (defaultConsultantId) setConsultantId(defaultConsultantId);
    setShow(true);
  };

  useEffect(() => {
    if (show) {
      loadRefs();
    }
  }, [show]);

  const loadRefs = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const [clientsRes, consultantsRes] = await Promise.all([
        axios.get("http://localhost:8000/api/data_management/all_clients/", { headers: currentHeaders }),
        axios.get("http://localhost:8000/api/administration/all_consultants/", { headers: currentHeaders }),
      ]);
      setClients(clientsRes?.data?.all_clients || []);
      setConsultants(consultantsRes?.data?.all_consultants || []);
    } catch (e) {
      console.error("Failed to load refs", e);
      setClients([]);
      setConsultants([]);
    }
  };

  const isIdValid = taxproj_id.trim().length >= 2 && taxproj_id.trim().length <= 10;
  const isClientValid = client_id !== "";
  const isConsultantValid = consultant_id !== "";
  const isTaxuseValid = /^\d{1,4}$/.test(taxuse.trim());
  const isFormValid = isIdValid && isClientValid && isConsultantValid && isTaxuseValid;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      await axios.post(ADD_TAXATION_PROJECT, {
        taxproj_id: taxproj_id.trim(),
        client_id,
        consultant_id,
        taxuse: taxuse.trim(),
        deadline: deadline || null,
        declaredone,
        declarationdate: declarationdate || null,
        comment: comment.trim() || null,
      }, { headers: currentHeaders });

      Swal.fire({ icon: "success", title: "Success", text: "Taxation Project created successfully!" });
      if (refreshData) {
        setShow(false);
        refreshData();
      } else {
        setShow(false);
      }
    } catch (e) {
      console.error("Create taxation project error", e);
      const apiMsg = e?.response?.data?.error || e?.response?.data?.detail || "Failed to create taxation project";
      Swal.fire({ icon: "error", title: "Error", text: typeof apiMsg === 'object' ? JSON.stringify(apiMsg) : apiMsg });
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
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Taxation Project ID *</Form.Label>
                <Form.Control value={taxproj_id} maxLength={10} onChange={(e) => setTaxprojId(e.target.value.toUpperCase())} placeholder="e.g., TP001" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tax use *</Form.Label>
                <Form.Control value={taxuse} maxLength={40} onChange={(e) => setTaxuse(e.target.value)} placeholder="e.g., Income" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Client *</Form.Label>
                <Form.Control as="select" value={client_id} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.client_id} value={c.client_id}>{c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Consultant *</Form.Label>
                <Form.Control as="select" value={consultant_id} onChange={(e) => setConsultantId(e.target.value)} disabled={lockConsultant}>
                  <option value="">Select consultant</option>
                  {consultants.map((u) => (
                    <option key={u.consultant_id} value={u.consultant_id}>{u.fullname || u.username || u.consultant_id}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Deadline</Form.Label>
                <Form.Control type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check type="checkbox" label="Declared" checked={declaredone} onChange={(e) => setDeclaredone(e.target.checked)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Declaration date</Form.Label>
                <Form.Control type="date" value={declarationdate} onChange={(e) => setDeclarationdate(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional" />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {!isIdValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> ID is required (2–10 chars).</li>)}
                {!isClientValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Client is required.</li>)}
                {!isConsultantValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Consultant is required.</li>)}
                {!isTaxuseValid && (<li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Tax use is required (4 digits).</li>)}
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li><AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} /> Validated</li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>Close</Button>
          <Button color="green" onClick={handleSubmit} disabled={!isFormValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTaxationProjectModal;
