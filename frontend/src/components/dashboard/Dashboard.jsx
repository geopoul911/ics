import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaUsers, FaProjectDiagram, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';
import StatisticsCard from './StatisticsCard';
import ProjectStatusChart from './charts/ProjectStatusChart';
import MonthlyRevenueChart from './charts/MonthlyRevenueChart';
import TaskCompletionChart from './charts/TaskCompletionChart';
import RecentActivities from './RecentActivities';
import TopClients from './TopClients';
import OverdueItems from './OverdueItems';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalDocuments: 0,
    totalRevenue: 0,
    activeProjects: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/dashboard/stats/');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">
            <FaProjectDiagram className="me-2" />
            Dashboard Overview
          </h2>
          <p className="text-muted">Welcome to your Client Management System dashboard</p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<FaUsers />}
            color="primary"
            trend="+12%"
            trendUp={true}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={<FaProjectDiagram />}
            color="success"
            trend="+8%"
            trendUp={true}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Total Documents"
            value={stats.totalDocuments}
            icon={<FaFileAlt />}
            color="info"
            trend="+15%"
            trendUp={true}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatisticsCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<FaMoneyBillWave />}
            color="warning"
            trend="+23%"
            trendUp={true}
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Monthly Revenue Trend</Card.Title>
              <MonthlyRevenueChart />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Project Status Distribution</Card.Title>
              <ProjectStatusChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second Charts Row */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Task Completion Rate</Card.Title>
              <TaskCompletionChart />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Overdue Items</Card.Title>
              <OverdueItems />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row>
        <Col lg={8} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Recent Activities</Card.Title>
              <RecentActivities />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Top Clients</Card.Title>
              <TopClients />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
