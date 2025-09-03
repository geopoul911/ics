// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
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

  const isValid = projectId.trim().length >= 2 && projectId.trim().length <= 10;

  const handleSave = async () => {
    if (!isValid) return;

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
      <Button size="tiny" basic disabled title="Project ID is immutable">
        <FiEdit style={{ marginRight: 6 }} /> ID
      </Button>

      <Modal show={false} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {projectId.trim().length < 2 && (
                  <li>Project ID must be at least 2 characters</li>
                )}
                {projectId.trim().length > 10 && (
                  <li>Project ID must be at most 10 characters</li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!isValid}>Save Changes</Button>
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

  const isValid = title.trim().length >= 2 && title.trim().length <= 120;

  const handleSave = async () => {
    if (!isValid) return;

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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Title
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {title.trim().length < 2 && (<li>Title must be at least 2 characters</li>)}
                {title.trim().length > 120 && (<li>Title must be at most 120 characters</li>)}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!isValid}>Save Changes</Button>
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

  const filecodePattern = /^[A-Z]{3}\/\d{6}\/\d{2}-\d{4}$/;
  const isValid = filecodePattern.test(filecode.trim());

  const handleSave = async () => {
    if (!isValid) return;

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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit File Code
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit File Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                Format: 3 uppercase letters/6 digits/2 digits-4 digits (e.g., TOR/000256/05-2019)
              </Form.Text>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {filecode.trim().length === 0 ? (
                  <li>File code is required</li>
                ) : (
                  <li>
                    Format: 3 uppercase letters/6 digits/2 digits-4 digits (e.g., TOR/000256/05-2019)
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!isValid}>Save Changes</Button>
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
  const isValid = (consultant || "").trim().length > 0;

  useEffect(() => {
    if (show) {
      setConsultant(project.consultant?.consultant_id || "");
      loadConsultants();
    }
  }, [show, project]);

  const loadConsultants = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/administration/all_consultants/", { headers: currentHeaders });
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Consultant
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Consultant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    {consultant.consultant_id} - {consultant.fullname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>Consultant is required</li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!isValid}>Save Changes</Button>
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

  const isValid = !!status;

  const handleSave = async () => {
    if (!isValid) return;

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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Status
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>Status is required</li>
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!isValid}>Save Changes</Button>
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
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (show) {
      setTaxation(project.taxation || false);
      // Initialize categories
      const existing = (project.categories || []).map(c => c.projcate_id).filter(Boolean);
      setSelectedCategories(existing);
      loadCategories();
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loadCategories = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const res = await axios.get("http://localhost:8000/api/administration/all_project_categories/", { headers: currentHeaders });
      const data = res?.data?.all_project_categories || [];
      setAllCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      setAllCategories([]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = taxation
        ? { taxation: true, category_ids: [] }
        : { taxation: false, category_ids: selectedCategories };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        payload,
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Taxation / Categories
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Taxation Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Check
                type="switch"
                id="taxation-switch"
                label="Taxation Project"
                checked={taxation}
                onChange={(e) => setTaxation(e.target.checked)}
              />
            </Form.Group>
            {!taxation && (
              <Form.Group style={{ marginTop: 12 }}>
                <Form.Label>Categories</Form.Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allCategories.map(cat => {
                    const isSelected = selectedCategories.includes(cat.projcate_id);
                    return (
                      <Button
                        key={cat.projcate_id}
                        type="button"
                        size="tiny"
                        color={isSelected ? 'green' : 'grey'}
                        onClick={() => setSelectedCategories(prev => (
                          prev.includes(cat.projcate_id)
                            ? prev.filter(id => id !== cat.projcate_id)
                            : [...prev, cat.projcate_id]
                        ))}
                      >
                        {cat.title}
                      </Button>
                    );
                  })}
                </div>
              </Form.Group>
            )}
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {taxation || selectedCategories.length > 0 ? (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>Please select at least one category</li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!taxation && selectedCategories.length === 0}>Save Changes</Button>
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Deadline
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Deadline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Deadline:</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <div style={{ color: "green" }}>
              <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
            </div>
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>Save Changes</Button>
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
  const isValid = details.trim().length > 0 && details.trim().length <= 1000;

  useEffect(() => {
    if (show) {
      setDetails(project.details || "");
    }
  }, [show, project]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios.put(
        UPDATE_PROJECT + project.project_id + "/",
        { details: details.trim() },
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Details
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {details.trim().length === 0 && (<li>Details are required</li>)}
                {details.trim().length > 1000 && (<li>Details must be at most 1000 characters</li>)}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading} disabled={!isValid}>Save Changes</Button>
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} /> Edit Notes
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <div style={{ color: "green" }}>
              <AiOutlineCheckCircle style={{ marginRight: 5 }} /> Looks good.
            </div>
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={isLoading}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
