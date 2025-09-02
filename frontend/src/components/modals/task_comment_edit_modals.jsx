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

// Edit Task Comment ID Modal
export function EditTaskCommentIdModal({ taskComment, update_state }) {
  const [show, setShow] = useState(false);
  const [taskcomm_id, setTaskcommId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setTaskcommId(taskComment.taskcomm_id || "");
    }
  }, [show, taskComment]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!taskcomm_id.trim()) {
      Swal.fire("Error", "Task Comment ID is required", "error");
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
        { taskcomm_id: taskcomm_id.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Task Comment ID updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating task comment ID:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update task comment ID";
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
          <Modal.Title>Edit Task Comment ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Task Comment ID *:</Form.Label>
              <Form.Control
                type="text"
                value={taskcomm_id}
                onChange={(e) => setTaskcommId(e.target.value)}
                placeholder="Enter task comment ID"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={!taskcomm_id.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

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
      const response = await axios.get("http://localhost:8000/api/data_management/project_tasks/");
      const projectTasksData = response?.data?.all_project_tasks || [];
      setProjectTasks(projectTasksData);
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
        { projtask: projtask },
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={!projtask.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
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
      const response = await axios.get("http://localhost:8000/api/administration/all_consultants/");
      const consultantsData = response?.data?.all_consultants || [];
      setConsultants(consultantsData);
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
        { consultant: consultant },
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Consultant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                    {cons.surname} {cons.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={!consultant.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
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
          <Form>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={!comment.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
