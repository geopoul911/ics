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

function AddDocumentModal({ onClientCreated }) {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const [documentId, setDocumentId] = useState(""); // maps to document_id
  const [title, setTitle] = useState(""); // required
  const [projectId, setProjectId] = useState(""); // optional - this will store project_id
  const [clientId, setClientId] = useState(""); // optional - this will store client_id
  const [created, setCreated] = useState(""); // required
  const [validUntil, setValidUntil] = useState(""); // required
  const [filepath, setFilepath] = useState(""); // required
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
    setCreated("");
    setValidUntil("");
    setFilepath("");
    setOriginal(false);
    setTrafficable(false);
    setStatus("");
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const isDocumentIdValid = documentId.length >= 2 && documentId.length <= 10;
  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isProjectOrClientValid = projectId !== "" || clientId !== "";
  const isCreatedValid = created !== "";
  const isValidUntilValid = validUntil !== "";
  const isFilePathValid = filepath.trim().length >= 1 && filepath.trim().length <= 120;

  const isFormValid = isDocumentIdValid && isTitleValid && isProjectOrClientValid && 
                     isCreatedValid && isValidUntilValid && isFilePathValid;

  const createNewDocument = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const documentData = {
        document_id: documentId,
        title: title.trim(),
        created: created,
        validuntil: validUntil,
        filepath: filepath.trim(),
        original: original,
        trafficable: trafficable,
        notes: notes.trim() || null,
      };

      // Add project_id if selected
      if (projectId) {
        documentData.project_id = projectId;
      }

      // Add client_id if selected
      if (clientId) {
        documentData.client_id = clientId;
      }

      // Add status if selected
      if (status) {
        documentData.status = status;
      }

      const response = await axios.post(ADD_DOCUMENT, documentData, { headers: currentHeaders });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document created successfully.",
        });

        handleClose();
        if (onClientCreated) {
          onClientCreated();
        }
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

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Document ID *
                    {isDocumentIdValid ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : (
                      <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
                    )}
                  </Form.Label>
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
                  <Form.Label>
                    Title *
                    {isTitleValid ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : (
                      <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
                    )}
                  </Form.Label>
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
                    Project
                    {projectId !== "" ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : null}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
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
                  <Form.Label>
                    Created Date *
                    {isCreatedValid ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : (
                      <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
                    )}
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={created}
                    onChange={(e) => setCreated(e.target.value)}
                    isInvalid={created.length > 0 && !isCreatedValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Created date is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Valid Until *
                    {isValidUntilValid ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : (
                      <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
                    )}
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    isInvalid={validUntil.length > 0 && !isValidUntilValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Valid until date is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    File Path *
                    {isFilePathValid ? (
                      <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
                    ) : (
                      <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={filepath}
                    onChange={(e) => setFilepath(clampLen(e.target.value, 120))}
                    placeholder="Enter file path"
                    isInvalid={filepath.length > 0 && !isFilePathValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    File path must be 1-120 characters.
                  </Form.Control.Feedback>
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
                    <option value="SENT_TO_ATHENS">Αποστολή προς την Αθήνα</option>
                    <option value="RECEIVED_IN_ATHENS">Παραλήφθηκε από την Αθήνα</option>
                    <option value="SENT_TO_TORONTO">Αποστολή προς το Τορόντο</option>
                    <option value="RECEIVED_IN_TORONTO">Παραλήφθηκε από το Τορόντο</option>
                    <option value="SENT_TO_MONTREAL">Αποστολή προς το Μόντρεαλ</option>
                    <option value="RECEIVED_IN_MONTREAL">Παραλήφθηκε από το Μόντρεαλ</option>
                    <option value="SENT_TO_CLIENT">Αποστολή προς τον Πελάτη</option>
                    <option value="RECEIVED_FROM_CLIENT">Παραλήφθηκε από τον Πελάτη</option>
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

            {!isProjectOrClientValid && (
              <div className="alert alert-warning">
                <AiOutlineWarning style={{ marginRight: "0.5em" }} />
                At least one of Project or Client must be selected.
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={createNewDocument}
            disabled={!isFormValid}
          >
            Create Document
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddDocumentModal;
