import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
  ProgressBar,
  // Alert
} from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import Swal from 'sweetalert2';

const ProjectTaskDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [projects, setProjects] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [taskCategories, setTaskCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    taskcategory: '',
    description: '',
    assignedto: '',
    startdate: '',
    duedate: '',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    estimatedhours: '',
    actualhours: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [projectsRes, consultantsRes, categoriesRes] = await Promise.all([
        apiGet(API_ENDPOINTS.PROJECTS),
        apiGet(API_ENDPOINTS.CONSULTANTS),
        apiGet(API_ENDPOINTS.TASK_CATEGORIES)
      ]);
      setProjects(projectsRes.data);
      setConsultants(consultantsRes.data);
      setTaskCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadProjectTask = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.PROJECT_TASKS}${id}/`);
      const task = response.data;
      setFormData({
        title: task.title || '',
        project: task.project || '',
        taskcategory: task.taskcategory || '',
        description: task.description || '',
        assignedto: task.assignedto || '',
        startdate: task.startdate ? task.startdate.split('T')[0] : '',
        duedate: task.duedate ? task.duedate.split('T')[0] : '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        progress: task.progress || 0,
        estimatedhours: task.estimatedhours || '',
        actualhours: task.actualhours || '',
        active: task.active !== undefined ? task.active : true
      });
    } catch (error) {
      console.error('Error loading project task:', error);
      Swal.fire('Error', 'Failed to load project task', 'error');
      history.push('/data_management/project_tasks');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadProjectTask();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadProjectTask]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.project) {
      newErrors.project = 'Project is required';
    }

    if (!formData.taskcategory) {
      newErrors.taskcategory = 'Task category is required';
    }

    if (!formData.assignedto) {
      newErrors.assignedto = 'Assigned to is required';
    }

    if (!formData.startdate) {
      newErrors.startdate = 'Start date is required';
    }

    if (!formData.duedate) {
      newErrors.duedate = 'Due date is required';
    } else if (formData.startdate && formData.duedate < formData.startdate) {
      newErrors.duedate = 'Due date must be after start date';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    if (formData.estimatedhours && parseFloat(formData.estimatedhours) < 0) {
      newErrors.estimatedhours = 'Estimated hours must be positive';
    }

    if (formData.actualhours && parseFloat(formData.actualhours) < 0) {
      newErrors.actualhours = 'Actual hours must be positive';
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
        progress: parseInt(formData.progress),
        estimatedhours: formData.estimatedhours ? parseFloat(formData.estimatedhours) : null,
        actualhours: formData.actualhours ? parseFloat(formData.actualhours) : null
      };

      if (isCreating) {
        await apiPost(API_ENDPOINTS.PROJECT_TASKS, submitData);
        Swal.fire('Success', 'Project task created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.PROJECT_TASKS}${id}/`, submitData);
        Swal.fire('Success', 'Project task updated successfully', 'success');
      }
      history.push('/data_management/project_tasks');
    } catch (error) {
      console.error('Error saving project task:', error);
      Swal.fire('Error', 'Failed to save project task', 'error');
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
        await apiDelete(`${API_ENDPOINTS.PROJECT_TASKS}${id}/`);
        Swal.fire('Deleted!', 'Project task has been deleted.', 'success');
        history.push('/data_management/project_tasks');
      } catch (error) {
        console.error('Error deleting project task:', error);
        Swal.fire('Error', 'Failed to delete project task', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'secondary',
      in_progress: 'primary',
      completed: 'success',
      on_hold: 'warning',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      urgent: 'dark'
    };
    return colors[priority] || 'secondary';
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
          {isCreating ? 'New Project Task' : 'Project Task Details'}
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
            onClick={() => history.push('/data_management/project_tasks')}
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
                  <Form.Label>Project *</Form.Label>
                  <Form.Select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    isInvalid={!!errors.project}
                    disabled={!isEditing}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.project_id} value={project.project_id}>
                        {project.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.project}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Category *</Form.Label>
                  <Form.Select
                    value={formData.taskcategory}
                    onChange={(e) => setFormData({ ...formData, taskcategory: e.target.value })}
                    isInvalid={!!errors.taskcategory}
                    disabled={!isEditing}
                  >
                    <option value="">Select Category</option>
                    {taskCategories.map(category => (
                      <option key={category.taskcategory_id} value={category.taskcategory_id}>
                        {category.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.taskcategory}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assigned To *</Form.Label>
                  <Form.Select
                    value={formData.assignedto}
                    onChange={(e) => setFormData({ ...formData, assignedto: e.target.value })}
                    isInvalid={!!errors.assignedto}
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
                    {errors.assignedto}
                  </Form.Control.Feedback>
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startdate}
                    onChange={(e) => setFormData({ ...formData, startdate: e.target.value })}
                    isInvalid={!!errors.startdate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startdate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.duedate}
                    onChange={(e) => setFormData({ ...formData, duedate: e.target.value })}
                    isInvalid={!!errors.duedate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.duedate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg={getStatusColor(formData.status)}>
                        {formData.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg={getPriorityColor(formData.priority)}>
                        {formData.priority.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Progress (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    isInvalid={!!errors.progress}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.progress}
                  </Form.Control.Feedback>
                  {!isEditing && (
                    <div className="mt-2">
                      <ProgressBar 
                        now={formData.progress} 
                        label={`${formData.progress}%`}
                        variant={formData.progress === 100 ? 'success' : 'primary'}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estimated Hours</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.estimatedhours}
                    onChange={(e) => setFormData({ ...formData, estimatedhours: e.target.value })}
                    isInvalid={!!errors.estimatedhours}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.estimatedhours}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Actual Hours</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.actualhours}
                    onChange={(e) => setFormData({ ...formData, actualhours: e.target.value })}
                    isInvalid={!!errors.actualhours}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.actualhours}
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
                      history.push('/data_management/project_tasks');
                    } else {
                      setIsEditing(false);
                      loadProjectTask();
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

export default ProjectTaskDetail;
