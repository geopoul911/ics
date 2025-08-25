import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Spinner } from 'react-bootstrap';
import { FaUser, FaProjectDiagram, FaFileAlt, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { apiGet } from '../../utils/api';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      const response = await apiGet('/api/dashboard/recent-activities/');
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Error loading recent activities:', error);
      // Fallback data
      setActivities([
        {
          id: 1,
          type: 'project',
          action: 'Project created',
          description: 'New project "Website Redesign" was created',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          priority: 'normal'
        },
        {
          id: 2,
          type: 'client',
          action: 'Client updated',
          description: 'Client information for "ABC Corp" was updated',
          user: 'Jane Smith',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          priority: 'normal'
        },
        {
          id: 3,
          type: 'task',
          action: 'Task completed',
          description: 'Task "Design Review" was marked as completed',
          user: 'Mike Johnson',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          priority: 'high'
        },
        {
          id: 4,
          type: 'document',
          action: 'Document uploaded',
          description: 'New document "Contract.pdf" was uploaded',
          user: 'Sarah Wilson',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          priority: 'normal'
        },
        {
          id: 5,
          type: 'alert',
          action: 'Overdue task',
          description: 'Task "Final Review" is overdue by 2 days',
          user: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          priority: 'high'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return <FaProjectDiagram className="text-primary" />;
      case 'client':
        return <FaUser className="text-success" />;
      case 'task':
        return <FaCalendarAlt className="text-warning" />;
      case 'document':
        return <FaFileAlt className="text-info" />;
      case 'alert':
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaUser className="text-secondary" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge bg="danger">High</Badge>;
      case 'medium':
        return <Badge bg="warning">Medium</Badge>;
      case 'low':
        return <Badge bg="secondary">Low</Badge>;
      default:
        return <Badge bg="info">Normal</Badge>;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <ListGroup variant="flush">
      {activities.map((activity) => (
        <ListGroup.Item key={activity.id} className="d-flex align-items-start border-0 px-0">
          <div className="me-3 mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{activity.action}</h6>
                <p className="mb-1 text-muted small">{activity.description}</p>
                <small className="text-muted">
                  by {activity.user} • {formatTimestamp(activity.timestamp)}
                </small>
              </div>
              <div className="ms-2">
                {getPriorityBadge(activity.priority)}
              </div>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RecentActivities;
