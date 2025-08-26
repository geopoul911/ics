// Built-ins
import { useState, useEffect } from "react";

import { apiGet, apiPut } from "../../utils/api";

// Icons
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Libs

import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";


// API base
const CITY_DETAIL = "http://localhost:8000/api/regions/city/";
const GET_COUNTRIES = "http://localhost:8000/api/regions/all_countries/";
const GET_PROVINCES = "http://localhost:8000/api/regions/all_provinces/";

// Helpers
const onlyUpperLetters = (v) => v.replace(/[^A-Z]/g, "");
const clampLen = (v, max) => (v || "").slice(0, max);
const toSmallInt = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n));
};

const patchCity = async (id, payload) => {
  const url = `${CITY_DETAIL}${encodeURIComponent(id)}`;
  return apiPut(url, payload);
};

/* ===========================
   1) Edit City ID (PK)
   =========================== */
export function EditCityIdModal({ city, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(city?.city_id || "");
  const [busy, setBusy] = useState(false);

  const isValid = value.length >= 2 && value.length <= 10;

  const onOpen = () => {
    setValue(city?.city_id || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid) return;
    try {
      setBusy(true);
      await patchCity(city.city_id, { city_id: value });
      // After PK change, URL should reflect the new key:
      window.location.href = `/regions/city/${encodeURIComponent(value)}`;
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update City ID.";
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
        <Modal.Header closeButton><Modal.Title>Edit City ID</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>City ID (2–10 uppercase letters)</Form.Label>
            <Form.Control
              maxLength={10}
              value={value}
              onChange={(e) =>
                setValue(onlyUpperLetters(e.target.value.toUpperCase()).slice(0, 10))
              }
              placeholder="e.g., ATH"
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
                ID must be 2–10 uppercase letters.
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
export function EditCityTitleModal({ city, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(city?.title || "");
  const [busy, setBusy] = useState(false);

  const trimmed = value.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 40;
  const isChanged = trimmed !== (city?.title || "");

  const onOpen = () => {
    setValue(city?.title || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCity(city.city_id, { title: trimmed.toUpperCase() });
      const updated = res?.data?.city || res?.data || { ...city, title: trimmed.toUpperCase() };
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
        <Modal.Header closeButton><Modal.Title>Edit City Title</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>City Title (2–40 characters)</Form.Label>
            <Form.Control
              maxLength={40}
              value={value}
              onChange={(e) => setValue(clampLen(e.target.value, 40))}
              placeholder="e.g., ATHENS"
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
   3) Edit Country
   =========================== */
export function EditCityCountryModal({ city, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(city?.country || "");
  const [countries, setCountries] = useState([]);
  const [busy, setBusy] = useState(false);

  const isValid = value.length > 0;
  const isChanged = value !== (city?.country || "");

  const onOpen = () => {
    setValue(city?.country || "");
    setShow(true);
  };

  // Fetch countries for dropdown
  useEffect(() => {
    if (show) {
      apiGet(GET_COUNTRIES)
        .then((res) => {
          setCountries(res.data.all_countries || []);
        })
        .catch((e) => {
          console.error("Failed to fetch countries:", e);
        });
    }
  }, [show]);

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCity(city.city_id, { country: value });
      const updated = res?.data?.city || res?.data || { ...city, country: value };
      update_state?.(updated);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update Country.";
      Swal.fire({ icon: "error", title: "Error", text: apiMsg });
    } finally {
      setBusy(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={onOpen} title="Edit Country">
        <FiEdit style={{ marginRight: 6 }} />
        Country
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit City Country</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Control
              as="select"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">Select a country...</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_id} - {country.title}
                </option>
              ))}
            </Form.Control>
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
                Country is required.
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
   4) Edit Province
   =========================== */
export function EditCityProvinceModal({ city, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(city?.province || "");
  const [provinces, setProvinces] = useState([]);
  const [busy, setBusy] = useState(false);

  const isValid = value.length > 0;
  const isChanged = value !== (city?.province || "");

  const onOpen = () => {
    setValue(city?.province || "");
    setShow(true);
  };

  // Fetch provinces for dropdown
  useEffect(() => {
    if (show) {
      apiGet(GET_PROVINCES)
        .then((res) => {
          const allProvinces = res.data.all_provinces || [];
          const filteredProvinces = allProvinces.filter(province => province.country === city?.country);
          setProvinces(filteredProvinces);
        })
        .catch((e) => {
          console.error("Failed to fetch provinces:", e);
        });
    }
  }, [show, city?.country]);

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCity(city.city_id, { province: value });
      const updated = res?.data?.city || res?.data || { ...city, province: value };
      update_state?.(updated);
    } catch (e) {
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        "Failed to update Province.";
      Swal.fire({ icon: "error", title: "Error", text: apiMsg });
    } finally {
      setBusy(false);
      setShow(false);
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={onOpen} title="Edit Province">
        <FiEdit style={{ marginRight: 6 }} />
        Province
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit City Province</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Province</Form.Label>
            <Form.Control
              as="select"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">Select a province...</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province_id} - {province.title}
                </option>
              ))}
            </Form.Control>
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
                Province is required.
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
   5) Edit Order Index
   =========================== */
export function EditCityOrderIndexModal({ city, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(city?.orderindex?.toString() || "");
  const [busy, setBusy] = useState(false);

  const isValid = value !== "" && Number.isInteger(+value);
  const isChanged = value !== (city?.orderindex?.toString() || "");

  const onOpen = () => {
    setValue(city?.orderindex?.toString() || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCity(city.city_id, { orderindex: Number(value) });
      const updated = res?.data?.city || res?.data || { ...city, orderindex: Number(value) };
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
        Order Index
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit City Order Index</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Order Index (integer)</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => setValue(toSmallInt(e.target.value).toString())}
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
                Order index must be an integer.
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