// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, API_ENDPOINTS } from '../../../utils/api';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button, Badge } from "react-bootstrap";
// import { useHistory } from "react-router-dom";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  // pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// Helper function to get task status
const getTaskStatus = (task) => {
  if (task.completed) return { status: 'Completed', color: 'success' };
  if (task.inprogress) return { status: 'In Progress', color: 'warning' };
  if (task.assigned) return { status: 'Assigned', color: 'info' };
  return { status: 'Created', color: 'danger' };
};

// Helper function to get priority color
const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'danger';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'secondary';
  }
};

const columns = [
  {
    dataField: "projtask_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/project_tasks/" + row.projtask_id} className="text-decoration-none">
          {row.projtask_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "title",
    text: "Title",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const title = row.title || '';
      return title.length > 40 ? title.substring(0, 40) + '...' : title;
    },
  },
  {
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const projectTitle = row.project?.title || '';
      return projectTitle.length > 40 ? projectTitle.substring(0, 40) + '...' : projectTitle;
    },
  },
  {
    dataField: "priority",
    text: "Priority",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const priority = row.priority || 'Low';
      const color = getPriorityColor(priority);
      return (
        <Badge bg={color}>
          {priority}
        </Badge>
      );
    },
  },
  {
    dataField: "assignee.fullname",
    text: "Assignee",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.assignee?.fullname || '',
  },
  {
    dataField: "assigner.fullname",
    text: "Assigner",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.assigner?.fullname || '',
  },
  {
    dataField: "deadline",
    text: "Deadline",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.deadline) return '';
      const deadline = new Date(row.deadline);
      const today = new Date();
      const isOverdue = deadline < today && !row.completed;
      
      return (
        <span className={isOverdue ? 'text-danger' : ''}>
          {deadline.toLocaleDateString()}
          {isOverdue && <Badge bg="danger" className="ms-1">Overdue</Badge>}
        </span>
      );
    },
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const statusInfo = getTaskStatus(row);
      return (
        <Badge bg={statusInfo.color}>
          {statusInfo.status}
        </Badge>
      );
    },
  },
  {
    dataField: "completiondate",
    text: "Completion Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.completiondate ? new Date(row.completiondate).toLocaleDateString() : '';
    },
  },
  {
    dataField: "efforttime",
    text: "Effort Time (hrs)",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.efforttime ? `${row.efforttime}h` : '';
    },
  },
  {
    dataField: "taskcategory.title",
    text: "Category",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.taskcategory?.title || '',
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.active ? 'success' : 'secondary'}>
        {row.active ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "deadline",
    order: "asc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class ProjectTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_tasks: [],
      is_loaded: false,
      currentPage: 1,
      tasksPerPage: 10,
    };
  }

  async fetchProjectTasks() {
    this.setState({ is_loaded: false });
    try {
      const tasks = await apiGet(API_ENDPOINTS.PROJECT_TASKS);
      this.setState({
        project_tasks: tasks,
        is_loaded: true,
      });
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        this.setState({
          forbidden: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load project tasks.",
        });
      }
      this.setState({ is_loaded: true });
    }
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchProjectTasks();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Project Tasks</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/project_tasks/new')}
            >
              New Project Task
            </Button>
          </div>
          <ToolkitProvider
            keyField="projtask_id"
            data={this.state.project_tasks}
            columns={columns}
            search
            noDataIndication={<NoDataToShow />}
            bootstrap4
            condensed
            defaultSorted={defaultSorted}
            exportCSV
          >
            {(props) => (
              <div>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory(paginationOptions)}
                  hover
                  bordered={false}
                  striped
                  filter={filterFactory()}
                  loading={!this.state.is_loaded}
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
        <Footer />
      </>
    );
  }
}

export default ProjectTasks;
