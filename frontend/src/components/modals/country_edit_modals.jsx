// Built-ins
import { useState } from "react";

// Icons
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { FaStop } from "react-icons/fa";
import { apiPut, } from "../../utils/api";

// Libs

import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Globals

// API base
const COUNTRY_DETAIL = "http://localhost:8000/api/regions/country/";

// Helpers
const clampLen = (v, max) => (v || "").slice(0, max);
const toSmallInt = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n));
};

const patchCountry = async (id, payload) => {
  const url = `${COUNTRY_DETAIL}${encodeURIComponent(id)}/`;
  return apiPut(url, payload);
};

/* ===========================
   1) Country ID (PK) - Immutable
   =========================== */
export function EditCountryIdModal({ country, update_state }) {
  return (
    <Button size="tiny" basic disabled >
      <FaStop style={{ marginRight: 6, color: "red" }} title="Country ID is immutable"/>
      ID
    </Button>
  );
}

/* ===========================
   2) Edit Title
   =========================== */
export function EditCountryTitleModal({ country, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(country?.title || "");
  const [busy, setBusy] = useState(false);

  const trimmed = value.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 40;
  const isChanged = trimmed !== (country?.title || "");

  const onOpen = () => {
    setValue(country?.title || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCountry(country.country_id, { title: trimmed.toUpperCase() });
      const updated = res || { ...country, title: trimmed.toUpperCase() };
      update_state?.(updated);
    } catch (e) {
      console.log('Error updating country title:', e);
      console.log('Error response data:', e?.response?.data);
      
      // Handle different error response formats
      let apiMsg = "Failed to update Title.";
      
      if (e?.response?.data?.error) {
        // Custom error format from our enhanced error handling
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.orderindex) {
        // Serializer validation error for orderindex
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.country_id) {
        // Serializer validation error for country_id
        apiMsg = e.response.data.country_id[0];
      } else if (e?.response?.data?.errormsg) {
        apiMsg = e.response.data.errormsg;
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({ icon: "error", title: "Error", text: apiMsg });
    } finally {
      setBusy(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={onOpen} title="Edit Title">
        <FiEdit style={{ marginRight: 6 }} />
        Title
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Title</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Title (2–40 chars)</Form.Label>
            <Form.Control
              maxLength={40}
              value={value}
              onChange={(e) => setValue(clampLen(e.target.value.toUpperCase(), 40))}
              placeholder="e.g., GREECE"
            />
          </Form.Group>
          <small style={{ color: isValid ? "green" : "red" }}>
            {isValid ? (
              <>
                <AiOutlineCheckCircle style={{ marginRight: 6 }} />
                Looks good
              </>
            ) : (
              <>
                <AiOutlineWarning style={{ marginRight: 6 }} />
                Title must be 2–40 characters.
              </>
            )}
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Close</Button>
          <Button color="green" onClick={onSave} disabled={!isValid || !isChanged || busy}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

/* ===========================
   3) Edit Currency
   =========================== */
export function EditCountryCurrencyModal({ country, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(country?.currency || "");
  const [busy, setBusy] = useState(false);

  const upper = clampLen((value || "").toUpperCase(), 10);
  const isValid = upper.length <= 10;
  const isChanged = (country?.currency || "") !== upper;

  const onOpen = () => {
    setValue(country?.currency || "");
    setShow(true);
  };

  const onSave = async () => {
    try {
      setBusy(true);
      const payload = { currency: upper || null }; // allow clearing to null
      const res = await patchCountry(country.country_id, payload);
      const updated = res || { ...country, currency: upper || null };
      update_state?.(updated);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update Currency.";
      Swal.fire({ icon: "error", title: "Error", text: apiMsg });
    } finally {
      setBusy(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={onOpen} title="Edit Currency">
        <FiEdit style={{ marginRight: 6 }} />
        Currency
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Currency</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Currency (optional, ≤10)</Form.Label>
            <Form.Control
              maxLength={10}
              value={value || ""}
              onChange={(e) => setValue(clampLen(e.target.value, 10))}
              placeholder="e.g., EUR"
            />
          </Form.Group>
          <small style={{ color: isValid ? "green" : "red" }}>
            {isValid ? (
              <>
                <AiOutlineCheckCircle style={{ marginRight: 6 }} />
                Looks good
              </>
            ) : (
              <>
                <AiOutlineWarning style={{ marginRight: 6 }} />
                Max length is 10.
              </>
            )}
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Close</Button>
          <Button color="green" onClick={onSave} disabled={!isValid || !isChanged || busy}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

/* ===========================
   4) Edit Order Index
   =========================== */
export function EditCountryOrderIndexModal({ country, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(
    country?.orderindex === 0 || country?.orderindex
      ? String(country.orderindex)
      : ""
  );
  const [busy, setBusy] = useState(false);

  const smallInt = toSmallInt(value);
  const isValid = value !== "" && String(smallInt) === String(value);
  const isChanged = String(country?.orderindex ?? "") !== String(value);

  const onOpen = () => {
    setValue(
      country?.orderindex === 0 || country?.orderindex
        ? String(country.orderindex)
        : ""
    );
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCountry(country.country_id, { orderindex: Number(value) });
      const updated = res || { ...country, orderindex: Number(value) };
      update_state?.(updated);
    } catch (e) {
      console.log('Error updating country order index:', e);
      console.log('Error response data:', e?.response?.data);
      
      // Handle different error response formats
      let apiMsg = "Failed to update Order Index.";
      
      // Priority order for error messages
      if (e?.response?.data?.orderindex && Array.isArray(e.response.data.orderindex)) {
        // Serializer validation error for orderindex (highest priority)
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.error) {
        // Custom error format from our enhanced error handling
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.country_id && Array.isArray(e.response.data.country_id)) {
        // Serializer validation error for country_id
        apiMsg = e.response.data.country_id[0];
      } else if (e?.response?.data?.errormsg) {
        apiMsg = e.response.data.errormsg;
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({ icon: "error", title: "Error", text: apiMsg });
    } finally {
      setBusy(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={onOpen} title="Edit Order Index">
        <FiEdit style={{ marginRight: 6 }} />
        Order
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Order Index</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Order Index (integer)</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => setValue(String(toSmallInt(e.target.value)))}
              placeholder="e.g., 1"
            />
          </Form.Group>
          <small style={{ color: isValid ? "green" : "red" }}>
            {isValid ? (
              <>
                <AiOutlineCheckCircle style={{ marginRight: 6 }} />
                Looks good
              </>
            ) : (
              <>
                <AiOutlineWarning style={{ marginRight: 6 }} />
                Must be an integer within SmallIntegerField range.
              </>
            )}
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Close</Button>
          <Button color="green" onClick={onSave} disabled={!isValid || !isChanged || busy}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
