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
  EditTaskCommentProjectTaskModal,
  EditTaskCommentConsultantModal,
  EditTaskCommentCommentModal,
} from "../../../modals/task_comment_edit_modals";
import DeleteObjectModal from "../../../modals/delete_object";

const VIEW_TASK_COMMENT = "http://localhost:8000/api/data_management/task_comment/";

function getTaskCommentIdFromPath() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

class TaskCommentOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskComment: {},
      is_loaded: false,
    };
  }

  componentDidMount() {
    this.fetchTaskComment();
  }

  fetchTaskComment = () => {
    const taskCommentId = getTaskCommentIdFromPath();
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(VIEW_TASK_COMMENT + taskCommentId + "/", {
        headers: currentHeaders,
      })
      .then((res) => {
        this.setState({
          taskComment: res.data,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error("Error fetching task comment:", e);
        this.setState({
          is_loaded: true,
        });
      });
  };

  update_state = (newData) => {
    this.setState({
      taskComment: { ...this.state.taskComment, ...newData },
    });
  };

  render() {
    const { taskComment, is_loaded } = this.state;

    if (!is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="mainContainer">
            {pageHeader("task_comment_overview", "Loading...")}
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
          {pageHeader("task_comment_overview", `Task Comment: ${taskComment.taskcomm_id || "Loading..."}`)}
          <div className="contentContainer">
            <div className="contentBody">
              <Grid stackable columns={2} divided>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaIdBadge style={overviewIconStyle} /> Basic Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}><FaIdBadge style={overviewIconStyle} /> Task Comment ID</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {taskComment.taskcomm_id || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <button className="ui button tiny basic" disabled title="ID is immutable"><FaStop style={{ marginRight: 6, color: "red" }} />ID</button>
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Project Task</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {taskComment.projtask?.title || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCommentProjectTaskModal taskComment={taskComment} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Entered</div>
                      <div className={"info_span"}>
                        {taskComment.commentregistration ? new Date(taskComment.commentregistration).toLocaleString() : "N/A"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal objectType="TaskComment" objectId={taskComment.taskcomm_id} objectName={taskComment.taskcomm_id} />
                    </Card.Footer>
                  </Card>
                </Grid.Column>

                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaStickyNote style={overviewIconStyle} /> Details
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}><FaStickyNote style={overviewIconStyle} /> Consultant</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {(taskComment.consultant && (taskComment.consultant.fullname || `${taskComment.consultant.surname || ''} ${taskComment.consultant.name || ''}`.trim())) || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCommentConsultantModal taskComment={taskComment} update_state={this.update_state} />
                        </span>
                      </div>

                      <div className={"info_descr"} style={{ marginTop: 16 }}><FaStickyNote style={overviewIconStyle} /> Comment</div>
                      <div className={"info_span"} style={{ position: "relative" }}>
                        {taskComment.comment || "N/A"}
                        <span style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                          <EditTaskCommentCommentModal taskComment={taskComment} update_state={this.update_state} />
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

export default TaskCommentOverview;
