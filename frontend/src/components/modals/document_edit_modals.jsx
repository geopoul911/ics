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
const UPDATE_DOCUMENT = "http://localhost:8000/api/data_management/document/";

// Edit Document ID Modal
export function EditDocumentIdModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [document_id, setDocumentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setDocumentId(document.document_id || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!document_id.trim()) {
      Swal.fire("Error", "Document ID is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { document_id: document_id.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Document ID updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating document ID:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update document ID";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit ID</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Document ID *:</Form.Label>
              <Form.Control
                type="text"
                value={document_id}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Enter document ID"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: document_id.trim() ? "green" : "red" }}>{document_id.trim() ? "Looks good." : "ID is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!document_id.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Title Modal
export function EditDocumentTitleModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isValid = title.trim().length >= 2 && title.trim().length <= 40;

  useEffect(() => {
    if (show) {
      setTitle(document.title || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!isValid) {
      Swal.fire("Error", "Title must be between 2 and 40 characters.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { title: title.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Title updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating title:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update title";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Title</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Title *:</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                maxLength={40}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Title must be 2–40 characters."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Project Modal
export function EditDocumentProjectModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProject(document.project?.project_id || "");
      loadProjects();
    }
  }, [show, document]);

  const loadProjects = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const response = await axios.get("http://localhost:8000/api/data_management/all_projects/", { headers: currentHeaders });
      const projectsData = response?.data?.all_projects || response?.data?.results || response?.data?.data || response?.data || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
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

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { project_id: project || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Project updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating project:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update project";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Project</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Project:</Form.Label>
              <Form.Control
                as="select"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              >
                <option value="">Select Project (Optional)</option>
                {projects.map((proj) => (
                  <option key={proj.project_id} value={proj.project_id}>
                    {proj.project_id} - {proj.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: project ? "green" : "red" }}>{project ? "Looks good." : "Project is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!project || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Client Modal
export function EditDocumentClientModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setClient(document.client?.client_id || "");
      loadClients();
    }
  }, [show, document]);

  const loadClients = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const response = await axios.get("http://localhost:8000/api/data_management/all_clients/", { headers: currentHeaders });
      const clientsData = response?.data?.all_clients || response?.data?.results || response?.data?.data || response?.data || [];
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
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

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { client_id: client || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Client updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating client:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update client";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Client</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Client:</Form.Label>
              <Form.Control
                as="select"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value="">Select Client (Optional)</option>
                {clients.map((cli) => (
                  <option key={cli.client_id} value={cli.client_id}>
                    {cli.client_id} - {cli.fullname || `${cli.surname} ${cli.name}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>{client ? "Looks good." : "No client selected: will clear this field."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Created Modal
export function EditDocumentCreatedModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [created, setCreated] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setCreated(document.created || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!created.trim()) {
      Swal.fire("Error", "Created date is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { created: created },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Created date updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating created date:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update created date";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Created</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Created *</Form.Label>
              <Form.Control
                type="date"
                value={created}
                onChange={(e) => setCreated(e.target.value)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: created.trim() ? "green" : "red" }}>{created.trim() ? "Looks good." : "Created date is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!created.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Valid Until Modal
export function EditDocumentValidUntilModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [validuntil, setValidUntil] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setValidUntil(document.validuntil || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!validuntil.trim()) {
      Swal.fire("Error", "Valid until date is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { validuntil: validuntil },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Valid until date updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating valid until date:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update valid until date";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Valid until</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Valid until</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Valid until *</Form.Label>
              <Form.Control
                type="date"
                value={validuntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: validuntil.trim() ? "green" : "red" }}>{validuntil.trim() ? "Looks good." : "Valid until date is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!validuntil.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Filepath Modal
export function EditDocumentFilepathModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [filepath, setFilepath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFilepath(document.filepath || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!filepath.trim()) {
      Swal.fire("Error", "Filepath is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { filepath: filepath.trim() },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Filepath updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating filepath:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update filepath";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Filepath</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Filepath</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Filepath *:</Form.Label>
              <Form.Control
                type="text"
                value={filepath}
                onChange={(e) => setFilepath(e.target.value)}
                placeholder="Enter filepath"
                maxLength={120}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: filepath.trim() ? "green" : "red" }}>{filepath.trim() ? "Looks good." : "Filepath is required."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!filepath.trim() || isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Upload/Replace document file
export function UploadDocumentFileModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => { setShow(false); setFile(null); };
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      delete currentHeaders["Content-Type"]; // allow browser to set multipart boundary
      const formData = new FormData();
      formData.append("filepath", file);
      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        formData,
        { headers: currentHeaders }
      );
      Swal.fire("Success", "File uploaded successfully", "success");
      update_state && update_state(response.data);
      handleClose();
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data?.error || "Failed to upload file";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Upload File</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Select file *</Form.Label>
              <Form.Control type="file" onChange={(e) => setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: file ? "green" : "red" }}>{file ? "Looks good." : "Please select a file."}</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!file || isLoading}>{isLoading ? "Uploading..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Delete current file (clear filepath)
export function DeleteDocumentFileModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { filepath: "" },
        { headers: currentHeaders }
      );
      Swal.fire("Success", "File removed successfully", "success");
      update_state && update_state(response.data);
      handleClose();
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data?.error || "Failed to remove file";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Delete File</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the stored file for this document?
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "red" }}>This will remove the file reference.</div></small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={isLoading}>{isLoading ? "Removing..." : "Confirm"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Original Modal
export function EditDocumentOriginalModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [original, setOriginal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setOriginal(document.original || false);
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { original: original },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Original status updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating original status:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update original status";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Original</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Original Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Is Original Document"
                checked={original}
                onChange={(e) => setOriginal(e.target.checked)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Trafficable Modal
export function EditDocumentTrafficableModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [trafficable, setTrafficable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setTrafficable(document.trafficable || false);
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { trafficable: trafficable },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Trafficable status updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating trafficable status:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update trafficable status";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Trafficable</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Trafficable Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Is Trafficable Document"
                checked={trafficable}
                onChange={(e) => setTrafficable(e.target.checked)}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Status Modal
export function EditDocumentStatusModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusChoices = [
    { value: "", label: "No Status" },
    { value: "SENT_TO_ATHENS", label: "Sent To Athens" },
    { value: "RECEIVED_IN_ATHENS", label: "Received From Athens" },
    { value: "SENT_TO_TORONTO", label: "Sent To Toronto" },
    { value: "RECEIVED_IN_TORONTO", label: "Received From Toronto" },
    { value: "SENT_TO_MONTREAL", label: "Sent To Montreal" },
    { value: "RECEIVED_IN_MONTREAL", label: "Received From Montreal" },
    { value: "SENT_TO_CLIENT", label: "Sent To Client" },
    { value: "RECEIVED_FROM_CLIENT", label: "Received From Client" },
  ];

  useEffect(() => {
    if (show) {
      setStatus(document.status || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { status: status || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Status updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating status:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update status";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Status</Button>

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
                {statusChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Notes Modal
export function EditDocumentNotesModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setNotes(document.notes || "");
    }
  }, [show, document]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_DOCUMENT + document.document_id + "/",
        { notes: notes.trim() || null },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Notes updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating notes:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update notes";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Notes</Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Notes:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes"
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
