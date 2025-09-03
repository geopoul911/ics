// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../global_vars";


// Variables
window.Swal = Swal;

// API endpoints
const UPDATE_CLIENT = "http://localhost:8000/api/data_management/client/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Combined Location Edit Modal
export function EditClientLocationModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setCountry(client.country?.country_id || "");
      setProvince(client.province?.province_id || "");
      setCity(client.city?.city_id || "");
      loadCountries();
    }
  }, [show, client]);

  useEffect(() => {
    if (country) {
      loadProvinces(country);
    } else {
      setProvinces([]);
      setCities([]);
    }
  }, [country]);

  useEffect(() => {
    if (province) {
      loadCities(province);
    } else {
      setCities([]);
    }
  }, [province]);

  const loadCountries = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
              const response = await axios.get("http://localhost:8000/api/regions/all_countries/", {
        headers: currentHeaders
      });
      const countriesData = response?.data?.all_countries || [];
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const loadProvinces = async (countryId) => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get(`http://localhost:8000/api/regions/all_provinces/?country=${countryId}`, { headers: currentHeaders });
      const provincesData = response?.data?.all_provinces || [];
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error loading provinces:', error);
      setProvinces([]);
    }
  };

  const loadCities = async (provinceId) => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get(`http://localhost:8000/api/regions/all_cities/?province=${provinceId}`, { headers: currentHeaders });
      const citiesData = response?.data?.all_cities || [];
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      setCities([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!country || !province || !city) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please select Country, Province, and City.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { 
          country_id: country,
          province_id: province,
          city_id: city
        },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Location information updated successfully.",
      });
    } catch (error) {
      console.error("Error updating location:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update location information.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Location">
        <FiEdit style={{ marginRight: 6 }} />
        Location
      </Button>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Location Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Country *</Form.Label>
            <Form.Control
              as="select"
              value={country}
              onChange={(e) => {
                const newCountry = e.target.value;
                setCountry(newCountry);
                // Reset dependent selections when country changes
                setProvince("");
                setCity("");
              }}
            >
              <option value="">Select Country</option>
              {countries.map((countryItem) => (
                <option key={countryItem.country_id} value={countryItem.country_id}>
                  {countryItem.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Province *</Form.Label>
            <Form.Control
              as="select"
              value={province}
              onChange={(e) => {
                const newProvince = e.target.value;
                setProvince(newProvince);
                // Reset dependent selection when province changes
                setCity("");
              }}
              disabled={!country}
            >
              <option value="">Select Province</option>
              {provinces.map((provinceItem) => (
                <option key={provinceItem.province_id} value={provinceItem.province_id}>
                  {provinceItem.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>City *</Form.Label>
            <Form.Control
              as="select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!province}
            >
              <option value="">Select City</option>
              {cities.map((cityItem) => (
                <option key={cityItem.city_id} value={cityItem.city_id}>
                  {cityItem.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(!country || !province || !city) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Country, Province and City are required.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!country || !province || !city || isLoading}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Surname Modal
export function EditClientSurnameModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [surname, setSurname] = useState("");
  const isSurnameValid = surname.trim().length >= 2 && surname.trim().length <= 40;

  useEffect(() => {
    if (show) {
      setSurname(client.surname || "");
    }
  }, [show, client.surname]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { surname: surname.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Surname updated successfully.",
      });
    } catch (error) {
      console.error("Error updating surname:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update surname.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Surname">
        <FiEdit style={{ marginRight: 6 }} />
        Surname
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Surname</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Surname</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => setSurname(clampLen(e.target.value, 40))}
              placeholder="Enter surname"
              isInvalid={surname.length > 0 && !isSurnameValid}
            />
            <Form.Control.Feedback type="invalid">
              Surname must be between 2 and 40 characters.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isSurnameValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Surname must be 2–40 characters.
                </li>
              </ul>
            ) : (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "green" }}
              >
                <li>
                  <AiOutlineCheckCircle
                    style={{ fontSize: 18, marginRight: 6 }}
                  />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isSurnameValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Name Modal
export function EditClientNameModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 40;

  useEffect(() => {
    if (show) {
      setName(client.name || "");
    }
  }, [show, client.name]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { name: name.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Name updated successfully.",
      });
    } catch (error) {
      console.error("Error updating name:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update name.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Name">
        <FiEdit style={{ marginRight: 6 }} />
        Name
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(clampLen(e.target.value, 40))}
              placeholder="Enter name"
              isInvalid={name.length > 0 && !isNameValid}
            />
            <Form.Control.Feedback type="invalid">
              Name must be between 2 and 40 characters.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isNameValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Name must be 2–40 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isNameValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Onoma Modal
export function EditClientOnomaModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [onoma, setOnoma] = useState("");
  const isOnomaValid = onoma.trim().length >= 2 && onoma.trim().length <= 40;

  useEffect(() => {
    if (show) {
      setOnoma(client.onoma || "");
    }
  }, [show, client.onoma]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { onoma: onoma.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Onoma updated successfully.",
      });
    } catch (error) {
      console.error("Error updating onoma:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update onoma.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Onoma">
        <FiEdit style={{ marginRight: 6 }} />
        Onoma
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Onoma (Greek Name)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Onoma (Greek Name)</Form.Label>
            <Form.Control
              type="text"
              value={onoma}
              onChange={(e) => setOnoma(clampLen(e.target.value, 40))}
              placeholder="Enter Greek name"
              isInvalid={onoma.length > 0 && !isOnomaValid}
            />
            <Form.Control.Feedback type="invalid">
              Greek name must be between 2 and 40 characters.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isOnomaValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Greek name must be 2–40 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isOnomaValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Eponymo Modal
export function EditClientEponymoModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [eponymo, setEponymo] = useState("");
  const isEponymoValid = eponymo.trim().length >= 2 && eponymo.trim().length <= 40;

  useEffect(() => {
    if (show) {
      setEponymo(client.eponymo || "");
    }
  }, [show, client.eponymo]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { eponymo: eponymo.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Eponymo updated successfully.",
      });
    } catch (error) {
      console.error("Error updating eponymo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update eponymo.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Eponymo">
        <FiEdit style={{ marginRight: 6 }} />
        Eponymo
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Eponymo (Greek Surname)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Eponymo (Greek Surname)</Form.Label>
            <Form.Control
              type="text"
              value={eponymo}
              onChange={(e) => setEponymo(clampLen(e.target.value, 40))}
              placeholder="Enter Greek surname"
              isInvalid={eponymo.length > 0 && !isEponymoValid}
            />
            <Form.Control.Feedback type="invalid">
              Greek surname must be between 2 and 40 characters.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isEponymoValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Greek surname must be 2–40 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isEponymoValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Email Modal
export function EditClientEmailModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  // eslint-disable-next-line
  const [isValid, setIsValid] = useState(true);
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (show) {
      setEmail(client.email || "");
    }
  }, [show, client.email]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validateEmail = (email) => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (email && !validateEmail(email)) {
      setIsValid(false);
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { email: email.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Email updated successfully.",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update email.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Email">
        <FiEdit style={{ marginRight: 6 }} />
        Email
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              Email
              {email && validateEmail(email) ? (
                <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
              ) : email ? (
                <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
              ) : null}
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(clampLen(e.target.value, 100));
                setIsValid(true);
              }}
              isInvalid={email && !isEmailValid}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isEmailValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Email must be a valid email address.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isEmailValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Phone1 Modal
export function EditClientPhone1Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [phone1, setPhone1] = useState("");
  const isPhoneValid = (v) => !v || v.replace(/\s+/g, '').length >= 7;

  useEffect(() => {
    if (show) {
      setPhone1(client.phone1 || "");
    }
  }, [show, client.phone1]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { phone1: phone1.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Phone 1 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating phone1:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update phone 1.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Phone 1">
        <FiEdit style={{ marginRight: 6 }} />
        Phone 1
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Phone 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Phone 1</Form.Label>
            <Form.Control
              type="text"
              value={phone1}
              onChange={(e) => setPhone1(clampLen(e.target.value, 20))}
              placeholder="Enter phone number"
              isInvalid={!!phone1 && !isPhoneValid(phone1)}
            />
            <Form.Control.Feedback type="invalid">
              Phone must be at least 7 digits (spaces ignored).
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!!phone1 && !isPhoneValid(phone1) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Phone must be at least 7 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!!phone1 && !isPhoneValid(phone1)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Mobile1 Modal
export function EditClientMobile1Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [mobile1, setMobile1] = useState("");
  const isPhoneValid = (v) => !v || v.replace(/\s+/g, '').length >= 7;

  useEffect(() => {
    if (show) {
      setMobile1(client.mobile1 || "");
    }
  }, [show, client.mobile1]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { mobile1: mobile1.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Mobile 1 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating mobile1:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update mobile 1.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Mobile 1">
        <FiEdit style={{ marginRight: 6 }} />
        Mobile 1
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mobile 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Mobile 1</Form.Label>
            <Form.Control
              type="text"
              value={mobile1}
              onChange={(e) => setMobile1(clampLen(e.target.value, 20))}
              placeholder="Enter mobile number"
              isInvalid={!!mobile1 && !isPhoneValid(mobile1)}
            />
            <Form.Control.Feedback type="invalid">
              Mobile must be at least 7 digits (spaces ignored).
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!!mobile1 && !isPhoneValid(mobile1) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Mobile must be at least 7 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!!mobile1 && !isPhoneValid(mobile1)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Phone2 Modal
export function EditClientPhone2Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [phone2, setPhone2] = useState("");
  const isPhoneValid = (v) => !v || v.replace(/\s+/g, '').length >= 7;

  useEffect(() => {
    if (show) {
      setPhone2(client.phone2 || "");
    }
  }, [show, client.phone2]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { phone2: phone2.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Phone 2 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating phone2:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update phone 2.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Phone 2">
        <FiEdit style={{ marginRight: 6 }} />
        Phone 2
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Phone 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Phone 2</Form.Label>
            <Form.Control
              type="text"
              value={phone2}
              onChange={(e) => setPhone2(clampLen(e.target.value, 20))}
              placeholder="Enter phone number"
              isInvalid={!!phone2 && !isPhoneValid(phone2)}
            />
            <Form.Control.Feedback type="invalid">
              Phone must be at least 7 digits (spaces ignored).
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!!phone2 && !isPhoneValid(phone2) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Phone must be at least 7 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!!phone2 && !isPhoneValid(phone2)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Mobile2 Modal
export function EditClientMobile2Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [mobile2, setMobile2] = useState("");
  const isPhoneValid = (v) => !v || v.replace(/\s+/g, '').length >= 7;

  useEffect(() => {
    if (show) {
      setMobile2(client.mobile2 || "");
    }
  }, [show, client.mobile2]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { mobile2: mobile2.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Mobile 2 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating mobile2:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update mobile 2.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Mobile 2">
        <FiEdit style={{ marginRight: 6 }} />
        Mobile 2
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mobile 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Mobile 2</Form.Label>
            <Form.Control
              type="text"
              value={mobile2}
              onChange={(e) => setMobile2(clampLen(e.target.value, 20))}
              placeholder="Enter mobile number"
              isInvalid={!!mobile2 && !isPhoneValid(mobile2)}
            />
            <Form.Control.Feedback type="invalid">
              Mobile must be at least 7 digits (spaces ignored).
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!!mobile2 && !isPhoneValid(mobile2) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Mobile must be at least 7 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!!mobile2 && !isPhoneValid(mobile2)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Address Modal
export function EditClientAddressModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState("");
  const isAddressValid = address.trim().length >= 2 && address.trim().length <= 200;

  useEffect(() => {
    if (show) {
      setAddress(client.address || "");
    }
  }, [show, client.address]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { address: address.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Address updated successfully.",
      });
    } catch (error) {
      console.error("Error updating address:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update address.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Address">
        <FiEdit style={{ marginRight: 6 }} />
        Address
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(clampLen(e.target.value, 200))}
              placeholder="Enter address"
              isInvalid={address.length > 0 && !isAddressValid}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isAddressValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Address must be 2–200 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isAddressValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Postal Code Modal
export function EditClientPostalcodeModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [postalcode, setPostalcode] = useState("");
  const isPostalValid = postalcode.trim().length >= 1 && postalcode.trim().length <= 10;

  useEffect(() => {
    if (show) {
      setPostalcode(client.postalcode || "");
    }
  }, [show, client.postalcode]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { postalcode: postalcode.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Postal code updated successfully.",
      });
    } catch (error) {
      console.error("Error updating postalcode:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update postal code.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Postal Code">
        <FiEdit style={{ marginRight: 6 }} />
        Postal Code
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Postal Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              value={postalcode}
              onChange={(e) => setPostalcode(clampLen(e.target.value, 10))}
              placeholder="Enter postal code"
              isInvalid={postalcode.length > 0 && !isPostalValid}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isPostalValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Postal code must be 1–10 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!isPostalValid}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Active Modal
export function EditClientActiveModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (show) {
      setActive(client.active || false);
    }
  }, [show, client.active]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { active },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Client ${active ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating active status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update active status.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Active Status">
        <FiEdit style={{ marginRight: 6 }} />
        Active
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
              <li>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                Validated
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Edit Client Notes Modal
export function EditClientNotesModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (show) {
      setNotes(client.notes || "");
    }
  }, [show, client.notes]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { notes: notes.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Notes updated successfully.",
      });
    } catch (error) {
      console.error("Error updating notes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update notes.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Notes">
        <FiEdit style={{ marginRight: 6 }} />
        Notes
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
              <li>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                Validated
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Placeholder modals for other fields (to be implemented as needed)
export function EditClientIdModal({ client, update_state }) {
  return null; // Client ID cannot be edited
}

export function EditClientCountryModal({ client, update_state }) {
  return <Button size="tiny" basic disabled title="Edit Country"><FiEdit style={{ marginRight: 6 }} />Country</Button>;
}

export function EditClientProvinceModal({ client, update_state }) {
  return <Button size="tiny" basic disabled title="Edit Province"><FiEdit style={{ marginRight: 6 }} />Province</Button>;
}

export function EditClientCityModal({ client, update_state }) {
  return <Button size="tiny" basic disabled title="Edit City"><FiEdit style={{ marginRight: 6 }} />City</Button>;
}

export function EditClientBirthdateModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [birthdate, setBirthdate] = useState("");

  useEffect(() => {
    if (show) {
      setBirthdate(client.birthdate ? client.birthdate.split('T')[0] : "");
    }
  }, [show, client.birthdate]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { birthdate: birthdate || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Birth date updated successfully.",
      });
    } catch (error) {
      console.error("Error updating birth date:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update birth date.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Birth Date">
        <FiEdit style={{ marginRight: 6 }} />
        Birth Date
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Birth Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Birth Date</Form.Label>
            <Form.Control
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="Select birth date"
            />
            <Form.Text className="text-muted">
              Leave empty if not applicable
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
              <li>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                Validated
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientBirthplaceModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [birthplace, setBirthplace] = useState("");

  useEffect(() => {
    if (show) {
      setBirthplace(client.birthplace || "");
    }
  }, [show, client.birthplace]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { birthplace: birthplace.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Birth place updated successfully.",
      });
    } catch (error) {
      console.error("Error updating birth place:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update birth place.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Birth Place">
        <FiEdit style={{ marginRight: 6 }} />
        Birth Place
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Birth Place</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Birth Place</Form.Label>
            <Form.Control
              type="text"
              value={birthplace}
              onChange={(e) => setBirthplace(e.target.value)}
              placeholder="e.g., Athens, Greece"
              maxLength={60}
            />
            <Form.Text className="text-muted">
              Enter the place of birth (max 60 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(!birthplace || birthplace.trim().length < 2 || birthplace.trim().length > 60) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Birth place is required and must be 2–60 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!birthplace || birthplace.trim().length < 2 || birthplace.trim().length > 60}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientFathernameModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [fathername, setFathername] = useState("");

  useEffect(() => {
    if (show) {
      setFathername(client.fathername || "");
    }
  }, [show, client.fathername]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { fathername: fathername.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Father's name updated successfully.",
      });
    } catch (error) {
      console.error("Error updating father's name:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update father's name.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Father's Name">
        <FiEdit style={{ marginRight: 6 }} />
        Father's Name
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Father's Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Father's Name</Form.Label>
            <Form.Control
              type="text"
              value={fathername}
              onChange={(e) => setFathername(e.target.value)}
              placeholder="Enter father's name"
              maxLength={80}
            />
            <Form.Text className="text-muted">
              Enter the father's full name (max 80 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(fathername && fathername.trim().length > 80) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Father's name must be up to 80 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={fathername && fathername.trim().length > 80}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientMothernameModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [mothername, setMothername] = useState("");

  useEffect(() => {
    if (show) {
      setMothername(client.mothername || "");
    }
  }, [show, client.mothername]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { mothername: mothername.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Mother's name updated successfully.",
      });
    } catch (error) {
      console.error("Error updating mother's name:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update mother's name.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Mother's Name">
        <FiEdit style={{ marginRight: 6 }} />
        Mother's Name
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mother's Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Mother's Name</Form.Label>
            <Form.Control
              type="text"
              value={mothername}
              onChange={(e) => setMothername(e.target.value)}
              placeholder="Enter mother's name"
              maxLength={80}
            />
            <Form.Text className="text-muted">
              Enter the mother's full name (max 80 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(mothername && mothername.trim().length > 80) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Mother's name must be up to 80 characters.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={mothername && mothername.trim().length > 80}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientMaritalstatusModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [maritalstatus, setMaritalstatus] = useState("");

  const maritalStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Common law", label: "Common law" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];

  useEffect(() => {
    if (show) {
      setMaritalstatus(client.maritalstatus || "");
    }
  }, [show, client.maritalstatus]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { maritalstatus: maritalstatus || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Marital status updated successfully.",
      });
    } catch (error) {
      console.error("Error updating marital status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update marital status.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Marital Status">
        <FiEdit style={{ marginRight: 6 }} />
        Marital Status
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Marital Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Marital Status</Form.Label>
            <Form.Control
              as="select"
              value={maritalstatus}
              onChange={(e) => setMaritalstatus(e.target.value)}
            >
              <option value="">Select marital status</option>
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Select the current marital status
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {/* Optional date; show validated state */}
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
              <li>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                Validated
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientDeceasedModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [deceased, setDeceased] = useState(false);

  useEffect(() => {
    if (show) {
      setDeceased(client.deceased || false);
    }
  }, [show, client.deceased]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { deceased },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Deceased status ${deceased ? "set" : "cleared"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating deceased status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update deceased status.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Deceased Status">
        <FiEdit style={{ marginRight: 6 }} />
        Deceased
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Deceased Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Deceased"
              checked={deceased}
              onChange={(e) => setDeceased(e.target.checked)}
            />
            <Form.Text className="text-muted">
              Check this box if the client is deceased
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
              <li>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                Validated
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientDeceasedateModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [deceasedate, setDeceasedate] = useState("");

  useEffect(() => {
    if (show) {
      setDeceasedate(client.deceasedate ? client.deceasedate.split('T')[0] : "");
    }
  }, [show, client.deceasedate]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { deceasedate: deceasedate || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Deceased date updated successfully.",
      });
    } catch (error) {
      console.error("Error updating deceased date:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update deceased date.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Deceased Date">
        <FiEdit style={{ marginRight: 6 }} />
        Deceased Date
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Deceased Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Deceased Date</Form.Label>
            <Form.Control
              type="date"
              value={deceasedate}
              onChange={(e) => setDeceasedate(e.target.value)}
              placeholder="Select deceased date"
            />
            <Form.Text className="text-muted">
              Leave empty if not applicable
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
              <li>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                Validated
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientAfmModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [afm, setAfm] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (show) {
      setAfm(client.afm || "");
    }
  }, [show, client.afm]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    // Validate AFM - must be exactly 9 digits if provided
    if (afm && (afm.length !== 9 || !/^\d{9}$/.test(afm))) {
      setIsValid(false);
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { afm: afm.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "AFM updated successfully.",
      });
    } catch (error) {
      console.error("Error updating AFM:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update AFM.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit AFM">
        <FiEdit style={{ marginRight: 6 }} />
        AFM
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit AFM (Greek Tax Number)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              AFM
            </Form.Label>
            <Form.Control
              type="text"
              value={afm}
              onChange={(e) => {
                setAfm(clampLen(e.target.value.replace(/\D/g, ''), 9));
                setIsValid(true);
              }}
              placeholder="e.g., 123456789"
              maxLength={9}
              isInvalid={!isValid}
            />

          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(afm && (afm.length !== 9 || !/^\d{9}$/.test(afm))) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  AFM must be exactly 9 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={afm && (afm.length !== 9 || !/^\d{9}$/.test(afm))}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientSinModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [sin, setSin] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (show) {
      setSin(client.sin || "");
    }
  }, [show, client.sin]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    // Validate SIN - required and must be exactly 9 digits
    if (!sin || sin.length !== 9 || !/^\d{9}$/.test(sin)) {
      setIsValid(false);
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { sin: sin.trim() },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "SIN updated successfully.",
      });
    } catch (error) {
      console.error("Error updating SIN:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update SIN.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit SIN">
        <FiEdit style={{ marginRight: 6 }} />
        SIN
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit SIN (Canadian Tax Number)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              SIN
              {sin && sin.length === 9 && /^\d{9}$/.test(sin) ? (
                <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
              ) : sin ? (
                <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
              ) : null}
            </Form.Label>
            <Form.Control
              type="text"
              value={sin}
              onChange={(e) => {
                setSin(clampLen(e.target.value.replace(/\D/g, ''), 9));
                setIsValid(true);
              }}
              placeholder="e.g., 123456789"
              maxLength={9}
              isInvalid={!isValid}
            />
            <Form.Text className="text-muted">
              Must be exactly 9 digits (leave empty if not applicable)
            </Form.Text>
            {!isValid && (
              <Form.Control.Feedback type="invalid">
                SIN must be exactly 9 digits.
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(!sin || sin.length !== 9 || !/^\d{9}$/.test(sin)) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  SIN is required and must be exactly 9 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!sin || sin.length !== 9 || !/^\d{9}$/.test(sin)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientAmkaModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [amka, setAmka] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (show) {
      setAmka(client.amka || "");
    }
  }, [show, client.amka]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    // Validate AMKA - must be exactly 11 digits if provided
    if (amka && (amka.length !== 11 || !/^\d{11}$/.test(amka))) {
      setIsValid(false);
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { amka: amka.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "AMKA updated successfully.",
      });
    } catch (error) {
      console.error("Error updating AMKA:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update AMKA.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit AMKA">
        <FiEdit style={{ marginRight: 6 }} />
        AMKA
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit AMKA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              AMKA
              {amka && amka.length === 11 && /^\d{11}$/.test(amka) ? (
                <AiOutlineCheckCircle style={{ color: "green", marginLeft: "0.5em" }} />
              ) : amka ? (
                <AiOutlineWarning style={{ color: "orange", marginLeft: "0.5em" }} />
              ) : null}
            </Form.Label>
            <Form.Control
              type="text"
              value={amka}
              onChange={(e) => {
                setAmka(clampLen(e.target.value.replace(/\D/g, ''), 11));
                setIsValid(true);
              }}
              placeholder="e.g., 12345678901"
              maxLength={11}
              isInvalid={!isValid}
            />
            <Form.Text className="text-muted">
              Must be exactly 11 digits (leave empty if not applicable)
            </Form.Text>
            {!isValid && (
              <Form.Control.Feedback type="invalid">
                AMKA must be exactly 11 digits.
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(amka && (amka.length !== 11 || !/^\d{11}$/.test(amka))) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  AMKA must be exactly 11 digits.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={amka && (amka.length !== 11 || !/^\d{11}$/.test(amka))}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPassportcountryModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [passportcountry, setPassportcountry] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (show) {
      setPassportcountry(client.passportcountry?.country_id || "");
      loadCountries();
    }
  }, [show, client.passportcountry]);

  const loadCountries = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/regions/all_countries/", {
        headers: currentHeaders
      });
      const countriesData = response?.data?.all_countries || [];
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { passportcountry_id: passportcountry || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Passport country updated successfully.",
      });
    } catch (error) {
      console.error("Error updating passport country:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update passport country.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Passport Country">
        <FiEdit style={{ marginRight: 6 }} />
        Passport Country
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Passport Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Passport Country</Form.Label>
            <Form.Control
              as="select"
              value={passportcountry}
              onChange={(e) => setPassportcountry(e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.title}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Select the country that issued the passport
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {(!passportcountry) ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                <li>
                  <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                  Passport country is required.
                </li>
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li>
                  <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                  Validated
                </li>
              </ul>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave} disabled={!passportcountry}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPassportnumberModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [passportnumber, setPassportnumber] = useState("");

  useEffect(() => {
    if (show) {
      setPassportnumber(client.passportnumber || "");
    }
  }, [show, client.passportnumber]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { passportnumber: passportnumber.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Passport number updated successfully.",
      });
    } catch (error) {
      console.error("Error updating passport number:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update passport number.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Passport Number">
        <FiEdit style={{ marginRight: 6 }} />
        Passport Number
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Passport Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Passport Number</Form.Label>
            <Form.Control
              type="text"
              value={passportnumber}
              onChange={(e) => setPassportnumber(e.target.value)}
              placeholder="Enter passport number"
              maxLength={15}
            />
            <Form.Text className="text-muted">
              Enter the passport number (max 15 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPassportexpiredateModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [passportexpiredate, setPassportexpiredate] = useState("");

  useEffect(() => {
    if (show) {
      setPassportexpiredate(client.passportexpiredate ? client.passportexpiredate.split('T')[0] : "");
    }
  }, [show, client.passportexpiredate]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { passportexpiredate: passportexpiredate || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Passport expire date updated successfully.",
      });
    } catch (error) {
      console.error("Error updating passport expire date:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update passport expire date.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Passport Expire Date">
        <FiEdit style={{ marginRight: 6 }} />
        Passport Expire Date
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Passport Expire Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Passport Expire Date</Form.Label>
            <Form.Control
              type="date"
              value={passportexpiredate}
              onChange={(e) => setPassportexpiredate(e.target.value)}
              placeholder="Select passport expire date"
            />
            <Form.Text className="text-muted">
              Leave empty if not applicable
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPoliceidModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [policeid, setPoliceid] = useState("");

  useEffect(() => {
    if (show) {
      setPoliceid(client.policeid || "");
    }
  }, [show, client.policeid]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { policeid: policeid.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Police ID updated successfully.",
      });
    } catch (error) {
      console.error("Error updating police ID:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update police ID.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Police ID">
        <FiEdit style={{ marginRight: 6 }} />
        Police ID
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Police ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Police ID</Form.Label>
            <Form.Control
              type="text"
              value={policeid}
              onChange={(e) => setPoliceid(e.target.value)}
              placeholder="Enter police ID"
              maxLength={15}
            />
            <Form.Text className="text-muted">
              Enter the police ID number (max 15 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientProfessionModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [profession, setProfession] = useState("");

  useEffect(() => {
    if (show) {
      setProfession(client.profession || "");
    }
  }, [show, client.profession]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { profession: profession.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profession updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profession:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update profession.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Profession">
        <FiEdit style={{ marginRight: 6 }} />
        Profession
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Profession</Form.Label>
            <Form.Control
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Enter profession"
              maxLength={40}
            />
            <Form.Text className="text-muted">
              Enter the client's profession (max 40 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientTaxmanagementModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [taxmanagement, setTaxmanagement] = useState(false);

  useEffect(() => {
    if (show) {
      setTaxmanagement(client.taxmanagement || false);
    }
  }, [show, client.taxmanagement]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { taxmanagement },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Tax management ${taxmanagement ? "enabled" : "disabled"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating tax management:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update tax management.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Tax Management">
        <FiEdit style={{ marginRight: 6 }} />
        Tax Management
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tax Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Tax Management"
              checked={taxmanagement}
              onChange={(e) => setTaxmanagement(e.target.checked)}
            />
            <Form.Text className="text-muted">
              Check this box if tax management is required
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientTaxrepresentationModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [taxrepresentation, setTaxrepresentation] = useState(false);

  useEffect(() => {
    if (show) {
      setTaxrepresentation(client.taxrepresentation || false);
    }
  }, [show, client.taxrepresentation]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { taxrepresentation },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Tax representation ${taxrepresentation ? "enabled" : "disabled"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating tax representation:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update tax representation.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Tax Representation">
        <FiEdit style={{ marginRight: 6 }} />
        Tax Representation
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tax Representation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Tax Representation"
              checked={taxrepresentation}
              onChange={(e) => setTaxrepresentation(e.target.checked)}
            />
            <Form.Text className="text-muted">
              Check this box if tax representation is required
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientTaxrepresentativeModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [taxrepresentative, setTaxrepresentative] = useState("");

  useEffect(() => {
    if (show) {
      setTaxrepresentative(client.taxrepresentative || "");
    }
  }, [show, client.taxrepresentative]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { taxrepresentative: taxrepresentative.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Tax representative updated successfully.",
      });
    } catch (error) {
      console.error("Error updating tax representative:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update tax representative.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Tax Representative">
        <FiEdit style={{ marginRight: 6 }} />
        Tax Representative
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tax Representative</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tax Representative</Form.Label>
            <Form.Control
              type="text"
              value={taxrepresentative}
              onChange={(e) => setTaxrepresentative(e.target.value)}
              placeholder="Enter tax representative name"
              maxLength={200}
            />
            <Form.Text className="text-muted">
              Enter the name of the tax representative (max 200 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientRetiredModal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [retired, setRetired] = useState(false);

  useEffect(() => {
    if (show) {
      setRetired(client.retired || false);
    }
  }, [show, client.retired]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { retired },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Retired status ${retired ? "set" : "cleared"} successfully.`,
      });
    } catch (error) {
      console.error("Error updating retired status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update retired status.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Retired Status">
        <FiEdit style={{ marginRight: 6 }} />
        Retired
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Retired Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Retired"
              checked={retired}
              onChange={(e) => setRetired(e.target.checked)}
            />
            <Form.Text className="text-muted">
              Check this box if the client is retired
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPensioncountry1Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [pensioncountry1, setPensioncountry1] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (show) {
      setPensioncountry1(client.pensioncountry1?.country_id || "");
      loadCountries();
    }
  }, [show, client.pensioncountry1]);

  const loadCountries = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/regions/all_countries/", {
        headers: currentHeaders
      });
      const countriesData = response?.data?.all_countries || [];
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { pensioncountry1_id: pensioncountry1 || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Pension Country 1 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating pension country 1:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update pension country 1.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Pension Country 1">
        <FiEdit style={{ marginRight: 6 }} />
        Pension Country 1
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pension Country 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Pension Country 1</Form.Label>
            <Form.Control
              as="select"
              value={pensioncountry1}
              onChange={(e) => setPensioncountry1(e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.title}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Select the first pension country
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientInsucarrier1Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [insucarrier1, setInsucarrier1] = useState("");
  const [insuranceCarriers, setInsuranceCarriers] = useState([]);

  useEffect(() => {
    if (show) {
      setInsucarrier1(client.insucarrier1?.insucarrier_id || "");
      loadInsuranceCarriers();
    }
  }, [show, client.insucarrier1]);

  const loadInsuranceCarriers = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/administration/all_insurance_carriers/", {
        headers: currentHeaders
      });
      const carriersData = response?.data?.all_insurance_carriers || [];
      setInsuranceCarriers(carriersData);
    } catch (error) {
      console.error('Error loading insurance carriers:', error);
      setInsuranceCarriers([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { insucarrier1_id: insucarrier1 || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Insurance Carrier 1 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating insurance carrier 1:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update insurance carrier 1.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Insurance Carrier 1">
        <FiEdit style={{ marginRight: 6 }} />
        Insurance Carrier 1
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insurance Carrier 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Insurance Carrier 1</Form.Label>
            <Form.Control
              as="select"
              value={insucarrier1}
              onChange={(e) => setInsucarrier1(e.target.value)}
            >
              <option value="">Select an insurance carrier</option>
              {insuranceCarriers.map((carrier) => (
                <option key={carrier.insucarrier_id} value={carrier.insucarrier_id}>
                  {carrier.title}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Select the first insurance carrier
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPensioninfo1Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [pensioninfo1, setPensioninfo1] = useState("");

  useEffect(() => {
    if (show) {
      setPensioninfo1(client.pensioninfo1 || "");
    }
  }, [show, client.pensioninfo1]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { pensioninfo1: pensioninfo1.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Pension Info 1 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating pension info 1:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update pension info 1.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Pension Info 1">
        <FiEdit style={{ marginRight: 6 }} />
        Pension Info 1
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pension Info 1</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Pension Info 1</Form.Label>
            <Form.Control
              type="text"
              value={pensioninfo1}
              onChange={(e) => setPensioninfo1(e.target.value)}
              placeholder="Enter pension information"
              maxLength={80}
            />
            <Form.Text className="text-muted">
              Enter pension information (max 80 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPensioncountry2Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [pensioncountry2, setPensioncountry2] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (show) {
      setPensioncountry2(client.pensioncountry2?.country_id || "");
      loadCountries();
    }
  }, [show, client.pensioncountry2]);

  const loadCountries = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/regions/all_countries/", {
        headers: currentHeaders
      });
      const countriesData = response?.data?.all_countries || [];
      setCountries(countriesData);
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { pensioncountry2_id: pensioncountry2 || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Pension Country 2 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating pension country 2:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update pension country 2.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Pension Country 2">
        <FiEdit style={{ marginRight: 6 }} />
        Pension Country 2
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pension Country 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Pension Country 2</Form.Label>
            <Form.Control
              as="select"
              value={pensioncountry2}
              onChange={(e) => setPensioncountry2(e.target.value)}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.title}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Select the second pension country
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientInsucarrier2Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [insucarrier2, setInsucarrier2] = useState("");
  const [insuranceCarriers, setInsuranceCarriers] = useState([]);

  useEffect(() => {
    if (show) {
      setInsucarrier2(client.insucarrier2?.insucarrier_id || "");
      loadInsuranceCarriers();
    }
  }, [show, client.insucarrier2]);

  const loadInsuranceCarriers = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get("http://localhost:8000/api/administration/all_insurance_carriers/", {
        headers: currentHeaders
      });
      const carriersData = response?.data?.all_insurance_carriers || [];
      setInsuranceCarriers(carriersData);
    } catch (error) {
      console.error('Error loading insurance carriers:', error);
      setInsuranceCarriers([]);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { insucarrier2_id: insucarrier2 || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Insurance Carrier 2 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating insurance carrier 2:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update insurance carrier 2.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Insurance Carrier 2">
        <FiEdit style={{ marginRight: 6 }} />
        Insurance Carrier 2
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insurance Carrier 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Insurance Carrier 2</Form.Label>
            <Form.Control
              as="select"
              value={insucarrier2}
              onChange={(e) => setInsucarrier2(e.target.value)}
            >
              <option value="">Select an insurance carrier</option>
              {insuranceCarriers.map((carrier) => (
                <option key={carrier.insucarrier_id} value={carrier.insucarrier_id}>
                  {carrier.title}
                </option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">
              Select the second insurance carrier
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditClientPensioninfo2Modal({ client, update_state }) {
  const [show, setShow] = useState(false);
  const [pensioninfo2, setPensioninfo2] = useState("");

  useEffect(() => {
    if (show) {
      setPensioninfo2(client.pensioninfo2 || "");
    }
  }, [show, client.pensioninfo2]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const response = await axios.patch(
        `${UPDATE_CLIENT}${client.client_id}/`,
        { pensioninfo2: pensioninfo2.trim() || null },
        { headers: currentHeaders }
      );

      update_state(response.data);
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Pension Info 2 updated successfully.",
      });
    } catch (error) {
      console.error("Error updating pension info 2:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to update pension info 2.",
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} size="tiny" basic title="Edit Pension Info 2">
        <FiEdit style={{ marginRight: 6 }} />
        Pension Info 2
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pension Info 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Pension Info 2</Form.Label>
            <Form.Control
              type="text"
              value={pensioninfo2}
              onChange={(e) => setPensioninfo2(e.target.value)}
              placeholder="Enter pension information"
              maxLength={80}
            />
            <Form.Text className="text-muted">
              Enter pension information (max 80 characters)
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
