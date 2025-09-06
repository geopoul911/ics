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

// API endpoint
const ADD_CASH = "http://localhost:8000/api/data_management/cash/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

function AddCashModal({ onCashCreated, refreshData, defaultProjectId, lockProject = false, defaultConsultantId, lockConsultant = false }) {
  const [show, setShow] = useState(false);

  // Basic Information
  const [cashId, setCashId] = useState("");
  const [project, setProject] = useState("");
  const [country, setCountry] = useState("");
  const [trandate, setTrandate] = useState("");
  const [consultant, setConsultant] = useState("");
  const [kind, setKind] = useState("E"); // Default to Expense
  const [amountexp, setAmountexp] = useState("");
  const [amountpay, setAmountpay] = useState("");
  const [reason, setReason] = useState("");

  // Dropdown Data
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const resetForm = () => {
    setCashId("");
    setProject("");
    setCountry("");
    setTrandate("");
    setConsultant("");
    setKind("E");
    setAmountexp("");
    setAmountpay("");
    setReason("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    if (defaultProjectId) setProject(defaultProjectId);
    if (defaultConsultantId) setConsultant(defaultConsultantId);
    setShow(true);
  };

  // Load dropdown data when modal opens
  useEffect(() => {
    if (show) {
      loadDropdownData();
    }
  }, [show]);

  // Clear the irrelevant amount field when kind changes
  useEffect(() => {
    if (kind === "E") {
      setAmountpay("");
    } else if (kind === "P") {
      setAmountexp("");
    }
  }, [kind]);

  const loadDropdownData = async () => {
    try {
      console.log('Loading dropdown data...');

      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      // Load reference data for dropdowns using axios
      const [projectsRes, countriesRes, consultantsRes] = await Promise.all([
        axios.get("http://localhost:8000/api/data_management/all_projects/", { headers: currentHeaders }),
        axios.get("http://localhost:8000/api/regions/all_countries/", { headers: currentHeaders }),
        axios.get("http://localhost:8000/api/administration/all_consultants/", { headers: currentHeaders })
      ]);

      console.log('Raw API responses:', {
        projects: projectsRes,
        countries: countriesRes,
        consultants: consultantsRes
      });

      // Handle the response structure correctly
      const projectsData = projectsRes?.data?.all_projects || [];
      const countriesData = countriesRes?.data?.all_countries || [];
      const consultantsData = consultantsRes?.data?.all_consultants || [];

      console.log('Processed data:', {
        projects: projectsData,
        countries: countriesData,
        consultants: consultantsData
      });

      setProjects(projectsData);
      setCountries(countriesData);
      setConsultants(consultantsData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      // Set empty arrays to prevent map errors
      setProjects([]);
      setCountries([]);
      setConsultants([]);
    }
  };

  // Validation
  const isCashIdValid = cashId.trim().length >= 2 && cashId.trim().length <= 10;
  const isProjectValid = project.length > 0;
  const isCountryValid = country.length > 0;
  const isTrandateValid = trandate.length > 0;
  const isConsultantValid = consultant.length > 0;
  const isReasonValid = reason.trim().length >= 1 && reason.trim().length <= 120;

  const isFormValid = isCashIdValid && isProjectValid && isCountryValid && isTrandateValid && isConsultantValid && isReasonValid;

  const createNewCash = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios({
        method: "post",
        url: ADD_CASH,
        headers: currentHeaders,
        data: {
          // Required fields
          cash_id: cashId.trim(),
          project_id: project,
          country_id: country,
          trandate: trandate,
          consultant_id: consultant,
          kind: kind,

          // Optional fields
          amountexp: kind === 'E' ? (amountexp.trim() || null) : null,
          amountpay: kind === 'P' ? (amountpay.trim() || null) : null,
          reason: reason.trim() || null,
        },
      });

      if (refreshData) {
        setShow(false);
        refreshData();
      } else {
        // legacy behavior: navigate to overview
        const newId = cashId.trim();
        window.location.href = `/data_management/cash/${newId}`;
      }
    } catch (e) {
      console.error('Cash creation error:', e.response?.data);
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        e?.response?.data ||
        "Something went wrong while creating the cash entry.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: typeof apiMsg === 'object' ? JSON.stringify(apiMsg) : apiMsg,
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Cash entry
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Cash entry</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                {/* Basic information */}
                <h6 className="mb-3">Basic information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cash ID *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., CA001"
                        onChange={(e) => setCashId(clampLen(e.target.value.toUpperCase(), 10))}
                        value={cashId}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Project *:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setProject(e.target.value)}
                        value={project}
                        disabled={lockProject}
                      >
                        <option value="">Select project</option>
                        {Array.isArray(projects) && projects.map((project) => (
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
                      <Form.Label>Country *:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                      >
                        <option value="">Select country</option>
                        {Array.isArray(countries) && countries.map((country) => (
                          <option key={country.country_id} value={country.country_id}>
                            {country.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Transaction date *:</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setTrandate(e.target.value)}
                        value={trandate}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Consultant *:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setConsultant(e.target.value)}
                        value={consultant}
                        disabled={lockConsultant}
                      >
                        <option value="">Select consultant</option>
                        {Array.isArray(consultants) && consultants.map((consultant) => (
                          <option key={consultant.consultant_id} value={consultant.consultant_id}>
                            {consultant.fullname}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Kind:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setKind(e.target.value)}
                        value={kind}
                      >
                        <option value="E">Expense</option>
                        <option value="P">Payment</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                {kind === 'E' && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount expense:</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="e.g., 100.00"
                          onChange={(e) => setAmountexp(e.target.value)}
                          value={amountexp}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                {kind === 'P' && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount payment:</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="e.g., 100.00"
                          onChange={(e) => setAmountpay(e.target.value)}
                          value={amountpay}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Reason *:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Reason for the cash entry"
                    onChange={(e) => setReason(e.target.value)}
                    value={reason}
                  />
                </Form.Group>
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
                {!isCashIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Cash ID is required (2–10 chars).
                  </li>
                )}
                {!isProjectValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Project is required.
                  </li>
                )}
                {!isCountryValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Country is required.
                  </li>
                )}
                {!isTrandateValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Transaction date is required.
                  </li>
                )}
                {!isConsultantValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Consultant is required.
                  </li>
                )}
                {!isReasonValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Reason is required (1–120 chars).
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
            onClick={() => {
              handleClose();
              createNewCash();
            }}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCashModal;
