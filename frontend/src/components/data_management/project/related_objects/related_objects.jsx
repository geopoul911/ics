// Built-ins
import React from "react";

// Icons
import { MdLink, MdFolder, MdAccountBalance } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Container } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import axios from "axios";
import AddAssociatedClientModal from "../../../modals/create/add_associated_client";
import AddDocumentModal from "../../../modals/create/add_document";
import AddClientContactModal from "../../../modals/create/add_client_contact";
import AddPropertyModal from "../../../modals/create/add_property";
import AddBankProjectAccountModal from "../../../modals/create/add_bank_project_account";
import AddCashModal from "../../../modals/create/add_cash";

// Global Variables
import { headers, pageHeader, loader } from "../../../global_vars";
import { formatAmountWithCurrency } from "../../../global_vars";

const VIEW_PROJECT = "http://localhost:8000/api/data_management/project/";

function getProjectIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("project");
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

class RelatedObjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      is_loaded: false,
      associatedClients: [],
      clients: [],
      documents: [],
      clientContacts: [],
      properties: [],
      bankProjectAccounts: [],
      cashTransactions: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const projectId = getProjectIdFromPath();
      const res = await axios.get(`${VIEW_PROJECT}${projectId}/`, { headers: currentHeaders });
      const p = res?.data || {};
      const associated = p.associated_clients || [];
      // Derive unique clients from associated clients
      const clientsMap = {};
      (Array.isArray(associated) ? associated : []).forEach((ac) => {
        const c = ac?.client;
        const cid = c?.client_id || c?.id;
        if (c && cid && !clientsMap[cid]) clientsMap[cid] = c;
      });
      const clients = Object.values(clientsMap);

      this.setState({
        project: p,
        associatedClients: associated,
        clients,
        documents: p.documents || [],
        clientContacts: p.contacts || [],
        properties: p.properties || [],
        bankProjectAccounts: p.bank_accounts || [],
        cashTransactions: p.cash_transactions || [],
        is_loaded: true,
      });
    } catch (e) {
      if (e?.response?.status === 401) {
        this.setState({ forbidden: true });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "An unknown error has occurred." });
      }
    }
  };

  render() {
    const { project } = this.state;
    if (!this.state.is_loaded) {
      return (
        <>
          <div className="rootContainer">
            {pageHeader("project_related", project?.title || "Project")}
            {loader()}
          </div>
        </>
      );
    }

    const section = (this.props.section || '').toLowerCase();

    const showAssociatedClients = section === 'associated_clients' || !section;
    const showClients = section === 'clients';
    const showDocuments = section === 'documents';
    const showClientContacts = section === 'client_contacts';
    const showProperties = section === 'properties';
    const showBankProjectAccounts = section === 'bank_project_accounts';
    const showCash = section === 'cash';

    return (
      <>
        <div className="rootContainer">
          {pageHeader("project_related", project?.title || "Project")}
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>
            <Grid stackable columns={2}>
              {showAssociatedClients && (
                <Container>
              <Grid.Column>
                    {Array.isArray(this.state.associatedClients) && this.state.associatedClients.length > 0 ? (
                      this.state.associatedClients.map((ac) => (
                        <Card key={ac.assoclient_id} style={{ marginTop: 16 }}>
                          <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h5 style={{ margin: 0 }}>
                              <MdLink style={overviewIconStyle} /> Associated client
                            </h5>
                            <a href={`/data_management/associated_client/${ac.assoclient_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>#{ac.assoclient_id}</a>
                          </Card.Header>
                          <Card.Body>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                              <span style={labelPillStyle}>Client</span>
                              {ac.client?.client_id ? (
                                <a href={`/data_management/client/${ac.client.client_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>#{ac.client.client_id}</a>
                              ) : null}
                              {ac.client?.fullname ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Full name</span>
                                <span style={valueTextStyle}>{ac.client.fullname}</span>
                              </>) : null}
                              {ac.orderindex !== undefined ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Order by</span>
                                <span style={valueTextStyle}>{ac.orderindex}</span>
                              </>) : null}
                            </div>
                            {ac.notes ? (
                              <div style={{ marginTop: 10 }}>
                                <div className={"info_descr"}>Notes</div>
                                <div className={"info_span"}>{ac.notes}</div>
                              </div>
                            ) : null}
                          </Card.Body>
                        </Card>
                      ))
                    ) : (<div>No associated clients</div>)}
                  <AddAssociatedClientModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
              </Grid.Column>
              </Container>
              )}

              {showClients && (
                <Container>
              <Grid.Column>
                
                    {Array.isArray(this.state.clients) && this.state.clients.length > 0 ? (
                      this.state.clients.map((c, idx) => (
                        <Card key={c.client_id || idx} style={{ marginTop: 16 }}>
                          <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h5 style={{ margin: 0 }}>
                              <MdLink style={overviewIconStyle} /> {c.fullname || `${c.surname || ''} ${c.name || ''}`.trim()}
                            </h5>
                            <a href={`/data_management/client/${c.client_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>#{c.client_id}</a>
                          </Card.Header>
                          <Card.Body>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                              {c.address ? (<>
                                <span style={labelPillStyle}>Address</span>
                                <span style={valueTextStyle}>{c.address}</span>
                              </>) : null}
                              {c.country?.country_id ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Country</span>
                                <a href={`/regions/country/${c.country.country_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>{c.country.title}</a>
                              </>) : null}
                              {c.province?.province_id ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Province</span>
                                <a href={`/regions/province/${c.province.province_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>{c.province.title}</a>
                              </>) : null}
                              {c.city?.city_id ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>City</span>
                                <a href={`/regions/city/${c.city.city_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>{c.city.title}</a>
                              </>) : null}
                              {c.birthdate ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Birthdate</span>
                                <span style={valueTextStyle}>{new Date(c.birthdate).toLocaleDateString()}</span>
                              </>) : null}
                              <span style={{ width: 10 }} />
                              <span style={c.deceased ? { ...labelPillStyle, background: '#ffe5e5', color: '#c00' } : labelPillStyle}>Deceased</span>
                              <span style={c.deceased ? { ...valueTextStyle, color: '#c00' } : valueTextStyle}>{c.deceased ? 'Yes' : 'No'}</span>
                              {c.retired !== undefined ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Retired</span>
                                <span style={valueTextStyle}>{c.retired ? 'Yes' : 'No'}</span>
                              </>) : null}
                              {c.mobile1 ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Mobile</span>
                                <span style={valueTextStyle}>{c.mobile1}</span>
                              </>) : null}
                              {c.email ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Email</span>
                                <a href={`mailto:${c.email}`} className="pillLink"><span style={valueTextStyle}>{c.email}</span></a>
                              </>) : null}
                              {c.afm ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>TIN-GR</span>
                                <span style={valueTextStyle}>{c.afm}</span>
                              </>) : null}
                              {c.sin ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>TIN</span>
                                <span style={valueTextStyle}>{c.sin}</span>
                              </>) : null}
                              {c.amka ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>AMKA</span>
                                <span style={valueTextStyle}>{c.amka}</span>
                              </>) : null}
                            </div>
                            {c.notes ? (
                              <div style={{ marginTop: 10 }}>
                                <div className={"info_descr"}>Notes</div>
                                <div className={"info_span"}>{c.notes}</div>
                              </div>
                            ) : null}
                          </Card.Body>
                        </Card>
                      ))
                    ) : (<div>No clients</div>)}
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
                              {doc.project?.project_id ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Project</span>
                                <a href={`/data_management/project/${doc.project.project_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>#{doc.project.project_id}</a>
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
                              {doc.status ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{doc.status}</span>
                              </>) : null}
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
                    ) : (<div>No documents</div>)}
                  <AddDocumentModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                </Grid.Column>
              </Container>
              )}

              {showClientContacts && (
                <Container>
              <Grid.Column>
                {Array.isArray(this.state.clientContacts) && this.state.clientContacts.length > 0 ? (
                  this.state.clientContacts.map((cc) => (
                    <Card key={cc.clientcont_id} style={{ marginTop: 16 }}>
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdLink style={overviewIconStyle} /> {cc.fullname}
                        </h5>
                        <a
                          href={`/data_management/client_contact/${cc.clientcont_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{cc.clientcont_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {cc.connection ? (<>
                            <span style={labelPillStyle}>Connection</span>
                            <span style={valueTextStyle}>{cc.connection}</span>
                          </>) : null}
                          {cc.address ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Address</span>
                            <span style={valueTextStyle}>{cc.address}</span>
                          </>) : null}
                          {cc.email ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Email</span>
                            <a href={`mailto:${cc.email}`} className="pillLink"><span style={valueTextStyle}>{cc.email}</span></a>
                          </>) : null}
                          {cc.phone ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Phone</span>
                            <span style={valueTextStyle}>{cc.phone}</span>
                          </>) : null}
                          {cc.mobile ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Mobile</span>
                            <span style={valueTextStyle}>{cc.mobile}</span>
                          </>) : null}
                          {cc.profession ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Profession</span>
                            <span style={valueTextStyle}>{cc.profession}</span>
                          </>) : null}
                          {cc.reliability ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Reliability</span>
                            <span style={valueTextStyle}>{cc.reliability}</span>
                          </>) : null}
                          {cc.city ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>City</span>
                            <span style={valueTextStyle}>{cc.city}</span>
                          </>) : null}
                        </div>
                        {cc.notes ? (
                          <div style={{ marginTop: 10 }}>
                            <div className={"info_descr"}>Notes</div>
                            <div className={"info_span"}>{cc.notes}</div>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  ))
                ) : (<div>No client contacts</div>)}
                <AddClientContactModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                </Grid.Column>
              </Container>
              )}

              {showProperties && (
                <Container>
                <Grid.Column>
                {Array.isArray(this.state.properties) && this.state.properties.length > 0 ? (
                  this.state.properties.map((prop) => (
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
                          {prop.country?.country_id ? (<>
                            <span style={labelPillStyle}>Country</span>
                            <a href={`/regions/country/${prop.country.country_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>{prop.country.title}</a>
                          </>) : null}
                          {prop.province?.province_id ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Province</span>
                            <a href={`/regions/province/${prop.province.province_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>{prop.province.title}</a>
                          </>) : null}
                          {prop.city?.city_id ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>City</span>
                            <a href={`/regions/city/${prop.city.city_id}`} className="btn btn-sm btn-success" style={{ padding: '2px 10px', borderRadius: 6 }}>{prop.city.title}</a>
                          </>) : null}
                          {prop.description ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Description</span>
                            <span style={valueTextStyle}>{prop.description}</span>
                          </>) : null}
                          {prop.type ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Type</span>
                            <span style={valueTextStyle}>{prop.type}</span>
                          </>) : null}
                          {prop.constructyear ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Construct year</span>
                            <span style={valueTextStyle}>{prop.constructyear}</span>
                          </>) : null}
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
                        {prop.notes ? (
                          <div style={{ marginTop: 10 }}>
                            <div className={"info_descr"}>Notes</div>
                            <div className={"info_span"}>{prop.notes}</div>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  ))
                ) : (<div>No properties</div>)}
                <AddPropertyModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
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
                          {bpa.bankclientacco?.accountnumber ? (<>
                            <span style={labelPillStyle}>Account</span>
                            <span style={valueTextStyle}>{bpa.bankclientacco.accountnumber}</span>
                          </>) : null}
                          {bpa.client ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Client</span>
                            <a
                              href={`/data_management/client/${(bpa.client && (bpa.client.client_id || bpa.client))}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              #{(bpa.client && (bpa.client.client_id || bpa.client))}
                            </a>
                            {bpa.client && (bpa.client.fullname || bpa.client.surname || bpa.client.name) ? (<>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Full name</span>
                              <span style={valueTextStyle}>{bpa.client.fullname || `${bpa.client.surname || ''} ${bpa.client.name || ''}`.trim()}</span>
                            </>) : null}
                          </>) : null}
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
                ) : (<div>No bank project accounts</div>)}
                <AddBankProjectAccountModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                </Grid.Column>
                </Container>
              )}
            </Grid>

            {showCash && (
              <Grid stackable columns={2}>
                <Container>
                <Grid.Column>
                  {Array.isArray(this.state.cashTransactions) && this.state.cashTransactions.length > 0 ? (
                    this.state.cashTransactions.map((c) => (
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
                            {c.country?.title ? (<>
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
                    <Card style={{ marginTop: 20 }}><Card.Body><div>No cash</div></Card.Body></Card>
                  )}
                  <div style={{ marginTop: 12 }}>
                    <AddCashModal
                      refreshData={this.fetchData}
                      defaultProjectId={this.state.project?.project_id}
                      lockProject={true}
                    />
                  </div>
                </Grid.Column>
                </Container>
              </Grid>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default RelatedObjects;


