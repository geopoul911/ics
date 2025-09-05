// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaEnvelope, FaPhone, FaMobile, FaSort } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel, MdPerson, MdLock, MdTask, MdCheckCircleOutline } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaUserTag } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditConsultantIdModal,
  EditConsultantFullnameModal,
  EditConsultantEmailModal,
  EditConsultantPhoneModal,
  EditConsultantMobileModal,
  EditConsultantRoleModal,
  EditConsultantUsernameModal,
  EditConsultantPasswordModal,
  EditConsultantCanAssignTaskModal,
  EditConsultantCashPassportModal,
  EditConsultantActiveModal,
  EditConsultantOrderIndexModal,
  EditConsultantPhotoModal,
} from "../../../modals/consultant_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for consultant
const VIEW_CONSULTANT = "http://localhost:8000/api/administration/consultant/";

// Helpers to read URL like: /administration/consultant/<consultant_id>
function getConsultantIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("consultant");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class ConsultantOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consultant: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const consultantId = getConsultantIdFromPath();

    axios
      .get(`${VIEW_CONSULTANT}${consultantId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const consultant =
          res?.data ||
          {};

        this.setState({
          consultant,
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

  // When modals return a fresh object, replace state.consultant
  update_state = (updated) => {
    this.setState({ consultant: updated });
  };

  render() {
    const { consultant } = this.state;
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("consultant_overview", `Consultant: ${consultant.fullname || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              {/* New Consultant Photo and Name Section */}
              <Card style={{ marginBottom: "20px", backgroundColor: "#f8f9fa" }}>
                <Card.Body style={{ padding: "30px" }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "flex-start",
                    gap: "40px"
                  }}>
                    {/* Photo Section */}
                    <div style={{ position: "relative" }}>
                      {consultant.photo_url ? (
                        <img
                          src={consultant.photo_url}
                          alt="Consultant"
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid #93ab3c",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#e9ecef",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "4px solid #93ab3c",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                          }}
                        >
                          <MdPerson style={{ fontSize: "75px", color: "#6c757d" }} />
                        </div>
                      )}
                      {/* Photo Edit Button */}
                      <div style={{ 
                        marginTop: "10px",
                        textAlign: "center"
                      }}>
                        <EditConsultantPhotoModal
                          consultant={consultant}
                          update_state={this.update_state}
                        />
                      </div>
                    </div>

                    {/* Name Section */}
                    <div style={{ textAlign: "left" }}>
                      <h1 style={{ 
                        margin: "0", 
                        fontSize: "2.5rem", 
                        fontWeight: "bold",
                        color: "#93ab3c"
                      }}>
                        {consultant.fullname || "N/A"}
                      </h1>
                      <p style={{ 
                        margin: "10px 0 0 0", 
                        fontSize: "1.2rem", 
                        color: "#6c757d",
                        fontWeight: "500"
                      }}>
                        Consultant ID: {consultant.consultant_id || "N/A"}
                      </p>
                      <div style={{ marginTop: "15px" }}>
                        <EditConsultantFullnameModal
                          consultant={consultant}
                          update_state={this.update_state}
                        />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Consultant ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Consultant ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.consultant_id ? consultant.consultant_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantIdModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* E-mail */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaEnvelope style={overviewIconStyle} /> E-mail
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.email ? consultant.email : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantEmailModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Telephone */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaPhone style={overviewIconStyle} /> Telephone
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.phone ? consultant.phone : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantPhoneModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Cell phone */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaMobile style={overviewIconStyle} /> Cell phone
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.mobile ? consultant.mobile : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantMobileModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof consultant.orderindex === "number" ||
                          typeof consultant.orderindex === "string")
                          ? consultant.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantOrderIndexModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectId={consultant.consultant_id}
                        objectName={consultant.fullname}
                        objectType="Consultant"
                        onObjectDeleted={() => {
                          window.location.href = "/administration/all_consultants";
                        }}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <MdSecurity
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Account Information
                    </Card.Header>
                    <Card.Body>
                      {/* Username */}
                      <div className={"info_descr"}>
                        <MdPerson style={overviewIconStyle} /> Username
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.username ? consultant.username : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantUsernameModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Password */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <MdLock style={overviewIconStyle} /> Password
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        ********
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantPasswordModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Role */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaUserTag style={overviewIconStyle} /> Role
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.role === 'A' ? 'Admin' :
                         consultant.role === 'S' ? 'Supervisor' :
                         consultant.role === 'U' ? 'Superuser' :
                         consultant.role === 'C' ? 'User' : consultant.role || "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantRoleModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Can Assign Tasks */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <MdTask style={overviewIconStyle} /> Can Assign Tasks
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.canassigntask ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantCanAssignTaskModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Active */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <MdCheckCircleOutline style={overviewIconStyle} /> Active
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.active ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantActiveModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Cash Passport Countries */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <GiMoneyStack style={overviewIconStyle} /> Cash Passport Countries
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.cashpassport ? consultant.cashpassport : "None"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantCashPassportModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer></Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default ConsultantOverview;
