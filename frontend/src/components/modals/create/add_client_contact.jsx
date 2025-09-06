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
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css';

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint
const ADD_CLIENT_CONTACT = "http://localhost:8000/api/data_management/client_contacts/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

const validateEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// Phone format must match backend: optional leading +, then digits only, up to 16 total chars
const phoneRegex = /^\+?[1-9]\d{0,15}$/;

function AddClientContactModal({ refreshData, defaultProjectId, lockProject = false, defaultProfessionalId, lockProfessional = false }) {
  const [show, setShow] = useState(false);

  // Basic Information
  const [clientcontId, setClientcontId] = useState("");
  const [fullname, setFullname] = useState("");
  const [fathername, setFathername] = useState("");
  const [mothername, setMothername] = useState("");
  const [connection, setConnection] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  const [profession, setProfession] = useState("");
  const [reliability, setReliability] = useState("");
  const [city, setCity] = useState("");
  
  // Foreign Keys
  const [projectId, setProjectId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  
  // System Information
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");

  // Dropdown Data
  const [projects, setProjects] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [lockedByProfessional, setLockedByProfessional] = useState(false);

  const resetForm = () => {
    setClientcontId("");
    setFullname("");
    setFathername("");
    setMothername("");
    setConnection("");
    setAddress("");
    setEmail("");
    setPhone("");
    setMobile("");
    setProfession("");
    setReliability("");
    setCity("");
    setProjectId("");
    setProfessionalId("");
    setActive(true);
    setNotes("");
  };

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
      // Load projects
      const projectsResponse = await axios.get(
        "http://localhost:8000/api/data_management/all_projects/",
        { headers: currentHeaders }
      );
      const projectsData = projectsResponse?.data?.all_projects || [];
      setProjects(projectsData);

      // Load professionals
      const professionalsResponse = await axios.get(
        "http://localhost:8000/api/data_management/all_professionals/",
        { headers: currentHeaders }
      );
      const professionalsData = professionalsResponse?.data?.all_professionals || [];
      setProfessionals(professionalsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => {
    if (defaultProjectId) setProjectId(defaultProjectId);
    if (defaultProfessionalId) {
      setProfessionalId(defaultProfessionalId);
      onProfessionalSelect(defaultProfessionalId);
    }
    setShow(true);
  };

  const onProfessionalSelect = (id) => {
    setProfessionalId(id);
    if (!id) {
      setLockedByProfessional(false);
      return;
    }
    const prof = professionals.find((p) => String(p.professional_id) === String(id));
    if (!prof) {
      setLockedByProfessional(false);
      return;
    }
    setFullname(prof.fullname || "");
    setAddress(prof.address || "");
    setEmail(prof.email || "");
    setPhone((prof.phone || "").replace(/\D/g, ""));
    setMobile((prof.mobile || "").replace(/\D/g, ""));
    setProfession((prof.profession && (prof.profession.title || prof.profession)) || "");
    setReliability(prof.reliability || "");
    setCity((prof.city && (prof.city.title || prof.city.name || prof.city)) || "");
    setLockedByProfessional(true);
  };

  // Validation
  const isClientcontIdValid = clientcontId.trim().length >= 2 && clientcontId.trim().length <= 10;
  const isFullnameValid = fullname.trim().length >= 2 && fullname.trim().length <= 40;
  const isAddressValid = !address || (address.trim().length >= 2 && address.trim().length <= 80);
  const isEmailValid = validateEmail(email);
  const normalizedPhone = phone ? ('+' + (phone || '').replace(/\D/g, '')) : '';
  const normalizedMobile = mobile ? ('+' + (mobile || '').replace(/\D/g, '')) : '';
  const isPhoneValid = !phone || phoneRegex.test(normalizedPhone);
  const isMobileValid = phoneRegex.test(normalizedMobile);
  const isProfessionValid = !profession || (profession.trim().length >= 2 && profession.trim().length <= 40);
  const isReliabilityValid = true; // optional
  const isCityValid = city.trim().length >= 2 && city.trim().length <= 40;
  const isProjectValid = projectId !== "";

  const isFormValid = isClientcontIdValid && isFullnameValid && isAddressValid && 
                     isEmailValid && isPhoneValid && isMobileValid && 
                     isProfessionValid && isCityValid && isProjectValid;

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const clientContactData = {
      clientcont_id: clientcontId.trim(),
      fullname: fullname.trim(),
      fathername: fathername.trim() || null,
      mothername: mothername.trim() || null,
      connection: connection.trim() || null,
      address: address.trim() || null,
      email: email.trim() || null,
      phone: normalizedPhone || null,
      mobile: normalizedMobile,
      profession: profession.trim() || null,
      reliability: reliability || null,
      city: city.trim(),
      project_id: projectId,
      professional_id: professionalId || null,
      active,
      notes: notes.trim() || null,
    };

    try {
      await axios.post(
        ADD_CLIENT_CONTACT,
        clientContactData,
        { headers: currentHeaders }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Client contact created successfully!",
      });

      handleClose();
      
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error("Error creating client contact:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create client contact.",
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Client Contact
      </Button>

      <Modal
        show={show}
        size="xl"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Client Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Client Contact ID *</Form.Label>
                      <Form.Control
                        type="text"
                        value={clientcontId}
                        onChange={(e) => setClientcontId(clampLen(e.target.value, 10))}
                        maxLength={10}
                        placeholder="Enter client contact ID"
                      />
                      <Form.Text className="text-muted">
                        {clientcontId.length}/10 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(clampLen(e.target.value, 40))}
                        maxLength={40}
                        placeholder="Enter full name"
                        disabled={lockedByProfessional}
                      />
                      <Form.Text className="text-muted">
                        {fullname.length}/40 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Father fullname</Form.Label>
                      <Form.Control
                        type="text"
                        value={fathername}
                        onChange={(e) => setFathername(clampLen(e.target.value, 80))}
                        maxLength={80}
                        placeholder="Enter father's name"
                      />
                      <Form.Text className="text-muted">
                        {fathername.length}/80 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mother fullname</Form.Label>
                      <Form.Control
                        type="text"
                        value={mothername}
                        onChange={(e) => setMothername(clampLen(e.target.value, 80))}
                        maxLength={80}
                        placeholder="Enter mother's name"
                      />
                      <Form.Text className="text-muted">
                        {mothername.length}/80 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Connection</Form.Label>
                      <Form.Control
                        type="text"
                        value={connection}
                        onChange={(e) => setConnection(clampLen(e.target.value, 40))}
                        maxLength={40}
                        placeholder="Enter connection type"
                      />
                      <Form.Text className="text-muted">
                        {connection.length}/40 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        value={city}
                        onChange={(e) => setCity(clampLen(e.target.value, 40))}
                        maxLength={40}
                        placeholder="Enter city"
                        disabled={lockedByProfessional}
                      />
                      <Form.Text className="text-muted">
                        {city.length}/40 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address *</Form.Label>
                      <Form.Control
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(clampLen(e.target.value, 80))}
                        maxLength={80}
                        placeholder="Enter address"
                        disabled={lockedByProfessional}
                      />
                      <Form.Text className="text-muted">
                        {address.length}/80 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail *</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        disabled={lockedByProfessional}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Profession *</Form.Label>
                      <Form.Control
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(clampLen(e.target.value, 40))}
                        maxLength={40}
                        placeholder="Enter profession"
                        disabled={lockedByProfessional}
                      />
                      <Form.Text className="text-muted">
                        {profession.length}/40 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone *</Form.Label>
                      <PhoneInput
                        country={'gr'}
                        value={phone}
                        onChange={(val) => setPhone(val)}
                        enableSearch
                        countryCodeEditable={false}
                        inputProps={{ name: 'phone' }}
                        disabled={lockedByProfessional}
                      />
                      <Form.Text className="text-muted">
                        {phone.length}/16 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cell phone *</Form.Label>
                      <PhoneInput
                        country={'gr'}
                        value={mobile}
                        onChange={(val) => setMobile(val)}
                        enableSearch
                        countryCodeEditable={false}
                        inputProps={{ name: 'mobile' }}
                        disabled={lockedByProfessional}
                      />
                      <Form.Text className="text-muted">
                        {mobile.length}/16 characters
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Reliability</Form.Label>
                      <Form.Control
                        as="select"
                        value={reliability}
                        onChange={(e) => setReliability(e.target.value)}
                        disabled={lockedByProfessional}
                      >
                        <option value="">Select reliability level</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Project *</Form.Label>
                      <Form.Control
                        as="select"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        disabled={lockProject}
                      >
                        <option value="">Select project</option>
                        {projects.map((project) => (
                          <option key={project.project_id} value={project.project_id}>
                            {project.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Professional</Form.Label>
                      <Form.Control
                        as="select"
                        value={professionalId}
                        onChange={(e) => onProfessionalSelect(e.target.value)}
                        disabled={lockProfessional}
                      >
                        <option value="">Select professional (optional)</option>
                        {professionals.map((professional) => (
                          <option key={professional.professional_id} value={professional.professional_id}>
                            {professional.fullname}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Active"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter notes"
                      />
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
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isClientcontIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Client Contact ID is required (2–10 chars).
                  </li>
                )}
                {!isFullnameValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Full name is required (2–40 chars).
                  </li>
                )}
                {!isAddressValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Address is required (2–80 chars).
                  </li>
                )}
                {!isEmailValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Valid e-mail is required.
                  </li>
                )}
                {!isPhoneValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Telephone is required (7–15 chars).
                  </li>
                )}
                {!isMobileValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Cell phone is required (7–15 chars).
                  </li>
                )}
                {!isProfessionValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Profession is required (2–40 chars).
                  </li>
                )}
                {!isReliabilityValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Reliability is required.
                  </li>
                )}
                {!isCityValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    City is required (2–40 chars).
                  </li>
                )}
                {!isProjectValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Project is required.
                  </li>
                )}
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
            Close
          </Button>
          <Button
            color="green"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddClientContactModal;
