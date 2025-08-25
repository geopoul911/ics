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
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import Swal from 'sweetalert2';

const DocumentDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [documentCategories, setDocumentCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    project: '',
    documentcategory: '',
    filename: '',
    filepath: '',
    filesize: '',
    filetype: '',
    uploaddate: '',
    expirydate: '',
    description: '',
    tags: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [clientsRes, projectsRes, categoriesRes] = await Promise.all([
        apiGet(API_ENDPOINTS.CLIENTS),
        apiGet(API_ENDPOINTS.PROJECTS),
        apiGet(API_ENDPOINTS.DOCUMENT_CATEGORIES)
      ]);
      setClients(clientsRes.data);
      setProjects(projectsRes.data);
      setDocumentCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.DOCUMENTS}${id}/`);
      const document = response.data;
      setFormData({
        title: document.title || '',
        client: document.client || '',
        project: document.project || '',
        documentcategory: document.documentcategory || '',
        filename: document.filename || '',
        filesize: document.filesize || '',
        filetype: document.filetype || '',
        uploaddate: document.uploaddate ? document.uploaddate.split('T')[0] : '',
        expirydate: document.expirydate ? document.expirydate.split('T')[0] : '',
        description: document.description || '',
        active: document.active !== undefined ? document.active : true
      });
    } catch (error) {
      console.error('Error loading document:', error);
      Swal.fire('Error', 'Failed to load document', 'error');
      history.push('/data_management/documents');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadDocument();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadDocument]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.documentcategory) {
      newErrors.documentcategory = 'Document category is required';
    }

    if (!formData.filename.trim()) {
      newErrors.filename = 'Filename is required';
    }

    if (formData.expirydate && formData.uploaddate && formData.expirydate < formData.uploaddate) {
      newErrors.expirydate = 'Expiry date must be after upload date';
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
        filesize: formData.filesize ? parseInt(formData.filesize) : null
      };

      if (isCreating) {
        await apiPost(API_ENDPOINTS.DOCUMENTS, submitData);
        Swal.fire('Success', 'Document created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.DOCUMENTS}${id}/`, submitData);
        Swal.fire('Success', 'Document updated successfully', 'success');
      }
      history.push('/data_management/documents');
    } catch (error) {
      console.error('Error saving document:', error);
      Swal.fire('Error', 'Failed to save document', 'error');
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
        await apiDelete(`${API_ENDPOINTS.DOCUMENTS}${id}/`);
        Swal.fire('Deleted!', 'Document has been deleted.', 'success');
        history.push('/data_management/documents');
      } catch (error) {
        console.error('Error deleting document:', error);
        Swal.fire('Error', 'Failed to delete document', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
          {isCreating ? 'New Document' : 'Document Details'}
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
            onClick={() => history.push('/data_management/documents')}
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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Document Category *</Form.Label>
                  <Form.Select
                    value={formData.documentcategory}
                    onChange={(e) => setFormData({ ...formData, documentcategory: e.target.value })}
                    isInvalid={!!errors.documentcategory}
                    disabled={!isEditing}
                  >
                    <option value="">Select Category</option>
                    {documentCategories.map(category => (
                      <option key={category.documentcategory_id} value={category.documentcategory_id}>
                        {category.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.documentcategory}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Filename *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.filename}
                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                    isInvalid={!!errors.filename}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.filename}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.filetype}
                    onChange={(e) => setFormData({ ...formData, filetype: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., PDF, DOC, JPG"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File Path</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.filepath}
                    onChange={(e) => setFormData({ ...formData, filepath: e.target.value })}
                    disabled={!isEditing}
                    placeholder="/path/to/file"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File Size (bytes)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.filesize}
                    onChange={(e) => setFormData({ ...formData, filesize: e.target.value })}
                    disabled={!isEditing}
                  />
                  {!isEditing && formData.filesize && (
                    <div className="mt-2">
                      <small className="text-muted">
                        {formatFileSize(formData.filesize)}
                      </small>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.uploaddate}
                    onChange={(e) => setFormData({ ...formData, uploaddate: e.target.value })}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.expirydate}
                    onChange={(e) => setFormData({ ...formData, expirydate: e.target.value })}
                    isInvalid={!!errors.expirydate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.expirydate}
                  </Form.Control.Feedback>
                  {!isEditing && formData.expirydate && (
                    <div className="mt-2">
                      {isExpired(formData.expirydate) ? (
                        <Badge bg="danger">Expired</Badge>
                      ) : (
                        <Badge bg="success">Valid</Badge>
                      )}
                    </div>
                  )}
                </Form.Group>
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
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter tags separated by commas"
              />
              <Form.Text className="text-muted">
                Separate multiple tags with commas
              </Form.Text>
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
                      history.push('/data_management/documents');
                    } else {
                      setIsEditing(false);
                      loadDocument();
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

export default DocumentDetail;
