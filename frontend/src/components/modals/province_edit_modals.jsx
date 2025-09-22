// Built-ins
import { useState, useEffect } from "react";

// Icons
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { FaStop } from "react-icons/fa";

import axios from "axios";
import { headers } from "../global_vars";
// Libs

import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// API base
const PROVINCE_DETAIL = "https://ultima.icsgr.com/api/regions/province/";
const GET_COUNTRIES = "https://ultima.icsgr.com/api/regions/all_countries/";

// Helpers
const clampLen = (v, max) => (v || "").slice(0, max);
const toSmallInt = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n));
};

const patchProvince = async (id, payload) => {
  const url = `${PROVINCE_DETAIL}${encodeURIComponent(id)}/`;
  console.log('Patching province at URL:', url, 'with payload:', payload);
  const currentHeaders = {
    ...headers,
    "Authorization": "Token " + localStorage.getItem("userToken")
  };
  const response = await axios.patch(url, payload, { headers: currentHeaders });
  return response.data;
};

/* ===========================
   1) Province ID (PK) - Immutable
   =========================== */
export function EditProvinceIdModal({ province, update_state }) {
  return (
    <Button size="tiny" basic disabled title="Province ID is immutable">
      <FaStop style={{ marginRight: 6, color: "red" }} />
      ID
    </Button>
  );
}

/* ===========================
   2) Edit Title
   =========================== */
export function EditProvinceTitleModal({ province, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(province?.title || "");
  const [busy, setBusy] = useState(false);

  const trimmed = value.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 40;
  const isChanged = trimmed !== (province?.title || "");

  const onOpen = () => {
    setValue(province?.title || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchProvince(province.province_id, { title: trimmed.toUpperCase() });
      const updated = res || { ...province, title: trimmed.toUpperCase() };
      update_state?.(updated);
    } catch (e) {
      console.log('Error updating province title:', e);
      console.log('Error response data:', e?.response?.data);
      
      // Handle different error response formats
      let apiMsg = "Failed to update Title.";
      
      if (e?.response?.data?.error) {
        // Custom error format from our enhanced error handling
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.orderindex) {
        // Serializer validation error for orderindex
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.province_id) {
        // Serializer validation error for province_id
        apiMsg = e.response.data.province_id[0];
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
        <Modal.Header closeButton><Modal.Title>Edit Province Title</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Province Title (2–40 characters)</Form.Label>
            <Form.Control
              maxLength={40}
              value={value}
              onChange={(e) => setValue(clampLen(e.target.value, 40))}
              placeholder="e.g., ATTICA"
            />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto" style={{ color: isValid ? "green" : "red" }}>
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
export function EditProvinceCountryModal({ province, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(province?.country?.country_id || "");
  const [countries, setCountries] = useState([]);
  const [busy, setBusy] = useState(false);

  const isValid = value.length > 0;
  const isChanged = value !== (province?.country?.country_id || "");

  const onOpen = () => {
    setValue(province?.country?.country_id || "");
    setShow(true);
  };

  // Fetch countries for dropdown
  useEffect(() => {
    if (show) {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      
      console.log('Fetching countries from:', GET_COUNTRIES);
      console.log('Using headers:', currentHeaders);
      
      axios.get(GET_COUNTRIES, { headers: currentHeaders })
        .then((res) => {
          console.log('Countries API response:', res.data);
          // Handle different response structures
          const countriesData = res.data?.all_countries || [];
          console.log('Processed countries data:', countriesData);
          console.log('Setting countries state with:', countriesData);
          setCountries(countriesData);
        })
        .catch((e) => {
          console.error("Failed to fetch countries:", e);
          console.error("Error response:", e.response?.data);
          console.error("Error status:", e.response?.status);
          console.error("Error message:", e.message);
          setCountries([]);
        });
    }
  }, [show]);

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      console.log('Updating province country:', { province_id: province.province_id, country_id: value });
      const res = await patchProvince(province.province_id, { country_id: value });
      console.log('API response:', res);
      const updated = res || { ...province, country_id: value };
      console.log('Updated province data:', updated);
      update_state?.(updated);
    } catch (e) {
      console.error('Error updating province country:', e);
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
        <Modal.Header closeButton><Modal.Title>Edit Province Country</Modal.Title></Modal.Header>
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

        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto" style={{ color: isValid ? "green" : "red" }}>
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
   4) Edit Order by
   =========================== */
export function EditProvinceOrderIndexModal({ province, update_state }) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(province?.orderindex?.toString() || "");
  const [busy, setBusy] = useState(false);

  const isValid = value !== "" && Number.isInteger(+value);
  const isChanged = value !== (province?.orderindex?.toString() || "");

  const onOpen = () => {
    setValue(province?.orderindex?.toString() || "");
    setShow(true);
  };

  const onSave = async () => {
    if (!isValid) return;
    try {
      setBusy(true);
      const res = await patchProvince(province.province_id, { orderindex: Number(value) });
      const updated = res || { ...province, orderindex: Number(value) };
      update_state?.(updated);
    } catch (e) {
      console.log('Error updating province order index:', e);
      console.log('Error response data:', e?.response?.data);
      
      // Handle different error response formats
      let apiMsg = "Failed to update Order by.";
      
      // Priority order for error messages
      if (e?.response?.data?.orderindex && Array.isArray(e.response.data.orderindex)) {
        // Serializer validation error for orderindex (highest priority)
        apiMsg = e.response.data.orderindex[0];
      } else if (e?.response?.data?.error) {
        // Custom error format from our enhanced error handling
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.province_id && Array.isArray(e.response.data.province_id)) {
        // Serializer validation error for province_id
        apiMsg = e.response.data.province_id[0];
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
      <Button size="tiny" basic onClick={onOpen} title="Edit Order by">
        <FiEdit style={{ marginRight: 6 }} />
        Order by
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton><Modal.Title>Edit Province Order by</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Order by (integer)</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => setValue(toSmallInt(e.target.value).toString())}
              placeholder="e.g., 1"
            />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto" style={{ color: isValid ? "green" : "red" }}>
            {isValid ? (
              <>
                <AiOutlineCheckCircle style={{ marginRight: 6 }} />
                Looks good
              </>
            ) : (
              <>
                <AiOutlineWarning style={{ marginRight: 6 }} />
                Order by must be an integer.
              </>
            )}
          </small>
          <Button color="red" onClick={() => setShow(false)} disabled={busy}>Close</Button>
          <Button color="green" onClick={onSave} disabled={!isValid || !isChanged || busy}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
} 