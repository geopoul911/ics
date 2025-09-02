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
const UPDATE_ASSOCIATED_CLIENT = "http://localhost:8000/api/data_management/associated_client/";

// Helpers
// const clampLen = (value, max) => value.slice(0, max);

// Edit Associated Client Project Modal
export function EditAssociatedClientProjectModal({ associatedClient, update_state }) {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setProject(associatedClient.project?.project_id || "");
      loadProjects();
    }
  }, [show, associatedClient]);

  const loadProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/data_management/all_projects/");
      const projectsData = response?.data?.all_projects || [];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!project.trim()) {
      Swal.fire("Error", "Project is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_ASSOCIATED_CLIENT + associatedClient.assoclient_id + "/",
        { project_id: project },
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Project *:</Form.Label>
              <Form.Control
                as="select"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects.map((proj) => (
                  <option key={proj.project_id} value={proj.project_id}>
                    {proj.title}
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
            disabled={!project.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Associated Client Client Modal
export function EditAssociatedClientClientModal({ associatedClient, update_state }) {
  const [show, setShow] = useState(false);
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setClient(associatedClient.client?.client_id || "");
      loadClients();
    }
  }, [show, associatedClient]);

  const loadClients = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/data_management/all_clients/");
      const clientsData = response?.data?.all_clients || [];
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!client.trim()) {
      Swal.fire("Error", "Client is required", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_ASSOCIATED_CLIENT + associatedClient.assoclient_id + "/",
        { client_id: client },
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Client *:</Form.Label>
              <Form.Control
                as="select"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value="">Select Client</option>
                {clients.map((cli) => (
                  <option key={cli.client_id} value={cli.client_id}>
                    {cli.surname} {cli.name}
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
            disabled={!client.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Associated Client Order Index Modal
export function EditAssociatedClientOrderindexModal({ associatedClient, update_state }) {
  const [show, setShow] = useState(false);
  const [orderindex, setOrderindex] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setOrderindex(associatedClient.orderindex || "");
    }
  }, [show, associatedClient]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!orderindex.trim()) {
      Swal.fire("Error", "Order index is required", "error");
      return;
    }

    const orderIndexNum = parseInt(orderindex);
    if (isNaN(orderIndexNum) || orderIndexNum < 0) {
      Swal.fire("Error", "Order index must be a positive number", "error");
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.put(
        UPDATE_ASSOCIATED_CLIENT + associatedClient.assoclient_id + "/",
        { orderindex: orderIndexNum },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Order index updated successfully", "success");
      if (update_state) update_state(response.data);
      handleClose();
    } catch (e) {
      console.error('Error updating order index:', e);
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update order index";
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
          <Modal.Title>Edit Order Index</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Order Index *:</Form.Label>
              <Form.Control
                type="number"
                value={orderindex}
                onChange={(e) => setOrderindex(e.target.value)}
                placeholder="Enter order index"
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
            disabled={!orderindex.trim() || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Associated Client Notes Modal
export function EditAssociatedClientNotesModal({ associatedClient, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setNotes(associatedClient.notes || "");
    }
  }, [show, associatedClient]);

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
        UPDATE_ASSOCIATED_CLIENT + associatedClient.assoclient_id + "/",
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
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
          </Form>
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
