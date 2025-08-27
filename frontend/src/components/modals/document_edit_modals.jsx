// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

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
const GET_PROJECTS = "http://localhost:8000/api/data_management/all_projects/";
const GET_CLIENTS = "http://localhost:8000/api/data_management/all_clients/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Edit Document Title Modal
export function EditDocumentTitleModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setTitle(document.title || "");
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;

  const updateDocumentTitle = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { title: title.trim() },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document title updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document title:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document title.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateDocumentTitle}
            disabled={!isTitleValid}
          >
            Update Title
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Project Modal
export function EditDocumentProjectModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(GET_PROJECTS, { headers: currentHeaders });
        if (response.data && response.data.all_projects) {
          setProjects(response.data.all_projects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (show) {
      fetchProjects();
    }
  }, [show]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setProjectId(document.project?.project_id || "");
    setShow(true);
  };

  const updateDocumentProject = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const updateData = projectId ? { project_id: projectId } : { project: null };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        updateData,
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document project updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document project:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document project.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Project</Form.Label>
              <Form.Control
                as="select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">No project (clear assignment)</option>
                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_id} - {project.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={updateDocumentProject}>
            Update Project
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Client Modal
export function EditDocumentClientModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const currentHeaders = {
          ...headers,
          "Authorization": "Token " + localStorage.getItem("userToken")
        };

        const response = await axios.get(GET_CLIENTS, { headers: currentHeaders });
        if (response.data && response.data.all_clients) {
          setClients(response.data.all_clients);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    if (show) {
      fetchClients();
    }
  }, [show]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setClientId(document.client?.client_id || "");
    setShow(true);
  };

  const updateDocumentClient = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const updateData = clientId ? { client_id: clientId } : { client: null };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        updateData,
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document client updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document client:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document client.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Client</Form.Label>
              <Form.Control
                as="select"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">No client (clear assignment)</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.client_id} - {client.fullname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={updateDocumentClient}>
            Update Client
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Created Modal
export function EditDocumentCreatedModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [created, setCreated] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setCreated(document.created || "");
    setShow(true);
  };

  const isCreatedValid = created !== "";

  const updateDocumentCreated = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { created: created },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document created date updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document created date:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document created date.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Created Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateDocumentCreated}
            disabled={!isCreatedValid}
          >
            Update Created Date
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Valid Until Modal
export function EditDocumentValidUntilModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [validUntil, setValidUntil] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setValidUntil(document.validuntil || "");
    setShow(true);
  };

  const isValidUntilValid = validUntil !== "";

  const updateDocumentValidUntil = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { validuntil: validUntil },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document valid until date updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document valid until date:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document valid until date.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Valid Until Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Valid Until Date *
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateDocumentValidUntil}
            disabled={!isValidUntilValid}
          >
            Update Valid Until Date
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document File Path Modal
export function EditDocumentFilePathModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [filepath, setFilepath] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setFilepath(document.filepath || "");
    setShow(true);
  };

  const isFilePathValid = filepath.trim().length >= 1 && filepath.trim().length <= 120;

  const updateDocumentFilePath = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { filepath: filepath.trim() },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document file path updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document file path:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document file path.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document File Path</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateDocumentFilePath}
            disabled={!isFilePathValid}
          >
            Update File Path
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Document Original Modal
export function EditDocumentOriginalModal({ document, update_state }) {
  const [show, setShow] = useState(false);
  const [original, setOriginal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOriginal(document.original || false);
    setShow(true);
  };

  const updateDocumentOriginal = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { original: original },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document original status updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document original status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document original status.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Original Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Original"
                checked={original}
                onChange={(e) => setOriginal(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={updateDocumentOriginal}>
            Update Original Status
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

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setTrafficable(document.trafficable || false);
    setShow(true);
  };

  const updateDocumentTrafficable = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { trafficable: trafficable },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document trafficable status updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document trafficable status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document trafficable status.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Trafficable Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Trafficable"
                checked={trafficable}
                onChange={(e) => setTrafficable(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={updateDocumentTrafficable}>
            Update Trafficable Status
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

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setStatus(document.status || "");
    setShow(true);
  };

  const updateDocumentStatus = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { status: status || null },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document status updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document status.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">No status (clear status)</option>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={updateDocumentStatus}>
            Update Status
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

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setNotes(document.notes || "");
    setShow(true);
  };

  const updateDocumentNotes = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        `${UPDATE_DOCUMENT}${document.document_id}/`,
        { notes: notes.trim() || null },
        { headers: currentHeaders }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Document notes updated successfully.",
        });

        handleClose();
        update_state(response.data);
      }
    } catch (error) {
      console.error("Error updating document notes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "An error occurred while updating the document notes.",
      });
    }
  };

  return (
    <>
      <Button size="mini" color="blue" onClick={handleShow}>
        <FiEdit style={{ color: "white", fontSize: "1em" }} />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes (optional)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="grey" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={updateDocumentNotes}>
            Update Notes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
