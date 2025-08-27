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
  EditProjectCategoryTitleModal,
  EditProjectCategoryOrderIndexModal,
  EditProjectCategoryActiveModal,
} from "../../../modals/project_category_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for project category
const VIEW_PROJECT_CATEGORY = "http://localhost:8000/api/administration/project_category/";

// Helpers to read URL like: /administration/project_category/<projcate_id>
function getProjectCategoryIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("project_category");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

class ProjectCategoryOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_category: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const projectCategoryId = getProjectCategoryIdFromPath();

    axios
      .get(`${VIEW_PROJECT_CATEGORY}${projectCategoryId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const project_category =
          res?.data ||
          {};

        this.setState({
          project_category,
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

  // When modals return a fresh object, replace state.project_category
  update_state = (updated) => {
    this.setState({ project_category: updated });
  };

  render() {
    const { project_category } = this.state;
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("project_category_overview", `Project Category: ${project_category.title || 'Loading...'}`)}
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
                      {/* Project Category ID */}
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Category ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project_category.projcate_id ? project_category.projcate_id : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <Button size="tiny" basic disabled>
                            <FaStop style={{ marginRight: 6, color: "red" }} title="Category ID is immutable"/>
                            ID
                          </Button>
                        </span>
                      </div>

                      {/* Title */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Title
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project_category.title ? project_category.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectCategoryTitleModal
                            project_category={project_category}
                            onProjectCategoryUpdated={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order Index */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Order Index
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof project_category.orderindex === "number" ||
                          typeof project_category.orderindex === "string")
                          ? project_category.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectCategoryOrderIndexModal
                            project_category={project_category}
                            onProjectCategoryUpdated={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={project_category.projcate_id}
                        object_name={project_category.title}
                        object_type="ProjectCategory"
                        warningMessage="This will also delete all projects associated with this category."
                        onDeleteSuccess={() => {
                          window.location.href = "/administration/all_project_categories";
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
                      Status Information
                    </Card.Header>
                    <Card.Body>
                      {/* Active */}
                      <div className={"info_descr"}>
                        <MdCheckCircle style={overviewIconStyle} /> Active
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {project_category.active ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditProjectCategoryActiveModal
                            project_category={project_category}
                            onProjectCategoryUpdated={this.update_state}
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

export default ProjectCategoryOverview;
