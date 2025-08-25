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


const TaskCommentDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [projectTasks, setProjectTasks] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [formData, setFormData] = useState({
    project_task: '',
    commenttext: '',
    commenttype: 'general',
    author: '',
    commentdate: '',
    commenttime: '',
    isprivate: false,
    isurgent: false,
    requiresaction: false,
    actioncompleted: false,
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadReferenceData = useCallback(async () => {
    try {
      const [tasksRes, consultantsRes] = await Promise.all([
        apiGet(API_ENDPOINTS.PROJECT_TASKS),
        apiGet(API_ENDPOINTS.CONSULTANTS)
      ]);
      setProjectTasks(tasksRes.data);
      setConsultants(consultantsRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
      Swal.fire('Error', 'Failed to load reference data', 'error');
    }
  }, []);

  const loadTaskComment = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.TASK_COMMENTS}${id}/`);
      const comment = response.data;
      setFormData({
        project_task: comment.project_task || '',
        commenttext: comment.commenttext || '',
        commenttype: comment.commenttype || 'general',
        author: comment.author || '',
        commentdate: comment.commentdate ? comment.commentdate.split('T')[0] : '',
        commenttime: comment.commenttime || '',
        isprivate: comment.isprivate !== undefined ? comment.isprivate : false,
        isurgent: comment.isurgent !== undefined ? comment.isurgent : false,
        requiresaction: comment.requiresaction !== undefined ? comment.requiresaction : false,
        actioncompleted: comment.actioncompleted !== undefined ? comment.actioncompleted : false,
        active: comment.active !== undefined ? comment.active : true
      });
    } catch (error) {
      console.error('Error loading task comment:', error);
      Swal.fire('Error', 'Failed to load task comment', 'error');
      history.push('/data_management/task_comments');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    const initialize = async () => {
      await loadReferenceData();
      if (id && id !== 'new') {
        await loadTaskComment();
      } else if (id === 'new') {
        setIsCreating(true);
        setIsEditing(true);
        // Set default date and time for new comments
        const now = new Date();
        setFormData(prev => ({
          ...prev,
          commentdate: now.toISOString().split('T')[0],
          commenttime: now.toTimeString().slice(0, 5)
        }));
      }
    };

    initialize();
  }, [id, history, loadReferenceData, loadTaskComment]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_task) {
      newErrors.project_task = 'Project task is required';
    }

    if (!formData.commenttext.trim()) {
      newErrors.commenttext = 'Comment text is required';
    }

    if (!formData.author) {
      newErrors.author = 'Author is required';
    }

    if (!formData.commentdate) {
      newErrors.commentdate = 'Comment date is required';
    }

    if (!formData.commenttime) {
      newErrors.commenttime = 'Comment time is required';
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
        await apiPost(API_ENDPOINTS.TASK_COMMENTS, formData);
        Swal.fire('Success', 'Task comment created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.TASK_COMMENTS}${id}/`, formData);
        Swal.fire('Success', 'Task comment updated successfully', 'success');
      }
      history.push('/data_management/task_comments');
    } catch (error) {
      console.error('Error saving task comment:', error);
      Swal.fire('Error', 'Failed to save task comment', 'error');
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
        await apiDelete(`${API_ENDPOINTS.TASK_COMMENTS}${id}/`);
        Swal.fire('Deleted!', 'Task comment has been deleted.', 'success');
        history.push('/data_management/task_comments');
      } catch (error) {
        console.error('Error deleting task comment:', error);
        Swal.fire('Error', 'Failed to delete task comment', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getCommentTypeColor = (type) => {
    const colors = {
      general: 'secondary',
      urgent: 'danger',
      important: 'warning',
      info: 'info',
      success: 'success'
    };
    return colors[type] || 'secondary';
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
          {isCreating ? 'New Task Comment' : 'Task Comment Details'}
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
            onClick={() => history.push('/data_management/task_comments')}
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
                  <Form.Label>Project Task *</Form.Label>
                  <Form.Select
                    value={formData.project_task}
                    onChange={(e) => setFormData({ ...formData, project_task: e.target.value })}
                    isInvalid={!!errors.project_task}
                    disabled={!isEditing}
                  >
                    <option value="">Select Project Task</option>
                    {projectTasks.map(task => (
                      <option key={task.projtask_id} value={task.projtask_id}>
                        {task.title}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.project_task}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author *</Form.Label>
                  <Form.Select
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    isInvalid={!!errors.author}
                    disabled={!isEditing}
                  >
                    <option value="">Select Author</option>
                    {consultants.map(consultant => (
                      <option key={consultant.consultant_id} value={consultant.consultant_id}>
                        {consultant.firstname} {consultant.lastname}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.author}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Comment Type</Form.Label>
                  <Form.Select
                    value={formData.commenttype}
                    onChange={(e) => setFormData({ ...formData, commenttype: e.target.value })}
                    disabled={!isEditing}
                  >
                    <option value="general">General</option>
                    <option value="urgent">Urgent</option>
                    <option value="important">Important</option>
                    <option value="info">Information</option>
                    <option value="success">Success</option>
                  </Form.Select>
                  {!isEditing && (
                    <div className="mt-2">
                      <Badge bg={getCommentTypeColor(formData.commenttype)}>
                        {formData.commenttype.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Comment Date *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.commentdate}
                    onChange={(e) => setFormData({ ...formData, commentdate: e.target.value })}
                    isInvalid={!!errors.commentdate}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.commentdate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Comment Time *</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.commenttime}
                    onChange={(e) => setFormData({ ...formData, commenttime: e.target.value })}
                    isInvalid={!!errors.commenttime}
                    disabled={!isEditing}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.commenttime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Flags</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    <Form.Check
                      type="checkbox"
                      label="Private"
                      checked={formData.isprivate}
                      onChange={(e) => setFormData({ ...formData, isprivate: e.target.checked })}
                      disabled={!isEditing}
                      inline
                    />
                    <Form.Check
                      type="checkbox"
                      label="Urgent"
                      checked={formData.isurgent}
                      onChange={(e) => setFormData({ ...formData, isurgent: e.target.checked })}
                      disabled={!isEditing}
                      inline
                    />
                    <Form.Check
                      type="checkbox"
                      label="Requires Action"
                      checked={formData.requiresaction}
                      onChange={(e) => setFormData({ ...formData, requiresaction: e.target.checked })}
                      disabled={!isEditing}
                      inline
                    />
                    <Form.Check
                      type="checkbox"
                      label="Action Completed"
                      checked={formData.actioncompleted}
                      onChange={(e) => setFormData({ ...formData, actioncompleted: e.target.checked })}
                      disabled={!isEditing}
                      inline
                    />
                  </div>
                  {!isEditing && (
                    <div className="mt-2">
                      {formData.isprivate && <Badge bg="secondary" className="me-1">Private</Badge>}
                      {formData.isurgent && <Badge bg="danger" className="me-1">Urgent</Badge>}
                      {formData.requiresaction && <Badge bg="warning" className="me-1">Action Required</Badge>}
                      {formData.actioncompleted && <Badge bg="success" className="me-1">Completed</Badge>}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Comment Text *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.commenttext}
                onChange={(e) => setFormData({ ...formData, commenttext: e.target.value })}
                isInvalid={!!errors.commenttext}
                disabled={!isEditing}
                placeholder="Enter your comment here..."
              />
              <Form.Control.Feedback type="invalid">
                {errors.commenttext}
              </Form.Control.Feedback>
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
                      history.push('/data_management/task_comments');
                    } else {
                      setIsEditing(false);
                      loadTaskComment();
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

export default TaskCommentDetail;
