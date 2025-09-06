// Built-ins
import React from "react";

// Icons / Images
import { MdAccountBalance, MdFolder, MdLink } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import axios from "axios";
import AddBankClientAccountModal from "../../../modals/create/add_bank_client_account";
import AddAssociatedClientModal from "../../../modals/create/add_associated_client";
import AddDocumentModal from "../../../modals/create/add_document";
import AddBankProjectAccountModal from "../../../modals/create/add_bank_project_account";
// Delete buttons removed per request

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for client
const VIEW_CLIENT = "http://localhost:8000/api/data_management/client/";

// Helpers to read URL like: /data_management/client/<client_id>
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

// Helper to color-code project status
function projectStatusColor(status) {
  switch (status) {
    case 'Created':
      return '#c0392b'; // red
    case 'Assigned':
    case 'Inprogress':
      return '#e67e22'; // orange
    case 'Completed':
      return '#27ae60'; // green
    case 'Settled':
      return '#17a2b8'; // cyan
    case 'Abandoned':
      return '#7f8c8d'; // grey
    default:
      return '#333333';
  }
}

class ClientOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      is_loaded: false,
      bankAccounts: [],
      associatedClients: [],
      documents: [],
      bankProjectAccounts: [],
      projects: [],
      projectProperties: [],
    };
  }

  componentDidMount() {
    this.fetchClientData();
  }

  fetchClientData = () => {
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };
    const clientId = getClientIdFromPath();
    axios
      .get(`${VIEW_CLIENT}${clientId}/`, { headers: currentHeaders })
      .then((res) => {
        const client = res?.data || {};
        const bankAccounts = Array.isArray(res?.data?.bank_accounts) ? res.data.bank_accounts : [];
        const associatedClients = Array.isArray(res?.data?.associated_projects) ? res.data.associated_projects : [];
        const documents = Array.isArray(res?.data?.documents) ? res.data.documents : [];
        const bankProjectAccounts = Array.isArray(res?.data?.bank_project_accounts) ? res.data.bank_project_accounts : [];
        const projects = associatedClients.map((ac) => ac.project).filter(Boolean);
        this.setState({
          client,
          bankAccounts,
          associatedClients,
          documents,
          bankProjectAccounts,
          projects,
          is_loaded: true,
        });

        // Fetch properties that belong to the client's projects
        const projectIds = projects.map((p) => p.project_id);
        if (projectIds.length > 0) {
          axios
            .get(`http://localhost:8000/api/data_management/all_properties/`, { headers: currentHeaders })
            .then((prRes) => {
              const allProps = Array.isArray(prRes?.data?.all_properties) ? prRes.data.all_properties : [];
              const projectProperties = allProps.filter((prop) => projectIds.includes(prop.project?.project_id));
              this.setState({ projectProperties });
            })
            .catch(() => this.setState({ projectProperties: [] }));
        } else {
          this.setState({ projectProperties: [] });
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
      });
  }

  update_state = (updated) => {
    this.setState({ client: updated });
  };

  render() {
    const { client } = this.state;
    if (!this.state.is_loaded) {
      return (
        <>
          <div className="rootContainer">
            {pageHeader("client_overview", `${client.surname} ${client.name}`)}
            {loader()}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="rootContainer">
          {pageHeader("client_related", `${client.surname} ${client.name}`)}
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>
            <Grid stackable columns={2} divided>
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdAccountBalance style={overviewIconStyle} />
                      Bank client accounts
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.bankAccounts) && this.state.bankAccounts.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.bankAccounts.map((acc, idx) => (
                          <li key={acc.bankclientacco_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/bank_client_account/${acc.bankclientacco_id}`} className="pillLink" style={{ ...valueTextStyle }}>{acc.bankclientacco_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Account number</span>
                              <span style={valueTextStyle}>{acc.accountnumber || 'N/A'}</span>
                              {acc.iban ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>IBAN</span>
                                <span style={valueTextStyle}>{acc.iban}</span>
                              </>) : null}
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Bank</span>
                              <span style={valueTextStyle}>{acc.bank?.bankname || 'N/A'}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No bank client accounts</div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <AddBankClientAccountModal
                      refreshData={this.fetchClientData}
                      defaultClientId={this.state.client?.client_id}
                      lockClient={true}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdLink style={overviewIconStyle} /> Projects
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.projects) && this.state.projects.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.projects.map((p, idx) => (
                          <li key={p.project_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/project/${p.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{p.project_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Title</span>
                              <span style={valueTextStyle}>{p.title}</span>
                              {p.registrationdate ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Registered</span>
                                <span style={valueTextStyle}>{new Date(p.registrationdate).toLocaleDateString()}</span>
                              </>) : null}
                              {p.consultant ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Consultant</span>
                                <a href={`/administration/consultant/${(p.consultant.consultant_id || p.consultant)}`} className="pillLink" style={{ ...valueTextStyle }}>{p.consultant.consultant_id || p.consultant}</a>
                              </>) : null}
                              {p.filecode ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>File code</span>
                                <span style={valueTextStyle}>{p.filecode}</span>
                              </>) : null}
                              {p.status ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={{ ...valueTextStyle, color: projectStatusColor(p.status) }}>{p.status === 'Inprogress' ? 'In Progress' : p.status}</span>
                              </>) : null}
                              {p.deadline ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Deadline</span>
                                <span style={valueTextStyle}>{new Date(p.deadline).toLocaleDateString()}</span>
                              </>) : null}
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
                    {Array.isArray(this.state.projectProperties) && this.state.projectProperties.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.projectProperties.map((prop, idx) => (
                          <li key={prop.property_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/property/${prop.property_id}`} className="pillLink" style={{ ...valueTextStyle }}>{prop.property_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Description</span>
                              <span style={valueTextStyle}>{prop.description}</span>
                              {prop.location ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Location</span>
                                <span style={valueTextStyle}>{prop.location}</span>
                              </>) : null}
                              {prop.city ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>City</span>
                                <span style={valueTextStyle}>{prop.city?.title || prop.city?.name || ''}</span>
                              </>) : null}
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
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdLink style={overviewIconStyle} />
                      Associated clients
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.associatedClients) && this.state.associatedClients.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.associatedClients.map((ac, idx) => (
                          <li key={ac.assoclient_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/associated_client/${ac.assoclient_id}`} className="pillLink" style={{ ...valueTextStyle }}>{ac.assoclient_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Project</span>
                              <span style={valueTextStyle}>{ac.project?.title || 'N/A'}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Order by</span>
                              <span style={valueTextStyle}>{ac.orderindex ?? 'N/A'}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No associated clients</div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <AddAssociatedClientModal
                      refreshData={this.fetchClientData}
                      defaultClientId={this.state.client?.client_id}
                      lockClient={true}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdFolder style={overviewIconStyle} />
                      Documents
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.documents) && this.state.documents.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.documents.map((doc, idx) => (
                          <li key={doc.document_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/document/${doc.document_id}`} className="pillLink" style={{ ...valueTextStyle }}>{doc.document_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Title</span>
                              <span style={valueTextStyle}>{doc.title}</span>
                              {doc.project?.project_id ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Project</span>
                                <a href={`/data_management/project/${doc.project.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{doc.project.project_id}</a>
                              </>) : null}
                              {doc.validuntil ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Valid until</span>
                                <span style={valueTextStyle}>{new Date(doc.validuntil).toLocaleDateString()}</span>
                              </>) : null}
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Status</span>
                              <span style={valueTextStyle}>{doc.status || 'No status'}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No documents</div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <AddDocumentModal
                      refreshData={this.fetchClientData}
                      defaultClientId={this.state.client?.client_id}
                      lockClient={true}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdAccountBalance style={overviewIconStyle} />
                      Bank project accounts
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.bankProjectAccounts) && this.state.bankProjectAccounts.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.bankProjectAccounts.map((bpa, idx) => (
                          <li key={bpa.bankprojacco_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/bank_project_account/${bpa.bankprojacco_id}`} className="pillLink" style={{ ...valueTextStyle }}>{bpa.bankprojacco_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Project</span>
                              <span style={valueTextStyle}>{bpa.project?.title || 'N/A'}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Account number</span>
                              <a href={`/data_management/bank_client_account/${bpa.bankclientacco?.bankclientacco_id || ''}`} className="pillLink" style={{ ...valueTextStyle }}>{bpa.bankclientacco?.accountnumber || 'N/A'}</a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div>No bank project accounts</div>
                    )}
                  </Card.Body>
                  <Card.Footer>
                    <AddBankProjectAccountModal
                      refreshData={this.fetchClientData}
                      defaultClientId={this.state.client?.client_id}
                      lockClient={true}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default ClientOverview;
