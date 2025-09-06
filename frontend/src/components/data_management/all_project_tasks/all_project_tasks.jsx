// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import filterFactory, { textFilter, dateFilter, Comparator } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
  loader,
} from "../../global_vars";
import AddProjectTaskModal from "../../modals/create/add_project_task";

// Variables
window.Swal = Swal;

// API endpoint
const ALL_PROJECT_TASKS = "http://localhost:8000/api/data_management/project_tasks/";

const columns = [
  {
    dataField: "projtask_id",
    text: "Project task ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/project_task/" + row.projtask_id} basic id="cell_link">
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
  },
  {
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.project?.title || "",
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "priority",
    text: "Priority",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "deadline",
    text: "Deadline",
    sort: true,
    filter: dateFilter({
      comparator: Comparator.LE,
      withoutEmptyComparatorOption: true,
      comparatorStyle: { display: 'none' },
      delay: 0,
    }),
    formatter: (cell, row) => (row.deadline ? new Date(row.deadline).toLocaleDateString() : ""),
  },
  {
    dataField: "assigner.fullname",
    text: "Assigner",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.assigner?.fullname || ((row.assigner && `${row.assigner.surname || ''} ${row.assigner.name || ''}`.trim()) || ''),
  },
  {
    dataField: "assignee.fullname",
    text: "Assignee",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.assignee?.fullname || "",
  },
  {
    dataField: "taskcate.title",
    text: "Category",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.taskcate?.title || "",
  },
];

const defaultSorted = [
  {
    dataField: "assigndate",
    order: "desc",
  },
];

class AllProjectTasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_project_tasks: [],
      is_loaded: false,
    };
  }

  fetchProjectTasks = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_PROJECT_TASKS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allTasks = [];

        if (Array.isArray(res.data)) {
          allTasks = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allTasks = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allTasks = res.data.data;
        } else if (res.data && res.data.all_project_tasks) {
          allTasks = res.data.all_project_tasks;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allTasks = [];
        }
        
        // Normalize deadline to Date objects for correct dateFilter comparison
        const normalized = (allTasks || []).map((t) => ({
          ...t,
          deadline: t && t.deadline ? new Date(t.deadline) : null,
        }));

        this.setState({
          all_project_tasks: normalized,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching project tasks:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load project tasks. Please try again.",
          });
        }
        this.setState({
          all_project_tasks: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchProjectTasks();
  }

  render() {
    const tableData = Array.isArray(this.state.all_project_tasks) ? this.state.all_project_tasks : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_project_tasks")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="projtask_id"
                    data={tableData}
                    columns={columns}
                    search
                    condensed
                  >
                    {(props) => (
                      <div>
                        <BootstrapTable
                          {...props.baseProps}
                          pagination={paginationFactory(paginationOptions)}
                          filter={filterFactory()}
                          defaultSorted={defaultSorted}
                          hover
                          bordered={false}
                          striped
                          id="all_project_tasks_table"
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                  <div className="contentHeader">
                    <AddProjectTaskModal onCreated={this.fetchProjectTasks} />
                  </div>
                </>
              ) : (
                <div>{loader()}</div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default AllProjectTasks;


