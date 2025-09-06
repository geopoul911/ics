// Built-ins
import React from "react";

// Icons / Images
import { MdLink, MdFolder, MdTask } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import axios from "axios";

// Global Variables
import { headers, pageHeader, loader } from "../../../global_vars";

const VIEW_CLIENT = "http://localhost:8000/api/data_management/client/";
const VIEW_PROJECT = "http://localhost:8000/api/data_management/project/";

function getClientIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("client");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

// Reusable styles for list-style UI
const labelPillStyle = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "999px",
  background: "#f5f5f5",
  color: "#666",
  fontSize: 12,
  fontWeight: 600,
};

const valueTextStyle = {
  fontWeight: 700,
};

class ClientProjectsProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      is_loaded: false,
      projects: [], // [{...project, tasks: [], cash_transactions: [], properties: []}]
      properties: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    try {
      const currentHeaders = { ...headers, Authorization: "Token " + localStorage.getItem("userToken") };
      const clientId = getClientIdFromPath();
      const res = await axios.get(`${VIEW_CLIENT}${clientId}/`, { headers: currentHeaders });
      const client = res?.data || {};
      const associatedClients = Array.isArray(client?.associated_projects) ? client.associated_projects : [];
      const baseProjects = associatedClients.map((ac) => ac.project).filter(Boolean);

      // Fetch each project's details (to get tasks, cash and properties)
      const detailPromises = baseProjects.map((p) => axios.get(`${VIEW_PROJECT}${p.project_id}/`, { headers: currentHeaders }));
      const detailResponses = await Promise.all(detailPromises.map((pr) => pr.catch((e) => ({ error: e }))));

      const projects = detailResponses.map((r, idx) => {
        const fallback = baseProjects[idx] || {};
        if (r && r.data) {
          const d = r.data;
          return {
            ...fallback,
            ...d,
            tasks: Array.isArray(d.tasks) ? d.tasks : [],
            cash_transactions: Array.isArray(d.cash_transactions) ? d.cash_transactions : [],
            properties: Array.isArray(d.properties) ? d.properties : [],
          };
        }
        return { ...fallback, tasks: [], cash_transactions: [], properties: [] };
      });

      // Aggregate properties across projects
      const properties = projects.flatMap((p) => Array.isArray(p.properties) ? p.properties : []);

      this.setState({ client, projects, properties, is_loaded: true });
    } catch (e) {
      if (e?.response?.status === 401) {
        this.setState({ forbidden: true });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "An unknown error has occurred." });
      }
    }
  };

  render() {
    const { client } = this.state;
    if (!this.state.is_loaded) {
      return (
        <>
          <div className="rootContainer">
            {pageHeader("client_projects_properties", `${client.surname || ''} ${client.name || ''}`.trim() || "Client")}
            {loader()}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="rootContainer">
          {pageHeader("client_projects_properties", `${client.surname || ''} ${client.name || ''}`.trim() || "Client")}
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>

            <Grid stackable columns={2}>
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdLink style={overviewIconStyle} /> Projects, tasks and cash
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.projects) && this.state.projects.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.projects.map((p, pidx) => (
                          <li key={p.project_id || pidx} style={{ padding: '16px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{pidx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/project/${p.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{p.project_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Title</span>
                              <span style={valueTextStyle}>{p.title || 'N/A'}</span>
                              {p.status ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{p.status}</span>
                              </>) : null}
                            </div>

                            {/* Tasks for this project */}
                            <div style={{ marginTop: 10, paddingLeft: 12 }}>
                              <div style={{ marginBottom: 6, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                <MdTask style={{ ...overviewIconStyle, marginRight: 6 }} /> Tasks
                              </div>
                              {Array.isArray(p.tasks) && p.tasks.length > 0 ? (
                                <ul className="list-unstyled" style={{ margin: 0 }}>
                                  {p.tasks.map((t, tidx) => (
                                    <li key={t.projtask_id || tidx} style={{ padding: '6px 0' }}>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                        <span style={labelPillStyle}>#</span>
                                        <span style={valueTextStyle}>{tidx + 1}</span>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>ID</span>
                                        <a href={`/data_management/project_task/${t.projtask_id}`} className="pillLink" style={{ ...valueTextStyle }}>{t.projtask_id}</a>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>Title</span>
                                        <span style={valueTextStyle}>{t.title}</span>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>Status</span>
                                        <span style={valueTextStyle}>{t.status || 'N/A'}</span>
                                        {t.deadline ? (<>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>Deadline</span>
                                          <span style={valueTextStyle}>{new Date(t.deadline).toLocaleDateString()}</span>
                                        </>) : null}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div style={{ color: '#666' }}>No tasks</div>
                              )}
                            </div>

                            {/* Cash for this project */}
                            <div style={{ marginTop: 10, paddingLeft: 12 }}>
                              <div style={{ marginBottom: 6, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                <MdTask style={{ ...overviewIconStyle, marginRight: 6 }} /> Cash
                              </div>
                              {Array.isArray(p.cash_transactions) && p.cash_transactions.length > 0 ? (
                                <ul className="list-unstyled" style={{ margin: 0 }}>
                                  {p.cash_transactions.map((c, cidx) => (
                                    <li key={c.cash_id || cidx} style={{ padding: '6px 0' }}>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                        <span style={labelPillStyle}>#</span>
                                        <span style={valueTextStyle}>{cidx + 1}</span>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>ID</span>
                                        <a href={`/data_management/cash/${c.cash_id}`} className="pillLink" style={{ ...valueTextStyle }}>{c.cash_id}</a>
                                        {c.trandate ? (<>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>Transaction date</span>
                                          <span style={valueTextStyle}>{new Date(c.trandate).toLocaleDateString()}</span>
                                        </>) : null}
                                        {c.kind ? (<>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>Kind</span>
                                          <span style={{ ...valueTextStyle, color: c.kind === 'E' ? '#c0392b' : '#27ae60' }}>
                                            {c.kind === 'E' ? 'Expense' : 'Payment'}
                                          </span>
                                        </>) : null}
                                        {(c.amountpay || c.amountexp) ? (<>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>{c.amountpay ? 'Amount payment' : 'Amount expense'}</span>
                                          <span style={valueTextStyle}>{c.amountpay || c.amountexp}</span>
                                        </>) : null}
                                        {c.currency ? (<>
                                          <span style={{ width: 10 }} />
                                          <span style={labelPillStyle}>Currency</span>
                                          <span style={valueTextStyle}>{c.currency}</span>
                                        </>) : null}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div style={{ color: '#666' }}>No cash entries</div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No projects</div>
                    )}
                  </Card.Body>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdFolder style={overviewIconStyle} /> Properties (from client's projects)
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.properties) && this.state.properties.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.properties.map((prop, idx) => (
                          <li key={prop.property_id || idx} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/property/${prop.property_id}`} className="pillLink" style={{ ...valueTextStyle }}>{prop.property_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Description</span>
                              <span style={valueTextStyle}>{prop.description}</span>
                              {prop.project?.title ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Project</span>
                                <a href={`/data_management/project/${prop.project?.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{prop.project?.title}</a>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No properties</div>
                    )}
                  </Card.Body>
                </Card>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default ClientProjectsProperties;


