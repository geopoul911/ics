import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';

const BankDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalcode: '',
    phone: '',
    website: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadBank = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.BANKS}${id}/`);
      const bank = response.data;
      setFormData({
        name: bank.name || '',
        code: bank.code || '',
        address: bank.address || '',
        city: bank.city || '',
        province: bank.province || '',
        country: bank.country || '',
        postalcode: bank.postalcode || '',
        phone: bank.phone || '',
        website: bank.website || '',
        active: bank.active !== undefined ? bank.active : true
      });
    } catch (error) {
      console.error('Error loading bank:', error);
      Swal.fire('Error', 'Failed to load bank', 'error');
      history.push('/data_management/banks');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    if (id && id !== 'new') {
      loadBank();
    } else if (id === 'new') {
      setIsCreating(true);
      setIsEditing(true);
    }
  }, [id, history, loadBank]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bank name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Bank code is required';
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
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
        await apiPost(API_ENDPOINTS.BANKS, formData);
        Swal.fire('Success', 'Bank created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.BANKS}${id}/`, formData);
        Swal.fire('Success', 'Bank updated successfully', 'success');
      }
      history.push('/data_management/banks');
    } catch (error) {
      console.error('Error saving bank:', error);
      Swal.fire('Error', 'Failed to save bank', 'error');
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
        await apiDelete(`${API_ENDPOINTS.BANKS}${id}/`);
        Swal.fire('Deleted!', 'Bank has been deleted.', 'success');
        history.push('/data_management/banks');
      } catch (error) {
        console.error('Error deleting bank:', error);
        Swal.fire('Error', 'Failed to delete bank', 'error');
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
          {isCreating ? 'New Bank' : 'Bank Details'}
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
            onClick={() => history.push('/data_management/banks')}
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
                  <Form.Label>Bank Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    isInvalid={!!errors.name}
                    disabled={!isEditing}
                    placeholder="Enter bank name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    isInvalid={!!errors.code}
                    disabled={!isEditing}
                    placeholder="Enter bank code"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter bank address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter city"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Province</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter province"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter country"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.postalcode}
                    onChange={(e) => setFormData({ ...formData, postalcode: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter postal code"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    isInvalid={!!errors.phone}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    isInvalid={!!errors.website}
                    disabled={!isEditing}
                    placeholder="Enter website URL"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.website}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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
                      history.push('/data_management/banks');
                    } else {
                      setIsEditing(false);
                      loadBank();
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

export default BankDetail;
