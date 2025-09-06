// Built-ins
import React from "react";

// Icons / Images
import { FaStop } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { MdSecurity, MdCheckCircle, MdCancel } from "react-icons/md";
import { MdTask } from "react-icons/md";

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
const ALL_PROJECTS = "http://localhost:8000/api/data_management/projects/";

// Helpers to read URL like: /administration/project_category/<projcate_id>
function getProjectCategoryIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("project_category");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
let labelPillStyle = { background: "#eef5ff", color: "#2c3e50", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85em", marginRight: "8px", border: "1px solid #d6e4ff" };
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class ProjectCategoryOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_category: {},
      is_loaded: false,
      projects: [],
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
      .then(async (res) => {
        // Accept a few possible payload shapes safely
        const project_category =
          res?.data ||
          {};

        let projects = project_category.projects || [];
        if (!Array.isArray(projects) || projects.length === 0) {
          try {
            const projRes = await axios.get(ALL_PROJECTS, { headers: currentHeaders });
            const allProjects = projRes?.data?.all_projects || projRes?.data?.results || projRes?.data?.data || projRes?.data || [];
            const pid = project_category.projcate_id;
            projects = (Array.isArray(allProjects) ? allProjects : []).filter(p => {
              const cats = Array.isArray(p.categories) ? p.categories : [];
              return cats.some(c => (c?.projcate_id === pid || c === pid));
            });
          } catch (_e) { projects = []; }
        }

        this.setState({
          project_category,
          projects,
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
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("project_category_overview", `Project Category: ${project_category.title || 'Loading...'}`)}
          {this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaIdBadge
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Basic Information
                    </Card.Header>
                    <Card.Body>
                      {/* Project Category ID */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Category ID
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
                        <FaIdBadge style={overviewIconStyle} /> Title
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

                      {/* Order by */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> Order by
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
                          color: "#93ab3c",
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
                <Grid.Column>
                  <Card style={{ marginTop: 20 }}>
                    <Card.Header>
                      <MdTask
                        style={{
                          color: "#93ab3c",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Projects
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.projects) && this.state.projects.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.projects.map((p, idx) => (
                            <li key={p.project_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/project/${p.project_id}`} className="pillLink" style={{ ...valueTextStyle }}>{p.project_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Title</span>
                                <span style={valueTextStyle}>{p.title || 'N/A'}</span>
                                {p.filecode ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>File code</span>
                                  <span style={valueTextStyle}>{p.filecode}</span>
                                </>) : null}
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{p.status || 'N/A'}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No projects</div>
                      )}
                    </Card.Body>
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
