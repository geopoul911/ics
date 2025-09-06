// Built-ins
import React from "react";

// Icons
import { MdLink, MdFolder, MdAccountBalance } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import axios from "axios";
import AddAssociatedClientModal from "../../../modals/create/add_associated_client";
import AddDocumentModal from "../../../modals/create/add_document";
import AddClientContactModal from "../../../modals/create/add_client_contact";
import AddPropertyModal from "../../../modals/create/add_property";
import AddBankProjectAccountModal from "../../../modals/create/add_bank_project_account";

// Global Variables
import { headers, pageHeader, loader } from "../../../global_vars";

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
      documents: [],
      clientContacts: [],
      properties: [],
      bankProjectAccounts: [],
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
      this.setState({
        project: p,
        associatedClients: p.associated_clients || [],
        documents: p.documents || [],
        clientContacts: p.contacts || [],
        properties: p.properties || [],
        bankProjectAccounts: p.bank_accounts || [],
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
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdLink style={overviewIconStyle} /> Associated clients</h4>
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
                              <span style={labelPillStyle}>Client</span>
                              <span style={valueTextStyle}>{ac.client ? (ac.client.fullname || `${ac.client.surname || ''} ${ac.client.name || ''}`.trim()) : 'N/A'}</span>
                              {ac.orderindex !== undefined ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Order by</span>
                                <span style={valueTextStyle}>{ac.orderindex}</span>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No associated clients</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddAssociatedClientModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdFolder style={overviewIconStyle} /> Documents</h4>
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
                              {doc.status ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{doc.status}</span>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No documents</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddDocumentModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdLink style={overviewIconStyle} /> Client contacts</h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.clientContacts) && this.state.clientContacts.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.clientContacts.map((cc, idx) => (
                          <li key={cc.clientcont_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/client_contact/${cc.clientcont_id}`} className="pillLink" style={{ ...valueTextStyle }}>{cc.clientcont_id}</a>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Full name</span>
                              <span style={valueTextStyle}>{cc.fullname}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No client contacts</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddClientContactModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdFolder style={overviewIconStyle} /> Properties</h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.properties) && this.state.properties.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.properties.map((prop, idx) => (
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
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No properties</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddPropertyModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdAccountBalance style={overviewIconStyle} /> Bank project accounts</h4>
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
                              {bpa.bankclientacco?.accountnumber ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Account</span>
                                <span style={valueTextStyle}>{bpa.bankclientacco.accountnumber}</span>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No bank project accounts</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddBankProjectAccountModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
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

export default RelatedObjects;


