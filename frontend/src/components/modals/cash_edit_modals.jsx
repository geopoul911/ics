// Built-ins
import { useEffect, useState } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Vars
import { headers } from "../global_vars";

// API
const UPDATE_CASH = "http://localhost:8000/api/data_management/cash/";

// Country
export function EditCashCountryModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (show) {
      setCountry(cash.country?.country_id || "");
      loadCountries();
    }
  }, [show, cash]);

  const loadCountries = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.get("http://localhost:8000/api/regions/all_countries/", { headers: currentHeaders });
      setCountries(res?.data?.all_countries || []);
    } catch (e) {
      setCountries([]);
    }
  };

  const isValid = country.trim().length > 0;
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", { country_id: country }, { headers: currentHeaders });
      Swal.fire("Success", "Country updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update country";
      Swal.fire("Error", apiMsg, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Country</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Country</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Country *:</Form.Label>
            <Form.Control as="select" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">Select Country</option>
              {countries.map(c => (
                <option key={c.country_id} value={c.country_id}>{c.country_id} - {c.title}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Country is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Transaction Date
export function EditCashTrandateModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [trandate, setTrandate] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setTrandate(cash.trandate || ""); }, [show, cash]);

  const isValid = trandate && trandate.length > 0;
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", { trandate }, { headers: currentHeaders });
      Swal.fire("Success", "Transaction date updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update date";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Transaction Date</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Transaction Date</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Transaction Date *:</Form.Label>
            <Form.Control type="date" value={trandate} onChange={(e) => setTrandate(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Date is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Consultant
export function EditCashConsultantModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [consultant, setConsultant] = useState("");
  const [consultants, setConsultants] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (show) {
      setConsultant(cash.consultant?.consultant_id || "");
      loadConsultants();
    }
  }, [show, cash]);

  const loadConsultants = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.get("http://localhost:8000/api/administration/all_consultants/", { headers: currentHeaders });
      setConsultants(res?.data?.all_consultants || []);
    } catch (e) { setConsultants([]); }
  };

  const isValid = consultant.trim().length > 0;
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", { consultant_id: consultant }, { headers: currentHeaders });
      Swal.fire("Success", "Consultant updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update consultant";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

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

// Kind
export function EditCashKindModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [kind, setKind] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setKind(cash.kind || ""); }, [show, cash]);
  const isValid = kind === 'E' || kind === 'P';

  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", { kind }, { headers: currentHeaders });
      Swal.fire("Success", "Kind updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update kind";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Kind</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Kind</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Kind *:</Form.Label>
            <Form.Control as="select" value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="">Select Kind</option>
              <option value="E">Expense</option>
              <option value="P">Payment</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Kind is required."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Amount Expense (only when kind = E)
export function EditCashAmountExpenseModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setAmount(cash.amountexp ?? ""); }, [show, cash]);
  const handleSave = async () => {
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const payload = { amountexp: String(amount).trim() === '' ? null : amount };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", payload, { headers: currentHeaders });
      Swal.fire("Success", "Amount expense updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update amount expense";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  if (cash.kind !== 'E') return null;
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Amount Expense</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Amount Expense</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount Expense:</Form.Label>
            <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 100.00" />
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

// Amount Payment (only when kind = P)
export function EditCashAmountPaymentModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setAmount(cash.amountpay ?? ""); }, [show, cash]);
  const handleSave = async () => {
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const payload = { amountpay: String(amount).trim() === '' ? null : amount };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", payload, { headers: currentHeaders });
      Swal.fire("Success", "Amount payment updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update amount payment";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  if (cash.kind !== 'P') return null;
  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Amount Payment</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Amount Payment</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount Payment:</Form.Label>
            <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 100.00" />
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

// Reason
export function EditCashReasonModal({ cash, update_state }) {
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (show) setReason(cash.reason || ""); }, [show, cash]);
  const isValid = reason.trim().length >= 1 && reason.trim().length <= 120;
  const handleSave = async () => {
    if (!isValid) return;
    setBusy(true);
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const res = await axios.put(UPDATE_CASH + cash.cash_id + "/", { reason: reason.trim() }, { headers: currentHeaders });
      Swal.fire("Success", "Reason updated successfully", "success");
      update_state && update_state(res.data);
      setShow(false);
    } catch (e) {
      const apiMsg = e?.response?.data?.detail || e?.response?.data || "Failed to update reason";
      Swal.fire("Error", apiMsg, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <Button size="tiny" basic onClick={() => setShow(true)}><FiEdit style={{ marginRight: 6 }} /> Edit Reason</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Reason</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason *:</Form.Label>
            <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason (1-120 chars)" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto"><div style={{ color: isValid ? "green" : "red" }}>{isValid ? "Looks good." : "Reason is required (1–120 chars)."}</div></small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Cancel</Button>
          <Button color="green" onClick={handleSave} disabled={!isValid || busy}>{busy ? "Saving..." : "Save Changes"}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


