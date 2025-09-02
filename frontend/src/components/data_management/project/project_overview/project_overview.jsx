// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { FaHashtag, FaSort, FaStop } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { MdCheckCircle, MdCancel } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import {
  EditProjectIdModal,
  EditProjectTitleModal,
  EditProjectConsultantModal,
  EditProjectFilecodeModal,
  EditProjectTaxationModal,
  EditProjectDeadlineModal,
  EditProjectStatusModal,
  EditProjectDetailsModal,
  EditProjectNotesModal,
} from "../../../modals/project_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_PROJECT = "http://localhost:8000/api/data_management/project/";

function getProjectIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

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
          <NavigationBar />
          <div className="rootContainer">
            {pageHeader("project_overview", "")}
            <div className="contentBody">
              <div>Loading...</div>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("project_overview", project.title)}
          <div className="contentBody">
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <FaHashtag style={overviewIconStyle} />
                        Basic Information
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="overview_item">
                        <strong>Project ID:</strong>
                        <span>{project.project_id}</span>
                        <EditProjectIdModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>Title:</strong>
                        <span>{project.title}</span>
                        <EditProjectTitleModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>File Code:</strong>
                        <span>{project.filecode}</span>
                        <EditProjectFilecodeModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>Registration Date:</strong>
                        <span>{project.registrationdate ? new Date(project.registrationdate).toLocaleDateString() : ""}</span>
                      </div>
                      <div className="overview_item">
                        <strong>Registration User:</strong>
                        <span>{project.registrationuser}</span>
                      </div>
                    </Card.Body>
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
                      <div className="overview_item">
                        <strong>Consultant:</strong>
                        <span>
                          {project.consultant ? `${project.consultant.surname} ${project.consultant.name}` : "Not assigned"}
                        </span>
                        <EditProjectConsultantModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>Status:</strong>
                        <span>{project.status}</span>
                        <EditProjectStatusModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>Taxation:</strong>
                        <span>
                          {project.taxation ? (
                            <MdCheckCircle style={{ color: "green", fontSize: "1.2em" }} />
                          ) : (
                            <MdCancel style={{ color: "red", fontSize: "1.2em" }} />
                          )}
                        </span>
                        <EditProjectTaxationModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>Deadline:</strong>
                        <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</span>
                        <EditProjectDeadlineModal project={project} refreshData={this.fetchProject} />
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <FaSort style={overviewIconStyle} />
                        Additional Information
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <div className="overview_item">
                        <strong>Details:</strong>
                        <span>{project.details || "No details provided"}</span>
                        <EditProjectDetailsModal project={project} refreshData={this.fetchProject} />
                      </div>
                      <div className="overview_item">
                        <strong>Notes:</strong>
                        <span>{project.notes || "No notes provided"}</span>
                        <EditProjectNotesModal project={project} refreshData={this.fetchProject} />
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={16}>
                  <Card>
                    <Card.Header>
                      <h4>
                        <FaStop style={overviewIconStyle} />
                        Actions
                      </h4>
                    </Card.Header>
                    <Card.Body>
                      <DeleteObjectModal
                        objectType="Project"
                        objectId={project.project_id}
                        objectName={project.title}
                        onDelete={this.fetchProject}
                      />
                    </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default ProjectOverview;
