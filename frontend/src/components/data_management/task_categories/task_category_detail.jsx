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

const TaskCategoryDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orderindex: 0,
    active: true
  });
  const [errors, setErrors] = useState({});

  const loadTaskCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGet(`${API_ENDPOINTS.TASK_CATEGORIES}${id}/`);
      const category = response.data;
      setFormData({
        title: category.title || '',
        description: category.description || '',
        orderindex: category.orderindex || 0,
        active: category.active !== undefined ? category.active : true
      });
    } catch (error) {
      console.error('Error loading task category:', error);
      Swal.fire('Error', 'Failed to load task category', 'error');
      history.push('/data_management/task_categories');
    } finally {
      setIsLoading(false);
    }
  }, [id, history]);

  useEffect(() => {
    if (id && id !== 'new') {
      loadTaskCategory();
    } else if (id === 'new') {
      setIsCreating(true);
      setIsEditing(true);
    }
  }, [id, history, loadTaskCategory]);



  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.orderindex < 0) {
      newErrors.orderindex = 'Order index cannot be negative';
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
        await apiPost(API_ENDPOINTS.TASK_CATEGORIES, formData);
        Swal.fire('Success', 'Task category created successfully', 'success');
      } else {
        await apiPut(`${API_ENDPOINTS.TASK_CATEGORIES}${id}/`, formData);
        Swal.fire('Success', 'Task category updated successfully', 'success');
      }
      history.push('/data_management/task_categories');
    } catch (error) {
      console.error('Error saving task category:', error);
      Swal.fire('Error', 'Failed to save task category', 'error');
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
        await apiDelete(`${API_ENDPOINTS.TASK_CATEGORIES}${id}/`);
        Swal.fire('Deleted!', 'Task category has been deleted.', 'success');
        history.push('/data_management/task_categories');
      } catch (error) {
        console.error('Error deleting task category:', error);
        Swal.fire('Error', 'Failed to delete task category', 'error');
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
          {isCreating ? 'New Task Category' : 'Task Category Details'}
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
            onClick={() => history.push('/data_management/task_categories')}
          >
            Back to List
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    isInvalid={!!errors.title}
                    disabled={!isEditing}
                    placeholder="Enter category title"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Order Index</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.orderindex}
                    onChange={(e) => setFormData({ ...formData, orderindex: parseInt(e.target.value) || 0 })}
                    isInvalid={!!errors.orderindex}
                    disabled={!isEditing}
                    min="0"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.orderindex}
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
                placeholder="Enter category description"
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
                      history.push('/data_management/task_categories');
                    } else {
                      setIsEditing(false);
                      loadTaskCategory();
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

export default TaskCategoryDetail;
