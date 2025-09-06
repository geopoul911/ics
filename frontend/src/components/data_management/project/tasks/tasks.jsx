// Built-ins
import React from "react";

// Icons
import { MdTask } from "react-icons/md";

// Modules / Functions
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import axios from "axios";
import AddProjectTaskModal from "../../../modals/create/add_project_task";
import AddCashModal from "../../../modals/create/add_cash";

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
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdTask style={overviewIconStyle} /> Tasks</h4>
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
                              <span style={valueTextStyle}>{t.title}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>Status</span>
                              <span style={valueTextStyle}>{t.status || 'N/A'}</span>
                              {t.deadline ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Deadline</span>
                                <span style={valueTextStyle}>{new Date(t.deadline).toLocaleDateString()}</span>
                              </>) : null}
                              {t.assignee?.fullname ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Assignee</span>
                                <span style={valueTextStyle}>{t.assignee.fullname}</span>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No tasks</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddProjectTaskModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                  </Card.Footer>
                </Card>
              </Grid.Column>
              
              <Grid.Column>
                <Card style={{ marginTop: 20 }}>
                  <Card.Header>
                    <h4><MdTask style={overviewIconStyle} /> Cash</h4>
                  </Card.Header>
                  <Card.Body>
                    {Array.isArray(this.state.cashItems) && this.state.cashItems.length > 0 ? (
                      <ul className="list-unstyled" style={{ margin: 0 }}>
                        {this.state.cashItems.map((c, idx) => (
                          <li key={c.cash_id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                              <span style={labelPillStyle}>#</span>
                              <span style={valueTextStyle}>{idx + 1}</span>
                              <span style={{ width: 10 }} />
                              <span style={labelPillStyle}>ID</span>
                              <a href={`/data_management/cash/${c.cash_id}`} className="pillLink" style={{ ...valueTextStyle }}>{c.cash_id}</a>
                              {c.trandate ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Transaction date</span>
                                <span style={valueTextStyle}>{new Date(c.trandate).toLocaleDateString()}</span>
                              </>) : null}
                              {c.kind ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>Kind</span>
                                <span style={valueTextStyle}>{c.kind === 'E' ? 'Expense' : 'Payment'}</span>
                              </>) : null}
                              {(c.amountpay || c.amountexp) ? (<>
                                <span style={{ width: 10 }} />
                                <span style={labelPillStyle}>{c.amountpay ? 'Amount payment' : 'Amount expense'}</span>
                                <span style={valueTextStyle}>{c.amountpay || c.amountexp}</span>
                              </>) : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (<div>No cash entries</div>)}
                  </Card.Body>
                  <Card.Footer>
                    <AddCashModal refreshData={this.fetchData} defaultProjectId={this.state.project?.project_id} lockProject={true} />
                  </Card.Footer>
                </Card>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}

export default Tasks;


