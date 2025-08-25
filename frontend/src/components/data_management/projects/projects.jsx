// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button, Badge, ProgressBar } from "react-bootstrap";
import { apiGet, API_ENDPOINTS, handlePagination } from "../../../utils/api";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_PROJECTS = API_ENDPOINTS.PROJECTS;

// Helper function to get project status
const getProjectStatus = (project) => {
  if (project.abandoned) return { status: 'Abandoned', color: 'secondary', progress: 0 };
  if (project.settled) return { status: 'Settled', color: 'info', progress: 100 };
  if (project.completed) return { status: 'Completed', color: 'success', progress: 100 };
  if (project.inprogress) return { status: 'In Progress', color: 'warning', progress: 75 };
  if (project.assigned) return { status: 'Assigned', color: 'warning', progress: 25 };
  return { status: 'Created', color: 'danger', progress: 10 };
};

// Helper function to calculate progress percentage
const calculateProgress = (project) => {
  // This would be calculated based on completed tasks vs total tasks
  // For now, using the status-based progress
  const statusInfo = getProjectStatus(project);
  return statusInfo.progress;
};

const columns = [
  {
    dataField: "project_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/projects/" + row.project_id} className="text-decoration-none">
          {row.project_id}
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
      return title.length > 50 ? title.substring(0, 50) + '...' : title;
    },
  },
  {
    dataField: "registrationdate",
    text: "Registration Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.registrationdate ? new Date(row.registrationdate).toLocaleDateString() : '';
    },
  },
  {
    dataField: "consultant.fullname",
    text: "Consultant",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.consultant?.fullname || '',
  },
  {
    dataField: "filecode",
    text: "File Code",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const statusInfo = getProjectStatus(row);
      return (
        <Badge bg={statusInfo.color}>
          {statusInfo.status}
        </Badge>
      );
    },
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
      const isOverdue = deadline < today && !row.completed && !row.settled && !row.abandoned;
      
      return (
        <span className={isOverdue ? 'text-danger' : ''}>
          {deadline.toLocaleDateString()}
          {isOverdue && <Badge bg="danger" className="ms-1">Overdue</Badge>}
        </span>
      );
    },
  },
  {
    dataField: "progress",
    text: "Progress %",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const progress = calculateProgress(row);
      const statusInfo = getProjectStatus(row);
      
      return (
        <div style={{ width: '100px' }}>
          <ProgressBar 
            now={progress} 
            variant={statusInfo.color}
            label={`${progress}%`}
          />
        </div>
      );
    },
  },
  {
    dataField: "taxation",
    text: "Taxation",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.taxation ? 'primary' : 'light'}>
        {row.taxation ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "registrationdate",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      is_loaded: false,
      currentPage: 1,
      projectsPerPage: 10,
    };
  }

  async fetchProjects() {
    this.setState({ is_loaded: false });
    try {
      const response = await apiGet(GET_PROJECTS);
      const { data: projects } = handlePagination(response);
      this.setState({
        projects: projects,
        is_loaded: true,
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.message === 'Authentication required') {
        this.setState({ forbidden: true });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load projects.",
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
    this.fetchProjects();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("projects")}
          <div className="mb-3">
            <Button
              variant="primary"
              onClick={() => this.props.history.push("/data_management/projects/new")}
            >
              New Project
            </Button>
          </div>
          <ToolkitProvider
            keyField="project_id"
            data={this.state.projects}
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

export default Projects;
