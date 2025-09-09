// Built-ins
import React from "react";

// Icons
import { MdTask } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid, Container } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import axios from "axios";
import AddProjectTaskModal from "../../../modals/create/add_project_task";
import AddTaskCommentModal from "../../../modals/create/add_task_comment";

// Global Variables
import { headers, pageHeader, loader } from "../../../global_vars";

const VIEW_PROJECT = "http://localhost:8000/api/data_management/project/";

function getProjectIdFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("project");
  if (idx === -1) return null;
  const id = parts[idx + 1] || null;
  return id ? decodeURIComponent(id) : null;
}

let overviewIconStyle = { color: "#93ab3c", marginRight: "0.5em" };

// Reusable styles for list-style UI
const labelPillStyle = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "999px",
  background: "#f5f5f5",
  color: "#666",
  fontSize: 12,
  fontWeight: 600,
};

const valueTextStyle = {
  fontWeight: 700,
};

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      is_loaded: false,
      tasks: [],
      taskComments: [],
      cashItems: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const currentHeaders = { ...headers, "Authorization": "Token " + localStorage.getItem("userToken") };
      const projectId = getProjectIdFromPath();
      const res = await axios.get(`${VIEW_PROJECT}${projectId}/`, { headers: currentHeaders });
      const p = res?.data || {};
      this.setState({
        project: p,
        tasks: p.tasks || [],
        taskComments: p.comments || p.task_comments || [],
        cashItems: p.cash_transactions || [],
        is_loaded: true,
      });
    } catch (e) {
      if (e?.response?.status === 401) {
        this.setState({ forbidden: true });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "An unknown error has occurred." });
      }
    }
  };

  render() {
    const { project } = this.state;
    if (!this.state.is_loaded) {
      return (
        <>
          <div className="rootContainer">
            {pageHeader("project_tasks", project?.title || "Project")}
            {loader()}
          </div>
        </>
      );
    }

    return (
      <>
        <div className="rootContainer">
          {pageHeader("project_tasks", project?.title || "Project")}
          <div className="contentBody">
            <style>{`
              .pillLink { color: inherit; text-decoration: none; }
              .pillLink:hover { color: #93ab3c; text-decoration: none; }
            `}</style>
            <Grid stackable columns={2}>
              <Container>
              <Grid.Column>
                {Array.isArray(this.state.tasks) && this.state.tasks.length > 0 ? (
                  this.state.tasks.map((t) => (
                    <Card key={t.projtask_id} style={{ marginTop: 16 }}>
                      <Card.Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h5 style={{ margin: 0 }}>
                          <MdTask style={overviewIconStyle} /> {t.title || 'Task'}
                        </h5>
                        <a
                          href={`/data_management/project_task/${t.projtask_id}`}
                          className="btn btn-sm btn-success"
                          style={{ padding: '2px 10px', borderRadius: 6 }}
                        >
                          #{t.projtask_id}
                        </a>
                      </Card.Header>
                      <Card.Body>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          <span style={labelPillStyle}>Status</span>
                          <span style={valueTextStyle}>{t.status || 'N/A'}</span>
                          {t.deadline ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Deadline</span>
                            <span style={valueTextStyle}>{new Date(t.deadline).toLocaleDateString()}</span>
                          </>) : null}
                          {t.taskcate ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Category</span>
                            <span style={valueTextStyle}>{t.taskcate?.title || t.taskcate}</span>
                          </>) : null}
                          {t.assignee?.consultant_id ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Assignee</span>
                            <a
                              href={`/administration/consultant/${t.assignee.consultant_id}`}
                              className="btn btn-sm btn-success"
                              style={{ padding: '2px 10px', borderRadius: 6 }}
                            >
                              {t.assignee.consultant_id}
                            </a>
                          </>) : (t.assignee?.fullname ? (<>
                            <span style={{ width: 10 }} />
                            <span style={labelPillStyle}>Assignee</span>
                            <span style={valueTextStyle}>{t.assignee.fullname}</span>
                          </>) : null)}
                        </div>
                        {(() => {
                          const taskId = t.projtask_id;
                          const comments = (this.state.taskComments || []).filter((c) => {
                            const cid = c?.projtask?.projtask_id || c?.projtask_id;
                            return cid === taskId;
                          });
                          if (!comments.length) return null;
                          return (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ marginBottom: 6, fontWeight: 700 }}>Comments</div>
                              <ul className="list-unstyled" style={{ margin: 0 }}>
                                {comments.map((cm, cidx) => (
                                  <li key={cm.taskcomm_id || cidx} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                                      <span style={labelPillStyle}>#</span>
                                      <span style={valueTextStyle}>{cidx + 1}</span>
                                      {cm.commentregistration ? (<>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>Time</span>
                                        <span style={valueTextStyle}>{new Date(cm.commentregistration).toLocaleString()}</span>
                                      </>) : null}
                                      {cm.consultant?.consultant_id ? (<>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>By</span>
                                        <a
                                          href={`/administration/consultant/${cm.consultant.consultant_id}`}
                                          className="btn btn-sm btn-success"
                                          style={{ padding: '2px 10px', borderRadius: 6 }}
                                        >
                                          {cm.consultant.consultant_id}
                                        </a>
                                      </>) : (cm.consultant ? (<>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>By</span>
                                        <span style={valueTextStyle}>{cm.consultant.fullname || `${cm.consultant.surname || ''} ${cm.consultant.name || ''}`.trim()}</span>
                                      </>) : null)}
                                      {cm.comment ? (<>
                                        <span style={{ width: 10 }} />
                                        <span style={labelPillStyle}>Comment</span>
                                        <span style={valueTextStyle}>{cm.comment}</span>
                                      </>) : null}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}
                      </Card.Body>
                      <Card.Footer>
                        <AddTaskCommentModal
                          refreshData={this.fetchData}
                          defaultProjectTaskId={t.projtask_id}
                          lockProjectTask={true}
                        />
                      </Card.Footer>
                    </Card>
                  ))
                ) : (<div>No tasks</div>)}
                <AddProjectTaskModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
              </Grid.Column>
              </Container>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default Tasks;


