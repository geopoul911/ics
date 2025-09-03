// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

import axios from "axios";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoints
const ADD_PROFESSIONAL = "http://localhost:8000/api/data_management/professionals/";
const ALL_PROFESSIONS = "http://localhost:8000/api/administration/all_professions/";
const ALL_CITIES = "http://localhost:8000/api/regions/all_cities/";

function AddProfessionalModal({ onProfessionalCreated }) {
  const [show, setShow] = useState(false);

  // Form state
  const [professional_id, setProfessional_id] = useState("");
  const [fullname, setFullname] = useState("");
  const [profession_id, setProfession_id] = useState("");
  const [city_id, setCity_id] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [reliability, setReliability] = useState("");
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");

  // Dropdown data
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);

  const resetForm = () => {
    setProfessional_id("");
    setFullname("");
    setProfession_id("");
    setCity_id("");
    setAddress("");
    setEmail("");
    setPhone("");
    setMobile("");
    setReliability("");
    setActive(true);
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  // Load dropdown data when modal opens
  useEffect(() => {
    if (show) {
      loadDropdownData();
    }
  }, [show]);

  const loadDropdownData = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const professionsRes = await axios.get(ALL_PROFESSIONS, { headers: currentHeaders });
      setProfessions(professionsRes.data.all_professions || []);

      const citiesRes = await axios.get(ALL_CITIES, { headers: currentHeaders });
      setCities(citiesRes.data.all_cities || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  // Validation
  const isIdValid = professional_id.trim().length >= 2 && professional_id.trim().length <= 10;
  const isFullnameValid = fullname.trim().length >= 2 && fullname.trim().length <= 40;
  const isProfessionValid = profession_id !== "";
  const isCityValid = city_id !== "";
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = !phone || phone.length <= 15;
  const isMobileValid = mobile.trim().length > 0 && mobile.length <= 15;
  const isFormValid = isIdValid && isFullnameValid && isProfessionValid && isCityValid && isMobileValid && isEmailValid && isPhoneValid;

  const createNewProfessional = async () => {
    if (!isFormValid) return;
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      await axios.post(
        ADD_PROFESSIONAL,
        {
          professional_id: professional_id.trim().toUpperCase(),
          fullname: fullname.trim(),
          profession_id,
          city_id,
          address: address.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
          mobile: mobile.trim(),
          reliability: reliability || null,
          active,
          notes: notes.trim() || null
        },
        { headers: currentHeaders }
      );

      Swal.fire("Success", "Professional created successfully", "success");
      if (onProfessionalCreated) onProfessionalCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating professional:", error);
      let apiMsg = "Failed to create professional";
      const data = error.response?.data;
      if (data?.error) apiMsg = data.error;
      else if (data?.professional_id) apiMsg = data.professional_id[0];
      else if (data?.fullname) apiMsg = data.fullname[0];
      else if (data?.profession_id) apiMsg = data.profession_id[0];
      else if (data?.city_id) apiMsg = data.city_id[0];
      else if (data?.mobile) apiMsg = data.mobile[0];
      else if (data?.email) apiMsg = data.email[0];
      else if (data?.phone) apiMsg = data.phone[0];
      else if (data?.detail) apiMsg = data.detail;
      Swal.fire("Error", apiMsg, "error");
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }} />
        Create new Professional
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Create new Professional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <h6 className="mb-2">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Professional ID *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., PR001"
                        onChange={(e) => setProfessional_id(e.target.value.toUpperCase())}
                        value={professional_id}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Fullname *:</Form.Label>
                      <Form.Control
                        maxLength={40}
                        placeholder="e.g., John Smith"
                        onChange={(e) => setFullname(e.target.value)}
                        value={fullname}
                        isInvalid={fullname !== "" && !isFullnameValid}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-2 mt-3">Links</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Profession *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setProfession_id(e.target.value)} value={profession_id} isInvalid={profession_id !== "" && !isProfessionValid}>
                        <option value="">Select Profession</option>
                        {Array.isArray(professions) && professions.map((p) => (
                          <option key={p.profession_id} value={p.profession_id}>{p.title}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>City *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setCity_id(e.target.value)} value={city_id} isInvalid={city_id !== "" && !isCityValid}>
                        <option value="">Select City</option>
                        {Array.isArray(cities) && cities.map((c) => (
                          <option key={c.city_id} value={c.city_id}>{c.title}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-2 mt-3">Contact</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Address:</Form.Label>
                      <Form.Control onChange={(e) => setAddress(e.target.value)} value={address} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} value={email} isInvalid={email !== "" && !isEmailValid} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone:</Form.Label>
                      <Form.Control placeholder="Optional, max 15 chars" onChange={(e) => setPhone(e.target.value)} value={phone} isInvalid={phone !== "" && !isPhoneValid} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile *:</Form.Label>
                      <Form.Control placeholder="e.g., +30-697-1234567" onChange={(e) => setMobile(e.target.value)} value={mobile} isInvalid={!isMobileValid} />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-2 mt-3">Status</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reliability:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setReliability(e.target.value)} value={reliability}>
                        <option value="">Select</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check type="switch" id="active-switch" label="Active" checked={active} onChange={(e) => setActive(e.target.checked)} />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-2 mt-3">Notes</h6>
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Optional notes about the professional"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid ? (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
                {!isIdValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Professional ID is required (2–10 chars).</li>
                )}
                {!isFullnameValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Fullname is required (2–40 chars).</li>
                )}
                {!isProfessionValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Profession is required.</li>
                )}
                {!isCityValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> City is required.</li>
                )}
                {!isMobileValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Mobile is required (max 15 chars).</li>
                )}
                {!isEmailValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Email must be a valid email address.</li>
                )}
                {!isPhoneValid && (
                  <li><AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} /> Phone must be 15 characters or less.</li>
                )}
              </ul>
            ) : (
              <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "green" }}>
                <li><AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} /> Validated</li>
              </ul>
            )}
          </small>

          <Button color="red" onClick={handleClose}>Close</Button>
          <Button color="green" onClick={createNewProfessional} disabled={!isFormValid}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddProfessionalModal;
