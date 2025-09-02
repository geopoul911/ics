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
  EditTaskCommentIdModal,
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

let overviewIconStyle = { color: "#2a9fd9", marginRight: "0.5em" };

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
          {pageHeader("task_comment_overview", taskComment.taskcomm_id || "Not set")}
          <div className="contentContainer">
            <div className="contentBody">
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Card>
                      <Card.Header>
                        <BsInfoSquare style={overviewIconStyle} />
                        Task Comment Information
                      </Card.Header>
                      <Card.Body>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Task Comment ID:</strong> {taskComment.taskcomm_id || "Not set"}
                                <EditTaskCommentIdModal
                                  taskComment={taskComment}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Project Task:</strong> {taskComment.projtask?.title || "Not set"}
                                <EditTaskCommentProjectTaskModal
                                  taskComment={taskComment}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Registration Date:</strong>{" "}
                                {taskComment.commentregistration
                                  ? new Date(taskComment.commentregistration).toLocaleString()
                                  : "Not set"}
                              </p>
                            </Grid.Column>
                            <Grid.Column width={8}>
                              <p>
                                <strong>Consultant:</strong>{" "}
                                {taskComment.consultant?.surname || "Not set"} {taskComment.consultant?.name || ""}
                                <EditTaskCommentConsultantModal
                                  taskComment={taskComment}
                                  update_state={this.update_state}
                                />
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <p>
                                <strong>Comment:</strong> {taskComment.comment || "Not set"}
                                <EditTaskCommentCommentModal
                                  taskComment={taskComment}
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
                      objectType="task_comment"
                      objectId={taskComment.taskcomm_id}
                      objectName={taskComment.taskcomm_id}
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

export default TaskCommentOverview;
