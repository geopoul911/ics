// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../../core/navigation_bar/navigation_bar";
import Footer from "../../../core/footer/footer";

// Icons / Images
import { FaHashtag, FaSort, FaStop } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers, pageHeader } from "../../../global_vars";
import DeleteObjectModal from "../../../modals/delete_object";
import {
  EditTaskTitleModal,
  EditTaskDetailsModal,
  EditTaskPriorityModal,
  EditTaskWeightModal,
  EditTaskEffortTimeModal,
  EditTaskStatusModal,
  EditTaskActiveModal,
  EditTaskAssigneeModal,
  EditTaskCategoryModal,
  EditTaskDeadlineModal,
} from "../../../modals/project_task_edit_modals";

// Edit Modals (to be implemented similarly later or reuse existing)
// Edit modals can be added here later when implemented

const VIEW_TASK = "https://ultima.icsgr.com/api/data_management/project_task/";

function getTaskIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("project_task");
  if (idx === -1) return null;
  return parts[idx + 1] || null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class ProjectTaskOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    this.fetchTask();
  }

  fetchTask = () => {
    const taskId = getTaskIdFromPath();
    const currentHeaders = {
      ...headers,
      Authorization: "Token " + localStorage.getItem("userToken"),
    };

    axios
      .get(`${VIEW_TASK}${taskId}/`, { headers: currentHeaders })
      .then((res) => {
        this.setState({ task: res.data, is_loaded: true });
      })
      .catch((e) => {
        console.error("Error fetching project task:", e);
        this.setState({ is_loaded: true });
      });
  };

  update_state = (updated) => {
    this.setState({ task: updated });
  };

  render() {
    const { task, is_loaded } = this.state;

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("project_task_overview", `Task: ${task.title || "Loading..."}`)}
          {is_loaded ? (
            <>
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={overviewIconStyle} /> Basic Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <FaHashtag style={overviewIconStyle} /> Project task ID
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.projtask_id || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <button className="ui button tiny basic" disabled title="Task ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</button>
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Title
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.title || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskTitleModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Priority
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.priority || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskPriorityModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Details
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.details || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskDetailsModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Weight
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.weight ?? "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskWeightModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Effort Time (h)
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.efforttime ?? "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskEffortTimeModal task={task} update_state={this.update_state} />
                        </span>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        objectType="ProjectTask"
                        objectId={task.projtask_id}
                        objectName={task.title}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>

                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare style={overviewIconStyle} /> Assignments
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}>
                        <BsInfoSquare style={overviewIconStyle} /> Project
                      </div>
                      <div className={"info_span"}>{task.project?.title || "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Assigner
                      </div>
                      <div className={"info_span"}>{task.assigner?.fullname || "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Assignee
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.assignee?.fullname || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskAssigneeModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Category
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.taskcate?.title || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCategoryModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Entered
                      </div>
                      <div className={"info_span"}>{task.assigndate || "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Deadline
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.deadline || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskDeadlineModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Completion date
                      </div>
                      <div className={"info_span"}>{task.completiondate || "N/A"}</div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <FaSort style={overviewIconStyle} /> Status
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.status || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskStatusModal task={task} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}>
                        <BsInfoSquare style={overviewIconStyle} /> Active
                      </div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {task.active ? 'Yes' : 'No'}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskActiveModal task={task} update_state={this.update_state} />
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            <div style={{ padding: 20 }}>Loading...</div>
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default ProjectTaskOverview;


