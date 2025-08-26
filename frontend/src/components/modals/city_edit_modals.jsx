// Built-ins
import { useState, useEffect } from "react";

import { apiPut } from "../../utils/api";
import axios from "axios";
import { headers } from "../global_vars";

// Icons
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { FaStop } from "react-icons/fa";

// Libs

import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";


// API base
const CITY_DETAIL = "http://localhost:8000/api/regions/city/";
const GET_COUNTRIES = "http://localhost:8000/api/regions/all_countries/";
const GET_PROVINCES = "http://localhost:8000/api/regions/all_provinces/";

// Helpers
const clampLen = (v, max) => (v || "").slice(0, max);
const toSmallInt = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return "";
  return Math.max(-32768, Math.min(32767, n));
};

const patchCity = async (id, payload) => {
  const url = `${CITY_DETAIL}${encodeURIComponent(id)}/`;
  return apiPut(url, payload);
};

/* ===========================
   1) City ID (PK) - Immutable
   =========================== */
export function EditCityIdModal({ city, update_state }) {
  return (
    <Button size="tiny" basic disabled title="City ID is immutable">
      <FaStop style={{ marginRight: 6, color: "red" }} />
      ID
    </Button>
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
      const updated = res?.data || { ...city, title: trimmed.toUpperCase() };
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
  const [value, setValue] = useState(city?.country?.country_id || "");
  const [countries, setCountries] = useState([]);
  const [busy, setBusy] = useState(false);

  const isValid = value.length > 0;
  const isChanged = value !== (city?.country?.country_id || "");

  const onOpen = () => {
    setValue(city?.country?.country_id || "");
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
    
    // Show confirmation if country is changing and city has a province
    if (city?.province?.province_id) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Change Country",
        text: `Changing the country will also clear the current province (${city.province.title}) since it may not exist in the new country. Do you want to continue?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Change Country",
        cancelButtonText: "Cancel"
      });
      
      if (!result.isConfirmed) {
        return;
      }
    }
    
    try {
      setBusy(true);
      // When country changes, always clear the province since it might not exist in the new country
      const payload = { country_id: value };
      // Always clear province when country changes
      payload.province_id = null;
      
      const res = await patchCity(city.city_id, payload);
      
      const updated = res || { ...city, country_id: value, province_id: null };
      update_state?.(updated);
      
      // Show success message if province was cleared
      if (city?.province?.province_id) {
        Swal.fire({
          icon: "success",
          title: "Country Updated",
          text: `Country changed successfully. Province has been cleared. Please select a new province for the city.`
        });
      }
    } catch (e) {
      const apiMsg = e?.message || "Failed to update Country.";
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
  const [value, setValue] = useState(city?.province?.province_id || "");
  const [provinces, setProvinces] = useState([]);
  const [busy, setBusy] = useState(false);

  const isValid = value.length > 0;
  const isChanged = value !== (city?.province?.province_id || "");

  const onOpen = () => {
    setValue(city?.province?.province_id || "");
    setShow(true);
  };

    // Fetch provinces for dropdown
  useEffect(() => {
    if (show) {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      
      console.log('Fetching provinces from:', GET_PROVINCES);
      console.log('Fetching provinces for country:', city?.country?.country_id);
      
      axios.get(GET_PROVINCES, { headers: currentHeaders })
        .then((res) => {
          console.log('Provinces API response:', res.data);
          // Handle different response structures
          const allProvinces = res.data?.all_provinces || [];
          const filteredProvinces = allProvinces.filter(province => province.country?.country_id === city?.country?.country_id);
          console.log('Filtered provinces data:', filteredProvinces);
          console.log('Setting provinces state with:', filteredProvinces);
          setProvinces(filteredProvinces);
        })
        .catch((e) => {
          console.error("Failed to fetch provinces:", e);
          console.error("Error response:", e.response?.data);
          console.error("Error status:", e.response?.status);
          console.error("Error message:", e.message);
          setProvinces([]);
        });
    }
  }, [show, city?.country]);

  const onSave = async () => {
    if (!isValid || !isChanged) return;
    try {
      setBusy(true);
      const res = await patchCity(city.city_id, { province_id: value });
      const updated = res || { ...city, province_id: value };
      update_state?.(updated);
    } catch (e) {
      const apiMsg = e?.message || "Failed to update Province.";
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
      const updated = res?.data || { ...city, orderindex: Number(value) };
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