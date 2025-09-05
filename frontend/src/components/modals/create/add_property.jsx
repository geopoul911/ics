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
const ADD_PROPERTY = "http://localhost:8000/api/data_management/all_properties/";

// Helpers
const onlyAlphanumeric = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const clampLen = (value, max) => value.slice(0, max);

function AddPropertyModal({ onPropertyCreated }) {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [propertyId, setPropertyId] = useState(""); // maps to property_id
  const [description, setDescription] = useState(""); // required
  const [projectId, setProjectId] = useState(""); // required
  const [countryId, setCountryId] = useState(""); // required
  const [provinceId, setProvinceId] = useState(""); // required
  const [cityId, setCityId] = useState(""); // required
  const [location, setLocation] = useState(""); // optional per model
  const [type, setType] = useState(""); // required
  const [constructYear, setConstructYear] = useState(""); // optional
  const [status, setStatus] = useState(""); // optional
  const [market, setMarket] = useState(""); // optional
  const [broker, setBroker] = useState(""); // optional
  const [active, setActive] = useState(true); // optional, default true
  const [notes, setNotes] = useState(""); // optional

  const resetForm = () => {
    setPropertyId("");
    setDescription("");
    setProjectId("");
    setCountryId("");
    setProvinceId("");
    setCityId("");
    setLocation("");
    setType("");
    setConstructYear("");
    setStatus("");
    setMarket("");
    setBroker("");
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

  // Load provinces when country changes
  useEffect(() => {
    if (countryId) {
      loadProvinces(countryId);
    } else {
      setProvinces([]);
      setCities([]);
    }
  }, [countryId]);

  // Load cities when province changes
  useEffect(() => {
    if (provinceId) {
      loadCities(provinceId);
    } else {
      setCities([]);
    }
  }, [provinceId]);

  const loadDropdownData = async () => {
    try {
      console.log('Loading dropdown data...');
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      // Load reference data for dropdowns using axios with auth
      const [projectsRes, countriesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/data_management/all_projects/", { headers: currentHeaders }),
        axios.get("http://localhost:8000/api/regions/all_countries/", { headers: currentHeaders })
      ]);
      
      console.log('Raw API responses:', {
        projects: projectsRes,
        countries: countriesRes
      });
      
      // Handle the response structure correctly
      // Projects API returns {"all_projects": [...]}
      const projectsData = projectsRes?.data?.all_projects || [];
      
      // Countries API returns {"all_countries": [...]}
      const countriesData = countriesRes?.data?.all_countries || [];
      
      console.log('Processed data:', {
        projects: projectsData,
        countries: countriesData
      });
      
      setProjects(projectsData);
      setCountries(countriesData);
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
    }
  };

  const loadProvinces = async (countryId) => {
    try {
      console.log('Loading provinces for country:', countryId);
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get(`http://localhost:8000/api/regions/all_provinces/?country=${countryId}`,{ headers: currentHeaders });
      console.log('Raw provinces response:', response);
      // Provinces API returns {"all_provinces": [...]}
      const provincesData = response?.data?.all_provinces || [];
      console.log('Processed provinces data:', provincesData);
      setProvinces(provincesData);
    } catch (error) {
      console.error('Error loading provinces:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setProvinces([]);
    }
  };

  const loadCities = async (provinceId) => {
    try {
      console.log('Loading cities for province:', provinceId);
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };
      const response = await axios.get(`http://localhost:8000/api/regions/all_cities/?province=${provinceId}`, { headers: currentHeaders });
      console.log('Raw cities response:', response);
      // Cities API returns {"all_cities": [...]}
      const citiesData = response?.data?.all_cities || [];
      console.log('Processed cities data:', citiesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Error loading cities:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setCities([]);
    }
  };

  // Validation
  const isPropertyIdValid = propertyId.length >= 2 && propertyId.length <= 10;
  const isDescriptionValid = description.trim().length >= 2 && description.trim().length <= 80;
  const isProjectValid = projectId !== "";
  const isCountryValid = countryId !== "";
  const isProvinceValid = provinceId !== "";
  const isCityValid = cityId !== "";
  const isTypeValid = type !== "";

  const isConstructYearValid = () => {
    if (String(constructYear).trim() === "") return true; // optional
    const y = parseInt(constructYear, 10);
    return Number.isInteger(y) && y >= 1800 && y <= 2100;
  };

  const isFormValid = isPropertyIdValid && isDescriptionValid && isProjectValid && 
                     isCountryValid && isProvinceValid && isCityValid && 
                     isTypeValid && isConstructYearValid();

  const createNewProperty = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const propertyData = {
        property_id: propertyId,
        description: description.trim(),
        project_id: projectId,
        country_id: countryId,
        province_id: provinceId,
        city_id: cityId,
        location: location.trim() || null,
        type: type,
        constructyear: constructYear.trim() || null,
        status: status || null,
        market: market || null,
        broker: broker.trim() || null,
        active: active,
        notes: notes.trim() || null,
      };

      const response = await axios.post(ADD_PROPERTY, propertyData, { headers: currentHeaders });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Property created successfully.",
        });

        // Navigate to the newly created property's overview
        const newId = propertyId;
        window.location.href = `/data_management/property/${newId}`;
      }
    } catch (error) {
      console.error("Error creating property:", error);

      let errorMessage = "An error occurred while creating the property.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data) {
        // Handle validation errors
        const errors = error.response.data;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        errorMessage = errorMessages;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  return (
    <>
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Property
      </Button>

      <Modal
        show={show}
        size="xl"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Property</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                {/* Basic Information */}
                <h6 className="mb-3">Basic Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Property ID *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., PR001"
                        onChange={(e) => setPropertyId(clampLen(onlyAlphanumeric(e.target.value), 10))}
                        value={propertyId}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description *:</Form.Label>
                      <Form.Control
                        maxLength={80}
                        placeholder="e.g., Beautiful apartment in city center"
                        onChange={(e) => setDescription(clampLen(e.target.value, 80))}
                        value={description}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Project *:</Form.Label>
                      <Form.Control
                        as="select"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                      >
                        <option value="">Select a project</option>
                        {Array.isArray(projects) && projects.map((project) => (
                          <option key={project.project_id} value={project.project_id}>
                            {project.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type *:</Form.Label>
                      <Form.Control
                        as="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select property type</option>
                        <option value="Plot">Plot</option>
                        <option value="Land">Land</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Store">Store</option>
                        <option value="Other">Other</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Location Information */}
                <h6 className="mb-3 mt-4">Location Information</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country *:</Form.Label>
                      <Form.Control
                        as="select"
                        value={countryId}
                        onChange={(e) => setCountryId(e.target.value)}
                      >
                        <option value="">Select Country</option>
                        {Array.isArray(countries) && countries.map((country) => (
                          <option key={country.country_id} value={country.country_id}>
                            {country.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Province *:</Form.Label>
                      <Form.Control
                        as="select"
                        value={provinceId}
                        onChange={(e) => setProvinceId(e.target.value)}
                        disabled={!countryId}
                      >
                        <option value="">Select Province</option>
                        {Array.isArray(provinces) && provinces.map((province) => (
                          <option key={province.province_id} value={province.province_id}>
                            {province.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *:</Form.Label>
                      <Form.Control
                        as="select"
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        disabled={!provinceId}
                      >
                        <option value="">Select City</option>
                        {Array.isArray(cities) && cities.map((city) => (
                          <option key={city.city_id} value={city.city_id}>
                            {city.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location :</Form.Label>
                      <Form.Control
                        maxLength={80}
                        placeholder="e.g., 123 Main Street"
                        onChange={(e) => setLocation(clampLen(e.target.value, 80))}
                        value={location}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Construction Year:</Form.Label>
                      <Form.Control
                        type="number"
                        min={1800}
                        max={2100}
                        step={1}
                        placeholder="Enter year"
                        onChange={(e) => setConstructYear(e.target.value)}
                        value={constructYear}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Property Details */}
                <h6 className="mb-3 mt-4">Property Details</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status:</Form.Label>
                      <Form.Control
                        as="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select status (optional)</option>
                        <option value="Empty">Empty</option>
                        <option value="Rented">Rented</option>
                        <option value="Unfinished">Unfinished</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Market:</Form.Label>
                      <Form.Control
                        as="select"
                        value={market}
                        onChange={(e) => setMarket(e.target.value)}
                      >
                        <option value="">Select market (optional)</option>
                        <option value="ShortTerm">Short Term</option>
                        <option value="LongTerm">Long Term</option>
                        <option value="Sale">Sale</option>
                        <option value="Wait">Wait</option>
                        <option value="Own">Own</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Broker:</Form.Label>
                      <Form.Control
                        maxLength={120}
                        placeholder="e.g., Broker name (optional)"
                        onChange={(e) => setBroker(clampLen(e.target.value, 120))}
                        value={broker}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* System Information */}
                <h6 className="mb-3 mt-4">System Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="active-switch"
                        label="Active"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Notes:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Additional notes about the property"
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
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isPropertyIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Property ID is required (2–10 chars).
                  </li>
                )}
                {!isDescriptionValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Description is required (2–80 chars).
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
                {!isProvinceValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Province is required.
                  </li>
                )}
                {!isCityValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    City is required.
                  </li>
                )}
                {!isTypeValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Type is required.
                  </li>
                )}
                {String(constructYear).trim() !== "" && !isConstructYearValid() && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Enter a valid Construction Year.
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
              createNewProperty();
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

export default AddPropertyModal;
