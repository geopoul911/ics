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
  EditClientBirthdateModal,
  EditClientBirthplaceModal,
  EditClientFathernameModal,
  EditClientMothernameModal,
  EditClientMaritalstatusModal,
  EditClientDeceasedModal,
  EditClientDeceasedateModal,
  EditClientAfmModal,
  EditClientSinModal,
  EditClientAmkaModal,
  EditClientPassportcountryModal,
  EditClientPassportnumberModal,
  EditClientPassportexpiredateModal,
  EditClientPoliceidModal,
  EditClientProfessionModal,
  EditClientTaxmanagementModal,
  EditClientTaxrepresentationModal,
  EditClientTaxrepresentativeModal,
  EditClientRetiredModal,
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
const VIEW_CLIENT = "http://localhost:8000/api/data_management/client/";

// Helpers to read URL like: /data_management/client/<client_id>
function getClientIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("client");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class ClientOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      is_loaded: false,
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
        this.setState({
          client,
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
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("client_overview", `${client.surname} ${client.name}`)}
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
          {pageHeader("client_overview", `${client.surname} ${client.name}`)}
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
                    {/* Client ID */}
                    <div className={"info_descr"}>
                      <FaHashtag style={overviewIconStyle} /> Client ID
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

                    {/* Surname */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Surname
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

                    {/* Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Name
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

                    {/* Onoma (Greek Name) */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Onoma (Greek Name)
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
                      <BsInfoSquare style={overviewIconStyle} /> Eponymo (Greek Surname)
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
                      <BsInfoSquare style={overviewIconStyle} /> Email
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
                      <BsInfoSquare style={overviewIconStyle} /> Phone 1
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
                      <BsInfoSquare style={overviewIconStyle} /> Mobile 1
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
                      <BsInfoSquare style={overviewIconStyle} /> Phone 2
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
                      <BsInfoSquare style={overviewIconStyle} /> Mobile 2
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
                      <BsInfoSquare style={overviewIconStyle} /> Address
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
                      <BsInfoSquare style={overviewIconStyle} /> Postal Code
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
                      <MdSecurity style={overviewIconStyle} />
                      Location Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Country */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Country
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.country?.title || "Not set"}
                    </div>

                    {/* Province */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Province
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.province?.title || "Not set"}
                    </div>

                    {/* City */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> City
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
                      <BsInfoSquare style={overviewIconStyle} /> Registration Date
                    </div>
                    <div className={"info_span"}>
                      {client.registrationdate ? new Date(client.registrationdate).toLocaleDateString() : "Not set"}
                    </div>

                    {/* Registration User */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Registration User
                    </div>
                    <div className={"info_span"}>
                      {client.registrationuser || "Not set"}
                    </div>

                    {/* Active */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Active
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
            
            <Grid stackable columns={2}>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaSort style={overviewIconStyle} />
                      Personal Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Birth Date */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Birth Date
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.birthdate ? new Date(client.birthdate).toLocaleDateString() : "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientBirthdateModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Birth Place */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Birth Place
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.birthplace || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientBirthplaceModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Father's Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Father's Name
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.fathername || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientFathernameModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Mother's Name */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Mother's Name
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.mothername || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientMothernameModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Marital Status */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Marital Status
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.maritalstatus || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientMaritalstatusModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Profession */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Profession
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.profession || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientProfessionModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Deceased */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Deceased
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.deceased ? (
                        <MdCheckCircle style={{ color: "red", marginRight: "0.5em" }} />
                      ) : (
                        <MdCancel style={{ color: "green", marginRight: "0.5em" }} />
                      )}
                      {client.deceased ? "Yes" : "No"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientDeceasedModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {client.deceased && (
                      <>
                        {/* Deceased Date */}
                        <div className={"info_descr"} style={{ marginTop: 16 }}>
                          <BsInfoSquare style={overviewIconStyle} /> Deceased Date
                        </div>
                        <div className={"info_span"} style={{ position: "relative" }}>
                          {client.deceasedate ? new Date(client.deceasedate).toLocaleDateString() : "Not set"}
                          <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                            <EditClientDeceasedateModal
                              client={client}
                              update_state={this.update_state}
                            />
                          </span>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaHashtag style={overviewIconStyle} />
                      Tax & Identification
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* AFM */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> AFM
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.afm || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientAfmModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* SIN */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> SIN
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.sin || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientSinModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* AMKA */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> AMKA
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.amka || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientAmkaModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Tax Management */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Tax Management
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.taxmanagement ? (
                        <MdCheckCircle style={{ color: "green", marginRight: "0.5em" }} />
                      ) : (
                        <MdCancel style={{ color: "red", marginRight: "0.5em" }} />
                      )}
                      {client.taxmanagement ? "Yes" : "No"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientTaxmanagementModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Tax Representation */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Tax Representation
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.taxrepresentation ? (
                        <MdCheckCircle style={{ color: "green", marginRight: "0.5em" }} />
                      ) : (
                        <MdCancel style={{ color: "red", marginRight: "0.5em" }} />
                      )}
                      {client.taxrepresentation ? "Yes" : "No"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientTaxrepresentationModal
                          client={client}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {client.taxrepresentation && (
                      <>
                        {/* Tax Representative */}
                        <div className={"info_descr"} style={{ marginTop: 16 }}>
                          <BsInfoSquare style={overviewIconStyle} /> Tax Representative
                        </div>
                        <div className={"info_span"} style={{ position: "relative" }}>
                          {client.taxrepresentative || "Not set"}
                          <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                            <EditClientTaxrepresentativeModal
                              client={client}
                              update_state={this.update_state}
                            />
                          </span>
                        </div>
                      </>
                    )}

                    {/* Retired */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Retired
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {client.retired ? (
                        <MdCheckCircle style={{ color: "green", marginRight: "0.5em" }} />
                      ) : (
                        <MdCancel style={{ color: "red", marginRight: "0.5em" }} />
                      )}
                      {client.retired ? "Yes" : "No"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditClientRetiredModal
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
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <MdSecurity style={overviewIconStyle} />
                      Passport Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Passport Country */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Passport Country
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
                      <BsInfoSquare style={overviewIconStyle} /> Passport Number
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

                    {/* Passport Expire Date */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Passport Expire Date
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
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Police ID
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
                      <FaSort style={overviewIconStyle} />
                      Pension Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Pension Country 1 */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Pension Country 1
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
                      <BsInfoSquare style={overviewIconStyle} /> Insurance Carrier 1
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
                      <BsInfoSquare style={overviewIconStyle} /> Pension Info 1
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
                      <BsInfoSquare style={overviewIconStyle} /> Pension Country 2
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
                      <BsInfoSquare style={overviewIconStyle} /> Insurance Carrier 2
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
                      <BsInfoSquare style={overviewIconStyle} /> Pension Info 2
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
                      <FaSort style={overviewIconStyle} />
                      Additional Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Notes */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Notes
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
        <Footer />
      </>
    );
  }
}

export default ClientOverview;
