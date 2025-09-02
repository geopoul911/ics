// Built-ins
import React, { useState, useEffect } from "react";

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
const CREATE_BANK_PROJECT_ACCOUNT = "http://localhost:8000/api/data_management/bank_project_accounts/";
const ALL_PROJECTS = "http://localhost:8000/api/data_management/all_projects/";
const ALL_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";
const ALL_BANK_CLIENT_ACCOUNTS = "http://localhost:8000/api/data_management/bank_client_accounts/";

function AddBankProjectAccountModal({ onBankProjectAccountCreated }) {
  const [show, setShow] = useState(false);

  // Form state
  const [project_id, setProject_id] = useState("");
  const [client_id, setClient_id] = useState("");
  const [bankclientacco_id, setBankclientacco_id] = useState("");
  const [notes, setNotes] = useState("");

  // Dropdown data
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [bankClientAccounts, setBankClientAccounts] = useState([]);

  const resetForm = () => {
    setProject_id("");
    setClient_id("");
    setBankclientacco_id("");
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  // Load dropdown data when modal opens
  useEffect(() => {
    if (show) {
      loadDropdownData();
    }
  }, [show]);

  const loadDropdownData = async () => {
    try {
      const projectsRes = await axios.get(ALL_PROJECTS, { headers });
      setProjects(projectsRes.data.all_projects || []);

      const clientsRes = await axios.get(ALL_CLIENTS, { headers });
      setClients(clientsRes.data.all_clients || []);

      const bankAccRes = await axios.get(ALL_BANK_CLIENT_ACCOUNTS, { headers });
      setBankClientAccounts(bankAccRes.data.all_bank_client_accounts || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Validation
  const isProjectValid = project_id !== "";
  const isClientValid = client_id !== "";
  const isBankClientAccountValid = bankclientacco_id !== "";
  const isFormValid = isProjectValid && isClientValid && isBankClientAccountValid;

  const createNewBankProjectAccount = async () => {
    if (!isFormValid) return;
    try {
      await axios.post(
        CREATE_BANK_PROJECT_ACCOUNT,
        { project_id, client_id, bankclientacco_id, notes },
        { headers }
      );

      Swal.fire("Success", "Bank Project Account created successfully", "success");
      if (onBankProjectAccountCreated) onBankProjectAccountCreated();
      handleClose();
    } catch (e) {
      console.error("Error creating bank project account:", e);
      const errorMessage = e.response?.data?.error || "Failed to create bank project account";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }} />
        Create new Bank Project Account
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create new Bank Project Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                {/* Basic Information */}
                <h6 className="mb-3">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Project *</Form.Label>
                      <Form.Select
                        onChange={(e) => setProject_id(e.target.value)}
                        value={project_id}
                      >
                        <option value="">Select Project</option>
                        {Array.isArray(projects) && projects.map((p) => (
                          <option key={p.project_id} value={p.project_id}>
                            {p.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client *</Form.Label>
                      <Form.Select
                        onChange={(e) => setClient_id(e.target.value)}
                        value={client_id}
                      >
                        <option value="">Select Client</option>
                        {Array.isArray(clients) && clients.map((c) => (
                          <option key={c.client_id} value={c.client_id}>
                            {c.fullname || `${c.surname} ${c.name}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Client Account *</Form.Label>
                      <Form.Select
                        onChange={(e) => setBankclientacco_id(e.target.value)}
                        value={bankclientacco_id}
                      >
                        <option value="">Select Account</option>
                        {Array.isArray(bankClientAccounts) && bankClientAccounts.map((a) => (
                          <option key={a.bankclientacco_id} value={a.bankclientacco_id}>
                            {a.bank?.bankname ? `${a.bank.bankname} - ${a.accountnumber}` : a.accountnumber}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        onChange={(e) => setNotes(e.target.value)}
                        value={notes}
                      />
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
                {!isProjectValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Project is required.
                  </li>
                )}
                {!isClientValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Client is required.
                  </li>
                )}
                {!isBankClientAccountValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Bank Client Account is required.
                  </li>
                )}
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button color="green" onClick={createNewBankProjectAccount} disabled={!isFormValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddBankProjectAccountModal;
