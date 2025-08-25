import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaSave, FaTimes, FaUser, FaMapMarkerAlt, FaPassport, FaPiggyBank } from 'react-icons/fa';
import { apiGet, API_ENDPOINTS } from '../../../utils/api';

// Validation utilities
import { validateEmail, validatePhone, validateTaxNumber, validatePostalCode } from '../../../utils/validation';

const ClientForm = ({ client = null, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    surname: '',
    onoma: '',
    eponymo: '',
    email: '',
    birthdate: '',
    birthplace: '',
    fathername: '',
    mothername: '',
    maritalstatus: '',
    deceased: false,
    deceasedate: '',
    
    // Contact Information
    address: '',
    postalcode: '',
    country_id: '',
    province_id: '',
    city_id: '',
    phone1: '',
    phone2: '',
    mobile1: '',
    mobile2: '',
    
    // Tax Information
    afm: '',
    sin: '',
    amka: '',
    profession: '',
    taxmanagement: false,
    taxrepresentation: false,
    taxrepresentative: '',
    retired: false,
    
    // Passport Information
    passportcountry_id: '',
    passportnumber: '',
    passportexpiredate: '',
    policeid: '',
    
    // Pension Information
    pensioncountry1_id: '',
    insucarrier1_id: '',
    pensioninfo1: '',
    pensioncountry2_id: '',
    insucarrier2_id: '',
    pensioninfo2: '',
    
    // System Information
    active: true,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    countries: [],
    provinces: [],
    cities: [],
    insuranceCarriers: []
  });

  // Load dropdown data
  useEffect(() => {
    loadDropdownData();
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const loadDropdownData = async () => {
    try {
      // Load reference data for dropdowns
      const [countries, provinces, cities, insuranceCarriers] = await Promise.all([
        apiGet(API_ENDPOINTS.REFERENCE_COUNTRIES),
        apiGet(API_ENDPOINTS.REFERENCE_PROVINCES),
        apiGet(API_ENDPOINTS.REFERENCE_CITIES),
        apiGet(API_ENDPOINTS.REFERENCE_INSURANCE_CARRIERS)
      ]);
      
      setDropdownData({
        countries,
        provinces,
        cities,
        insuranceCarriers
      });
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Handle cascading dropdowns
    if (name === 'country_id') {
      setFormData(prev => ({
        ...prev,
        province_id: '',
        city_id: ''
      }));
    } else if (name === 'province_id') {
      setFormData(prev => ({
        ...prev,
        city_id: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.onoma.trim()) newErrors.onoma = 'Greek name is required';
    if (!formData.eponymo.trim()) newErrors.eponymo = 'Greek surname is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.country_id) newErrors.country_id = 'Country is required';
    if (!formData.city_id) newErrors.city_id = 'City is required';

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    if (formData.phone1 && !validatePhone(formData.phone1)) {
      newErrors.phone1 = 'Invalid phone format';
    }
    if (formData.phone2 && !validatePhone(formData.phone2)) {
      newErrors.phone2 = 'Invalid phone format';
    }
    if (formData.mobile1 && !validatePhone(formData.mobile1)) {
      newErrors.mobile1 = 'Invalid mobile format';
    }
    if (formData.mobile2 && !validatePhone(formData.mobile2)) {
      newErrors.mobile2 = 'Invalid mobile format';
    }

    // Tax number validation
    if (formData.afm && !validateTaxNumber(formData.afm, 'GR')) {
      newErrors.afm = 'Invalid Greek tax number';
    }
    if (formData.sin && !validateTaxNumber(formData.sin, 'CA')) {
      newErrors.sin = 'Invalid Canadian tax number';
    }

    // Postal code validation
    if (formData.postalcode && !validatePostalCode(formData.postalcode, formData.country_id)) {
      newErrors.postalcode = 'Invalid postal code format';
    }

    // Date validations
    if (formData.birthdate && new Date(formData.birthdate) > new Date()) {
      newErrors.birthdate = 'Birth date cannot be in the future';
    }
    if (formData.passportexpiredate && new Date(formData.passportexpiredate) < new Date()) {
      newErrors.passportexpiredate = 'Passport has expired';
    }
    if (formData.deceased && formData.deceasedate && new Date(formData.deceasedate) < new Date(formData.birthdate)) {
      newErrors.deceasedate = 'Death date cannot be before birth date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/clients/${isEdit ? client.client_id : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const savedClient = await response.json();
        onSave(savedClient);
      } else {
        throw new Error('Failed to save client');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      setErrors({ submit: 'Failed to save client. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (name, label, type = 'text', options = null, required = false) => (
    <Form.Group as={Col} md={6} controlId={name}>
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      {type === 'select' ? (
        <Form.Select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          isInvalid={!!errors[name]}
        >
          <option value="">Select {label}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : type === 'checkbox' ? (
        <Form.Check
          type="checkbox"
          name={name}
          checked={formData[name]}
          onChange={handleInputChange}
          label={label}
        />
      ) : type === 'textarea' ? (
        <Form.Control
          as="textarea"
          rows={3}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          isInvalid={!!errors[name]}
        />
      ) : (
        <Form.Control
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          isInvalid={!!errors[name]}
          required={required}
        />
      )}
      <Form.Control.Feedback type="invalid">
        {errors[name]}
      </Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <div className="client-form">
      <Card>
        <Card.Header>
          <h4>
            <FaUser className="me-2" />
            {isEdit ? 'Edit Client' : 'New Client'}
          </h4>
        </Card.Header>
        <Card.Body>
          {errors.submit && (
            <Alert variant="danger" dismissible onClose={() => setErrors({})}>
              {errors.submit}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5><FaUser className="me-2" />Personal Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {renderField('name', 'Name (English)', 'text', null, true)}
                  {renderField('surname', 'Surname (English)', 'text', null, true)}
                  {renderField('onoma', 'Name (Greek)', 'text', null, true)}
                  {renderField('eponymo', 'Surname (Greek)', 'text', null, true)}
                  {renderField('email', 'Email', 'email')}
                  {renderField('birthdate', 'Birth Date', 'date')}
                  {renderField('birthplace', 'Birth Place', 'text')}
                  {renderField('fathername', 'Father\'s Name', 'text')}
                  {renderField('mothername', 'Mother\'s Name', 'text')}
                  {renderField('maritalstatus', 'Marital Status', 'select', [
                    { value: 'Single', label: 'Single' },
                    { value: 'Married', label: 'Married' },
                    { value: 'Common law', label: 'Common law' },
                    { value: 'Divorced', label: 'Divorced' },
                    { value: 'Widowed', label: 'Widowed' }
                  ])}
                  {renderField('deceased', 'Deceased', 'checkbox')}
                  {formData.deceased && renderField('deceasedate', 'Death Date', 'date')}
                </Row>
              </Card.Body>
            </Card>

            {/* Contact Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5><FaMapMarkerAlt className="me-2" />Contact Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {renderField('address', 'Address', 'text', null, true)}
                  {renderField('postalcode', 'Postal Code', 'text')}
                  {renderField('country_id', 'Country', 'select', 
                    dropdownData.countries?.map(c => ({ value: c.country_id, label: c.title })), true)}
                  {renderField('province_id', 'Province', 'select',
                    dropdownData.provinces?.filter(p => p.country_id === formData.country_id)
                      .map(p => ({ value: p.province_id, label: p.title })))}
                  {renderField('city_id', 'City', 'select',
                    dropdownData.cities?.filter(c => c.province_id === formData.province_id)
                      .map(c => ({ value: c.city_id, label: c.title })), true)}
                  {renderField('phone1', 'Phone 1', 'tel')}
                  {renderField('phone2', 'Phone 2', 'tel')}
                  {renderField('mobile1', 'Mobile 1', 'tel')}
                  {renderField('mobile2', 'Mobile 2', 'tel')}
                </Row>
              </Card.Body>
            </Card>

            {/* Tax Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5><FaPiggyBank className="me-2" />Tax Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {renderField('afm', 'Greek Tax Number (AFM)', 'text')}
                  {renderField('sin', 'Canadian Tax Number (SIN)', 'text')}
                  {renderField('amka', 'AMKA', 'text')}
                  {renderField('profession', 'Profession', 'text')}
                  {renderField('taxmanagement', 'Tax Management', 'checkbox')}
                  {renderField('taxrepresentation', 'Tax Representation', 'checkbox')}
                  {formData.taxrepresentation && renderField('taxrepresentative', 'Tax Representative', 'textarea')}
                  {renderField('retired', 'Retired', 'checkbox')}
                </Row>
              </Card.Body>
            </Card>

            {/* Passport Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5><FaPassport className="me-2" />Passport Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {renderField('passportcountry_id', 'Passport Country', 'select',
                    dropdownData.countries?.map(c => ({ value: c.country_id, label: c.title })))}
                  {renderField('passportnumber', 'Passport Number', 'text')}
                  {renderField('passportexpiredate', 'Passport Expiry Date', 'date')}
                  {renderField('policeid', 'Greek ID Number', 'text')}
                </Row>
              </Card.Body>
            </Card>

            {/* Pension Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5><FaPiggyBank className="me-2" />Pension Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {renderField('pensioncountry1_id', 'Pension Country 1', 'select',
                    dropdownData.countries?.map(c => ({ value: c.country_id, label: c.title })))}
                  {renderField('insucarrier1_id', 'Insurance Carrier 1', 'select',
                    dropdownData.insuranceCarriers?.map(i => ({ value: i.insucarrier_id, label: i.title })))}
                  {renderField('pensioninfo1', 'Pension Info 1', 'textarea')}
                  {renderField('pensioncountry2_id', 'Pension Country 2', 'select',
                    dropdownData.countries?.map(c => ({ value: c.country_id, label: c.title })))}
                  {renderField('insucarrier2_id', 'Insurance Carrier 2', 'select',
                    dropdownData.insuranceCarriers?.map(i => ({ value: i.insucarrier_id, label: i.title })))}
                  {renderField('pensioninfo2', 'Pension Info 2', 'textarea')}
                </Row>
              </Card.Body>
            </Card>

            {/* System Information */}
            <Card className="mb-3">
              <Card.Header>
                <h5>System Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {renderField('active', 'Active', 'checkbox')}
                  {renderField('notes', 'Notes', 'textarea')}
                </Row>
              </Card.Body>
            </Card>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={onCancel} disabled={loading}>
                <FaTimes className="me-2" />
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {isEdit ? 'Update' : 'Save'} Client
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClientForm;
