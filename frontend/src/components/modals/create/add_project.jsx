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
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const consultantsRes = await axios.get(
        "http://localhost:8000/api/administration/all_consultants/",
        { headers: currentHeaders }
      );
      
      console.log('Raw consultants response:', consultantsRes);
      
      // Handle possible response structures
      let consultantsData = [];
      if (Array.isArray(consultantsRes?.data)) consultantsData = consultantsRes.data;
      else if (Array.isArray(consultantsRes?.data?.results)) consultantsData = consultantsRes.data.results;
      else if (Array.isArray(consultantsRes?.data?.data)) consultantsData = consultantsRes.data.data;
      else consultantsData = consultantsRes?.data?.all_consultants || [];
      
      console.log('Processed consultants data:', consultantsData);
      
      setConsultants(consultantsData);

      // Load project categories
      const categoriesRes = await axios.get(
        "http://localhost:8000/api/administration/all_project_categories/",
        { headers: currentHeaders }
      );
      const categoriesData = categoriesRes?.data?.all_project_categories || categoriesRes?.data?.results || categoriesRes?.data?.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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
  const filecodePattern = /^[A-Z]{3}\/\d{6}\/\d{2}-\d{4}$/;
  const isFilecodeValid = filecodePattern.test(filecode.trim());
  const isConsultantValid = consultant.length > 0; // required by model
  const isDetailsValid = details.trim().length >= 1 && details.trim().length <= 1000; // required by model
  const isNotesValid = !notes.trim() || notes.trim().length <= 1000;

  const isCategoriesValid = taxation ? true : selectedCategories.length > 0;
  const isFormValid = isProjectIdValid && isTitleValid && isFilecodeValid &&
                      isConsultantValid && isDetailsValid && isCategoriesValid && isNotesValid;

  const createNewProject = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const res = await axios({
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
          consultant_id: consultant || "",
          deadline: deadline || null,
          details: details.trim() || null,
          notes: notes.trim() || null,
          category_ids: taxation ? [] : selectedCategories,
        },
      });

      const newId = res?.data?.project_id || projectId.trim();

      Swal.fire({ icon: "success", title: "Success", text: "Project created successfully!" });
      handleClose();
      if (onProjectCreated) onProjectCreated();
      if (newId) window.location.href = `/data_management/project/${encodeURIComponent(newId)}`;
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
        size="lg"
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
                <h6 className="mb-2">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
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
                    <Form.Group className="mb-2">
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
                    <Form.Group className="mb-2">
                      <Form.Label>File Code *:</Form.Label>
                      <Form.Control
                        maxLength={20}
                        placeholder="e.g., TOR/000256/05-2019"
                        onChange={(e) => setFilecode(clampLen(e.target.value.toUpperCase(), 20))}
                        value={filecode}
                      />
                      <Form.Text className="text-muted">
                        Format: 3 uppercase letters/6 digits/2 digits-4 digits (e.g., TOR/000256/05-2019)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
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
                <h6 className="mb-2 mt-3">Project Details</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Consultant *:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setConsultant(e.target.value)}
                        value={consultant}
                        isInvalid={consultant !== "" && !isConsultantValid}
                      >
                        <option value="">Select Consultant</option>
                        {Array.isArray(consultants) && consultants.map((consultant) => (
                          <option key={consultant.consultant_id} value={consultant.consultant_id}>
                            {consultant.fullname || consultant.username || consultant.consultant_id}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Deadline:</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setDeadline(e.target.value)}
                        value={deadline}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {!taxation && (
                  <>
                    <h6 className="mb-2 mt-3">Categories</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Select Categories *:</Form.Label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {Array.isArray(categories) && categories.map((cat) => {
                          const isSelected = selectedCategories.includes(cat.projcate_id);
                          return (
                            <Button
                              key={cat.projcate_id}
                              type="button"
                              size="tiny"
                              color={isSelected ? 'green' : 'grey'}
                              onClick={() => {
                                setSelectedCategories((prev) => {
                                  if (prev.includes(cat.projcate_id)) {
                                    return prev.filter((id) => id !== cat.projcate_id);
                                  }
                                  return [...prev, cat.projcate_id];
                                });
                              }}
                            >
                              {cat.title}
                            </Button>
                          );
                        })}
                      </div>
                      {!isCategoriesValid && (
                        <div style={{ color: 'red', marginTop: 6 }}>Please select at least one category.</div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Selected Categories:</Form.Label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selectedCategories.map((id) => {
                          const cat = (categories || []).find((c) => c.projcate_id === id);
                          if (!cat) return null;
                          return (
                            <span
                              key={id}
                              onClick={() => setSelectedCategories((prev) => prev.filter((x) => x !== id))}
                              style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                background: '#e9ecef',
                                borderRadius: 12,
                                cursor: 'pointer',
                              }}
                              title="Click to remove"
                            >
                              {cat.title} ×
                            </span>
                          );
                        })}
                        {selectedCategories.length === 0 && (
                          <span style={{ color: '#6c757d' }}>None selected</span>
                        )}
                      </div>
                    </Form.Group>
                  </>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
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
                <h6 className="mb-2 mt-3">Additional Information</h6>
                <Form.Group className="mb-2">
                  <Form.Label>Details:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength={1000}
                    placeholder="Project details and description"
                    onChange={(e) => setDetails(clampLen(e.target.value, 1000))}
                    value={details}
                    isInvalid={!isDetailsValid}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
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
                {!isConsultantValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Consultant is required.
                  </li>
                )}
                {!isDetailsValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Details are required and must be 1000 chars or less.
                  </li>
                )}
                {!isNotesValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Notes must be 1000 chars or less.
                  </li>
                )}
                {!isCategoriesValid && !taxation && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Please select at least one category.
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
