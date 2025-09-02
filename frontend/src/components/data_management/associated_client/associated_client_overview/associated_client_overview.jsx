// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaStop } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditAssociatedClientProjectModal,
  EditAssociatedClientClientModal,
  EditAssociatedClientOrderindexModal,
  EditAssociatedClientNotesModal,
} from "../../../modals/associated_client_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for associated client
const VIEW_ASSOCIATED_CLIENT = "http://localhost:8000/api/data_management/associated_client/";

// Helpers to read URL like: /data_management/associated_client/<assoclient_id>
function getAssociatedClientIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("associated_client");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class AssociatedClientOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      associatedClient: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };
    const associatedClientId = getAssociatedClientIdFromPath();
    axios
      .get(`${VIEW_ASSOCIATED_CLIENT}${associatedClientId}/`, { headers: currentHeaders })
      .then((res) => {
        const associatedClient = res?.data || {};
        this.setState({
          associatedClient,
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
    this.setState({ associatedClient: updated });
  };

  render() {
    const { associatedClient } = this.state;
    if (!this.state.is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("associated_client_overview", "Loading...")}
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
          {pageHeader("associated_client_overview", `${associatedClient.project?.title || "Unknown"} - ${associatedClient.client?.surname || ""} ${associatedClient.client?.name || ""}`)}
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
                    {/* Associated Client ID */}
                    <div className={"info_descr"}>
                      <FaHashtag style={overviewIconStyle} /> Associated Client ID
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {associatedClient.assoclient_id || "N/A"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <Button size="tiny" basic disabled>
                          <FaStop disabled style={{ marginRight: 6, color: "red" }} title="Associated Client ID is immutable"/>
                          ID
                        </Button>
                      </span>
                    </div>

                    {/* Project */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Project
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {associatedClient.project?.title || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditAssociatedClientProjectModal
                          associatedClient={associatedClient}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Client */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Client
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {associatedClient.client?.surname} {associatedClient.client?.name || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditAssociatedClientClientModal
                          associatedClient={associatedClient}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Order Index */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Order Index
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {associatedClient.orderindex || "Not set"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditAssociatedClientOrderindexModal
                          associatedClient={associatedClient}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>

                    {/* Notes */}
                    <div className={"info_descr"} style={{ marginTop: 16 }}>
                      <BsInfoSquare style={overviewIconStyle} /> Notes
                    </div>
                    <div className={"info_span"} style={{ position: "relative" }}>
                      {associatedClient.notes || "No notes"}
                      <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                        <EditAssociatedClientNotesModal
                          associatedClient={associatedClient}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    {associatedClient.assoclient_id && (
                      <DeleteObjectModal
                        objectType="AssociatedClient"
                        objectId={associatedClient.assoclient_id}
                        objectName={`${associatedClient.project?.title || "Unknown"} - ${associatedClient.client?.surname || ""} ${associatedClient.client?.name || ""}`}
                        onObjectDeleted={() => {
                          window.location.href = "/data_management/all_associated_clients";
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
                      Additional Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* This card can be used for additional information in the future */}
                    <div className={"info_descr"}>
                      <BsInfoSquare style={overviewIconStyle} /> Associated Client Details
                    </div>
                    <div className={"info_span"}>
                      This Associated Client links the project "{associatedClient.project?.title || "Unknown"}" with the client "{associatedClient.client?.surname || ""} {associatedClient.client?.name || ""}".
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

export default AssociatedClientOverview;
