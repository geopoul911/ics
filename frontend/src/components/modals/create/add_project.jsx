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
const ADD_PROJECT = "http://localhost:8000/api/data_management/projects/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

function AddProjectModal({ onProjectCreated }) {
  const [show, setShow] = useState(false);

  // Basic Information
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [filecode, setFilecode] = useState("");
  const [consultant, setConsultant] = useState("");
  const [taxation, setTaxation] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Created");
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");

  // Dropdown Data
  const [consultants, setConsultants] = useState([]);

  const resetForm = () => {
    setProjectId("");
    setTitle("");
    setFilecode("");
    setConsultant("");
    setTaxation(false);
    setDeadline("");
    setStatus("Created");
    setDetails("");
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
      console.log('Loading dropdown data...');
      
      // Load consultants for dropdown
      const consultantsRes = await axios.get("http://localhost:8000/api/administration/all_consultants/");
      
      console.log('Raw consultants response:', consultantsRes);
      
      // Consultants API returns {"all_consultants": [...]}
      const consultantsData = consultantsRes?.data?.all_consultants || [];
      
      console.log('Processed consultants data:', consultantsData);
      
      setConsultants(consultantsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      // Set empty arrays to prevent map errors
      setConsultants([]);
    }
  };

  // Validation
  const isProjectIdValid = projectId.trim().length >= 2 && projectId.trim().length <= 10;
  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 120;
  const isFilecodeValid = filecode.trim().length >= 1 && filecode.trim().length <= 20;
  const isDetailsValid = !details.trim() || details.trim().length <= 1000;
  const isNotesValid = !notes.trim() || notes.trim().length <= 1000;

  const isFormValid = isProjectIdValid && isTitleValid && isFilecodeValid && 
                     isDetailsValid && isNotesValid;

  const createNewProject = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios({
        method: "post",
        url: ADD_PROJECT,
        headers: currentHeaders,
        data: {
          // Required fields
          project_id: projectId.trim(),
          title: title.trim(),
          filecode: filecode.trim(),
          registrationdate: new Date().toISOString().split('T')[0], // Today's date
          registrationuser: localStorage.getItem('username') || 'testuser', // Current user
          status: status,
          taxation: taxation,
          
          // Optional fields
          consultant_id: consultant || null,
          deadline: deadline || null,
          details: details.trim() || null,
          notes: notes.trim() || null,
        },
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project created successfully!",
      });

      // Refresh the parent component if callback provided
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (e) {
      console.error('Project creation error:', e.response?.data);
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        e?.response?.data ||
        "Something went wrong while creating the project.";
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
        Create new Project
      </Button>

      <Modal
        show={show}
        size="xl"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Project</Modal.Title>
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
                      <Form.Label>Project ID *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., PRJ001"
                        onChange={(e) => setProjectId(clampLen(e.target.value.toUpperCase(), 10))}
                        value={projectId}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *:</Form.Label>
                      <Form.Control
                        maxLength={120}
                        placeholder="e.g., Tax Return Preparation"
                        onChange={(e) => setTitle(clampLen(e.target.value, 120))}
                        value={title}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>File Code *:</Form.Label>
                      <Form.Control
                        maxLength={20}
                        placeholder="e.g., TOR/000256/05-2019"
                        onChange={(e) => setFilecode(clampLen(e.target.value.toUpperCase(), 20))}
                        value={filecode}
                      />
                      <Form.Text className="text-muted">
                        Format: 3 chars for office city/UniqueNumber(6)/Month(2)-Year(4)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                      >
                        <option value="Created">Created</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Inprogress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Settled">Settled</option>
                        <option value="Abandoned">Abandoned</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Project Details */}
                <h6 className="mb-3 mt-4">Project Details</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Consultant:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setConsultant(e.target.value)}
                        value={consultant}
                      >
                        <option value="">Select Consultant</option>
                        {Array.isArray(consultants) && consultants.map((consultant) => (
                          <option key={consultant.consultant_id} value={consultant.consultant_id}>
                            {consultant.surname} {consultant.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Deadline:</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setDeadline(e.target.value)}
                        value={deadline}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="taxation-switch"
                        label="Taxation Project"
                        checked={taxation}
                        onChange={(e) => setTaxation(e.target.checked)}
                      />
                      <Form.Text className="text-muted">
                        Check if this is a taxation project
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Additional Information */}
                <h6 className="mb-3 mt-4">Additional Information</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Details:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={1000}
                    placeholder="Project details and description"
                    onChange={(e) => setDetails(clampLen(e.target.value, 1000))}
                    value={details}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={1000}
                    placeholder="Additional notes about the project"
                    onChange={(e) => setNotes(clampLen(e.target.value, 1000))}
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
                {!isProjectIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Project ID is required (2–10 chars).
                  </li>
                )}
                {!isTitleValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title is required (2–120 chars).
                  </li>
                )}
                {!isFilecodeValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    File Code is required (1–20 chars).
                  </li>
                )}
                {!isDetailsValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Details must be 1000 chars or less.
                  </li>
                )}
                {!isNotesValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Notes must be 1000 chars or less.
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
              createNewProject();
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

export default AddProjectModal;
