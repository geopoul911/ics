// Built-ins
import React from "react";

// Icons / Images
import { MdAccountBalance, MdFolder, MdLink } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Container } from "semantic-ui-react";
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
  formatAmountWithCurrency,
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
      projectDetailsById: {},
      cashEntries: [],
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

          // Fetch project details (categories, tasks, task comments, cash)
          const detailPromises = projectIds.map((pid) =>
            axios.get(`http://localhost:8000/api/data_management/project/${pid}/`, { headers: currentHeaders })
              .then((r) => ({ pid, data: r?.data || {} }))
              .catch(() => ({ pid, data: {} }))
          );
          Promise.all(detailPromises).then((arr) => {
            const byId = {};
            const cashEntries = [];
            arr.forEach(({ pid, data }) => {
              byId[pid] = data;
              const cashList = Array.isArray(data?.cash_transactions) ? data.cash_transactions : [];
              cashList.forEach((c) => cashEntries.push(c));
            });
            this.setState({ projectDetailsById: byId, cashEntries });
          });
        } else {
          this.setState({ projectProperties: [], cashEntries: [] });
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

    // Determine which section to display based on props.section
    const section = (this.props.section || '').toLowerCase();

    const showProjects = section === 'projects' || !section;
    const showProperties = section === 'properties';
    const showBankClientAccounts = section === 'bank_client_accounts';
    const showAssociatedClients = section === 'associated_clients';
    const showDocuments = section === 'documents';
    const showBankProjectAccounts = section === 'bank_project_accounts';
    const showCash = section === 'cash';

    return (
      <>
        <div className="rootContainer">
          {(() => {
            const section = (this.props.section || '').toLowerCase();
            const headerKey =
              section === 'projects' ? 'client_related_projects' :
              section === 'properties' ? 'client_related_properties' :
              section === 'bank_client_accounts' ? 'client_related_bank_client_accounts' :
              section === 'associated_clients' ? 'client_related_associated_clients' :
              section === 'documents' ? 'client_related_documents' :
              section === 'cash' ? 'client_related_cash' :
              section === 'bank_project_accounts' ? 'client_related_bank_project_accounts' :
              'client_related';
            return pageHeader(headerKey, `${client.surname} ${client.name}`);
          })()}
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>
            <Grid stackable columns={2} divided>
              {showCash && (
              <Container>
              <Grid.Column>
                {Array.isArray(this.state.cashEntries) && this.state.cashEntries.length > 0 ? (
                  this.state.cashEntries.map((c) => (
                    <Card
                      key={c.cash_id}
                      style={{
                        marginTop: 16,
                        border: `2px solid ${c.kind === 'E' ? '#c0392b' : (c.kind === 'P' ? '#27ae60' : '#e5e5e5')}`,
                      }}
                    >
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdAccountBalance style={overviewIconStyle} />
                        </h5>
                        <a
                          href={`/data_management/cash/${c.cash_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{c.cash_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          <span style={labelPillStyle}>Project</span>
                          {c.project?.project_id ? (
                            <a
                              href={`/data_management/project/${c.project.project_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              #{c.project.project_id}
                            </a>
                          ) : (
                            <span style={valueTextStyle}>{c.project?.title || '—'}</span>
                          )}
                          {c.country?.title ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Country</span>
                            <span style={valueTextStyle}>{c.country.title}</span>
                          </>) : null}
                          {c.trandate ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Transaction date</span>
                            <span style={valueTextStyle}>{new Date(c.trandate).toLocaleDateString()}</span>
                          </>) : null}
                          {c.consultant ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Consultant</span>
                            <a
                              href={`/administration/consultant/${(c.consultant?.consultant_id || c.consultant)}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              {c.consultant?.consultant_id || c.consultant}
                            </a>
                          </>) : null}
                          {c.kind ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Kind</span>
                            <span style={valueTextStyle}>{c.kind === 'E' ? 'Expense' : 'Payment'}</span>
                          </>) : null}
                          {(c.amountexp || c.amountpay) ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Amount</span>
                            <span style={valueTextStyle}>{formatAmountWithCurrency(c.amountexp || c.amountpay, c.country?.currency || '')}</span>
                          </>) : null}
                          {c.reason ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Reason</span>
                            <span style={valueTextStyle}>{c.reason}</span>
                          </>) : null}
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Card style={{ marginTop: 20 }}><Card.Body><div>No cash entries</div></Card.Body></Card>
                )}
              </Grid.Column>
              </Container>
              )}
              {showBankClientAccounts && (
                <Container>
              <Grid.Column>
                {Array.isArray(this.state.bankAccounts) && this.state.bankAccounts.length > 0 ? (
                  this.state.bankAccounts.map((acc) => (
                    <Card key={acc.bankclientacco_id} style={{ marginTop: 16 }}>
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdAccountBalance style={overviewIconStyle} />
                        </h5>
                        <a
                          href={`/data_management/bank_client_account/${acc.bankclientacco_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{acc.bankclientacco_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          <span style={labelPillStyle}>Account number</span>
                          <span style={valueTextStyle}>{acc.accountnumber || '—'}</span>
                          {acc.iban ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>IBAN</span>
                            <span style={valueTextStyle}>{acc.iban}</span>
                          </>) : null}
                          {acc.transitnumber ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Branch</span>
                            <span style={valueTextStyle}>{acc.transitnumber}</span>
                          </>) : null}
                          <span style={{ width: 10 }} />
                          <span style={labelPillStyle}>Bank</span>
                          {acc.bank?.bank_id ? (
                            <a
                              href={`/administration/bank/${acc.bank.bank_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              {acc.bank?.bankname || acc.bank.bank_id}
                            </a>
                          ) : (
                            <span style={valueTextStyle}>{acc.bank?.bankname || '—'}</span>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Card style={{ marginTop: 20 }}><Card.Body><div>No bank client accounts</div></Card.Body></Card>
                )}
                <div style={{ marginTop: 12 }}>
                  <AddBankClientAccountModal
                    refreshData={this.fetchClientData}
                    defaultClientId={this.state.client?.client_id}
                    lockClient={true}
                  />
                </div>
              </Grid.Column>
              </Container>
              )}
              {showProjects && (
                <>
                <Container>
                  <Grid.Column>
                    {Array.isArray(this.state.projects) && this.state.projects.length > 0 ? (
                      this.state.projects.map((p) => {
                        const d = this.state.projectDetailsById[p.project_id] || {};
                        const categories = Array.isArray(d.categories) ? d.categories : [];
                        return (
                          <Card key={p.project_id} style={{ marginTop: 16 }}>
                            <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <h5 style={{ margin: 0 }}>
                                <MdLink style={overviewIconStyle} /> {p.title}
                              </h5>
                              <a
                                href={`/data_management/project/${p.project_id}`}
                                className="btn btn-sm btn-success"
                                style={{ padding: '2px 10px', borderRadius: 6 }}
                              >
                                #{p.project_id}
                              </a>
                            </Card.Header>
                            <Card.Body>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>File code</span>
                                <span style={valueTextStyle}>{p.filecode || '—'}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>User</span>
                                {(d.registrationuser || p.registrationuser) ? (
                                  <span style={valueTextStyle}>{d.registrationuser || p.registrationuser}</span>
                                ) : (
                                  <span style={valueTextStyle}>—</span>
                                )}
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Consultant</span>
                                {(p.consultant?.consultant_id || p.consultant) ? (
                                  <a
                                    href={`/administration/consultant/${(p.consultant?.consultant_id || p.consultant)}`}
                                    className="btn btn-sm btn-success"
                                    style={{ padding: '2px 10px', borderRadius: 6 }}
                                  >
                                    {p.consultant?.consultant_id || p.consultant}
                                  </a>
                                ) : (
                                  <span style={valueTextStyle}>—</span>
                                )}
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={{ ...valueTextStyle, color: projectStatusColor(p.status) }}>{p.status === 'Inprogress' ? 'In Progress' : (p.status || '—')}</span>
                                {p.deadline ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Deadline</span>
                                  <span style={valueTextStyle}>{new Date(p.deadline).toLocaleDateString()}</span>
                                </>) : null}
                              </div>
                              {(d.details || d.notes) && (
                                <div style={{ marginTop: 10 }}>
                                  {d.details && (<>
                                    <div className={"info_descr"}>Details</div>
                                    <div className={"info_span"}>{d.details}</div>
                                  </>)}
                                  {d.notes && (<>
                                    <div className={"info_descr"} style={{ marginTop: 10 }}>Notes</div>
                                    <div className={"info_span"}>{d.notes}</div>
                                  </>)}
                                </div>
                              )}
                              <div style={{ marginTop: 10 }}>
                                <div className={"info_descr"}>Categories</div>
                                <div className={"info_span"}>
                                  {categories.length > 0 ? categories.map(c => c.title).join(', ') : '—'}
                                </div>
                              </div>
                              {/* Cash removed per request */}
                            </Card.Body>
                          </Card>
                        );
                      })
                    ) : (
                      <Card style={{ marginTop: 20 }}><Card.Body><div>No projects</div></Card.Body></Card>
                    )}
                  </Grid.Column>
                </Container>
              </>
              )}
              {showProperties && (
              <Container>
              <Grid.Column>
                    {Array.isArray(this.state.projectProperties) && this.state.projectProperties.length > 0 ? (
                      this.state.projectProperties.map((prop) => (
                        <Card key={prop.property_id} style={{ marginTop: 16 }}>
                          <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h5 style={{ margin: 0 }}>
                              <MdFolder style={overviewIconStyle} /> {prop.description || 'Property'}
                            </h5>
                            <a
                              href={`/data_management/property/${prop.property_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              #{prop.property_id}
                            </a>
                          </Card.Header>
                          <Card.Body>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                              <span style={labelPillStyle}>Project</span>
                              {prop.project?.project_id ? (
                                <a
                                  href={`/data_management/project/${prop.project.project_id}`}
                                  className="btn btn-sm btn-success"
                                  style={{ padding: '2px 10px', borderRadius: 6 }}
                                >
                                  #{prop.project.project_id}
                                </a>
                              ) : (
                                <span style={valueTextStyle}>—</span>
                              )}
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Type</span>
                              <span style={valueTextStyle}>{prop.type || '—'}</span>
                              {prop.location ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Location</span>
                                <span style={valueTextStyle}>{prop.location}</span>
                              </>) : null}
                              {prop.constructyear ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Construction year</span>
                                <span style={valueTextStyle}>{prop.constructyear}</span>
                              </>) : null}
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Country</span>
                              <span style={valueTextStyle}>{prop.country?.title || '—'}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Province</span>
                              <span style={valueTextStyle}>{prop.province?.title || '—'}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>City</span>
                              <span style={valueTextStyle}>{prop.city?.title || '—'}</span>
                              {prop.status ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{prop.status}</span>
                              </>) : null}
                              {prop.market ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Market</span>
                                <span style={valueTextStyle}>{prop.market}</span>
                              </>) : null}
                              {prop.broker ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Broker</span>
                                <span style={valueTextStyle}>{prop.broker}</span>
                              </>) : null}
                            </div>
                            {prop.notes && (
                              <div style={{ marginTop: 10 }}>
                                <div className={"info_descr"}>Notes</div>
                                <div className={"info_span"}>{prop.notes}</div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <div>No properties</div>
                    )}
                </Grid.Column>
              </Container>
              )}
              {showAssociatedClients && (
              <Container>
              <Grid.Column>
                {Array.isArray(this.state.associatedClients) && this.state.associatedClients.length > 0 ? (
                  this.state.associatedClients.map((ac) => (
                    <Card key={ac.assoclient_id} style={{ marginTop: 16 }}>
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdLink style={overviewIconStyle} />
                        </h5>
                        <a
                          href={`/data_management/associated_client/${ac.assoclient_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{ac.assoclient_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          <span style={labelPillStyle}>Project</span>
                          {ac.project?.project_id ? (
                            <>
                              <a
                                href={`/data_management/project/${ac.project.project_id}`}
                                className="btn btn-sm btn-success"
                                style={{ padding: '2px 10px', borderRadius: 6 }}
                              >
                                #{ac.project.project_id}
                              </a>
                            </>
                          ) : (
                            <span style={valueTextStyle}>{ac.project?.title || '—'}</span>
                          )}
                          <span style={{ width: 10 }} />
                          <span style={labelPillStyle}>Order by</span>
                          <span style={valueTextStyle}>{ac.orderindex ?? '—'}</span>
                        </div>
                        {ac.notes && (
                          <div style={{ marginTop: 10 }}>
                            <div className={"info_descr"}>Notes</div>
                            <div className={"info_span"}>{ac.notes}</div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Card style={{ marginTop: 20 }}><Card.Body><div>No associated clients</div></Card.Body></Card>
                )}
                <div style={{ marginTop: 12 }}>
                  <AddAssociatedClientModal
                    refreshData={this.fetchClientData}
                    defaultClientId={this.state.client?.client_id}
                    lockClient={true}
                  />
                </div>
              </Grid.Column>
              </Container>  
              )}
              {showDocuments && (
              <Container>
              <Grid.Column>
                {Array.isArray(this.state.documents) && this.state.documents.length > 0 ? (
                  this.state.documents.map((doc) => (
                    <Card key={doc.document_id} style={{ marginTop: 16 }}>
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdFolder style={overviewIconStyle} /> {doc.title || 'Document'}
                        </h5>
                        <a
                          href={`/data_management/document/${doc.document_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{doc.document_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {doc.created ? (<>
                            <span style={labelPillStyle}>Created</span>
                            <span style={valueTextStyle}>{new Date(doc.created).toLocaleDateString()}</span>
                          </>) : null}
                          <span style={{ width: 10 }} />
                          <span style={labelPillStyle}>Title</span>
                          <span style={valueTextStyle}>{doc.title || '—'}</span>
                          {doc.project?.project_id ? (<>
                            <span style={labelPillStyle}>Project</span>
                            <a
                              href={`/data_management/project/${doc.project.project_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              #{doc.project.project_id}
                            </a>
                          </>) : null}
                          {typeof doc.original === 'boolean' ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Original</span>
                            <span style={valueTextStyle}>{doc.original ? 'Yes' : 'No'}</span>
                          </>) : null}
                          {typeof doc.trafficable === 'boolean' ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Trafficable</span>
                            <span style={valueTextStyle}>{doc.trafficable ? 'Yes' : 'No'}</span>
                          </>) : null}
                          {doc.validuntil ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Valid until</span>
                            <span style={valueTextStyle}>{new Date(doc.validuntil).toLocaleDateString()}</span>
                          </>) : null}
                          <span style={{ width: 10 }} />
                          <span style={labelPillStyle}>Status</span>
                          <span style={valueTextStyle}>{doc.status || 'No status'}</span>
                          {doc.statusdate ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Status date</span>
                            <span style={valueTextStyle}>{new Date(doc.statusdate).toLocaleDateString()}</span>
                          </>) : null}
                        </div>
                        {doc.logstatus ? (
                          <div style={{ marginTop: 10 }}>
                            <div className={"info_descr"}>Log status</div>
                            <div className={"info_span"}>{doc.logstatus}</div>
                          </div>
                        ) : null}
                        {doc.notes ? (
                          <div style={{ marginTop: 10 }}>
                            <div className={"info_descr"}>Notes</div>
                            <div className={"info_span"}>{doc.notes}</div>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Card style={{ marginTop: 20 }}><Card.Body><div>No documents</div></Card.Body></Card>
                )}
                <div style={{ marginTop: 12 }}>
                  <AddDocumentModal
                    refreshData={this.fetchClientData}
                    defaultClientId={this.state.client?.client_id}
                    lockClient={true}
                  />
                </div>
              </Grid.Column>
              </Container>
              )}
              {showBankProjectAccounts && (
              <Container>
              <Grid.Column>
                {Array.isArray(this.state.bankProjectAccounts) && this.state.bankProjectAccounts.length > 0 ? (
                  this.state.bankProjectAccounts.map((bpa) => (
                    <Card key={bpa.bankprojacco_id} style={{ marginTop: 16 }}>
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdAccountBalance style={overviewIconStyle} />
                        </h5>
                        <a
                          href={`/data_management/bank_project_account/${bpa.bankprojacco_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{bpa.bankprojacco_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {bpa.project?.project_id ? (<>
                            <span style={labelPillStyle}>Project</span>
                            <a
                              href={`/data_management/project/${bpa.project.project_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              #{bpa.project.project_id}
                            </a>
                          </>) : (
                            <>
                              <span style={labelPillStyle}>Project</span>
                              <span style={valueTextStyle}>{bpa.project?.title || '—'}</span>
                            </>
                          )}
                          <span style={{ width: 10 }} />
                          <span style={labelPillStyle}>Bank client account</span>
                          {bpa.bankclientacco?.bankclientacco_id ? (
                            <a
                              href={`/data_management/bank_client_account/${bpa.bankclientacco.bankclientacco_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              {bpa.bankclientacco.accountnumber || '—'}
                            </a>
                          ) : (
                            <span style={valueTextStyle}>{bpa.bankclientacco?.accountnumber || '—'}</span>
                          )}
                        </div>
                        {bpa.notes ? (
                          <div style={{ marginTop: 10 }}>
                            <div className={"info_descr"}>Notes</div>
                            <div className={"info_span"}>{bpa.notes}</div>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Card style={{ marginTop: 20 }}><Card.Body><div>No bank project accounts</div></Card.Body></Card>
                )}
                <div style={{ marginTop: 12 }}>
                  <AddBankProjectAccountModal
                    refreshData={this.fetchClientData}
                    defaultClientId={this.state.client?.client_id}
                    lockClient={true}
                  />
                </div>
              </Grid.Column>
              </Container>
              )}
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default ClientOverview;
