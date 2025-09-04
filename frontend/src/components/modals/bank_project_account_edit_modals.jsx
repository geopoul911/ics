// Built-ins
import { useEffect, useState } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Globals
import { headers } from "../global_vars";

const UPDATE = "http://localhost:8000/api/data_management/bank_project_account/";

export function EditBPAProjectModal({ bpa, update_state }) {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) { setProject(bpa.project?.project_id || ""); loadProjects(); } }, [show, bpa]);

  const loadProjects = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.get("http://localhost:8000/api/data_management/all_projects/", { headers: currentHeaders });
      setProjects(res?.data?.all_projects || []);
    } catch (e) { setProjects([]); }
  };

  const isValid = project.trim().length > 0;
  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE + bpa.bankprojacco_id + "/", { project_id: project }, { headers: currentHeaders });
      Swal.fire("Success", "Project updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update project";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Project</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Project</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Project *:</Form.Label>
            <Form.Control as="select" value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p.project_id} value={p.project_id}>{p.project_id} - {p.title}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Project is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditBPAClientModal({ bpa, update_state }) {
  const [show, setShow] = useState(false);
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) { setClient(bpa.client?.client_id || ""); loadClients(); } }, [show, bpa]);

  const loadClients = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.get("http://localhost:8000/api/data_management/all_clients/", { headers: currentHeaders });
      setClients(res?.data?.all_clients || []);
    } catch (e) { setClients([]); }
  };

  const isValid = client.trim().length > 0;
  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE + bpa.bankprojacco_id + "/", { client_id: client }, { headers: currentHeaders });
      Swal.fire("Success", "Client updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update client";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Client</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Client</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Client *:</Form.Label>
            <Form.Control as="select" value={client} onChange={(e) => setClient(e.target.value)}>
              <option value="">Select Client</option>
              {clients.map(c => (
                <option key={c.client_id} value={c.client_id}>{c.client_id} - {c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Client is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditBPABankClientAccountModal({ bpa, update_state }) {
  const [show, setShow] = useState(false);
  const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) { setAccount(bpa.bankclientacco?.bankclientacco_id || ""); loadAccounts(); } }, [show, bpa]);

  const loadAccounts = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.get("http://localhost:8000/api/data_management/all_bank_client_accounts/", { headers: currentHeaders });
      setAccounts(res?.data?.all_bank_client_accounts || []);
    } catch (e) { setAccounts([]); }
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const payload = { bankclientacco_id: account || null };
      const res = await axios.put(UPDATE + bpa.bankprojacco_id + "/", payload, { headers: currentHeaders });
      Swal.fire("Success", "Bank client account updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update bank client account";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Bank Client Account</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Bank Client Account</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Bank Client Account:</Form.Label>
            <Form.Control as="select" value={account} onChange={(e) => setAccount(e.target.value)}>
              <option value="">Select Bank Client Account (optional)</option>
              {accounts.map(a => (
                <option key={a.bankclientacco_id} value={a.bankclientacco_id}>{a.bankclientacco_id} - {a.bank?.bankname || ''} - {a.accountnumber}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditBPANotesModal({ bpa, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setNotes(bpa.notes || ""); }, [show, bpa]);
  const handleSave = async () => {
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE + bpa.bankprojacco_id + "/", { notes: notes.trim() || null }, { headers: currentHeaders });
      Swal.fire("Success", "Notes updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update notes";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Notes</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Notes</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Notes:</Form.Label>
            <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}>Looks good.</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


