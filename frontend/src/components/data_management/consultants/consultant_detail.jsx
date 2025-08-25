import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import Swal from 'sweetalert2';

const ConsultantDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [professions, setProfessions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    profession: '',
    phone: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalcode: '',
    licensenumber: '',
    specialization: '',
    hourlyrate: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [professionsRes, countriesRes] = await Promise.all([
        apiGet(API_ENDPOINTS.PROFESSIONS),
        apiGet(API_ENDPOINTS.COUNTRIES)
      ]);
      setProfessions(professionsRes.data);
      setCountries(countriesRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadProvinces = useCallback(async (countryId) => {
    if (!countryId) {
      setProvinces([]);
      setCities([]);
      return;
    }
    try {
      const response = await apiGet(`${API_ENDPOINTS.provinces}?country=${countryId}`);
      setProvinces(response.data);
      setCities([]);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  }, []);

  const loadCities = useCallback(async (provinceId) => {
    if (!provinceId) {
      setCities([]);
      return;
    }
    try {
      const response = await apiGet(`${API_ENDPOINTS.cities}?province=${provinceId}`);
      setCities(response.data);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  }, []);

  const loadConsultant = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.CONSULTANTS}${id}/`);
      const consultant = response.data;
      setFormData({
        firstname: consultant.firstname || '',
        lastname: consultant.lastname || '',
        profession: consultant.profession || '',
        phone: consultant.phone || '',
        mobile: consultant.mobile || '',
        email: consultant.email || '',
        address: consultant.address || '',
        city: consultant.city || '',
        province: consultant.province || '',
        country: consultant.country || '',
        postalcode: consultant.postalcode || '',
        licensenumber: consultant.licensenumber || '',
        specialization: consultant.specialization || '',
        hourlyrate: consultant.hourlyrate || '',
        active: consultant.active !== undefined ? consultant.active : true
      });

      // Load provinces and cities if country/province are set
      if (consultant.country) {
        await loadProvinces(consultant.country);
        if (consultant.province) {
          await loadCities(consultant.province);
        }
      }
    } catch (error) {
      console.error('Error loading consultant:', error);
      Swal.fire('Error', 'Failed to load consultant', 'error');
      history.push('/data_management/consultants');
    } finally {
      setIsLoading(false);
    }
  }, [id, history, loadProvinces, loadCities]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadConsultant();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadConsultant]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!formData.profession) {
      newErrors.profession = 'Profession is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.mobile && !/^[+]?[1-9][\d]{0,15}$/.test(formData.mobile.replace(/[\s\-()]/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    if (formData.hourlyrate && parseFloat(formData.hourlyrate) < 0) {
      newErrors.hourlyrate = 'Hourly rate must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        hourlyrate: formData.hourlyrate ? parseFloat(formData.hourlyrate) : null
      };

      if (isCreating) {
        await apiPost(API_ENDPOINTS.CONSULTANTS, submitData);
        Swal.fire('Success', 'Consultant created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.CONSULTANTS}${id}/`, submitData);
        Swal.fire('Success', 'Consultant updated successfully', 'success');
      }
      history.push('/data_management/consultants');
    } catch (error) {
      console.error('Error saving consultant:', error);
      Swal.fire('Error', 'Failed to save consultant', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await apiDelete(`${API_ENDPOINTS.CONSULTANTS}${id}/`);
        Swal.fire('Deleted!', 'Consultant has been deleted.', 'success');
        history.push('/data_management/consultants');
      } catch (error) {
        console.error('Error deleting consultant:', error);
        Swal.fire('Error', 'Failed to delete consultant', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCountryChange = async (countryId) => {
    setFormData({ ...formData, country: countryId, province: '', city: '' });
    await loadProvinces(countryId);
  };

  const handleProvinceChange = async (provinceId) => {
    setFormData({ ...formData, province: provinceId, city: '' });
    await loadCities(provinceId);
  };

  if (isLoading && !isCreating) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          {isCreating ? 'New Consultant' : 'Consultant Details'}
        </h2>
        <div>
          {!isCreating && (
            <>
              {!isEditing && (
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  className="me-2"
                >
                  Edit
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handleDelete}
                className="me-2"
              >
                Delete
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            onClick={() => history.push('/data_management/consultants')}
          >
            Back to List
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    isInvalid={!!errors.firstname}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    isInvalid={!!errors.lastname}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastname}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profession *</Form.Label>
                  <Form.Select
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    isInvalid={!!errors.profession}
                    disabled={!isEditing}
                  >
                    <option value="">Select Profession</option>
                    {professions.map(profession => (
                      <option key={profession.profession_id} value={profession.profession_id}>
                        {profession.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.profession}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.licensenumber}
                    onChange={(e) => setFormData({ ...formData, licensenumber: e.target.value })}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    isInvalid={!!errors.phone}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    isInvalid={!!errors.mobile}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                isInvalid={!!errors.email}
                disabled={!isEditing}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Select
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    disabled={!isEditing || !formData.country}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province.province_id} value={province.province_id}>
                        {province.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!isEditing || !formData.province}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.postalcode}
                    onChange={(e) => setFormData({ ...formData, postalcode: e.target.value })}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hourly Rate (CAD)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.hourlyrate}
                    onChange={(e) => setFormData({ ...formData, hourlyrate: e.target.value })}
                    isInvalid={!!errors.hourlyrate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hourlyrate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                disabled={!isEditing}
              />
            </Form.Group>

            {isEditing && (
              <div className="d-flex gap-2">
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (isCreating ? 'Create' : 'Update')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (isCreating) {
                      history.push('/data_management/consultants');
                    } else {
                      setIsEditing(false);
                      loadConsultant();
                    }
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ConsultantDetail;
