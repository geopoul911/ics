// Built-ins
import React, { useState, useEffect } from "react";

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

// Variables
window.Swal = Swal;

const CREATE_PROJECT_TASK = "http://localhost:8000/api/data_management/project_tasks/";

function AddProjectTaskModal({ onCreated }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState([]);
  const [taskCategories, setTaskCategories] = useState([]);
  const [consultants, setConsultants] = useState([]);

  // Form state
  const [projtask_id, setProjtaskId] = useState("");
  const [project_id, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [taskcate_id, setTaskcateId] = useState("");
  const [priority, setPriority] = useState("B");
  const [assigner_id, setAssignerId] = useState("");
  const [assignee_id, setAssigneeId] = useState("");
  const [assigndate, setAssigndate] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (show) {
      loadProjects();
      loadTaskCategories();
      loadConsultants();
    }
  }, [show]);

  const loadProjects = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const res = await axios.get(
        "http://localhost:8000/api/data_management/all_projects/",
        { headers: currentHeaders }
      );
      setProjects(res.data.all_projects || []);
    } catch (e) {
      console.error("Error loading projects", e);
      setProjects([]);
    }
  };

  const loadTaskCategories = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const res = await axios.get(
        "http://localhost:8000/api/administration/all_task_categories/",
        { headers: currentHeaders }
      );
      setTaskCategories(res.data.all_task_categories || []);
    } catch (e) {
      console.error("Error loading task categories", e);
      setTaskCategories([]);
    }
  };

  const loadConsultants = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const res = await axios.get(
        "http://localhost:8000/api/administration/all_consultants/",
        { headers: currentHeaders }
      );
      setConsultants(res.data.all_consultants || []);
    } catch (e) {
      console.error("Error loading consultants", e);
      setConsultants([]);
    }
  };

  const isProjtaskIdValid = projtask_id.trim().length >= 2 && projtask_id.trim().length <= 10;
  const isProjectValid = !!project_id;
  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 120;
  const isPriorityValid = ["A", "B", "C"].includes(priority);
  const isFormValid = isProjtaskIdValid && isProjectValid && isTitleValid && isPriorityValid;

  const clamp = (value, max) => value.slice(0, max);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const payload = {
        projtask_id: projtask_id.trim(),
        project_id,
        title: title.trim(),
        details: details.trim() || undefined,
        taskcate_id: taskcate_id || undefined,
        priority,
        assigner_id: assigner_id || undefined,
        assignee_id: assignee_id || undefined,
        assigndate: assigndate || undefined,
        deadline: deadline || undefined,
      };

      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };

      await axios.post(CREATE_PROJECT_TASK, payload, { headers: currentHeaders });

      Swal.fire({ icon: "success", title: "Success!", text: "Project Task created successfully" });

      // Reset
      setProjtaskId("");
      setProjectId("");
      setTitle("");
      setDetails("");
      setTaskcateId("");
      setPriority("B");
      setAssignerId("");
      setAssigneeId("");
      setAssigndate("");
      setDeadline("");
      setShow(false);

      if (onCreated) onCreated();
    } catch (error) {
      console.error("Error creating project task:", error);
      let errorMessage = "Failed to create project task";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      Swal.fire({ icon: "error", title: "Error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setProjtaskId("");
    setProjectId("");
    setTitle("");
    setDetails("");
    setTaskcateId("");
    setPriority("B");
    setAssignerId("");
    setAssigneeId("");
    setAssigndate("");
    setDeadline("");
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={() => setShow(true)}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }} />
        Create Project Task
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project Task</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Task ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={projtask_id}
                    onChange={(e) => setProjtaskId(clamp(e.target.value, 10))}
                    maxLength={10}
                    placeholder="Enter ID"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project *</Form.Label>
                  <Form.Control as="select" value={project_id} onChange={(e) => setProjectId(e.target.value)}>
                    <option value="">Select project</option>
                    {projects.map((p) => (
                      <option key={p.project_id} value={p.project_id}>{p.title}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(clamp(e.target.value, 120))}
                    maxLength={120}
                    placeholder="Enter title"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority *</Form.Label>
                  <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="A">High</option>
                    <option value="B">Medium</option>
                    <option value="C">Low</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Details</Form.Label>
                  <Form.Control as="textarea" rows={3} value={details} onChange={(e) => setDetails(clamp(e.target.value, 1000))} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Category</Form.Label>
                  <Form.Control as="select" value={taskcate_id} onChange={(e) => setTaskcateId(e.target.value)}>
                    <option value="">Select category</option>
                    {taskCategories.map((c) => (
                      <option key={c.taskcate_id} value={c.taskcate_id}>{c.title}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigner</Form.Label>
                  <Form.Control as="select" value={assigner_id} onChange={(e) => setAssignerId(e.target.value)}>
                    <option value="">Select assigner</option>
                    {consultants.map((c) => (
                      <option key={c.consultant_id} value={c.consultant_id}>{c.surname} {c.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Assignee</Form.Label>
                  <Form.Control as="select" value={assignee_id} onChange={(e) => setAssigneeId(e.target.value)}>
                    <option value="">Select assignee</option>
                    {consultants.map((c) => (
                      <option key={c.consultant_id} value={c.consultant_id}>{c.surname} {c.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign Date</Form.Label>
                  <Form.Control type="date" value={assigndate} onChange={(e) => setAssigndate(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <small className="mr-auto">
              {!isFormValid ? (
                <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                  {!isProjtaskIdValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Project Task ID is required (2–10 chars).
                    </li>
                  )}
                  {!isProjectValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Project is required.
                    </li>
                  )}
                  {!isTitleValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Title is required (2–120 chars).
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

            <Button color="red" onClick={handleClose} disabled={loading}>
              Close
            </Button>
            <Button color="green" onClick={handleSubmit} disabled={!isFormValid || loading}>
              {loading ? "Creating..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default AddProjectTaskModal;


