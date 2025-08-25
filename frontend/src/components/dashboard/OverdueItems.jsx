import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Spinner, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { apiGet } from '../../utils/api';

const OverdueItems = () => {
  const [overdueItems, setOverdueItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverdueItems();
  }, []);

  const loadOverdueItems = async () => {
    try {
      const response = await apiGet('/api/dashboard/overdue-items/');
      if (response.success) {
        setOverdueItems(response.data);
      }
    } catch (error) {
      console.error('Error loading overdue items:', error);
      // Fallback data
      setOverdueItems([
        {
          id: 1,
          type: 'task',
          title: 'Final Review',
          project: 'Website Redesign',
          dueDate: '2024-01-15',
          daysOverdue: 3,
          priority: 'high',
          assignee: 'John Doe'
        },
        {
          id: 2,
          type: 'project',
          title: 'Mobile App Development',
          project: 'Mobile App Development',
          dueDate: '2024-01-20',
          daysOverdue: 1,
          priority: 'medium',
          assignee: 'Jane Smith'
        },
        {
          id: 3,
          type: 'task',
          title: 'Content Creation',
          project: 'Marketing Campaign',
          dueDate: '2024-01-12',
          daysOverdue: 5,
          priority: 'high',
          assignee: 'Mike Johnson'
        },
        {
          id: 4,
          type: 'task',
          title: 'Database Optimization',
          project: 'System Upgrade',
          dueDate: '2024-01-18',
          daysOverdue: 2,
          priority: 'medium',
          assignee: 'Sarah Wilson'
        }
      ]);
    } finally {
      setLoading(false);
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'task':
        return <FaClock className="text-warning" />;
      case 'project':
        return <FaCalendarAlt className="text-danger" />;
      default:
        return <FaExclamationTriangle className="text-danger" />;
    }
  };

  const formatDueDate = (dueDate) => {
    return new Date(dueDate).toLocaleDateString();
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Overdue Items ({overdueItems.length})</h6>
        <Button variant="outline-primary" size="sm">
          View All
        </Button>
      </div>
      <ListGroup variant="flush">
        {overdueItems.map((item) => (
          <ListGroup.Item key={item.id} className="d-flex align-items-start border-0 px-0">
            <div className="me-3 mt-1">
              {getTypeIcon(item.type)}
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{item.title}</h6>
                  <p className="mb-1 text-muted small">{item.project}</p>
                  <div className="d-flex align-items-center gap-3">
                    <small className="text-muted">
                      Due: {formatDueDate(item.dueDate)}
                    </small>
                    <small className="text-danger">
                      {item.daysOverdue} day{item.daysOverdue > 1 ? 's' : ''} overdue
                    </small>
                  </div>
                  <small className="text-muted">
                    Assigned to: {item.assignee}
                  </small>
                </div>
                <div className="ms-2">
                  {getPriorityBadge(item.priority)}
                </div>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {overdueItems.length === 0 && (
        <div className="text-center py-4 text-muted">
          <FaExclamationTriangle className="mb-2" />
          <p>No overdue items</p>
        </div>
      )}
    </div>
  );
};

export default OverdueItems;
