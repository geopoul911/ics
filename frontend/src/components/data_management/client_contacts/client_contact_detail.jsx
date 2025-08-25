import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';  
import Swal from 'sweetalert2';

const ClientContactDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    firstname: '',
    lastname: '',
    relationship: '',
    phone: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalcode: '',
    notes: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const clientsRes = await apiGet(API_ENDPOINTS.CLIENTS);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadClientContact = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.CLIENT_CONTACTS}${id}/`);
      const contact = response.data;
      setFormData({
        client: contact.client || '',
        firstname: contact.firstname || '',
        lastname: contact.lastname || '',
        relationship: contact.relationship || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        email: contact.email || '',
        address: contact.address || '',
        city: contact.city || '',
        province: contact.province || '',
        country: contact.country || '',
        postalcode: contact.postalcode || '',
        notes: contact.notes || '',
        active: contact.active !== undefined ? contact.active : true
      });
    } catch (error) {
      console.error('Error loading client contact:', error);
      Swal.fire('Error', 'Failed to load client contact', 'error');
      history.push('/data_management/client_contacts');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadClientContact();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadClientContact]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (formData.mobile && !/^[+]?[1-9][\d]{0,15}$/.test(formData.mobile.replace(/[\s-()]/g, ''))) {
      newErrors.mobile = 'Please enter a valid mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isCreating) {
        await apiPost(API_ENDPOINTS.CLIENT_CONTACTS, formData);
        Swal.fire('Success', 'Client contact created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.CLIENT_CONTACTS}${id}/`, formData);
        Swal.fire('Success', 'Client contact updated successfully', 'success');
      }
      history.push('/data_management/client_contacts');
    } catch (error) {
      console.error('Error saving client contact:', error);
      Swal.fire('Error', 'Failed to save client contact', 'error');
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
        await apiDelete(`${API_ENDPOINTS.CLIENT_CONTACTS}${id}/`);
        Swal.fire('Deleted!', 'Client contact has been deleted.', 'success');
        history.push('/data_management/client_contacts');
      } catch (error) {
        console.error('Error deleting client contact:', error);
        Swal.fire('Error', 'Failed to delete client contact', 'error');
      } finally {
        setIsLoading(false);
      }
    }
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
          {isCreating ? 'New Client Contact' : 'Client Contact Details'}
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
            onClick={() => history.push('/data_management/client_contacts')}
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Relationship *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    isInvalid={!!errors.relationship}
                    disabled={!isEditing}
                    placeholder="e.g., Spouse, Child, Parent, Friend"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.relationship}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
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
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={!isEditing}
                placeholder="Additional notes about this contact"
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
                      history.push('/data_management/client_contacts');
                    } else {
                      setIsEditing(false);
                      loadClientContact();
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

export default ClientContactDetail;
