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
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import Swal from 'sweetalert2';

const TaxationProjectDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    taxyear: new Date().getFullYear(),
    taxstatus: 'pending',
    filingdate: '',
    duedate: '',
    refundamount: 0,
    taxliability: 0,
    consultant: '',
    taxformtype: 'T1',
    isamended: false,
    isextension: false,
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [clientsRes, consultantsRes] = await Promise.all([
        apiGet(API_ENDPOINTS.CLIENTS),
        apiGet(API_ENDPOINTS.CONSULTANTS)
      ]);
      setClients(clientsRes.data);
      setConsultants(consultantsRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadTaxationProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.TAXATION_PROJECTS}${id}/`);
      const project = response.data;
      setFormData({
        title: project.title || '',
        client: project.client || '',
        taxyear: project.taxyear || new Date().getFullYear(),
        taxstatus: project.taxstatus || 'pending',
        filingdate: project.filingdate ? project.filingdate.split('T')[0] : '',
        duedate: project.duedate ? project.duedate.split('T')[0] : '',
        refundamount: project.refundamount || 0,
        taxliability: project.taxliability || 0,
        consultant: project.consultant || '',
        taxformtype: project.taxformtype || 'T1',
        isamended: project.isamended !== undefined ? project.isamended : false,
        isextension: project.isextension !== undefined ? project.isextension : false,
        active: project.active !== undefined ? project.active : true
      });
    } catch (error) {
      console.error('Error loading taxation project:', error);
      Swal.fire('Error', 'Failed to load taxation project', 'error');
      history.push('/data_management/taxation_projects');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadTaxationProject();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadTaxationProject]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.taxyear) {
      newErrors.taxyear = 'Tax year is required';
    } else if (formData.taxyear < 1900 || formData.taxyear > new Date().getFullYear() + 5) {
      newErrors.taxyear = 'Tax year must be between 1900 and ' + (new Date().getFullYear() + 5);
    }

    if (!formData.consultant) {
      newErrors.consultant = 'Consultant is required';
    }

    if (formData.filingdate && formData.duedate && new Date(formData.filingdate) > new Date(formData.duedate)) {
      newErrors.filingdate = 'Filing date cannot be after due date';
    }

    if (formData.refundamount < 0) {
      newErrors.refundamount = 'Refund amount cannot be negative';
    }

    if (formData.taxliability < 0) {
      newErrors.taxliability = 'Tax liability cannot be negative';
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
        await apiPost(API_ENDPOINTS.TAXATION_PROJECTS, formData);
        Swal.fire('Success', 'Taxation project created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.TAXATION_PROJECTS}${id}/`, formData);
        Swal.fire('Success', 'Taxation project updated successfully', 'success');
      }
      history.push('/data_management/taxation_projects');
    } catch (error) {
      console.error('Error saving taxation project:', error);
      Swal.fire('Error', 'Failed to save taxation project', 'error');
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
        await apiDelete(`${API_ENDPOINTS.TAXATION_PROJECTS}${id}/`);
        Swal.fire('Deleted!', 'Taxation project has been deleted.', 'success');
        history.push('/data_management/taxation_projects');
      } catch (error) {
        console.error('Error deleting taxation project:', error);
        Swal.fire('Error', 'Failed to delete taxation project', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getTaxStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      filed: 'info',
      completed: 'success',
      overdue: 'danger',
      amended: 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const isOverdue = () => {
    if (!formData.duedate) return false;
    return new Date(formData.duedate) < new Date();
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
          {isCreating ? 'New Taxation Project' : 'Taxation Project Details'}
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
            onClick={() => history.push('/data_management/taxation_projects')}
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
                    placeholder="Enter project title"
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
                        {client.surname}, {client.name}
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
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tax Year *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.taxyear}
                    onChange={(e) => setFormData({ ...formData, taxyear: parseInt(e.target.value) })}
                    isInvalid={!!errors.taxyear}
                    disabled={!isEditing}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.taxyear}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tax Status</Form.Label>
                  <Form.Select
                    value={formData.taxstatus}
                    onChange={(e) => setFormData({ ...formData, taxstatus: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="pending">Pending</option>
                    <option value="filed">Filed</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                    <option value="amended">Amended</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg={getTaxStatusColor(formData.taxstatus)}>
                        {formData.taxstatus.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tax Form Type</Form.Label>
                  <Form.Select
                    value={formData.taxformtype}
                    onChange={(e) => setFormData({ ...formData, taxformtype: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="T1">T1 (Personal)</option>
                    <option value="T2">T2 (Corporate)</option>
                    <option value="T3">T3 (Trust)</option>
                    <option value="T4">T4 (Employment)</option>
                    <option value="T5">T5 (Investment)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filing Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.filingdate}
                    onChange={(e) => setFormData({ ...formData, filingdate: e.target.value })}
                    isInvalid={!!errors.filingdate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.filingdate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.duedate}
                    onChange={(e) => setFormData({ ...formData, duedate: e.target.value })}
                    disabled={!isEditing}
                  />
                  {!isEditing && isOverdue() && (
                    <div className="mt-2">
                      <Badge bg="danger">Overdue</Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Refund Amount (CAD)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.refundamount}
                    onChange={(e) => setFormData({ ...formData, refundamount: parseFloat(e.target.value) || 0 })}
                    isInvalid={!!errors.refundamount}
                    disabled={!isEditing}
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.refundamount}
                  </Form.Control.Feedback>
                  {!isEditing && formData.refundamount > 0 && (
                    <div className="mt-2">
                      <span className="text-success fw-bold">
                        {formatCurrency(formData.refundamount)}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tax Liability (CAD)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.taxliability}
                    onChange={(e) => setFormData({ ...formData, taxliability: parseFloat(e.target.value) || 0 })}
                    isInvalid={!!errors.taxliability}
                    disabled={!isEditing}
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.taxliability}
                  </Form.Control.Feedback>
                  {!isEditing && formData.taxliability > 0 && (
                    <div className="mt-2">
                      <span className="text-danger fw-bold">
                        {formatCurrency(formData.taxliability)}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultant *</Form.Label>
                  <Form.Select
                    value={formData.consultant}
                    onChange={(e) => setFormData({ ...formData, consultant: e.target.value })}
                    isInvalid={!!errors.consultant}
                    disabled={!isEditing}
                  >
                    <option value="">Select Consultant</option>
                    {consultants.map(consultant => (
                      <option key={consultant.consultant_id} value={consultant.consultant_id}>
                        {consultant.firstname} {consultant.lastname}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.consultant}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Flags</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    <Form.Check
                      type="checkbox"
                      label="Amended Return"
                      checked={formData.isamended}
                      onChange={(e) => setFormData({ ...formData, isamended: e.target.checked })}
                      disabled={!isEditing}
                      inline
                    />
                    <Form.Check
                      type="checkbox"
                      label="Extension Filed"
                      checked={formData.isextension}
                      onChange={(e) => setFormData({ ...formData, isextension: e.target.checked })}
                      disabled={!isEditing}
                      inline
                    />
                  </div>
                  {!isEditing && (
                    <div className="mt-2">
                      {formData.isamended && <Badge bg="secondary" className="me-1">Amended</Badge>}
                      {formData.isextension && <Badge bg="info" className="me-1">Extension</Badge>}
                    </div>
                  )}
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
                      history.push('/data_management/taxation_projects');
                    } else {
                      setIsEditing(false);
                      loadTaxationProject();
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

export default TaxationProjectDetail;
