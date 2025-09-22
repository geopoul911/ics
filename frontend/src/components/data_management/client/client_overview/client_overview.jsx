// Built-ins
import React from "react";

// Icons / Images
import { FaStop } from "react-icons/fa";
// Removed MdLink, MdFolder usage from overview; related lists moved to Related Objects page
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { FaIdBadge, FaMapMarkerAlt, FaPassport, FaMoneyCheckAlt, FaStickyNote } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Custom Made Components
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditClientSurnameModal,
  EditClientNameModal,
  EditClientOnomaModal,
  EditClientEponymoModal,
  EditClientEmailModal,
  EditClientPhone1Modal,
  EditClientPhone2Modal,
  EditClientMobile1Modal,
  EditClientMobile2Modal,
  EditClientAddressModal,
  EditClientPostalcodeModal,
  EditClientLocationModal,
  EditClientPassportcountryModal,
  EditClientPassportnumberModal,
  EditClientPassportexpiredateModal,
  EditClientPoliceidModal,
  EditClientPensioncountry1Modal,
  EditClientInsucarrier1Modal,
  EditClientPensioninfo1Modal,
  EditClientPensioncountry2Modal,
  EditClientInsucarrier2Modal,
  EditClientPensioninfo2Modal,
  EditClientActiveModal,
  EditClientNotesModal,
} from "../../../modals/client_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for client
const VIEW_CLIENT = "https://ultima.icsgr.com/api/data_management/client/";

// Helpers to read URL like: /data_management/client/<client_id>
function getClientIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("client");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

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
    };
  }

  componentDidMount() {
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
        this.setState({
          client,
          bankAccounts,
          associatedClients,
          documents,
          bankProjectAccounts,
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
          {pageHeader("client_overview", `${client.surname} ${client.name}`)}
          <div className="contentBody">
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
                    {/* Client ID */}
                    <div className={"info_descr"}>
                      <FaIdBadge style={overviewIconStyle} /> Client ID
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.client_id || "N/A"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled>
                          <FaStop  disabled style={{ marginRight: 6, color: "red" }} title="Client ID is immutable"/>
                          ID
                        </Button>
                      </span>
                    </div>


                    {/* Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Name
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.name || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientNameModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Surname */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Surname
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.surname || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientSurnameModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Onoma (Greek Name) */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> GrName
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.onoma || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientOnomaModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Eponymo (Greek Surname) */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> GrSurname
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.eponymo || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientEponymoModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Email */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> E-mail
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.email || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientEmailModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Phone 1 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Telephone 1
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.phone1 || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPhone1Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Mobile 1 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Cell Phone 1
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.mobile1 || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientMobile1Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Phone 2 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Telephone 2
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.phone2 || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPhone2Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Mobile 2 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Cell Phone 2
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.mobile2 || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientMobile2Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Address */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> Address
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.address || "N/A"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientAddressModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Postal Code */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaIdBadge style={overviewIconStyle} /> ZIP / PC
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.postalcode || "N/A"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPostalcodeModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    {client.client_id && (
                      <DeleteObjectModal
                        objectType="Client"
                        objectId={client.client_id}
                        objectName={`${client.surname} ${client.name}`}
                        onObjectDeleted={() => {
                          window.location.href = "/data_management/all_clients";
                        }}
                      />
                    )}
                  </Card.Footer>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaMapMarkerAlt style={overviewIconStyle} />
                      Location Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Country */}
                    <div className={"info_descr"}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> Country
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.country?.title || "Not set"}
                    </div>

                    {/* Province */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> Province
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.province?.title || "Not set"}
                    </div>

                    {/* City */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> City
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.city?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientLocationModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Registration Date */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> Entered
                    </div>
                    <div className={"info_span"}>
                      {client.registrationdate ? new Date(client.registrationdate).toLocaleDateString() : "Not set"}
                    </div>

                    {/* User */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> User
                    </div>
                    <div className={"info_span"}>
                      {client.registrationuser || "Not set"}
                    </div>

                    {/* Active */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMapMarkerAlt style={overviewIconStyle} /> Active
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.active ? (
                        <MdCheckCircle style={{ color: "green", marginRight: "0.5em" }} />
                      ) : (
                        <MdCancel style={{ color: "red", marginRight: "0.5em" }} />
                      )}
                      {client.active ? "Yes" : "No"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientActiveModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Grid.Column>
            </Grid>
            
            {/* Project and Properties lists moved to Related Objects page */}

            <Grid stackable columns={2}>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaPassport style={overviewIconStyle} />
                      Passport Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Passport Country */}
                    <div className={"info_descr"}>
                      <FaPassport style={overviewIconStyle} /> Passport Country
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.passportcountry?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPassportcountryModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Passport Number */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaPassport style={overviewIconStyle} /> Passport Number
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.passportnumber || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPassportnumberModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Expiration */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaPassport style={overviewIconStyle} /> Expiration
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.passportexpiredate ? new Date(client.passportexpiredate).toLocaleDateString() : "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPassportexpiredateModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Police ID */}
                    <div className={"info_descr"}>
                      <FaPassport style={overviewIconStyle} /> GR ID Number
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.policeid || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPoliceidModal
                          client={client}
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
                      <FaMoneyCheckAlt style={overviewIconStyle} />
                      Pension Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Pension Country 1 */}
                    <div className={"info_descr"}>
                      <FaMoneyCheckAlt style={overviewIconStyle} /> Country
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.pensioncountry1?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPensioncountry1Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Insurance Carrier 1 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMoneyCheckAlt style={overviewIconStyle} /> Public Insurance 1
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.insucarrier1?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientInsucarrier1Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Pension Info 1 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMoneyCheckAlt style={overviewIconStyle} /> Pension Info 1
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.pensioninfo1 || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPensioninfo1Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Pension Country 2 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMoneyCheckAlt style={overviewIconStyle} /> Country 2
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.pensioncountry2?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPensioncountry2Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Insurance Carrier 2 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMoneyCheckAlt style={overviewIconStyle} /> Public Insurance 2
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.insucarrier2?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientInsucarrier2Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Pension Info 2 */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <FaMoneyCheckAlt style={overviewIconStyle} /> Pension Info 2
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.pensioninfo2 || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientPensioninfo2Modal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Grid.Column>
            </Grid>
            
            <Grid stackable columns={2}>
              <Grid.Column width={8}>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaStickyNote style={overviewIconStyle} />
                      Additional Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Notes */}
                    <div className={"info_descr"}>
                      <FaStickyNote style={overviewIconStyle} /> Notes
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.notes || "No notes"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientNotesModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
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

export default ClientOverview;
