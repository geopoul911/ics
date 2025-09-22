// Built-ins
import React, { useEffect, useState } from "react";

// Modules / Functions
import axios from "axios";
import { Card, Form, Row, Col } from "react-bootstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Grid } from "semantic-ui-react";

// Icons
import { FaListUl, FaFilter } from "react-icons/fa";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Global Vars
import { headers, pageHeader, loader } from "../../global_vars";

const LIST_AUDIT_EVENTS = "https://ultima.icsgr.com/api/administration/audit_events/";
const LIST_CONSULTANTS = "https://ultima.icsgr.com/api/administration/all_consultants/";



function Logs() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [events, setEvents] = useState([]);
  const [consultants, setConsultants] = useState([]);
  // default: last 30 days to tomorrow
  const toDateStr = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  const startDefault = new Date(today);
  startDefault.setDate(startDefault.getDate() - 30);
  const endDefault = new Date(today);
  endDefault.setDate(endDefault.getDate() + 1);
  const [filters, setFilters] = useState({ action: "", actor: "", success: "", start: toDateStr(startDefault), end: toDateStr(endDefault) });

  const loadData = async () => {
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) params[k] = v;
      });
      const res = await axios.get(LIST_AUDIT_EVENTS, { headers: currentHeaders, params });
      console.log(res?.data?.audit_events);
      setEvents(res?.data?.audit_events || []);
      setIsLoaded(true);
    } catch (e) {
      setEvents([]);
      setIsLoaded(true);
    }
  };

  const loadConsultants = async () => {
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const res = await axios.get(LIST_CONSULTANTS, { headers: currentHeaders });
      // API returns { all_consultants: [...] }
      const data = res?.data?.all_consultants || [];
      setConsultants(Array.isArray(data) ? data : []);
    } catch (e) {
      setConsultants([]);
    }
  };

  useEffect(() => {
    loadConsultants();
    // eslint-disable-next-line
  }, []);

  // Auto-apply filters when they change
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [filters.action, filters.actor, filters.success, filters.start, filters.end]);

  return (
    <>
      <NavigationBar />
      <div className="rootContainer">
        {pageHeader("administration_logs", "Audit Logs")}
        <div className="contentBody">
          <style>{`
            .pillLink { color: inherit; text-decoration: none; }
            .pillLink:hover { color: #93ab3c; text-decoration: none; }
            .audit-row-delete { background-color: rgba(220, 53, 69, 0.12); }
            .audit-row-update { background-color: rgba(0, 123, 255, 0.10); }
            .audit-row-create { background-color: rgba(40, 167, 69, 0.12); }
            .audit-row-failed { background-color: rgba(220, 20, 60, 0.25); }
            .audit-row-auth { background-color: rgba(255, 165, 0, 0.15); }
          `}</style>
          <Grid stackable columns={1}>
            <Grid.Column>
              <Card>
                <Card.Header>
                  <FaFilter style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Filters
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Action</Form.Label>
                          <Form.Control as="select" value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value })}>
                            <option value="">Any</option>
                            <option value="login">Login</option>
                            <option value="logout">Logout</option>
                            <option value="login_failed">Login Failed</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Actor (Consultant)</Form.Label>
                          <Form.Control as="select" value={filters.actor} onChange={(e) => setFilters({ ...filters, actor: e.target.value })}>
                            <option value="">Any</option>
                            {consultants.map((c) => (
                              <option key={c.consultant_id} value={c.consultant_id}>{c.fullname} ({c.consultant_id})</option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Success</Form.Label>
                          <Form.Control as="select" value={filters.success} onChange={(e) => setFilters({ ...filters, success: e.target.value })}>
                            <option value="">Any</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Start</Form.Label>
                          <Form.Control type="date" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value })} />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>End</Form.Label>
                          <Form.Control type="date" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value })} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Card style={{ marginTop: 20 }}>
                <Card.Header>
                  <FaListUl style={{ color: "#93ab3c", marginRight: "0.5em" }} /> Events
                </Card.Header>
                <Card.Body>
                  {!isLoaded ? (
                    loader()
                  ) : (
                    <ToolkitProvider
                      keyField="id"
                      data={events}
                      columns={[
                        { dataField: 'occurred_at', text: 'When', sort: true, filter: textFilter(), filterValue: (c) => (c ? new Date(c).toLocaleString() : ''), formatter: (c) => (c ? new Date(c).toLocaleString() : '') },
                        { dataField: 'actor', text: 'Actor', sort: true, filter: textFilter(), filterValue: (c, r) => (r && r.actor ? `${r.actor} (${r.actor_id || ''})` : ''), formatter: (c, r) => (r && r.actor ? `${r.actor} (${r.actor_id || ''})` : '-') },
                        { dataField: 'action', text: 'Action', sort: true, filter: textFilter() },
                        { dataField: 'target', text: 'Target', filter: textFilter(), filterValue: (c, r) => `${r.target?.model || ''} ${r.target?.object_id ? '(' + r.target.object_id + ')' : ''}`, formatter: (c, r) => `${r.target?.model || ''} ${r.target?.object_id ? '(' + r.target.object_id + ')' : ''}` },
                        { dataField: 'ip_address', text: 'IP', filter: textFilter() },
                        { dataField: 'success', text: 'Success', filter: textFilter(), filterValue: (c) => (c ? 'Yes' : 'No'), formatter: (c) => (c ? 'Yes' : 'No') },
                        { dataField: 'message', text: 'Message', filter: textFilter() },
                        { dataField: 'metadata', text: 'Changes', filter: textFilter(), filterValue: (c) => {
                          const changes = c && c.changes ? c.changes : null;
                          if (!changes) return '';
                          try {
                            return Object.entries(changes).map(([k, v]) => `${k}: ${v.old ?? ''} → ${v.new ?? ''}`).join('; ');
                          } catch (e) { return ''; }
                        }, formatter: (c) => {
                          if (!c) return '';
                          const changes = c && c.changes ? c.changes : null;
                          if (!changes) return '';
                          try {
                            const parts = Object.entries(changes).map(([k, v]) => `${k}: ${v.old ?? ''} → ${v.new ?? ''}`);
                            return parts.join('; ');
                          } catch (e) { return ''; }
                        }},
                      ]}
                      rowClasses={(row) => {
                        const action = (row.action || '').toLowerCase();
                        const success = !!row.success;
                        if (action === 'delete') return 'audit-row-delete';
                        if (action === 'update') return 'audit-row-update';
                        if (action === 'create') return 'audit-row-create';
                        if (action === 'login_failed' || (!success && (action.includes('login') || action.includes('auth')))) return 'audit-row-failed';
                        if (action.includes('login') || action.includes('logout') || action.includes('auth')) return 'audit-row-auth';
                        return '';
                      }}
                    >
                      {(props) => (
                        <BootstrapTable
                          {...props.baseProps}
                          bootstrap4
                          hover
                          condensed
                          bordered={false}
                          pagination={paginationFactory({ sizePerPage: 10 })}
                          filter={filterFactory()}
                          rowClasses={(row) => {
                            const action = (row.action || '').toLowerCase();
                            const success = !!row.success;
                            if (action === 'delete') return 'audit-row-delete';
                            if (action === 'update') return 'audit-row-update';
                            if (action === 'create') return 'audit-row-create';
                            if (action === 'login_failed' || (!success && (action.includes('login') || action.includes('auth')))) return 'audit-row-failed';
                            if (action.includes('login') || action.includes('logout') || action.includes('auth')) return 'audit-row-auth';
                            return '';
                          }}
                        />
                      )}
                    </ToolkitProvider>
                  )}
                </Card.Body>
              </Card>
            </Grid.Column>
          </Grid>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Logs;


