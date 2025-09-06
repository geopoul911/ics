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

// API endpoint
const ADD_BANK_PROJECT_ACCOUNT = "http://localhost:8000/api/data_management/bank_project_accounts/";
const GET_PROJECTS = "http://localhost:8000/api/data_management/all_projects/";
const GET_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";
const GET_BANK_CLIENT_ACCOUNTS = "http://localhost:8000/api/data_management/all_bank_client_accounts/";

// Helpers
const onlyAlphanumeric = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);

function AddBankProjectAccountModal({ onCreated, onBankProjectAccountCreated, refreshData, defaultProjectId, defaultClientId, lockProject = false, lockClient = false, redirectOnCreate = false }) {
  const [show, setShow] = useState(false);

  // Dropdowns
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [bankClientAccounts, setBankClientAccounts] = useState([]);

  // Form state
  const [bankProjAccoId, setBankProjAccoId] = useState(""); // bankprojacco_id
  const [projectId, setProjectId] = useState(""); // required
  const [clientId, setClientId] = useState(""); // required
  const [bankClientAccoId, setBankClientAccoId] = useState(""); // optional
  const [notes, setNotes] = useState(""); // optional

  const resetForm = () => {
    setBankProjAccoId("");
    setProjectId("");
    setClientId("");
    setBankClientAccoId("");
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    if (defaultProjectId) setProjectId(defaultProjectId);
    if (defaultClientId) setClientId(defaultClientId);
    setShow(true);
  };

  // Load dropdowns when modal opens
  useEffect(() => {
    if (show) {
      loadDropdowns();
    }
  }, [show]);

  const loadDropdowns = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const [projectsRes, clientsRes, bankClientAccosRes] = await Promise.all([
        axios.get(GET_PROJECTS, { headers: currentHeaders }),
        axios.get(GET_CLIENTS, { headers: currentHeaders }),
        axios.get(GET_BANK_CLIENT_ACCOUNTS, { headers: currentHeaders }),
      ]);

      setProjects(projectsRes?.data?.all_projects || []);
      setClients(clientsRes?.data?.all_clients || []);
      setBankClientAccounts(bankClientAccosRes?.data?.all_bank_client_accounts || []);
    } catch (error) {
      console.error("Dropdowns load error:", error);
      setProjects([]);
      setClients([]);
      setBankClientAccounts([]);
    }
  };

  // Validation
  const isIdValid = bankProjAccoId.length >= 2 && bankProjAccoId.length <= 10;
  const isProjectValid = projectId !== "";
  const isClientValid = clientId !== "";
  const isFormValid = isIdValid && isProjectValid && isClientValid;

  const createNew = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };

      const payload = {
        bankprojacco_id: bankProjAccoId,
        project_id: projectId,
        client_id: clientId,
        bankclientacco_id: bankClientAccoId || "",
        notes: notes.trim() || null,
      };

      const res = await axios.post(ADD_BANK_PROJECT_ACCOUNT, payload, { headers: currentHeaders });
      if (res.status === 201) {
        try { if (typeof onCreated === 'function') onCreated(res.data); } catch (_) {}
        try { if (typeof onBankProjectAccountCreated === 'function') onBankProjectAccountCreated(res.data); } catch (_) {}
        try { if (typeof refreshData === 'function') refreshData(); } catch (_) {}
        handleClose();
        if (redirectOnCreate && res?.data?.bankprojacco_id) {
          window.location.href = `/data_management/bank_project_account/${res.data.bankprojacco_id}`;
        }
      }
    } catch (e) {
      console.error("Create bank project account error:", e);
      let errorMessage = "An error occurred while creating the bank project account.";
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
        Create new Bank Project Account
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create new Bank Project Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Project Account ID *:</Form.Label>
                  <Form.Control
                    maxLength={10}
                    placeholder="e.g., BPA001"
                    value={bankProjAccoId}
                    onChange={(e) => setBankProjAccoId(clampLen(onlyAlphanumeric(e.target.value), 10))}
                    isInvalid={bankProjAccoId.length > 0 && !isIdValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    ID must be 2–10 alphanumeric characters.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project *:</Form.Label>
                  <Form.Control as="select" value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={lockProject}>
                    <option value="">Select Project</option>
                    {Array.isArray(projects) && projects.map((p) => (
                      <option key={p.project_id} value={p.project_id}>{p.project_id} - {p.title}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Client *:</Form.Label>
                  <Form.Control as="select" value={clientId} onChange={(e) => setClientId(e.target.value)} disabled={lockClient}>
                    <option value="">Select Client</option>
                    {Array.isArray(clients) && clients.map((c) => (
                      <option key={c.client_id} value={c.client_id}>{c.client_id} - {c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Client Account:</Form.Label>
                  <Form.Control as="select" value={bankClientAccoId} onChange={(e) => setBankClientAccoId(e.target.value)}>
                    <option value="">Select Bank Client Account (optional)</option>
                    {Array.isArray(bankClientAccounts) && bankClientAccounts.map((a) => (
                      <option key={a.bankclientacco_id} value={a.bankclientacco_id}>{a.bankclientacco_id} - {a.bank?.bankname || ''} - {a.accountnumber}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes:</Form.Label>
              <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
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
                {!isProjectValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Project is required.</li>
                )}
                {!isClientValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Client is required.</li>
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

export default AddBankProjectAccountModal;
