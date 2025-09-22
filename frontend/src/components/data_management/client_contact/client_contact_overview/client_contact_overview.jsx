// Built-ins
import React from "react";

// Icons / Images
import { FaStop } from "react-icons/fa";
import { FaIdBadge, FaUser, FaStickyNote } from "react-icons/fa";
import { MdTask } from "react-icons/md";
import { MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditClientContactFullnameModal,
  EditClientContactFathernameModal,
  EditClientContactMothernameModal,
  EditClientContactConnectionModal,
  EditClientContactAddressModal,
  EditClientContactEmailModal,
  EditClientContactPhoneModal,
  EditClientContactMobileModal,
  EditClientContactProfessionModal,
  EditClientContactReliabilityModal,
  EditClientContactCityModal,
  EditClientContactActiveModal,
  EditClientContactNotesModal,
} from "../../../modals/client_contact_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for client contact
const VIEW_CLIENT_CONTACT = "https://ultima.icsgr.com/api/data_management/client_contact/";

// Helpers to read URL like: /data_management/client_contact/<clientcont_id>
function getClientContactIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("client_contact");
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

class ClientContactOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientContact: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };
    const clientContactId = getClientContactIdFromPath();
    axios
      .get(`${VIEW_CLIENT_CONTACT}${clientContactId}/`, { headers: currentHeaders })
      .then((res) => {
        const clientContact = res?.data || {};
        this.setState({
          clientContact,
          is_loaded: true,
        });
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
    this.setState({ clientContact: updated });
  };

  render() {
    const { clientContact } = this.state;
    if (!this.state.is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("client_contact_overview", `${clientContact.fullname}`)}
            {loader()}
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("client_contact_overview", `${clientContact.fullname}`)}
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>
            <Grid stackable columns={2}>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaIdBadge style={overviewIconStyle} />
                      Basic Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Client Contact ID */}
                    <div className={"info_descr"}>
                      <FaIdBadge style={overviewIconStyle} /> Client Contact ID
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.clientcont_id || "N/A"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled>
                          <FaStop  disabled style={{ marginRight: 6, color: "red" }} title="Client Contact ID is immutable"/>
                          ID
                        </Button>
                      </span>
                    </div>

                    {/* Full name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Full name
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.fullname || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactFullnameModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Father fullname */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Father fullname
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.fathername || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactFathernameModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Mother fullname */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Mother fullname
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.mothername || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactMothernameModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Connection */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Connection
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.connection || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactConnectionModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* E-mail */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> E-mail
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.email || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactEmailModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Telephone */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Telephone
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.phone || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactPhoneModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Cell phone */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Cell phone
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.mobile || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactMobileModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Address */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Address
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.address || "N/A"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactAddressModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Profession */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={overviewIconStyle} /> Profession
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.profession || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactProfessionModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Reliability */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={overviewIconStyle} /> Reliability
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.reliability || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactReliabilityModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* City */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={overviewIconStyle} /> City
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.city || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactCityModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Active Status */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaUser style={overviewIconStyle} /> Active Status
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.active ? (
                        <span style={{ color: "green" }}>
                          <MdCheckCircle style={{ marginRight: 6 }} />
                          Active
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>
                          <MdCancel style={{ marginRight: 6 }} />
                          Inactive
                        </span>
                      )}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactActiveModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <DeleteObjectModal
                      object={clientContact}
                      objectType="ClientContact"
                      objectName={clientContact.fullname}
                    />
                  </Card.Footer>
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaStickyNote style={overviewIconStyle} />
                      Additional Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Project */}
                    <div className={"info_descr"}>
                      <FaStickyNote style={overviewIconStyle} /> Project
                    </div>
                    <div className={"info_span"}>
                      {clientContact.project?.title || "Not set"}
                    </div>

                    {/* Professional */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaStickyNote style={overviewIconStyle} /> Professional
                    </div>
                    <div className={"info_span"}>
                      {clientContact.professional?.professional_id ? (
                        <a href={`/data_management/professional/${clientContact.professional.professional_id}`}>
                          {clientContact.professional.fullname}
                        </a>
                      ) : (
                        clientContact.professional?.fullname || "Not set"
                      )}
                    </div>

                    {/* Notes */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaStickyNote style={overviewIconStyle} /> Notes
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {clientContact.notes || "No notes"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientContactNotesModal
                          clientContact={clientContact}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                </Card>

                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4>
                      <MdTask style={overviewIconStyle} />
                      Projects
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {clientContact.project ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                            <span style={labelPillStyle}>#</span>
                            <span style={valueTextStyle}>1</span>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>ID</span>
                            <a href={`/data_management/project/${clientContact.project.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{clientContact.project.project_id}</a>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Title</span>
                            <span style={valueTextStyle}>{clientContact.project.title}</span>
                            {clientContact.project.status ? (
                              <>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{clientContact.project.status}</span>
                              </>
                            ) : null}
                          </div>
                        </li>
                      </ul>
                    ) : (
                      <div>No projects</div>
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
}

export default ClientContactOverview;
