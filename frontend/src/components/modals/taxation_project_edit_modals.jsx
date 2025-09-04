// Built-ins
import { useEffect, useState } from "react";

// Icons
import { FiEdit } from "react-icons/fi";

// Modules
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Globals
import { headers } from "../global_vars";

const UPDATE_URL = "http://localhost:8000/api/data_management/taxation_project/";

function getAuthHeaders() {
  return { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
}

export function EditTaxProjClientModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) { setClient(item.client?.client_id || ""); load(); } }, [show, item]);
  async function load() {
    try {
      const res = await axios.get("http://localhost:8000/api/data_management/all_clients/", { headers: getAuthHeaders() });
      setClients(res?.data?.all_clients || []);
    } catch { setClients([]); }
  }
  const isValid = client.trim().length > 0;
  async function handleSave() {
    if (!isValid) return; setBusy(true);
    try {
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", { client_id: client }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Client updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update client";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
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
                <option key={c.client_id} value={c.client_id}>{c.client_id} - {(c.fullname || `${c.surname || ''} ${c.name || ''}`.trim())}</option>
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

export function EditTaxProjConsultantModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [consultant, setConsultant] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) { setConsultant(item.consultant?.consultant_id || ""); load(); } }, [show, item]);
  async function load() {
    try {
      const res = await axios.get("http://localhost:8000/api/administration/all_consultants/", { headers: getAuthHeaders() });
      setConsultants(res?.data?.all_consultants || []);
    } catch { setConsultants([]); }
  }
  const isValid = consultant.trim().length > 0;
  async function handleSave() {
    if (!isValid) return; setBusy(true);
    try {
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", { consultant_id: consultant }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Consultant updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update consultant";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Consultant</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Consultant</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Consultant *:</Form.Label>
            <Form.Control as="select" value={consultant} onChange={(e) => setConsultant(e.target.value)}>
              <option value="">Select Consultant</option>
              {consultants.map(c => (
                <option key={c.consultant_id} value={c.consultant_id}>{c.consultant_id} - {c.fullname}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Consultant is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditTaxProjTaxUseModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [taxuse, setTaxuse] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setTaxuse(item.taxuse ?? ""); }, [show, item]);
  const isValid = String(taxuse).trim() !== "" && !isNaN(parseInt(taxuse, 10));
  async function handleSave() {
    if (!isValid) return; setBusy(true);
    try {
      const payload = { taxuse: parseInt(taxuse, 10) };
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Tax Use updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update tax use";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Tax Use</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Tax Use</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tax Use *:</Form.Label>
            <Form.Control type="number" value={taxuse} onChange={(e) => setTaxuse(e.target.value)} placeholder="e.g., 2024" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Tax Use is required (number)."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditTaxProjDeadlineModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setDeadline(item.deadline || ""); }, [show, item]);
  async function handleSave() {
    setBusy(true);
    try {
      const payload = { deadline: (String(deadline).trim() === "" ? null : deadline) };
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Deadline updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update deadline";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Deadline</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Deadline</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Deadline:</Form.Label>
            <Form.Control type="date" value={deadline || ""} onChange={(e) => setDeadline(e.target.value)} />
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

export function EditTaxProjDeclaredModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setDeclared(!!item.declaredone); }, [show, item]);
  async function handleSave() {
    setBusy(true);
    try {
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", { declaredone: declared }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Declared status updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update declared";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Declared</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Declared</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check type="checkbox" label="Declared" checked={declared} onChange={(e) => setDeclared(e.target.checked)} />
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

export function EditTaxProjDeclarationDateModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setDate(item.declarationdate || ""); }, [show, item]);
  async function handleSave() {
    setBusy(true);
    try {
      const payload = { declarationdate: (String(date).trim() === "" ? null : date) };
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Declaration date updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update declaration date";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Declaration Date</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Declaration Date</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Declaration Date:</Form.Label>
            <Form.Control type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} />
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

export function EditTaxProjCommentModal({ item, update_state }) {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setComment(item.comment || ""); }, [show, item]);
  async function handleSave() {
    setBusy(true);
    try {
      const payload = { comment: (comment.trim() === "" ? null : comment.trim()) };
      const res = await axios.put(UPDATE_URL + item.taxproj_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Comment updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update comment";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  }
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Comment</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Comment</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Comment:</Form.Label>
            <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
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


