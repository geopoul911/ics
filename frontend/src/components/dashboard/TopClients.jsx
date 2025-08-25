import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Spinner } from 'react-bootstrap';
import { FaCrown, FaMedal, FaAward } from 'react-icons/fa';
import { apiGet } from '../../utils/api';

const TopClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopClients();
  }, []);

  const loadTopClients = async () => {
    try {
      const response = await apiGet('/api/dashboard/top-clients/');
      if (response.success) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error loading top clients:', error);
      // Fallback data
      setClients([
        {
          id: 1,
          name: 'ABC Corporation',
          revenue: 125000,
          projects: 8,
          status: 'active',
          rank: 1
        },
        {
          id: 2,
          name: 'XYZ Industries',
          revenue: 98000,
          projects: 6,
          status: 'active',
          rank: 2
        },
        {
          id: 3,
          name: 'Tech Solutions Ltd',
          revenue: 75000,
          projects: 5,
          status: 'active',
          rank: 3
        },
        {
          id: 4,
          name: 'Global Enterprises',
          revenue: 62000,
          projects: 4,
          status: 'active',
          rank: 4
        },
        {
          id: 5,
          name: 'Innovation Corp',
          revenue: 48000,
          projects: 3,
          status: 'active',
          rank: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-warning" />;
      case 2:
        return <FaMedal className="text-secondary" />;
      case 3:
        return <FaAward className="text-warning" />;
      default:
        return <span className="text-muted">{rank}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      default:
        return <Badge bg="info">Unknown</Badge>;
    }
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
      {clients.map((client) => (
        <ListGroup.Item key={client.id} className="d-flex align-items-center border-0 px-0">
          <div className="me-3 d-flex align-items-center" style={{ width: '30px' }}>
            {getRankIcon(client.rank)}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">{client.name}</h6>
                <div className="d-flex align-items-center gap-3">
                  <small className="text-muted">
                    ${client.revenue.toLocaleString()}
                  </small>
                  <small className="text-muted">
                    {client.projects} projects
                  </small>
                </div>
              </div>
              <div className="ms-2">
                {getStatusBadge(client.status)}
              </div>
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TopClients;
