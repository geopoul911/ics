// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditDocumentIdModal,
  EditDocumentTitleModal,
  EditDocumentProjectModal,
  EditDocumentClientModal,
  EditDocumentCreatedModal,
  EditDocumentValidUntilModal,
  EditDocumentFilepathModal,
  EditDocumentOriginalModal,
  EditDocumentTrafficableModal,
  EditDocumentStatusModal,
  EditDocumentNotesModal,
} from "../../../modals/document_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_DOCUMENT = "http://localhost:8000/api/data_management/document/";

function getDocumentIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
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
    this.fetchDocument();
  }

  fetchDocument = () => {
    const documentId = getDocumentIdFromPath();
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(VIEW_DOCUMENT + documentId + "/", {
        headers: currentHeaders,
      })
      .then((res) => {
        this.setState({
          document: res.data,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error("Error fetching document:", e);
        this.setState({
          is_loaded: true,
        });
      });
  };

  update_state = (newData) => {
    this.setState({
      document: { ...this.state.document, ...newData },
    });
  };

  render() {
    const { document, is_loaded } = this.state;

    if (!is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="mainContainer">
            {pageHeader("document_overview", "Loading...")}
            <div className="contentContainer">
              <div className="contentBody">
                <div>Loading...</div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("document_overview", document.document_id || "Not set")}
          <div className="contentContainer">
            <div className="contentBody">
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare style={overviewIconStyle} />
                        Document Information
                      </Card.Header>
                      <Card.Body>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Document ID:</strong> {document.document_id || "Not set"}
                                <EditDocumentIdModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Title:</strong> {document.title || "Not set"}
                                <EditDocumentTitleModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Project:</strong> {document.project?.title || "Not set"}
                                <EditDocumentProjectModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Client:</strong>{" "}
                                {document.client?.surname || "Not set"} {document.client?.name || ""}
                                <EditDocumentClientModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Created Date:</strong>{" "}
                                {document.created
                                  ? new Date(document.created).toLocaleDateString()
                                  : "Not set"}
                                <EditDocumentCreatedModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Valid Until:</strong>{" "}
                                {document.validuntil
                                  ? new Date(document.validuntil).toLocaleDateString()
                                  : "Not set"}
                                <EditDocumentValidUntilModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Filepath:</strong> {document.filepath || "Not set"}
                                <EditDocumentFilepathModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Status:</strong> {document.status || "Not set"}
                                <EditDocumentStatusModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Original:</strong> {document.original ? "Yes" : "No"}
                                <EditDocumentOriginalModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Trafficable:</strong> {document.trafficable ? "Yes" : "No"}
                                <EditDocumentTrafficableModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <p>
                                <strong>Notes:</strong> {document.notes || "Not set"}
                                <EditDocumentNotesModal
                                  document={document}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <DeleteObjectModal
                      objectType="document"
                      objectId={document.document_id}
                      objectName={document.document_id}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default DocumentOverview;
