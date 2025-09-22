// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import { AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Vars
import { headers } from "../global_vars";

const UPDATE_TASK = "https://ultima.icsgr.com/api/data_management/project_task/";

const withAuthHeaders = () => ({
  ...headers,
  Authorization: "Token " + localStorage.getItem("userToken"),
});

// Title
export function EditTaskTitleModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const isValid = title.trim().length >= 2 && title.trim().length <= 120;
  useEffect(() => { if (show) setTitle(task.title || ""); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { title: title.trim() }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Title updated." });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update title" });
    } finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Title</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Title</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Enter title (2-120)" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {title.trim().length < 2 && (<li><AiOutlineWarning style={{ marginRight: 5 }} />Title must be at least 2 characters</li>)}
                {title.trim().length > 120 && (<li><AiOutlineWarning style={{ marginRight: 5 }} />Title must be at most 120 characters</li>)}
              </ul>
            ) : (
              <div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy} disabled={!isValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Details
export function EditTaskDetailsModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const isValid = details.trim().length > 0 && details.trim().length <= 1000;
  useEffect(() => { if (show) setDetails(task.details || ""); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { details: details.trim() }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Details updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update details" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Details</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Details</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Details</Form.Label>
              <Form.Control as="textarea" rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Details (1-1000)" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {details.trim().length === 0 && (<li><AiOutlineWarning style={{ marginRight: 5 }} />Details are required</li>)}
                {details.trim().length > 1000 && (<li><AiOutlineWarning style={{ marginRight: 5 }} />Details must be ≤ 1000 chars</li>)}
              </ul>
            ) : (
              <div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy} disabled={!isValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Priority (A/B/C)
export function EditTaskPriorityModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [priority, setPriority] = useState("A");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setPriority(task.priority || "A"); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { priority }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Priority updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update priority" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Priority</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Priority</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="A">High</option>
                <option value="B">Medium</option>
                <option value="C">Low</option>
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Weight (positive integer)
export function EditTaskWeightModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [weight, setWeight] = useState(1);
  const [busy, setBusy] = useState(false);
  const isValid = String(weight).trim() !== "" && !isNaN(parseInt(weight, 10)) && parseInt(weight, 10) > 0;
  useEffect(() => { if (show) setWeight(task.weight ?? 1); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { weight: parseInt(weight, 10) }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Weight updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update weight" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Weight</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Weight</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Weight</Form.Label>
              <Form.Control type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>Weight must be a positive integer</li>
              </ul>
            ) : (
              <div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy} disabled={!isValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Effort Time (0.5 step)
export function EditTaskEffortTimeModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [effort, setEffort] = useState(0);
  const [busy, setBusy] = useState(false);
  const normalizedEffort = () => {
    const raw = String(effort).replace(',', '.');
    const val = parseFloat(raw);
    return isNaN(val) ? null : val;
  };
  const isValid = (() => {
    const val = normalizedEffort();
    return val !== null && val >= 0 && Math.round(val * 2) === val * 2; // 0.5 step
  })();
  useEffect(() => { if (show) setEffort(task.efforttime ?? 0); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { efforttime: normalizedEffort() }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Effort time updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update effort time" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Effort Time</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Effort Time</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Effort (hours, 0.5 step)</Form.Label>
              <Form.Control type="text" value={effort} onChange={(e) => setEffort(e.target.value)} placeholder="e.g., 1.5 or 1,5" />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>Effort must be ≥ 0 in 0.5 steps</li>
              </ul>
            ) : (
              <div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy} disabled={!isValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Status
export function EditTaskStatusModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("Created");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setStatus(task.status || "Created"); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    setBusy(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const payload = { status };
      if (status === 'Completed') {
        payload['completiondate'] = today;
      } else if (task.status === 'Completed' && status !== 'Completed') {
        payload['completiondate'] = null;
      }
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, payload, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Status updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update status" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Status</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Status</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Created">Created</option>
                <option value="Assigned">Assigned</option>
                <option value="Inprogress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Active
export function EditTaskActiveModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setActive(task.active !== false); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { active }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Active updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update active" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Active</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Active</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Check type="switch" id="active-switch" label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Assignee (Consultant)
export function EditTaskAssigneeModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (show) {
      setAssignee(task.assignee?.consultant_id || "");
      (async () => {
        try {
          const res = await axios.get("https://ultima.icsgr.com/api/administration/all_consultants/", { headers: withAuthHeaders() });
          setConsultants(res?.data?.all_consultants || []);
        } catch (e) { setConsultants([]); }
      })();
    }
  }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    setBusy(true);
    try {
      const payload = { assignee_id: assignee || null };
      const wasUnassigned = !task.assignee;
      const isAssigningNow = (assignee || "").trim() !== "";
      if (wasUnassigned && isAssigningNow && task.status === 'Created') {
        const today = new Date().toISOString().slice(0, 10);
        payload['status'] = 'Assigned';
        payload['assigndate'] = today;
      }
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, payload, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Assignee updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update assignee" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Assignee</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Assignee</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Assignee</Form.Label>
              <Form.Control as="select" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">Select Consultant</option>
                {consultants.map(c => (
                  <option key={c.consultant_id} value={c.consultant_id}>{c.consultant_id} - {c.fullname}</option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Category (TaskCategory)
export function EditTaskCategoryModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [busy, setBusy] = useState(false);
  const isValid = (category || "").trim().length > 0;
  useEffect(() => {
    if (show) {
      setCategory(task.taskcate?.taskcate_id || "");
      (async () => {
        try {
          const res = await axios.get("https://ultima.icsgr.com/api/administration/all_task_categories/", { headers: withAuthHeaders() });
          setCategories(res?.data?.all_task_categories || []);
        } catch (e) { setCategories([]); }
      })();
    }
  }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { taskcate_id: category }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Category updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update category" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Category</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Category</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Category *</Form.Label>
              <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.taskcate_id} value={cat.taskcate_id}>{cat.taskcate_id} - {cat.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>Category is required</li>
              </ul>
            ) : (
              <div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy} disabled={!isValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Deadline
export function EditTaskDeadlineModal({ task, update_state }) {
  const [show, setShow] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (show) setDeadline(task.deadline || ""); }, [show, task]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await axios.put(`${UPDATE_TASK}${task.projtask_id}/`, { deadline: deadline || null }, { headers: withAuthHeaders() });
      update_state && update_state(res.data);
      setShow(false);
      Swal.fire({ icon: "success", title: "Success", text: "Deadline updated." });
    } catch (e) { Swal.fire({ icon: "error", title: "Error", text: e?.response?.data?.error || "Failed to update deadline" }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button size="tiny" basic onClick={handleShow}><FiEdit style={{ marginRight: 6 }} /> Edit Deadline</Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton><Modal.Title>Edit Deadline</Modal.Title></Modal.Header>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" value={deadline || ""} onChange={(e) => setDeadline(e.target.value)} />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: "green" }}><AiOutlineCheckCircle style={{ marginRight: 5 }} />Looks good.</div></small>
          <Button color="red" onClick={handleClose} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} loading={busy}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


