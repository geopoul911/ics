import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Card, Row, Col, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash, FaFilter, FaSort, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { apiGet, API_ENDPOINTS, handlePagination } from '../../../utils/api';

import ClientForm from './client_form';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    active: 'all',
    taxmanagement: 'all'
  });
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Sort states
  const [sortField, setSortField] = useState('surname');
  const [sortDirection, setSortDirection] = useState('asc');

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Filter clients when search or filters change
  useEffect(() => {
    filterClients();
    // eslint-disable-next-line
  }, [clients, searchTerm, filters]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await apiGet(API_ENDPOINTS.CLIENTS);
      const { data } = handlePagination(response);
      setClients(data);
      setError(null);
    } catch (error) {
      console.error('Error loading clients:', error);
      setError(error.message || 'Failed to load clients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name?.toLowerCase().includes(term) ||
        client.surname?.toLowerCase().includes(term) ||
        client.onoma?.toLowerCase().includes(term) ||
        client.eponymo?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.phone1?.includes(term) ||
        client.mobile1?.includes(term) ||
        client.address?.toLowerCase().includes(term) ||
        client.city?.title?.toLowerCase().includes(term)
      );
    }

    // Country filter
    if (filters.country) {
      filtered = filtered.filter(client => client.country?.country_id === filters.country);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(client => client.city?.city_id === filters.city);
    }

    // Active filter
    if (filters.active !== 'all') {
      const isActive = filters.active === 'true';
      filtered = filtered.filter(client => client.active === isActive);
    }

    // Tax management filter
    if (filters.taxmanagement !== 'all') {
      const hasTaxManagement = filters.taxmanagement === 'true';
      filtered = filtered.filter(client => client.taxmanagement === hasTaxManagement);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle nested objects
      if (sortField === 'country') {
        aValue = a.country?.title || '';
        bValue = b.country?.title || '';
      } else if (sortField === 'city') {
        aValue = a.city?.title || '';
        bValue = b.city?.title || '';
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredClients(filtered);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setFormMode('view');
    setShowForm(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/clients/${selectedClient.client_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (response.ok) {
        await loadClients();
        setShowDeleteModal(false);
        setSelectedClient(null);
      } else {
        throw new Error('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client. Please try again.');
    }
  };

  const handleFormSave = async (savedClient) => {
    await loadClients();
    setShowForm(false);
    setSelectedClient(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedClient(null);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-muted" />;
    return sortDirection === 'asc' ? 
      <FaSort className="text-primary" /> : 
      <FaSort className="text-primary" style={{ transform: 'rotate(180deg)' }} />;
  };

  const renderStatusBadge = (client) => {
    if (!client.active) {
      return <Badge bg="secondary">Inactive</Badge>;
    }
    if (client.deceased) {
      return <Badge bg="danger">Deceased</Badge>;
    }
    if (client.taxmanagement) {
      return <Badge bg="info">Tax Management</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="client-list">
      {/* Header */}
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4>
              <FaUser className="me-2" />
              Client Management
            </h4>
            <Button variant="primary" onClick={handleCreateClient}>
              <FaPlus className="me-2" />
              New Client
            </Button>
          </div>
        </Card.Header>
      </Card>

      {/* Search and Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, phone, address..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.active}
                onChange={(e) => handleFilterChange('active', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filters.taxmanagement}
                onChange={(e) => handleFilterChange('taxmanagement', e.target.value)}
              >
                <option value="all">All Tax Status</option>
                <option value="true">Tax Management</option>
                <option value="false">No Tax Management</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" size="sm">
                <FaFilter className="me-1" />
                More Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="mb-3">
        <small className="text-muted">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} clients
        </small>
      </div>

      {/* Clients Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th onClick={() => handleSort('surname')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center">
                    Name {renderSortIcon('surname')}
                  </div>
                </th>
                <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1" />
                    Location {renderSortIcon('city')}
                  </div>
                </th>
                <th>
                  <FaPhone className="me-1" />
                  Contact
                </th>
                <th onClick={() => handleSort('registrationdate')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center">
                    Registered {renderSortIcon('registrationdate')}
                  </div>
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map(client => (
                <tr key={client.client_id}>
                  <td>
                    <div>
                      <strong>{client.surname} {client.name}</strong>
                      <br />
                      <small className="text-muted">
                        {client.eponymo} {client.onoma}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{client.city?.title}</div>
                      <small className="text-muted">{client.country?.title}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      {client.email && (
                        <div>
                          <FaEnvelope className="me-1" />
                          {client.email}
                        </div>
                      )}
                      {client.phone1 && (
                        <div>
                          <FaPhone className="me-1" />
                          {client.phone1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <small>
                      {new Date(client.registrationdate).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    {renderStatusBadge(client)}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewClient(client)}
                        title="View Client"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleEditClient(client)}
                        title="Edit Client"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteClient(client)}
                        title="Delete Client"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <Button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Client Form Modal */}
      <Modal
        show={showForm}
        onHide={handleFormCancel}
        size="xl"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {formMode === 'create' ? 'New Client' : 
             formMode === 'edit' ? 'Edit Client' : 'View Client'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ClientForm
            client={selectedClient}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            isEdit={formMode === 'edit'}
            isView={formMode === 'view'}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete client "{selectedClient?.surname} {selectedClient?.name}"?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default ClientList;
