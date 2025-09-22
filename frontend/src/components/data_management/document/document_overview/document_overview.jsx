// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { FaIdBadge, FaStickyNote, FaStop } from "react-icons/fa";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditDocumentTitleModal,
  EditDocumentClientModal,
  EditDocumentValidUntilModal,
  EditDocumentOriginalModal,
  EditDocumentTrafficableModal,
  EditDocumentStatusModal,
  EditDocumentNotesModal,
  UploadDocumentFileModal,
  DeleteDocumentFileModal,
} from "../../../modals/document_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_DOCUMENT = "https://ultima.icsgr.com/api/data_management/document/";

function getDocumentIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

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
          {pageHeader("document_overview", `Document: ${document.document_id || "Loading..."}`)}
          <div className="contentContainer">
            <div className="contentBody">
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaIdBadge style={overviewIconStyle} /> Basic Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}><FaIdBadge style={overviewIconStyle} /> Document ID</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.document_id || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <button className="ui button tiny basic" disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</button>
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaIdBadge style={overviewIconStyle} /> Title</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.title || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentTitleModal document={document} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Project</div>
                      <div className={"info_span"}>{document.project?.title || "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Client</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(document.client && (document.client.fullname || `${document.client.surname || ''} ${document.client.name || ''}`.trim())) || 'N/A'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentClientModal document={document} update_state={this.update_state} />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal objectType="Document" objectId={document.document_id} objectName={document.document_id} />
                    </Card.Footer>
                  </Card>
                </Grid.Column>

                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaStickyNote style={overviewIconStyle} /> Details
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}><FaStickyNote style={overviewIconStyle} /> Created</div>
                      <div className={"info_span"}>{document.created ? new Date(document.created).toLocaleDateString() : "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Valid Until</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.validuntil ? new Date(document.validuntil).toLocaleDateString() : "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentValidUntilModal document={document} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Filepath</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        <div
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-all",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            paddingRight: 140,
                          }}
                        >
                          {document.filepath ? (
                            <a
                              href={(document.filepath.startsWith('http') ? document.filepath : `${window.location.origin}${document.filepath.startsWith('/') ? '' : '/'}${document.filepath}`)}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {document.filepath}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          {document.filepath ? (
                            <DeleteDocumentFileModal document={document} update_state={this.update_state} />
                          ) : (
                            <UploadDocumentFileModal document={document} update_state={this.update_state} />
                          )}
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Status</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.status || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentStatusModal document={document} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Status Date</div>
                      <div className={"info_span"}>{document.statusdate ? new Date(document.statusdate).toLocaleDateString() : "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Original</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.original ? 'Yes' : 'No'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentOriginalModal document={document} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Trafficable</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.trafficable ? 'Yes' : 'No'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentTrafficableModal document={document} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Notes</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {document.notes || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditDocumentNotesModal document={document} update_state={this.update_state} />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
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
