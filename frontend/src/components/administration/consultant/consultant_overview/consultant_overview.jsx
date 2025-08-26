// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaEnvelope, FaPhone, FaMobile, FaSort } from "react-icons/fa";
import { FiType } from "react-icons/fi";
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

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

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
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#2a9fd9",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Full Name */}
                      <div className={"info_descr"}>
                        <FiType style={overviewIconStyle} /> Full Name
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {consultant.fullname ? consultant.fullname : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditConsultantFullnameModal
                            consultant={consultant}
                            update_state={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Consultant ID */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
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

                      {/* Email */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaEnvelope style={overviewIconStyle} /> Email
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

                      {/* Phone */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaPhone style={overviewIconStyle} /> Phone
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

                      {/* Mobile */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaMobile style={overviewIconStyle} /> Mobile
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

                      {/* Order Index */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Order Index
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
                        object_id={consultant.consultant_id}
                        object_name={consultant.fullname}
                        object_type="Consultant"
                        warningMessage="This will also delete all projects, tasks, and other data associated with this consultant."
                        onDeleteSuccess={() => {
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
                          color: "#2a9fd9",
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
