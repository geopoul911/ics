// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaSort, FaStop } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel } from "react-icons/md";

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
const VIEW_CLIENT_CONTACT = "http://localhost:8000/api/data_management/client_contact/";

// Helpers to read URL like: /data_management/client_contact/<clientcont_id>
function getClientContactIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("client_contact");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

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
            <Grid stackable columns={2}>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaHashtag style={overviewIconStyle} />
                      Basic Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Client Contact ID */}
                    <div className={"info_descr"}>
                      <FaHashtag style={overviewIconStyle} /> Client Contact ID
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

                    {/* Full Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Full Name
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

                    {/* Father's Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Father's Name
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

                    {/* Mother's Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Mother's Name
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
                      <BsInfoSquare style={overviewIconStyle} /> Connection
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

                    {/* Email */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Email
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

                    {/* Phone */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Phone
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

                    {/* Mobile */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Mobile
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
                      <BsInfoSquare style={overviewIconStyle} /> Address
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
                      <BsInfoSquare style={overviewIconStyle} /> Profession
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
                      <BsInfoSquare style={overviewIconStyle} /> Reliability
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
                      <BsInfoSquare style={overviewIconStyle} /> City
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
                      <BsInfoSquare style={overviewIconStyle} /> Active Status
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
                </Card>
              </Grid.Column>

              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaSort style={overviewIconStyle} />
                      Additional Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Project */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Project
                    </div>
                    <div className={"info_span"}>
                      {clientContact.project?.title || "Not set"}
                    </div>

                    {/* Professional */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Professional
                    </div>
                    <div className={"info_span"}>
                      {clientContact.professional?.fullname || "Not set"}
                    </div>

                    {/* Notes */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Notes
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
                      <MdSecurity style={overviewIconStyle} />
                      Actions
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <DeleteObjectModal
                      object={clientContact}
                      objectType="client_contact"
                      objectName={clientContact.fullname}
                    />
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
