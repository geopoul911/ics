// Built-ins
import React from "react";

// Icons / Images
import { FaSort } from "react-icons/fa";
import { FaIdBadge, FaStickyNote, FaStop } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditProjectTitleModal,
  EditProjectConsultantModal,
  EditProjectFilecodeModal,
  EditProjectTaxationModal,
  EditProjectDeadlineModal,
  EditProjectDetailsModal,
  EditProjectNotesModal,
  EditProjectAssignedModal,
  EditProjectInprogressModal,
  EditProjectCompletedModal,
  EditProjectSettledModal,
  EditProjectAbandonedModal,
} from "../../../modals/project_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_PROJECT = "https://ultima.icsgr.com/api/data_management/project/";

function getProjectIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class ProjectOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    this.fetchProject();
  }

  fetchProject = () => {
    const projectId = getProjectIdFromPath();
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(VIEW_PROJECT + projectId + "/", {
        headers: currentHeaders,
      })
      .then((res) => {
        this.setState({
          project: res.data,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error("Error fetching project:", e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        }
      });
  };

  update_state = (updated) => {
    this.setState({ project: updated });
  };

  render() {
    const { project } = this.state;

    if (!this.state.is_loaded) {
      return (
        <>
          <div className="rootContainer">
            {pageHeader("project_overview", "")}
            <div className="contentBody">
              <div>Loading...</div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="rootContainer">
          {pageHeader("project_overview", project.title)}
          <div className="contentBody">
            <Grid stackable rows={2}>
                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <FaIdBadge style={overviewIconStyle} />
                        Basic Information
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Project ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.project_id || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 8, alignItems: "center" }}>
                          <button className="ui button tiny basic" disabled title="Project ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</button>
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> Title
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.title || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectTitleModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> File code
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.filecode || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectFilecodeModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> Entered
                      </div>
                      <div className={"info_span"}>
                        {project.registrationdate ? new Date(project.registrationdate).toLocaleDateString() : "N/A"}
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> User
                      </div>
                      <div className={"info_span"}>
                        {project.registrationuser || "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectType="Project"
                        objectId={project.project_id}
                        objectName={project.title}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>

                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <BsInfoSquare style={overviewIconStyle} />
                        Project Details
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <BsInfoSquare style={overviewIconStyle} /> Consultant
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.consultant ? (project.consultant.fullname || `${project.consultant.surname} ${project.consultant.name}`) : "Not assigned"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectConsultantModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Status
                      </div>
                      <div className={"info_span"}>
                        {project.status || "N/A"}
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Taxation
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.taxation ? (
                          <span style={{ color: "green" }}><MdCheckCircle /></span>
                        ) : (
                          <span style={{ color: "red" }}><MdCancel /></span>
                        )}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectTaxationModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Deadline
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectDeadlineModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Assigned
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.assigned ? <span style={{ color: "green" }}><MdCheckCircle /></span> : <span style={{ color: "red" }}><MdCancel /></span>}
                        {project.assignedate ? ` — ${new Date(project.assignedate).toLocaleDateString()}` : ""}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectAssignedModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> In progress
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.inprogress ? <span style={{ color: "green" }}><MdCheckCircle /></span> : <span style={{ color: "red" }}><MdCancel /></span>}
                        {project.inprogressdate ? ` — ${new Date(project.inprogressdate).toLocaleDateString()}` : ""}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectInprogressModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Completed
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.completed ? <span style={{ color: "green" }}><MdCheckCircle /></span> : <span style={{ color: "red" }}><MdCancel /></span>}
                        {project.completiondate ? ` — ${new Date(project.completiondate).toLocaleDateString()}` : ""}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectCompletedModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Settled
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.settled ? <span style={{ color: "green" }}><MdCheckCircle /></span> : <span style={{ color: "red" }}><MdCancel /></span>}
                        {project.settlementdate ? ` — ${new Date(project.settlementdate).toLocaleDateString()}` : ""}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectSettledModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Abandoned
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.abandoned ? <span style={{ color: "green" }}><MdCheckCircle /></span> : <span style={{ color: "red" }}><MdCancel /></span>}
                        {project.abandondate ? ` — ${new Date(project.abandondate).toLocaleDateString()}` : ""}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectAbandonedModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <FaStickyNote style={overviewIconStyle} />
                        Additional Information
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaStickyNote style={overviewIconStyle} /> Details
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.details || "No details provided"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectDetailsModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaStickyNote style={overviewIconStyle} /> Notes
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project.notes || "No notes provided"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectNotesModal project={project} refreshData={this.fetchProject} />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <BsInfoSquare style={overviewIconStyle} />
                        Categories
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>Assigned Categories</div>
                      <div className={"info_span"}>
                        {Array.isArray(project.categories) && project.categories.length > 0 ? (
                          <ul style={{ paddingLeft: 18, margin: 0 }}>
                            {project.categories.map((cat) => (
                              <li key={cat.projcate_id}>{cat.title}</li>
                            ))}
                          </ul>
                        ) : (
                          <span>None</span>
                        )}
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

export default ProjectOverview;
