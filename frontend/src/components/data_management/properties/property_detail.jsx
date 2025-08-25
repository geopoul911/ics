import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const PropertyDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    propertytype: 'residential',
    address: '',
    city: '',
    province: '',
    country: '',
    postalcode: '',
    purchaseprice: '',
    currentvalue: '',
    purchaseyear: '',
    squarefootage: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [clientsRes, countriesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/clients/'),
        axios.get('http://localhost:8000/api/countries/')
      ]);
      setClients(clientsRes.data);
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
      const response = await axios.get(`http://localhost:8000/api/provinces/?country=${countryId}`);
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
      const response = await axios.get(`http://localhost:8000/api/cities/?province=${provinceId}`);
      setCities(response.data);
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  }, []);

  const loadProperty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/properties/${id}/`);
      const property = response.data;
      setFormData({
        title: property.title || '',
        client: property.client || '',
        propertytype: property.propertytype || 'residential',
        address: property.address || '',
        city: property.city || '',
        province: property.province || '',
        country: property.country || '',
        postalcode: property.postalcode || '',
        purchaseprice: property.purchaseprice || '',
        currentvalue: property.currentvalue || '',
        purchaseyear: property.purchaseyear || '',
        squarefootage: property.squarefootage || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        description: property.description || '',
        active: property.active !== undefined ? property.active : true
      });

      // Load provinces and cities if country/province are set
      if (property.country) {
        await loadProvinces(property.country);
        if (property.province) {
          await loadCities(property.province);
        }
      }
    } catch (error) {
      console.error('Error loading property:', error);
      Swal.fire('Error', 'Failed to load property', 'error');
      history.push('/data_management/properties');
    } finally {
      setIsLoading(false);
    }
  }, [id, history, loadProvinces, loadCities]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadProperty();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadProperty]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.purchaseprice && parseFloat(formData.purchaseprice) < 0) {
      newErrors.purchaseprice = 'Purchase price must be positive';
    }

    if (formData.currentvalue && parseFloat(formData.currentvalue) < 0) {
      newErrors.currentvalue = 'Current value must be positive';
    }

    if (formData.purchaseyear && (parseInt(formData.purchaseyear) < 1900 || parseInt(formData.purchaseyear) > new Date().getFullYear())) {
      newErrors.purchaseyear = 'Purchase year must be between 1900 and current year';
    }

    if (formData.squarefootage && parseFloat(formData.squarefootage) < 0) {
      newErrors.squarefootage = 'Square footage must be positive';
    }

    if (formData.bedrooms && (parseInt(formData.bedrooms) < 0 || parseInt(formData.bedrooms) > 50)) {
      newErrors.bedrooms = 'Number of bedrooms must be between 0 and 50';
    }

    if (formData.bathrooms && (parseFloat(formData.bathrooms) < 0 || parseFloat(formData.bathrooms) > 20)) {
      newErrors.bathrooms = 'Number of bathrooms must be between 0 and 20';
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
        purchaseprice: formData.purchaseprice ? parseFloat(formData.purchaseprice) : null,
        currentvalue: formData.currentvalue ? parseFloat(formData.currentvalue) : null,
        purchaseyear: formData.purchaseyear ? parseInt(formData.purchaseyear) : null,
        squarefootage: formData.squarefootage ? parseFloat(formData.squarefootage) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null
      };

      if (isCreating) {
        await axios.post('http://localhost:8000/api/properties/', submitData);
        Swal.fire('Success', 'Property created successfully', 'success');
      } else {
        await axios.put(`http://localhost:8000/api/properties/${id}/`, submitData);
        Swal.fire('Success', 'Property updated successfully', 'success');
      }
      history.push('/data_management/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      Swal.fire('Error', 'Failed to save property', 'error');
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
        await axios.delete(`http://localhost:8000/api/properties/${id}/`);
        Swal.fire('Deleted!', 'Property has been deleted.', 'success');
        history.push('/data_management/properties');
      } catch (error) {
        console.error('Error deleting property:', error);
        Swal.fire('Error', 'Failed to delete property', 'error');
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

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return parseFloat(amount).toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD'
    });
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
          {isCreating ? 'New Property' : 'Property Details'}
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
            onClick={() => history.push('/data_management/properties')}
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
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    isInvalid={!!errors.title}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Client *</Form.Label>
                  <Form.Select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    isInvalid={!!errors.client}
                    disabled={!isEditing}
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.surname} {client.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.client}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select
                    value={formData.propertytype}
                    onChange={(e) => setFormData({ ...formData, propertytype: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="land">Land</option>
                    <option value="condo">Condominium</option>
                    <option value="townhouse">Townhouse</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg="info">
                        {formData.propertytype.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Purchase Year</Form.Label>
                  <Form.Control
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.purchaseyear}
                    onChange={(e) => setFormData({ ...formData, purchaseyear: e.target.value })}
                    isInvalid={!!errors.purchaseyear}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.purchaseyear}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                isInvalid={!!errors.address}
                disabled={!isEditing}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
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
                  <Form.Label>Square Footage</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.squarefootage}
                    onChange={(e) => setFormData({ ...formData, squarefootage: e.target.value })}
                    isInvalid={!!errors.squarefootage}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.squarefootage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bedrooms</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="50"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    isInvalid={!!errors.bedrooms}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bedrooms}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bathrooms</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    isInvalid={!!errors.bathrooms}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bathrooms}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Purchase Price (CAD)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.purchaseprice}
                    onChange={(e) => setFormData({ ...formData, purchaseprice: e.target.value })}
                    isInvalid={!!errors.purchaseprice}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.purchaseprice}
                  </Form.Control.Feedback>
                  {!isEditing && formData.purchaseprice && (
                    <div className="mt-2">
                      <span className="fw-bold text-primary">
                        {formatCurrency(formData.purchaseprice)}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Value (CAD)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.currentvalue}
                    onChange={(e) => setFormData({ ...formData, currentvalue: e.target.value })}
                    isInvalid={!!errors.currentvalue}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.currentvalue}
                  </Form.Control.Feedback>
                  {!isEditing && formData.currentvalue && (
                    <div className="mt-2">
                      <span className="fw-bold text-success">
                        {formatCurrency(formData.currentvalue)}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                {!isEditing && formData.purchaseprice && formData.currentvalue && (
                  <Form.Group className="mb-3">
                    <Form.Label>Value Change</Form.Label>
                    <div className="mt-2">
                      {(() => {
                        const purchase = parseFloat(formData.purchaseprice);
                        const current = parseFloat(formData.currentvalue);
                        const change = current - purchase;
                        const changePercent = (change / purchase) * 100;
                        const isPositive = change >= 0;
                        return (
                          <div>
                            <span className={`fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                              {isPositive ? '+' : ''}{formatCurrency(change)}
                            </span>
                            <br />
                            <small className={`${isPositive ? 'text-success' : 'text-danger'}`}>
                              ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                            </small>
                          </div>
                        );
                      })()}
                    </div>
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      history.push('/data_management/properties');
                    } else {
                      setIsEditing(false);
                      loadProperty();
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

export default PropertyDetail;
