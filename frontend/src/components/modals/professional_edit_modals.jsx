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

const UPDATE_PRO = "http://localhost:8000/api/data_management/professional/";

function getAuthHeaders() {
  return { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
}

export function EditProfessionalFullnameModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [fullname, setFullname] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setFullname(professional.fullname || ""); }, [show, professional]);
  const isValid = fullname.trim().length >= 2 && fullname.trim().length <= 40;

  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", { fullname: fullname.trim() }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Fullname updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update fullname";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Fullname</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Fullname</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Fullname *:</Form.Label>
            <Form.Control value={fullname} onChange={(e) => setFullname(e.target.value)} maxLength={40} placeholder="2–40 chars" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Fullname is required (2–40 chars)."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProfessionalProfessionModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [profession, setProfession] = useState("");
  const [professions, setProfessions] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) { setProfession(professional.profession?.profession_id || ""); load(); } }, [show, professional]);
  const load = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/administration/all_professions/", { headers: getAuthHeaders() });
      setProfessions(res?.data?.all_professions || []);
    } catch { setProfessions([]); }
  };
  const isValid = profession.trim().length > 0;

  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", { profession_id: profession }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Profession updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update profession";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Profession</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Profession</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Profession *:</Form.Label>
            <Form.Control as="select" value={profession} onChange={(e) => setProfession(e.target.value)}>
              <option value="">Select Profession</option>
              {professions.map(p => (
                <option key={p.profession_id} value={p.profession_id}>{p.title}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Profession is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProfessionalCityModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) { setCity(professional.city?.city_id || ""); load(); } }, [show, professional]);
  const load = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/regions/all_cities/", { headers: getAuthHeaders() });
      setCities(res?.data?.all_cities || []);
    } catch { setCities([]); }
  };
  const isValid = city.trim().length > 0;

  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", { city_id: city }, { headers: getAuthHeaders() });
      Swal.fire("Success", "City updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update city";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit City</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit City</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>City *:</Form.Label>
            <Form.Control as="select" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c.city_id} value={c.city_id}>{c.title}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "City is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProfessionalAddressModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setAddress(professional.address || ""); }, [show, professional]);

  const handleSave = async () => {
    setBusy(true);
    try {
      const payload = { address: address.trim() || null };
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Address updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update address";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Address</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Address</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Address:</Form.Label>
            <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} maxLength={80} />
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

export function EditProfessionalEmailModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  useEffect(() => { if (show) setEmail(professional.email || ""); }, [show, professional]);
  const isValid = !email || isValidEmail(email.trim());

  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const payload = { email: (email.trim() === "" ? null : email.trim()) };
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Email updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update email";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Email</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Email</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Enter a valid email."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProfessionalPhoneModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setPhone(professional.phone || ""); }, [show, professional]);
  const isValid = !phone || String(phone).trim().length <= 15;

  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const payload = { phone: (String(phone).trim() === "" ? null : String(phone).trim()) };
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", payload, { headers: getAuthHeaders() });
      Swal.fire("Success", "Phone updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update phone";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Phone</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Phone</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Phone:</Form.Label>
            <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={15} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Max 15 characters."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProfessionalMobileModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setMobile(professional.mobile || ""); }, [show, professional]);
  const isValid = String(mobile).trim().length > 0 && String(mobile).trim().length <= 15;

  const handleSave = async () => {
    if (!isValid) return; setBusy(true);
    try {
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", { mobile: String(mobile).trim() }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Mobile updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update mobile";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Mobile</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Mobile</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Mobile *:</Form.Label>
            <Form.Control value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={15} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Mobile is required (max 15)."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProfessionalReliabilityModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [reliability, setReliability] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setReliability(professional.reliability || ""); }, [show, professional]);

  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", { reliability: reliability || null }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Reliability updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update reliability";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Reliability</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Reliability</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reliability:</Form.Label>
            <Form.Control as="select" value={reliability} onChange={(e) => setReliability(e.target.value)}>
              <option value="">Select</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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

export function EditProfessionalActiveModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setActive(!!professional.active); }, [show, professional]);

  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", { active }, { headers: getAuthHeaders() });
      Swal.fire("Success", "Active status updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update active status";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Active</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Active Status</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check type="checkbox" label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
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

export function EditProfessionalNotesModal({ professional, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setNotes(professional.notes || ""); }, [show, professional]);

  const handleSave = async () => {
    setBusy(true);
    try {
      const payload = { notes: (notes.trim() === "" ? null : notes.trim()) };
      const res = await axios.put(UPDATE_PRO + professional.professional_id + "/", payload, { headers: getAuthHeaders() });
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
            <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
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


