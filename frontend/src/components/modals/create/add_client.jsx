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
const ADD_CLIENT = "http://localhost:8000/api/data_management/clients/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);
const validateEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function AddClientModal({ onClientCreated }) {
  const [show, setShow] = useState(false);

  // Basic Information
  const [clientId, setClientId] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [onoma, setOnoma] = useState("");
  const [eponymo, setEponymo] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [mobile1, setMobile1] = useState("");
  const [mobile2, setMobile2] = useState("");
  const [address, setAddress] = useState("");
  const [postalcode, setPostalcode] = useState("");
  
  // Location Information (Required Foreign Keys)
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  
  // Personal Information
  const [birthdate, setBirthdate] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [fathername, setFathername] = useState("");
  const [mothername, setMothername] = useState("");
  const [maritalstatus, setMaritalstatus] = useState("");
  const [deceased, setDeceased] = useState(false);
  const [deceasedate, setDeceasedate] = useState("");
  const [profession, setProfession] = useState("");
  
  // Tax Information
  const [afm, setAfm] = useState("");
  const [sin, setSin] = useState("");
  const [amka, setAmka] = useState("");
  const [taxmanagement, setTaxmanagement] = useState(false);
  const [taxrepresentation, setTaxrepresentation] = useState(false);
  const [taxrepresentative, setTaxrepresentative] = useState("");
  const [retired, setRetired] = useState(false);
  
  // Passport Information
  const [passportcountry, setPassportcountry] = useState("");
  const [passportnumber, setPassportnumber] = useState("");
  const [passportexpiredate, setPassportexpiredate] = useState("");
  const [policeid, setPoliceid] = useState("");
  
  // Pension Information
  const [pensioncountry1, setPensioncountry1] = useState("");
  const [insucarrier1, setInsucarrier1] = useState("");
  const [pensioninfo1, setPensioninfo1] = useState("");
  const [pensioncountry2, setPensioncountry2] = useState("");
  const [insucarrier2, setInsucarrier2] = useState("");
  const [pensioninfo2, setPensioninfo2] = useState("");
  
  // System Information
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");

  // Dropdown Data
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [insuranceCarriers, setInsuranceCarriers] = useState([]);

  const resetForm = () => {
    setClientId("");
    setSurname("");
    setName("");
    setOnoma("");
    setEponymo("");
    setEmail("");
    setPhone1("");
    setPhone2("");
    setMobile1("");
    setMobile2("");
    setAddress("");
    setPostalcode("");
    setCountry("");
    setProvince("");
    setCity("");
    setBirthdate("");
    setBirthplace("");
    setFathername("");
    setMothername("");
    setMaritalstatus("");
    setDeceased(false);
    setDeceasedate("");
    setAfm("");
    setSin("");
    setAmka("");
    setPassportcountry("");
    setPassportnumber("");
    setPassportexpiredate("");
    setPoliceid("");
    setProfession("");
    setTaxmanagement(false);
    setTaxrepresentation(false);
    setTaxrepresentative("");
    setRetired(false);
    setPensioncountry1("");
    setInsucarrier1("");
    setPensioninfo1("");
    setPensioncountry2("");
    setInsucarrier2("");
    setPensioninfo2("");
    setActive(true);
    setNotes("");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    resetForm();
    // Generate a default client ID based on current timestamp
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
    if (country) {
      loadProvinces(country);
    } else {
      setProvinces([]);
      setCities([]);
    }
  }, [country]);

  // Load cities when province changes
  useEffect(() => {
    if (province) {
      loadCities(province);
    } else {
      setCities([]);
    }
  }, [province]);

  const loadDropdownData = async () => {
    try {
      console.log('Loading dropdown data...');
      console.log('Loading dropdown data...');
      
      // Load reference data for dropdowns using axios
      const authHeaders = { headers: { ...headers, Authorization: "Token " + localStorage.getItem("userToken") } };
      const [countriesRes, insuranceCarriersRes] = await Promise.all([
        axios.get("http://localhost:8000/api/regions/all_countries/", authHeaders),
        axios.get("http://localhost:8000/api/administration/all_insurance_carriers/", authHeaders)
      ]);
      
      console.log('Raw API responses:', {
        countries: countriesRes,
        insuranceCarriers: insuranceCarriersRes
      });
      
      // Handle the response structure correctly
      // Countries API returns {"all_countries": [...]}
      const countriesData = countriesRes?.data?.all_countries || [];
      
      // Insurance carriers API returns {"all_insurance_carriers": [...]}
      const insuranceCarriersData = insuranceCarriersRes?.data?.all_insurance_carriers || [];
      
      console.log('Processed data:', {
        countries: countriesData,
        insuranceCarriers: insuranceCarriersData
      });
      
      setCountries(countriesData);
      setInsuranceCarriers(insuranceCarriersData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      // Set empty arrays to prevent map errors
      setCountries([]);
      setInsuranceCarriers([]);
    }
  };

  const loadProvinces = async (countryId) => {
    try {
      console.log('Loading provinces for country:', countryId);
      const response = await axios.get(`http://localhost:8000/api/regions/all_provinces/?country=${countryId}`,
        { headers: { ...headers, Authorization: "Token " + localStorage.getItem("userToken") } }
      );
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
      const response = await axios.get(`http://localhost:8000/api/regions/all_cities/?province=${provinceId}`,
        { headers: { ...headers, Authorization: "Token " + localStorage.getItem("userToken") } }
      );
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

  // Validation (required per backend model)
  const isClientIdValid = clientId.trim().length >= 2 && clientId.trim().length <= 10;
  const isSurnameValid = surname.trim().length >= 2 && surname.trim().length <= 40;
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 40;
  const isOnomaValid = onoma.trim().length >= 2 && onoma.trim().length <= 40;
  const isEponymoValid = eponymo.trim().length >= 2 && eponymo.trim().length <= 40;
  const isAddressValid = address.trim().length >= 2 && address.trim().length <= 120;
  const isPostalCodeValid = postalcode.trim().length >= 1 && postalcode.trim().length <= 10;
  const isEmailValid = validateEmail(email);
  const isPhone1Valid = !phone1 || phone1.replace(/\D/g, '').length >= 7;
  const isPhone2Valid = !phone2 || phone2.replace(/\D/g, '').length >= 7;
  const isMobile1Valid = mobile1.replace(/\D/g, '').length >= 7;
  const isMobile2Valid = !mobile2 || mobile2.replace(/\D/g, '').length >= 7;
  const isCountryValid = country.length > 0;
  const isProvinceValid = province.length > 0;
  const isCityValid = city.length > 0;
  // Personal required fields
  const isBirthdateValid = !!birthdate;
  const isBirthplaceValid = birthplace.trim().length >= 1 && birthplace.trim().length <= 60;
  const isFathernameValid = fathername.trim().length >= 1 && fathername.trim().length <= 80;
  const isMothernameValid = mothername.trim().length >= 1 && mothername.trim().length <= 80;
  // AFM optional; SIN required; AMKA optional
  const isAfmValid = !afm || (afm.length === 9 && /^\d{9}$/.test(afm));
  const isSinValid = sin.length === 9 && /^\d{9}$/.test(sin);
  const isAmkaValid = !amka || (amka.length === 11 && /^\d{11}$/.test(amka));
  // Passport required
  const isPassportCountryValid = passportcountry.length > 0;
  const isPassportNumberValid = passportnumber.trim().length >= 1 && passportnumber.trim().length <= 15;
  const isPassportExpireValid = !!passportexpiredate;

  const isFormValid = isClientIdValid && isSurnameValid && isNameValid && isOnomaValid &&
                     isEponymoValid && isAddressValid && isPostalCodeValid && isEmailValid &&
                     isPhone1Valid && isPhone2Valid && isMobile1Valid && isMobile2Valid &&
                     isCountryValid && isProvinceValid && isCityValid &&
                     isBirthdateValid && isBirthplaceValid && isFathernameValid && isMothernameValid &&
                     isAfmValid && isSinValid && isAmkaValid &&
                     isPassportCountryValid && isPassportNumberValid && isPassportExpireValid;

  const createNewClient = async () => {
    try {
      // Update headers with current token
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      await axios({
        method: "post",
        url: ADD_CLIENT,
        headers: currentHeaders,
        data: {
          // Required fields
          client_id: clientId.trim(),
          surname: surname.trim(),
          name: name.trim(),
          onoma: onoma.trim(),
          eponymo: eponymo.trim(),
          address: address.trim(),
          postalcode: postalcode.trim(),
          country_id: country,
          province_id: province,
          city_id: city,
          registrationdate: new Date().toISOString().split('T')[0], // Today's date
          registrationuser: localStorage.getItem('username') || 'testuser', // Current user
          
          // Optional fields
          email: email.trim() || null,
          phone1: phone1 ? ('+' + phone1.replace(/\D/g, '')) : null,
          phone2: phone2 ? ('+' + phone2.replace(/\D/g, '')) : null,
          mobile1: mobile1 ? ('+' + mobile1.replace(/\D/g, '')) : null,
          mobile2: mobile2 ? ('+' + mobile2.replace(/\D/g, '')) : null,
          birthdate: birthdate || null,
          birthplace: birthplace.trim() || null,
          fathername: fathername.trim() || null,
          mothername: mothername.trim() || null,
          maritalstatus: maritalstatus || null,
          deceased: deceased,
          deceasedate: deceasedate || null,
          afm: afm.trim() || null,
          sin: sin.trim() || null,
          amka: amka.trim() || null,
          passportcountry_id: passportcountry || null,
          passportnumber: passportnumber.trim() || null,
          passportexpiredate: passportexpiredate || null,
          policeid: policeid.trim() || null,
          profession: profession.trim() || null,
          taxmanagement: taxmanagement,
          taxrepresentation: taxrepresentation,
          taxrepresentative: taxrepresentative.trim() || null,
          retired: retired,
          pensioncountry1_id: pensioncountry1 || null,
          insucarrier1_id: insucarrier1 || null,
          pensioninfo1: pensioninfo1.trim() || null,
          pensioncountry2_id: pensioncountry2 || null,
          insucarrier2_id: insucarrier2 || null,
          pensioninfo2: pensioninfo2.trim() || null,
          active: active,
          notes: notes.trim() || null,
        },
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Client created successfully!",
      });

      // Refresh the parent component if callback provided
      if (onClientCreated) {
        onClientCreated();
      }
    } catch (e) {
      console.error('Client creation error:', e.response?.data);
      const apiMsg =
        e?.response?.data?.errormsg ||
        e?.response?.data?.detail ||
        e?.response?.data ||
        "Something went wrong while creating the client.";
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
        Create new Client
      </Button>

      <Modal
        show={show}
        size="xl"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new Client</Modal.Title>
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
                      <Form.Label>Client ID *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., CL001"
                        onChange={(e) => setClientId(clampLen(e.target.value.toUpperCase(), 10))}
                        value={clientId}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                  <Form.Group className="mb-3">
                      <Form.Label>Name:</Form.Label>
                      <Form.Control
                        maxLength={40}
                        placeholder="e.g., John"
                        onChange={(e) => setName(clampLen(e.target.value, 40))}
                        value={name}
                      />
                    </Form.Group>

                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                  <Form.Group className="mb-3">
                      <Form.Label>Surname:</Form.Label>
                      <Form.Control
                        maxLength={40}
                        placeholder="e.g., Smith"
                        onChange={(e) => setSurname(clampLen(e.target.value, 40))}
                        value={surname}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>GrName:</Form.Label>
                      <Form.Control
                        maxLength={40}
                        placeholder="e.g., Ioannis"
                        onChange={(e) => setOnoma(clampLen(e.target.value, 40))}
                        value={onoma}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>GrSurname:</Form.Label>
                      <Form.Control
                        maxLength={40}
                        placeholder="e.g., Papadopoulos"
                        onChange={(e) => setEponymo(clampLen(e.target.value, 40))}
                        value={eponymo}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Profession:</Form.Label>
                      <Form.Control
                        maxLength={40}
                        placeholder="e.g., Engineer"
                        onChange={(e) => setProfession(clampLen(e.target.value, 40))}
                        value={profession}
                      />
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
                        onChange={(e) => {
                          const newCountry = e.target.value;
                          setCountry(newCountry);
                          // Reset dependent fields when country changes
                          setProvince("");
                          setCity("");
                        }}
                        value={country}
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
                        onChange={(e) => {
                          const newProvince = e.target.value;
                          setProvince(newProvince);
                          // Reset dependent field when province changes
                          setCity("");
                        }}
                        value={province}
                        disabled={!country}
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
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        disabled={!province}
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
                      <Form.Label>Address *:</Form.Label>
                      <Form.Control
                        maxLength={120}
                        placeholder="e.g., 123 Main Street"
                        onChange={(e) => setAddress(clampLen(e.target.value, 120))}
                        value={address}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP / PC *:</Form.Label>
                      <Form.Control
                        maxLength={10}
                        placeholder="e.g., 12345"
                        onChange={(e) => setPostalcode(clampLen(e.target.value, 10))}
                        value={postalcode}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Contact Information */}
                <h6 className="mb-3 mt-4">Contact Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail:</Form.Label>
                      <Form.Control
                        type="email"
                        maxLength={100}
                        placeholder="e.g., john.smith@example.com"
                        onChange={(e) => setEmail(clampLen(e.target.value, 100))}
                        value={email}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone 1:</Form.Label>
                      <PhoneInput
                        country={'gr'}
                        value={phone1}
                        onChange={(val) => setPhone1(val)}
                        enableSearch
                        countryCodeEditable={false}
                        inputProps={{ name: 'phone1' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telephone 2:</Form.Label>
                      <PhoneInput
                        country={'gr'}
                        value={phone2}
                        onChange={(val) => setPhone2(val)}
                        enableSearch
                        countryCodeEditable={false}
                        inputProps={{ name: 'phone2' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cell phone 1:</Form.Label>
                      <PhoneInput
                        country={'gr'}
                        value={mobile1}
                        onChange={(val) => setMobile1(val)}
                        enableSearch
                        countryCodeEditable={false}
                        inputProps={{ name: 'mobile1' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cell phone 2:</Form.Label>
                      <PhoneInput
                        country={'gr'}
                        value={mobile2}
                        onChange={(val) => setMobile2(val)}
                        enableSearch
                        countryCodeEditable={false}
                        inputProps={{ name: 'mobile2' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Personal Information */}
                <h6 className="mb-3 mt-4">Personal Information</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Birthdate:</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setBirthdate(e.target.value)}
                        value={birthdate}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Birthplace:</Form.Label>
                      <Form.Control
                        maxLength={60}
                        placeholder="e.g., Athens, Greece"
                        onChange={(e) => setBirthplace(clampLen(e.target.value, 60))}
                        value={birthplace}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Father fullname:</Form.Label>
                      <Form.Control
                        maxLength={80}
                        placeholder="e.g., Michael Smith"
                        onChange={(e) => setFathername(clampLen(e.target.value, 80))}
                        value={fathername}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mother fullname:</Form.Label>
                      <Form.Control
                        maxLength={80}
                        placeholder="e.g., Maria Smith"
                        onChange={(e) => setMothername(clampLen(e.target.value, 80))}
                        value={mothername}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Marital status:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setMaritalstatus(e.target.value)}
                        value={maritalstatus}
                      >
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Common law">Common law</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="deceased-switch"
                        label="Deceased"
                        checked={deceased}
                        onChange={(e) => setDeceased(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {deceased && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Deceased Date:</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={(e) => setDeceasedate(e.target.value)}
                          value={deceasedate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {/* Tax Information */}
                <h6 className="mb-3 mt-4">Tax Information</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>TIN-GR:</Form.Label>
                      <Form.Control
                        maxLength={9}
                        placeholder="e.g., 123456789"
                        onChange={(e) => setAfm(clampLen(e.target.value.replace(/\D/g, ''), 9))}
                        value={afm}
                      />
                      <Form.Text className="text-muted">
                        Must be exactly 9 digits
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>TIN:</Form.Label>
                      <Form.Control
                        maxLength={9}
                        placeholder="e.g., 123456789"
                        onChange={(e) => setSin(clampLen(e.target.value.replace(/\D/g, ''), 9))}
                        value={sin}
                      />
                      <Form.Text className="text-muted">
                        Must be exactly 9 digits
                      </Form.Text>
                    </Form.Group>
                  </Col>
                                     <Col md={4}>
                     <Form.Group className="mb-3">
                       <Form.Label>AMKA:</Form.Label>
                       <Form.Control
                         maxLength={11}
                         placeholder="e.g., 12345678901"
                         onChange={(e) => setAmka(clampLen(e.target.value.replace(/\D/g, ''), 11))}
                         value={amka}
                       />
                       <Form.Text className="text-muted">
                         Must be exactly 11 digits
                       </Form.Text>
                     </Form.Group>
                   </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="taxmanagement-switch"
                        label="Tax Management"
                        checked={taxmanagement}
                        onChange={(e) => setTaxmanagement(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="taxrepresentation-switch"
                        label="Tax Representation"
                        checked={taxrepresentation}
                        onChange={(e) => setTaxrepresentation(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="retired-switch"
                        label="Retired"
                        checked={retired}
                        onChange={(e) => setRetired(e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {taxrepresentation && (
                  <Form.Group className="mb-3">
                    <Form.Label>Tax Representative:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      maxLength={200}
                      placeholder="e.g., Tax representative details"
                      onChange={(e) => setTaxrepresentative(clampLen(e.target.value, 200))}
                      value={taxrepresentative}
                    />
                  </Form.Group>
                )}

                {/* Passport Information */}
                <h6 className="mb-3 mt-4">Passport Information</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Passport Country:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setPassportcountry(e.target.value)}
                        value={passportcountry}
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
                      <Form.Label>Passport Number:</Form.Label>
                      <Form.Control
                        maxLength={15}
                        placeholder="e.g., A12345678"
                        onChange={(e) => setPassportnumber(clampLen(e.target.value, 15))}
                        value={passportnumber}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Passport Expiry Date:</Form.Label>
                      <Form.Control
                        type="date"
                        onChange={(e) => setPassportexpiredate(e.target.value)}
                        value={passportexpiredate}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>GR ID Number:</Form.Label>
                      <Form.Control
                        maxLength={15}
                        placeholder="e.g., AB123456"
                        onChange={(e) => setPoliceid(clampLen(e.target.value, 15))}
                        value={policeid}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Pension Information */}
                <h6 className="mb-3 mt-4">Pension Information</h6>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country 1:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setPensioncountry1(e.target.value)}
                        value={pensioncountry1}
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
                      <Form.Label>Public Insurance 1:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setInsucarrier1(e.target.value)}
                        value={insucarrier1}
                      >
                        <option value="">Select Insurance Carrier</option>
                        {Array.isArray(insuranceCarriers) && insuranceCarriers.map((carrier) => (
                          <option key={carrier.insucarrier_id} value={carrier.insucarrier_id}>
                            {carrier.insucarrier_id} - {carrier.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pension Info 1:</Form.Label>
                      <Form.Control
                        maxLength={80}
                        placeholder="e.g., Primary pension details"
                        onChange={(e) => setPensioninfo1(clampLen(e.target.value, 80))}
                        value={pensioninfo1}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country 2:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setPensioncountry2(e.target.value)}
                        value={pensioncountry2}
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
                      <Form.Label>Public Insurance 2:</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={(e) => setInsucarrier2(e.target.value)}
                        value={insucarrier2}
                      >
                        <option value="">Select Insurance Carrier</option>
                        {Array.isArray(insuranceCarriers) && insuranceCarriers.map((carrier) => (
                          <option key={carrier.insucarrier_id} value={carrier.insucarrier_id}>
                            {carrier.insucarrier_id} - {carrier.title}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pension Info 2:</Form.Label>
                      <Form.Control
                        maxLength={80}
                        placeholder="e.g., Secondary pension details"
                        onChange={(e) => setPensioninfo2(clampLen(e.target.value, 80))}
                        value={pensioninfo2}
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
                    placeholder="Additional notes about the client"
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
                {!isClientIdValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Client ID is required (2–10 chars).
                  </li>
                )}
                {!isSurnameValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Surname is required (2–40 chars).
                  </li>
                )}
                {!isNameValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Name is required (2–40 chars).
                  </li>
                )}
                {!isOnomaValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Greek Name (Onoma) is required (2–40 chars).
                  </li>
                )}
                {!isEponymoValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Greek Surname (Eponymo) is required (2–40 chars).
                  </li>
                )}
                {!isAddressValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Address is required (2–120 chars).
                  </li>
                )}
                {!isPostalCodeValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Postal Code is required (1–10 chars).
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
                {!isAfmValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    AFM must be exactly 9 digits.
                  </li>
                )}
                {!isSinValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     SIN is required and must be exactly 9 digits.
                   </li>
                 )}
                {!isAmkaValid && (
                   <li>
                     <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                     AMKA must be exactly 11 digits.
                   </li>
                )}
                {!isBirthdateValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Birth date is required.
                  </li>
                )}
                {!isBirthplaceValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Birth place is required (1–60 chars).
                  </li>
                )}
                {!isFathernameValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Father's name is required (1–80 chars).
                  </li>
                )}
                {!isMothernameValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Mother's name is required (1–80 chars).
                  </li>
                )}
                {!isPassportCountryValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Passport Country is required.
                  </li>
                )}
                {!isPassportNumberValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Passport Number is required (max 15 chars).
                  </li>
                )}
                {!isPassportExpireValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Passport Expiry Date is required.
                  </li>
                )}
                 {!isEmailValid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Email must be a valid email address.
                  </li>
                )}
                {!isPhone1Valid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Phone 1 must be at least 7 characters if provided.
                  </li>
                )}
                {!isPhone2Valid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Phone 2 must be at least 7 characters if provided.
                  </li>
                )}
                {!isMobile1Valid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Mobile 1 is required and must be at least 7 digits.
                  </li>
                )}
                {!isMobile2Valid && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Mobile 2 must be at least 7 characters if provided.
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
              createNewClient();
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

export default AddClientModal; 