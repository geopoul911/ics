// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../global_vars";


// Variables
window.Swal = Swal;

// API endpoints
const UPDATE_TASK_COMMENT = "http://localhost:8000/api/data_management/task_comment/";

// Edit Task Comment Project Task Modal
export function EditTaskCommentProjectTaskModal({ taskComment, update_state }) {
  const [show, setShow] = useState(false);
  const [projtask, setProjtask] = useState("");
  const [projectTasks, setProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProjtask(taskComment.projtask?.projtask_id || "");
      loadProjectTasks();
    }
  }, [show, taskComment]);

  const loadProjectTasks = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const response = await axios.get("http://localhost:8000/api/data_management/project_tasks/", { headers: currentHeaders });
      const projectTasksData = response?.data?.all_project_tasks || response?.data?.results || response?.data?.data || response?.data || [];
      setProjectTasks(Array.isArray(projectTasksData) ? projectTasksData : []);
    } catch (error) {
      console.error('Error loading project tasks:', error);
      setProjectTasks([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!projtask.trim()) {
      Swal.fire("Error", "Project Task is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_TASK_COMMENT + taskComment.taskcomm_id + "/",
        { projtask_id: projtask },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Project Task updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating project task:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update project task";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Project Task</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Project Task *:</Form.Label>
              <Form.Control
                as="select"
                value={projtask}
                onChange={(e) => setProjtask(e.target.value)}
              >
                <option value="">Select Project Task</option>
                {projectTasks.map((task) => (
                  <option key={task.projtask_id} value={task.projtask_id}>
                    {task.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: projtask.trim() ? "green" : "red" }}>{projtask.trim() ? "Looks good." : "Project Task is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!projtask.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Task Comment Consultant Modal
export function EditTaskCommentConsultantModal({ taskComment, update_state }) {
  const [show, setShow] = useState(false);
  const [consultant, setConsultant] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setConsultant(taskComment.consultant?.consultant_id || "");
      loadConsultants();
    }
  }, [show, taskComment]);

  const loadConsultants = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const response = await axios.get("http://localhost:8000/api/administration/all_consultants/", { headers: currentHeaders });
      const list = response?.data?.all_consultants || response?.data?.results || response?.data?.data || response?.data || [];
      setConsultants(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error loading consultants:', error);
      setConsultants([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!consultant.trim()) {
      Swal.fire("Error", "Consultant is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_TASK_COMMENT + taskComment.taskcomm_id + "/",
        { consultant_id: consultant },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Consultant updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating consultant:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update consultant";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Consultant</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Consultant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Consultant *:</Form.Label>
              <Form.Control
                as="select"
                value={consultant}
                onChange={(e) => setConsultant(e.target.value)}
              >
                <option value="">Select Consultant</option>
                {consultants.map((cons) => (
                  <option key={cons.consultant_id} value={cons.consultant_id}>
                    {cons.consultant_id} - {cons.fullname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: consultant.trim() ? "green" : "red" }}>{consultant.trim() ? "Looks good." : "Consultant is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!consultant.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Task Comment Comment Modal
export function EditTaskCommentCommentModal({ taskComment, update_state }) {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setComment(taskComment.comment || "");
    }
  }, [show, taskComment]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!comment.trim()) {
      Swal.fire("Error", "Comment is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_TASK_COMMENT + taskComment.taskcomm_id + "/",
        { comment: comment.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Comment updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating comment:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update comment";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Comment *:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter comment"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: comment.trim() ? "green" : "red" }}>{comment.trim() ? "Looks good." : "Comment is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!comment.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
