import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge
} from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const CashDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [cashCategories, setCashCategories] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    project: '',
    cashcategory: '',
    transactiondate: '',
    amount: '',
    transactiontype: 'income',
    description: '',
    reference: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [clientsRes, projectsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/clients/'),
        axios.get('http://localhost:8000/api/projects/'),
        axios.get('http://localhost:8000/api/cash_categories/')
      ]);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);
      setCashCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadCash = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/cash/${id}/`);
      const cash = response.data;
      setFormData({
        client: cash.client || '',
        project: cash.project || '',
        cashcategory: cash.cashcategory || '',
        transactiondate: cash.transactiondate ? cash.transactiondate.split('T')[0] : '',
        amount: cash.amount || '',
        transactiontype: cash.transactiontype || 'income',
        description: cash.description || '',
        reference: cash.reference || '',
        active: cash.active !== undefined ? cash.active : true
      });
    } catch (error) {
      console.error('Error loading cash transaction:', error);
      Swal.fire('Error', 'Failed to load cash transaction', 'error');
      history.push('/data_management/cash');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadCash();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadCash]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.cashcategory) {
      newErrors.cashcategory = 'Cash category is required';
    }

    if (!formData.transactiondate) {
      newErrors.transactiondate = 'Transaction date is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
        amount: parseFloat(formData.amount)
      };

      if (isCreating) {
        await axios.post('http://localhost:8000/api/cash/', submitData);
        Swal.fire('Success', 'Cash transaction created successfully', 'success');
      } else {
        await axios.put(`http://localhost:8000/api/cash/${id}/`, submitData);
        Swal.fire('Success', 'Cash transaction updated successfully', 'success');
      }
      history.push('/data_management/cash');
    } catch (error) {
      console.error('Error saving cash transaction:', error);
      Swal.fire('Error', 'Failed to save cash transaction', 'error');
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
        await axios.delete(`http://localhost:8000/api/cash/${id}/`);
        Swal.fire('Deleted!', 'Cash transaction has been deleted.', 'success');
        history.push('/data_management/cash');
      } catch (error) {
        console.error('Error deleting cash transaction:', error);
        Swal.fire('Error', 'Failed to delete cash transaction', 'error');
      } finally {
        setIsLoading(false);
      }
    }
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
          {isCreating ? 'New Cash Transaction' : 'Cash Transaction Details'}
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
            onClick={() => history.push('/data_management/cash')}
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
                  <Form.Label>Project</Form.Label>
                  <Form.Select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.project_id} value={project.project_id}>
                        {project.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cash Category *</Form.Label>
                  <Form.Select
                    value={formData.cashcategory}
                    onChange={(e) => setFormData({ ...formData, cashcategory: e.target.value })}
                    isInvalid={!!errors.cashcategory}
                    disabled={!isEditing}
                  >
                    <option value="">Select Category</option>
                    {cashCategories.map(category => (
                      <option key={category.cashcategory_id} value={category.cashcategory_id}>
                        {category.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.cashcategory}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Select
                    value={formData.transactiontype}
                    onChange={(e) => setFormData({ ...formData, transactiontype: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="refund">Refund</option>
                    <option value="liability">Liability</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg={formData.transactiontype === 'income' ? 'success' : 
                                formData.transactiontype === 'expense' ? 'danger' :
                                formData.transactiontype === 'refund' ? 'info' : 'warning'}>
                        {formData.transactiontype.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.transactiondate}
                    onChange={(e) => setFormData({ ...formData, transactiondate: e.target.value })}
                    isInvalid={!!errors.transactiondate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.transactiondate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (CAD) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    isInvalid={!!errors.amount}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                  {!isEditing && formData.amount && (
                    <div className="mt-2">
                      <span className={`fw-bold ${
                        formData.transactiontype === 'income' || formData.transactiontype === 'refund' 
                          ? 'text-success' 
                          : 'text-danger'
                      }`}>
                        {formatCurrency(formData.amount)}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                isInvalid={!!errors.description}
                disabled={!isEditing}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reference</Form.Label>
              <Form.Control
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                disabled={!isEditing}
                placeholder="Invoice number, receipt number, etc."
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
                      history.push('/data_management/cash');
                    } else {
                      setIsEditing(false);
                      loadCash();
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

export default CashDetail;
