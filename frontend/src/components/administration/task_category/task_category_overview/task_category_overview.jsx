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
  EditTaskCategoryTitleModal,
  EditTaskCategoryOrderIndexModal,
  EditTaskCategoryActiveModal,
} from "../../../modals/task_category_edit_modals";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// API endpoint for task category
const VIEW_TASK_CATEGORY = "https://ultima.icsgr.com/api/administration/task_category/";

// Helpers to read URL like: /administration/task_category/<taskcate_id>
function getTaskCategoryIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean); // removes '' from // or trailing /
  const idx = parts.indexOf("task_category");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };
let labelPillStyle = { background: "#eef5ff", color: "#2c3e50", padding: "2px 10px", borderRadius: "12px", fontSize: "0.85em", marginRight: "8px", border: "1px solid #d6e4ff" };
let valueTextStyle = { fontWeight: 600, color: "#212529" };

class TaskCategoryOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task_category: {},
      is_loaded: false,
      tasks: [],
    };
  }

  componentDidMount() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    const taskCategoryId = getTaskCategoryIdFromPath();

    axios
      .get(`${VIEW_TASK_CATEGORY}${taskCategoryId}/`, { headers: currentHeaders })
      .then((res) => {
        // Accept a few possible payload shapes safely
        const task_category =
          res?.data ||
          {};

        const tasks = Array.isArray(res?.data?.tasks) ? res.data.tasks : [];
        this.setState({
          task_category,
          tasks,
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

  // When modals return a fresh object, replace state.task_category
  update_state = (updated) => {
    this.setState({ task_category: updated });
  };

  render() {
    const { task_category } = this.state;
    
    return (
      <>
        <NavigationBar />
        <style>{`
          .pillLink { color: inherit; text-decoration: none; }
          .pillLink:hover { color: #93ab3c !important; text-decoration: none; }
        `}</style>
        <div className="mainContainer">
          {pageHeader("task_category_overview", `Task Category: ${task_category.title || 'Loading...'}`)}
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
                      {/* Task Category ID */}
                      <div className={"info_descr"}>
                        <FaIdBadge style={overviewIconStyle} /> Category ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task_category.taskcate_id ? task_category.taskcate_id : "N/A"}
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
                        {task_category.title ? task_category.title : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCategoryTitleModal
                            task_category={task_category}
                            onTaskCategoryUpdated={this.update_state}
                          />
                        </span>
                      </div>

                      {/* Order by */}
                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaIdBadge style={overviewIconStyle} /> Order by
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(typeof task_category.orderindex === "number" ||
                          typeof task_category.orderindex === "string")
                          ? task_category.orderindex
                          : "N/A"}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCategoryOrderIndexModal
                            task_category={task_category}
                            onTaskCategoryUpdated={this.update_state}
                          />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={task_category.taskcate_id}
                        object_name={task_category.title}
                        object_type="TaskCategory"
                        onDeleteSuccess={() => {
                          window.location.href = "/administration/all_task_categories";
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
                        {task_category.active ? 
                          <MdCheckCircle style={{ color: 'green' }} /> : 
                          <MdCancel style={{ color: 'red' }} />}
                        <span style={{ position: "absolute", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCategoryActiveModal
                            task_category={task_category}
                            onTaskCategoryUpdated={this.update_state}
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
                      Tasks
                    </Card.Header>
                    <Card.Body>
                      {Array.isArray(this.state.tasks) && this.state.tasks.length > 0 ? (
                        <ul className="list-unstyled" style={{ margin: 0 }}>
                          {this.state.tasks.map((t, idx) => (
                            <li key={t.projtask_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                <span style={labelPillStyle}>#</span>
                                <span style={valueTextStyle}>{idx + 1}</span>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>ID</span>
                                <a href={`/data_management/project_task/${t.projtask_id}`} className="pillLink" style={{ ...valueTextStyle }}>{t.projtask_id}</a>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Title</span>
                                <span style={valueTextStyle}>{t.title || 'N/A'}</span>
                                {t.project?.title ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Project</span>
                                  <span style={valueTextStyle}>{t.project.title}</span>
                                </>) : null}
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Status</span>
                                <span style={valueTextStyle}>{t.status || 'N/A'}</span>
                                {t.assignee?.fullname ? (<>
                                  <span style={{ width: 10 }} />
                                  <span style={labelPillStyle}>Assignee</span>
                                  <span style={valueTextStyle}>{t.assignee.fullname}</span>
                                </>) : null}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>No tasks</div>
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

export default TaskCategoryOverview;
