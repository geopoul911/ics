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

const BankClientAccountDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [banks, setBanks] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    bank: '',
    client: '',
    accountnumber: '',
    accounttype: 'checking',
    accountname: '',
    balance: '',
    currency: 'CAD',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [banksRes, clientsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/banks/'),
        axios.get('http://localhost:8000/api/clients/')
      ]);
      setBanks(banksRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadBankClientAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/bank_client_accounts/${id}/`);
      const account = response.data;
      setFormData({
        bank: account.bank || '',
        client: account.client || '',
        accountnumber: account.accountnumber || '',
        accounttype: account.accounttype || 'checking',
        accountname: account.accountname || '',
        balance: account.balance || '',
        currency: account.currency || 'CAD',
        active: account.active !== undefined ? account.active : true
      });
    } catch (error) {
      console.error('Error loading bank client account:', error);
      Swal.fire('Error', 'Failed to load bank client account', 'error');
      history.push('/data_management/bank_client_accounts');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadBankClientAccount();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadBankClientAccount]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.bank) {
      newErrors.bank = 'Bank is required';
    }

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.accountnumber.trim()) {
      newErrors.accountnumber = 'Account number is required';
    }

    if (!formData.accountname.trim()) {
      newErrors.accountname = 'Account name is required';
    }

    if (formData.balance && parseFloat(formData.balance) < 0) {
      newErrors.balance = 'Balance must be positive';
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
        balance: formData.balance ? parseFloat(formData.balance) : null
      };

      if (isCreating) {
        await axios.post('http://localhost:8000/api/bank_client_accounts/', submitData);
        Swal.fire('Success', 'Bank client account created successfully', 'success');
      } else {
        await axios.put(`http://localhost:8000/api/bank_client_accounts/${id}/`, submitData);
        Swal.fire('Success', 'Bank client account updated successfully', 'success');
      }
      history.push('/data_management/bank_client_accounts');
    } catch (error) {
      console.error('Error saving bank client account:', error);
      Swal.fire('Error', 'Failed to save bank client account', 'error');
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
        await axios.delete(`http://localhost:8000/api/bank_client_accounts/${id}/`);
        Swal.fire('Deleted!', 'Bank client account has been deleted.', 'success');
        history.push('/data_management/bank_client_accounts');
      } catch (error) {
        console.error('Error deleting bank client account:', error);
        Swal.fire('Error', 'Failed to delete bank client account', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return '';
    // Mask account number for security - show only last 4 digits
    const masked = '*'.repeat(Math.max(0, accountNumber.length - 4)) + accountNumber.slice(-4);
    return masked;
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
          {isCreating ? 'New Bank Client Account' : 'Bank Client Account Details'}
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
            onClick={() => history.push('/data_management/bank_client_accounts')}
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
                  <Form.Label>Bank *</Form.Label>
                  <Form.Select
                    value={formData.bank}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    isInvalid={!!errors.bank}
                    disabled={!isEditing}
                  >
                    <option value="">Select Bank</option>
                    {banks.map(bank => (
                      <option key={bank.bank_id} value={bank.bank_id}>
                        {bank.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.bank}
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
                  <Form.Label>Account Number *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.accountnumber}
                    onChange={(e) => setFormData({ ...formData, accountnumber: e.target.value })}
                    isInvalid={!!errors.accountnumber}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accountnumber}
                  </Form.Control.Feedback>
                  {!isEditing && formData.accountnumber && (
                    <div className="mt-2">
                      <small className="text-muted">
                        Display: {formatAccountNumber(formData.accountnumber)}
                      </small>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Select
                    value={formData.accounttype}
                    onChange={(e) => setFormData({ ...formData, accounttype: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                    <option value="credit">Credit</option>
                    <option value="loan">Loan</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg="info">
                        {formData.accounttype.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Account Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.accountname}
                onChange={(e) => setFormData({ ...formData, accountname: e.target.value })}
                isInvalid={!!errors.accountname}
                disabled={!isEditing}
              />
              <Form.Control.Feedback type="invalid">
                {errors.accountname}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Balance</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    isInvalid={!!errors.balance}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.balance}
                  </Form.Control.Feedback>
                  {!isEditing && formData.balance && (
                    <div className="mt-2">
                      <span className={`fw-bold ${parseFloat(formData.balance) >= 0 ? 'text-success' : 'text-danger'}`}>
                        {parseFloat(formData.balance).toLocaleString('en-CA', {
                          style: 'currency',
                          currency: formData.currency
                        })}
                      </span>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </Form.Select>
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
                      history.push('/data_management/bank_client_accounts');
                    } else {
                      setIsEditing(false);
                      loadBankClientAccount();
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

export default BankClientAccountDetail;
