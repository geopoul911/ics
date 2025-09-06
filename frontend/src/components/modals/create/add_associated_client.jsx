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
const ADD_ASSOCIATED_CLIENT = "http://localhost:8000/api/data_management/associated_clients/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

function AddAssociatedClientModal({ onClientCreated, refreshData, defaultProjectId, defaultClientId, lockProject = false, lockClient = false }) {
  const [show, setShow] = useState(false);

  // Basic Information
  const [assoclientId, setAssoclientId] = useState("");
  const [project, setProject] = useState("");
  const [client, setClient] = useState("");
  const [orderindex, setOrderindex] = useState("");
  const [notes, setNotes] = useState("");

  // Dropdown Data
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const resetForm = () => {
    setAssoclientId("");
    setProject("");
    setClient("");
    setOrderindex("");
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    if (defaultProjectId) setProject(defaultProjectId);
    if (defaultClientId) setClient(defaultClientId);
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
      console.log('Loading dropdown data...');
      
      // Load reference data for dropdowns using axios
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const [projectsRes, clientsRes] = await Promise.all([
        axios.get("http://localhost:8000/api/data_management/all_projects/", { headers: currentHeaders }),
        axios.get("http://localhost:8000/api/data_management/all_clients/", { headers: currentHeaders })
      ]);
      
      console.log('Raw API responses:', {
        projects: projectsRes,
        clients: clientsRes
      });
      
      // Handle the response structure correctly
      // Projects API returns {"all_projects": [...]}
      const projectsData = projectsRes?.data?.all_projects || [];
      
      // Clients API returns {"all_clients": [...]}
      const clientsData = clientsRes?.data?.all_clients || [];
      
      console.log('Processed data:', {
        projects: projectsData,
        clients: clientsData
      });
      
      setProjects(projectsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      // Set empty arrays to prevent map errors
      setProjects([]);
      setClients([]);
    }
  };

  // Validation
  const isAssoclientIdValid = assoclientId.trim().length >= 2 && assoclientId.trim().length <= 10;
  const isProjectValid = project.length > 0;
  const isClientValid = client.length > 0;
  const isOrderindexValid = /^-?\d+$/.test(String(orderindex).trim());

  const isFormValid = isAssoclientIdValid && isProjectValid && isClientValid && isOrderindexValid;

  const createNewAssociatedClient = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios({
        method: "post",
        url: ADD_ASSOCIATED_CLIENT,
        headers: currentHeaders,
        data: {
          // Required fields
          assoclient_id: assoclientId.trim(),
          project_id: project,
          client_id: client,
          orderindex: parseInt(orderindex, 10),
          
          // Optional fields
          notes: notes.trim() || null,
        },
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Associated Client created successfully!",
      });

      // Refresh the parent component if callback provided
      if (onClientCreated) onClientCreated();
      if (refreshData) refreshData();
      handleClose();
    } catch (e) {
      console.error('Associated Client creation error:', e.response?.data);
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        e?.response?.data ||
        "Something went wrong while creating the associated client.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: typeof apiMsg === 'object' ? JSON.stringify(apiMsg) : apiMsg,
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Associated Client
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Associated Client</Modal.Title>
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
                      <Form.Label>Associated Client ID *</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., AC001"
                        onChange={(e) => setAssoclientId(clampLen(e.target.value.toUpperCase(), 10))}
                        value={assoclientId}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Order by *</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="e.g., 1"
                        onChange={(e) => setOrderindex(e.target.value)}
                        value={orderindex}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Project *</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setProject(e.target.value)}
                        value={project}
                        disabled={lockProject}
                      >
                        <option value="">Select Project</option>
                        {Array.isArray(projects) && projects.map((project) => (
                          <option key={project.project_id} value={project.project_id}>
                            {project.project_id} - {project.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client *</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setClient(e.target.value)}
                        value={client}
                        disabled={lockClient}
                      >
                        <option value="">Select Client</option>
                        {Array.isArray(clients) && clients.map((client) => (
                          <option key={client.client_id} value={client.client_id}>
                            {client.client_id} - {client.fullname || `${client.surname} ${client.name}`}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Notes:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Additional notes about the associated client"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
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
                {!isAssoclientIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Associated Client ID is required (2–10 chars).
                  </li>
                )}
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
                {!isOrderindexValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Order by is required and must be an integer.
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
              createNewAssociatedClient();
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

export default AddAssociatedClientModal;
