// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaHashtag, FaSort } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditDocumentTitleModal,
  EditDocumentProjectModal,
  EditDocumentClientModal,
  EditDocumentCreatedModal,
  EditDocumentValidUntilModal,
  EditDocumentFilePathModal,
  EditDocumentOriginalModal,
  EditDocumentTrafficableModal,
  EditDocumentStatusModal,
  EditDocumentNotesModal,
} from "../../../modals/document_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for document
const VIEW_DOCUMENT = "http://localhost:8000/api/data_management/document/";

// Helpers to read URL like: /data_management/document/<document_id>
function getDocumentIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("document");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class DocumentOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const documentId = getDocumentIdFromPath();

    axios
      .get(`${VIEW_DOCUMENT}${documentId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const document =
          res?.data ||
          {};

        this.setState({
          document,
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

  // When modals return a fresh object, replace state.document
  update_state = (updated) => {
    this.setState({ document: updated });
  };

  render() {
    const { document } = this.state;
    
    if (!this.state.is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("document_overview", document.title)}
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
          {pageHeader("document_overview", document.title)}
          <div className="contentHeader">
            <div className="contentHeaderLeft">
              <h3>
                <BsInfoSquare style={overviewIconStyle} />
                Document Overview
              </h3>
            </div>
            <div className="contentHeaderRight">
              <DeleteObjectModal
                objectType="Document"
                objectId={document.document_id}
                objectName={document.title}
                onObjectDeleted={() => {
                  window.location.href = "/data_management/all_documents";
                }}
              />
            </div>
          </div>
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
                    <div className="overviewItem">
                      <strong>Document ID:</strong>
                      <span>{document.document_id}</span>
                    </div>
                    <div className="overviewItem">
                      <strong>Title:</strong>
                      <span>
                        {document.title}
                        <EditDocumentTitleModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Project:</strong>
                      <span>
                        {document.project?.title || "Not assigned"}
                        <EditDocumentProjectModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Client:</strong>
                      <span>
                        {document.client?.fullname || "Not assigned"}
                        <EditDocumentClientModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Created:</strong>
                      <span>
                        {document.created ? new Date(document.created).toLocaleDateString() : "Not set"}
                        <EditDocumentCreatedModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Valid Until:</strong>
                      <span>
                        {document.validuntil ? new Date(document.validuntil).toLocaleDateString() : "Not set"}
                        <EditDocumentValidUntilModal
                          document={document}
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
                      <MdSecurity style={overviewIconStyle} />
                      Document Properties
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="overviewItem">
                      <strong>File Path:</strong>
                      <span>
                        {document.filepath || "Not set"}
                        <EditDocumentFilePathModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Original:</strong>
                      <span>
                        {document.original ? (
                          <MdCheckCircle style={{ color: "green", marginRight: "0.5em" }} />
                        ) : (
                          <MdCancel style={{ color: "red", marginRight: "0.5em" }} />
                        )}
                        {document.original ? "Yes" : "No"}
                        <EditDocumentOriginalModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Trafficable:</strong>
                      <span>
                        {document.trafficable ? (
                          <MdCheckCircle style={{ color: "green", marginRight: "0.5em" }} />
                        ) : (
                          <MdCancel style={{ color: "red", marginRight: "0.5em" }} />
                        )}
                        {document.trafficable ? "Yes" : "No"}
                        <EditDocumentTrafficableModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Status:</strong>
                      <span>
                        {document.status || "Not set"}
                        <EditDocumentStatusModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    <div className="overviewItem">
                      <strong>Status Date:</strong>
                      <span>
                        {document.statusdate ? new Date(document.statusdate).toLocaleDateString() : "Not set"}
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Grid.Column>
            </Grid>
            
            <Grid stackable columns={1}>
              <Grid.Column>
                <Card>
                  <Card.Header>
                    <h4>
                      <FaSort style={overviewIconStyle} />
                      Additional Information
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="overviewItem">
                      <strong>Notes:</strong>
                      <span>
                        {document.notes || "No notes"}
                        <EditDocumentNotesModal
                          document={document}
                          update_state={this.update_state}
                        />
                      </span>
                    </div>
                    {document.logstatus && (
                      <div className="overviewItem">
                        <strong>Status Log:</strong>
                        <span>
                          <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9em" }}>
                            {document.logstatus}
                          </pre>
                        </span>
                      </div>
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

export default DocumentOverview;
