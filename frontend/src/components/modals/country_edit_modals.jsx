// Built-ins
import { useState } from "react";

// Icons
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import { apiGet, apiPut, apiPost, apiDelete, API_ENDPOINTS } from "../../utils/api";

// Libs

import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Globals
import { headers } from "../global_vars";

// API base
const COUNTRY_DETAIL = "http://localhost:8000/api/regions/country/";

// Helpers
const onlyUpperLetters = (v) => v.replace(/[^A-Z]/g, "");
const clampLen = (v, max) => (v || "").slice(0, max);
const toSmallInt = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n));
};

const patchCountry = async (id, payload) => {
  const url = `${COUNTRY_DETAIL}${encodeURIComponent(id)}`;
  return apiPut(url, data);
};

/* ===========================
   1) Edit Country ID (PK)
   =========================== */
export function EditCountryIdModal({ country, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(country?.country_id || "");
  const [busy, setBusy] = useState(false);

  const isValid = value.length >= 2 && value.length <= 3;

  const onOpen = () => {
    setValue(country?.country_id || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid) return;
    try {
      setBusy(true);
      await patchCountry(country.country_id, { country_id: value });
      // After PK change, URL should reflect the new key:
      window.location.href = `/regions/country/${encodeURIComponent(value)}`;
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update Country ID.";
      Swal.fire({ icon: "error", title: "Error", text: apiMsg });
    } finally {
      setBusy(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={onOpen} title="Edit ID">
        <FiEdit style={{ marginRight: 6 }} />
        ID
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Country ID</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Country ID (2–3 uppercase letters)</Form.Label>
            <Form.Control
              maxLength={3}
              value={value}
              onChange={(e) =>
                setValue(onlyUpperLetters(e.target.value.toUpperCase()).slice(0, 3))
              }
              placeholder="e.g., GR or GRC"
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
                ID must be 2–3 uppercase letters.
              </>
            )}
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Close</Button>
          <Button color="green" onClick={onSave} disabled={!isValid || busy}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
      const updated = res?.data?.country || res?.data || { ...country, title: trimmed.toUpperCase() };
      update_state?.(updated);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update Title.";
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
      const updated = res?.data?.country || res?.data || { ...country, currency: upper || null };
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
      const updated =
        res?.data?.country || res?.data || { ...country, orderindex: Number(value) };
      update_state?.(updated);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update Order Index.";
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
