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
      const professionsRes = await axios.get(ALL_PROFESSIONS, { headers });
      setProfessions(professionsRes.data.all_professions || []);

      const citiesRes = await axios.get(ALL_CITIES, { headers });
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
  const isFormValid = isIdValid && isFullnameValid && isProfessionValid && isCityValid;

  const createNewProfessional = async () => {
    if (!isFormValid) return;
    try {
      await axios.post(
        ADD_PROFESSIONAL,
        { professional_id, fullname, profession_id, city_id, address, email, phone, mobile, reliability, active, notes },
        { headers }
      );

      Swal.fire("Success", "Professional created successfully", "success");
      if (onProfessionalCreated) onProfessionalCreated();
      handleClose();
    } catch (error) {
      console.error("Error creating professional:", error);
      const errorMessage = error.response?.data?.error || "Failed to create professional";
      Swal.fire("Error", errorMessage, "error");
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }} />
        Create new Professional
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Create new Professional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <h6 className="mb-3">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Professional ID *:</Form.Label>
                      <Form.Control maxLength={10} onChange={(e) => setProfessional_id(e.target.value.toUpperCase())} value={professional_id} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fullname *:</Form.Label>
                      <Form.Control maxLength={40} onChange={(e) => setFullname(e.target.value)} value={fullname} />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Links</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Profession *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setProfession_id(e.target.value)} value={profession_id}>
                        <option value="">Select Profession</option>
                        {Array.isArray(professions) && professions.map((p) => (
                          <option key={p.profession_id} value={p.profession_id}>{p.title}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *:</Form.Label>
                      <Form.Control as="select" onChange={(e) => setCity_id(e.target.value)} value={city_id}>
                        <option value="">Select City</option>
                        {Array.isArray(cities) && cities.map((c) => (
                          <option key={c.city_id} value={c.city_id}>{c.title}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Contact</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address:</Form.Label>
                      <Form.Control onChange={(e) => setAddress(e.target.value)} value={address} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control onChange={(e) => setEmail(e.target.value)} value={email} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone:</Form.Label>
                      <Form.Control onChange={(e) => setPhone(e.target.value)} value={phone} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile:</Form.Label>
                      <Form.Control onChange={(e) => setMobile(e.target.value)} value={mobile} />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="mb-3 mt-4">Status</h6>
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

                <h6 className="mb-3 mt-4">Notes</h6>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Control as="textarea" rows={3} onChange={(e) => setNotes(e.target.value)} value={notes} />
                    </Form.Group>
                  </Col>
                </Row>
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
