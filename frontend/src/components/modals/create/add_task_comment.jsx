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

const CREATE_TASK_COMMENT = "https://ultima.icsgr.com/api/data_management/task_comments/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

function AddTaskCommentModal({ onTaskCommentCreated, refreshData, defaultProjectTaskId, lockProjectTask = false }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectTasks, setProjectTasks] = useState([]);
  const [consultants, setConsultants] = useState([]);

  // Form state
  const [taskcomm_id, setTaskcommId] = useState("");
  const [projtask, setProjtask] = useState("");
  const [consultant, setConsultant] = useState("");
  const [comment, setComment] = useState("");

  // Fetch data when modal opens
  useEffect(() => {
    if (show) {
      fetchProjectTasks();
      fetchConsultants();
    }
  }, [show]);

  const fetchProjectTasks = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const res = await axios.get(
        "https://ultima.icsgr.com/api/data_management/project_tasks/",
        { headers: currentHeaders }
      );
      let tasks = [];
      if (Array.isArray(res.data)) tasks = res.data;
      else if (Array.isArray(res.data?.results)) tasks = res.data.results;
      else if (Array.isArray(res.data?.data)) tasks = res.data.data;
      else tasks = res.data?.all_project_tasks || [];
      setProjectTasks(tasks);
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      setProjectTasks([]);
    }
  };

  const fetchConsultants = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken"),
      };
      const res = await axios.get(
        "https://ultima.icsgr.com/api/administration/all_consultants/",
        { headers: currentHeaders }
      );
      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data?.results)) list = res.data.results;
      else if (Array.isArray(res.data?.data)) list = res.data.data;
      else list = res.data?.all_consultants || [];
      setConsultants(list);
    } catch (error) {
      console.error("Error fetching consultants:", error);
      setConsultants([]);
    }
  };

  // Validation
  const isTaskcommIdValid = taskcomm_id.trim().length >= 2 && taskcomm_id.trim().length <= 10;
  const isProjtaskValid = projtask !== "";
  const isConsultantValid = consultant !== "";
  const isCommentValid = comment.trim().length >= 2 && comment.trim().length <= 1000;

  const isFormValid = isTaskcommIdValid && isProjtaskValid && isConsultantValid && isCommentValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setLoading(true);

    try {
      const taskCommentData = {
        taskcomm_id: taskcomm_id.trim(),
        projtask_id: projtask,
        consultant_id: consultant,
        comment: comment.trim(),
      };

      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.post(
        CREATE_TASK_COMMENT,
        taskCommentData,
        { headers: currentHeaders }
      );

      Swal.fire({ icon: "success", title: "Success!", text: "Task Comment created successfully" });

      // Navigate to the created task comment overview
      const newId = taskcomm_id.trim();
      window.location.href = `/data_management/task_comment/${newId}`;
    } catch (error) {
      console.error("Error creating task comment:", error);
      
      let errorMessage = "Failed to create task comment";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setTaskcommId("");
    setProjtask("");
    setConsultant("");
    setComment("");
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => { if (defaultProjectTaskId) setProjtask(defaultProjectTaskId); setShow(true); }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create Task Comment
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task Comment</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Comment ID *</Form.Label>
                  <Form.Control
                    type="text"
                    value={taskcomm_id}
                    onChange={(e) => setTaskcommId(clampLen(e.target.value, 10))}
                    maxLength={10}
                    placeholder="Enter task comment ID (max 10)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Task *</Form.Label>
                  <Form.Control
                    as="select"
                    value={projtask}
                    onChange={(e) => setProjtask(e.target.value)}
                    disabled={lockProjectTask}
                  >
                    <option value="">Select a project task</option>
                    {projectTasks.map((task) => (
                      <option key={task.projtask_id} value={task.projtask_id}>
                        {task.projtask_id} - {task.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultant *</Form.Label>
                  <Form.Control
                    as="select"
                    value={consultant}
                    onChange={(e) => setConsultant(e.target.value)}
                  >
                    <option value="">Select a consultant</option>
                    {consultants.map((c) => (
                      <option key={c.consultant_id} value={c.consultant_id}>
                        {c.consultant_id} - {c.fullname || c.username || c.consultant_id}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Comment *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(clampLen(e.target.value, 1000))}
                    maxLength={1000}
                    placeholder="Enter your comment"
                  />
                </Form.Group>
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
                  {!isTaskcommIdValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Task Comment ID is required (2–10 chars).
                    </li>
                  )}
                  {!isProjtaskValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Project Task is required.
                    </li>
                  )}
                  {!isConsultantValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Consultant is required.
                    </li>
                  )}
                  {!isCommentValid && (
                    <li>
                      <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                      Comment is required (2–1000 chars).
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

            <Button color="red" onClick={handleClose} disabled={loading}>
              Close
            </Button>
            <Button
              color="green"
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
            >
              {loading ? "Creating..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default AddTaskCommentModal;
