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
const ADD_DOCUMENT = "http://localhost:8000/api/data_management/all_documents/";
const GET_PROJECTS = "http://localhost:8000/api/data_management/all_projects/";
const GET_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";

// Helpers
const onlyAlphanumeric = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);

function AddDocumentModal({ onClientCreated, refreshData, defaultProjectId, defaultClientId, lockProject = false, lockClient = false }) {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const [documentId, setDocumentId] = useState(""); // maps to document_id
  const [title, setTitle] = useState(""); // required
  const [projectId, setProjectId] = useState(""); // optional - this will store project_id
  const [clientId, setClientId] = useState(""); // optional - this will store client_id
  const [validUntil, setValidUntil] = useState(""); // required
  const [file, setFile] = useState(null); // optional file upload
  const [original, setOriginal] = useState(false); // optional, default false
  const [trafficable, setTrafficable] = useState(false); // optional, default false
  const [status, setStatus] = useState(""); // optional
  const [notes, setNotes] = useState(""); // optional

  // Fetch projects and clients on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        // Fetch projects
        const projectsResponse = await axios.get(GET_PROJECTS, { headers: currentHeaders });
        if (projectsResponse.data && projectsResponse.data.all_projects) {
          setProjects(projectsResponse.data.all_projects);
        }

        // Fetch clients
        const clientsResponse = await axios.get(GET_CLIENTS, { headers: currentHeaders });
        if (clientsResponse.data && clientsResponse.data.all_clients) {
          setClients(clientsResponse.data.all_clients);
        }
      } catch (error) {
        console.error('Error fetching reference data:', error);
      }
    };

    fetchReferenceData();
  }, []);

  const resetForm = () => {
    setDocumentId("");
    setTitle("");
    setProjectId("");
    setClientId("");
    setValidUntil("");
    setFile(null);
    setOriginal(false);
    setTrafficable(false);
    setStatus("");
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    if (defaultProjectId) setProjectId(defaultProjectId);
    if (defaultClientId) setClientId(defaultClientId);
    setShow(true);
  };

  const isDocumentIdValid = documentId.length >= 2 && documentId.length <= 10;
  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isProjectValid = projectId !== "";
  const isFormValid = isDocumentIdValid && isTitleValid && isProjectValid;

  const createNewDocument = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      // Ensure we don't force JSON content-type; allow multipart boundary
      delete currentHeaders["Content-Type"]; 

      const formData = new FormData();
      formData.append("document_id", documentId);
      formData.append("title", title.trim());
      if (validUntil) formData.append("validuntil", validUntil);
      if (projectId) formData.append("project_id", projectId);
      if (clientId) formData.append("client_id", clientId);
      if (status) formData.append("status", status);
      formData.append("original", original ? "true" : "false");
      formData.append("trafficable", trafficable ? "true" : "false");
      if (notes && notes.trim().length > 0) formData.append("notes", notes.trim());
      if (file) formData.append("filepath", file);

      const response = await axios.post(ADD_DOCUMENT, formData, { headers: currentHeaders });

      if (response.status === 201) {
        if (refreshData) refreshData();
        handleClose();
      }
    } catch (error) {
      console.error("Error creating document:", error);

      let errorMessage = "An error occurred while creating the document.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        // Handle validation errors
        const errors = error.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        errorMessage = errorMessages;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Document
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Document ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(clampLen(onlyAlphanumeric(e.target.value), 10))}
                    placeholder="Enter document ID (2-10 characters)"
                    isInvalid={documentId.length > 0 && !isDocumentIdValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Document ID must be 2-10 alphanumeric characters.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(clampLen(e.target.value, 40))}
                    placeholder="Enter document title"
                    isInvalid={title.length > 0 && !isTitleValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Title must be 2-40 characters.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Project *
                    {projectId !== "" ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : null}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    disabled={lockProject}
                  >
                    <option value="">Select a project (optional)</option>
                    {projects.map((project) => (
                      <option key={project.project_id} value={project.project_id}>
                        {project.project_id} - {project.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Client
                    {clientId !== "" ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : null}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    disabled={lockClient}
                  >
                    <option value="">Select a client (optional)</option>
                    {clients.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.client_id} - {client.fullname}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Valid until</Form.Label>
                  <Form.Control
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File (optional)</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select status (optional)</option>
                    <option value="SENT_TO_ATHENS">Sent To Athens</option>
                    <option value="RECEIVED_IN_ATHENS">Received In Athens</option>
                    <option value="SENT_TO_TORONTO">Sent To Toronto</option>
                    <option value="RECEIVED_IN_TORONTO">Received In Toronto</option>
                    <option value="SENT_TO_MONTREAL">Sent To Montreal</option>
                    <option value="RECEIVED_IN_MONTREAL">Received In Montreal</option>
                    <option value="SENT_TO_CLIENT">Sent To Client</option>
                    <option value="RECEIVED_FROM_CLIENT">Received From Client</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes (optional)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Original"
                    checked={original}
                    onChange={(e) => setOriginal(e.target.checked)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Trafficable"
                    checked={trafficable}
                    onChange={(e) => setTrafficable(e.target.checked)}
                  />
                </Form.Group>
              </Col>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isDocumentIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Document ID is required (2–10 alphanumeric chars).
                  </li>
                )}
                {!isTitleValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title is required (2–40 chars).
                  </li>
                )}
                {!isProjectValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Project is required.
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
            onClick={createNewDocument}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddDocumentModal;
