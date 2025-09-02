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
const UPDATE_PROJECT = "http://localhost:8000/api/data_management/project/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Edit Project ID Modal
export function EditProjectIdModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProjectId(project.project_id || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!projectId.trim()) {
      Swal.fire("Error", "Project ID is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { project_id: projectId.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Project ID updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating project ID:", error);
      const errorMessage = error.response?.data?.error || "Failed to update project ID";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Project ID:</Form.Label>
              <Form.Control
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(clampLen(e.target.value.toUpperCase(), 10))}
                maxLength={10}
                placeholder="Enter project ID"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Title Modal
export function EditProjectTitleModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setTitle(project.title || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Title is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { title: title.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Project title updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating project title:", error);
      const errorMessage = error.response?.data?.error || "Failed to update project title";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(clampLen(e.target.value, 120))}
                maxLength={120}
                placeholder="Enter project title"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project File Code Modal
export function EditProjectFilecodeModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [filecode, setFilecode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFilecode(project.filecode || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!filecode.trim()) {
      Swal.fire("Error", "File code is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { filecode: filecode.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "File code updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating file code:", error);
      const errorMessage = error.response?.data?.error || "Failed to update file code";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit File Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>File Code:</Form.Label>
              <Form.Control
                type="text"
                value={filecode}
                onChange={(e) => setFilecode(clampLen(e.target.value.toUpperCase(), 20))}
                maxLength={20}
                placeholder="Enter file code"
              />
              <Form.Text className="text-muted">
                Format: 3 chars for office city/UniqueNumber(6)/Month(2)-Year(4)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Consultant Modal
export function EditProjectConsultantModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [consultant, setConsultant] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setConsultant(project.consultant?.consultant_id || "");
      loadConsultants();
    }
  }, [show, project]);

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
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { consultant_id: consultant || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Consultant updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating consultant:", error);
      const errorMessage = error.response?.data?.error || "Failed to update consultant";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Consultant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Consultant:</Form.Label>
              <Form.Control
                as="select"
                value={consultant}
                onChange={(e) => setConsultant(e.target.value)}
              >
                <option value="">Select Consultant</option>
                {Array.isArray(consultants) && consultants.map((consultant) => (
                  <option key={consultant.consultant_id} value={consultant.consultant_id}>
                    {consultant.surname} {consultant.name}
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
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Status Modal
export function EditProjectStatusModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setStatus(project.status || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!status) {
      Swal.fire("Error", "Status is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { status: status },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Status updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage = error.response?.data?.error || "Failed to update status";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status:</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Created">Created</option>
                <option value="Assigned">Assigned</option>
                <option value="Inprogress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Settled">Settled</option>
                <option value="Abandoned">Abandoned</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Taxation Modal
export function EditProjectTaxationModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [taxation, setTaxation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setTaxation(project.taxation || false);
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { taxation: taxation },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Taxation status updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating taxation:", error);
      const errorMessage = error.response?.data?.error || "Failed to update taxation status";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Taxation Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Check
                type="switch"
                id="taxation-switch"
                label="Taxation Project"
                checked={taxation}
                onChange={(e) => setTaxation(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Deadline Modal
export function EditProjectDeadlineModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setDeadline(project.deadline || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { deadline: deadline || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Deadline updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating deadline:", error);
      const errorMessage = error.response?.data?.error || "Failed to update deadline";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Deadline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Deadline:</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Details Modal
export function EditProjectDetailsModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setDetails(project.details || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { details: details.trim() || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Details updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating details:", error);
      const errorMessage = error.response?.data?.error || "Failed to update details";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Details:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={details}
                onChange={(e) => setDetails(clampLen(e.target.value, 1000))}
                maxLength={1000}
                placeholder="Enter project details"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Project Notes Modal
export function EditProjectNotesModal({ project, refreshData }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setNotes(project.notes || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { notes: notes.trim() || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Notes updated successfully", "success");
      if (refreshData) refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating notes:", error);
      const errorMessage = error.response?.data?.error || "Failed to update notes";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Notes:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(clampLen(e.target.value, 1000))}
                maxLength={1000}
                placeholder="Enter project notes"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
