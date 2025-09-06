// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import axios from "axios";

// Modules / Functions
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import CreateProjectModal from "../../modals/create/add_project";
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

// Variables
window.Swal = Swal;

// API endpoint
const ALL_PROJECTS = "http://localhost:8000/api/data_management/projects/";

const columns = [
  {
    dataField: "project_id",
    text: "Project ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/project/" + row.project_id} basic id="cell_link">
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
  },
  {
    dataField: "filecode",
    text: "File code",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "registrationdate",
    text: "Entered",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.registrationdate) {
        return new Date(row.registrationdate).toLocaleDateString();
      }
      return "";
    },
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "consultant",
    text: "Consultant",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const c = row.consultant;
      if (!c) return "N/A";
      if (c.fullname) return c.fullname;
      const surname = c.surname || "";
      const name = c.name || "";
      const combined = `${surname} ${name}`.trim();
      return combined || "N/A";
    },
    filterValue: (cell, row) => {
      const c = row.consultant;
      if (!c) return "";
      if (c.fullname) return c.fullname;
      const surname = c.surname || "";
      const name = c.name || "";
      return `${surname} ${name}`.trim();
    },
  },
  {
    dataField: "categories",
    text: "Categories",
    sort: false,
    filter: textFilter(),
    formatter: (cell, row) => {
      const cats = Array.isArray(row.categories) ? row.categories : [];
      return cats.map((c) => c?.title).filter(Boolean).join(", ");
    },
    filterValue: (cell, row) => {
      const cats = Array.isArray(row.categories) ? row.categories : [];
      return cats.map((c) => c?.title).filter(Boolean).join(" ");
    },
  },
  {
    dataField: "taxation",
    text: "Taxation",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <span className={row.taxation ? "text-success" : "text-danger"}>
        {row.taxation ? "Yes" : "No"}
      </span>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "registrationdate",
    order: "desc",
  },
];

class AllProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_projects: [],
      is_loaded: false,
    };
  }

  fetchProjects = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_PROJECTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allProjects = [];

        if (Array.isArray(res.data)) {
          allProjects = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allProjects = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allProjects = res.data.data;
        } else if (res.data && res.data.all_projects) {
          allProjects = res.data.all_projects;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allProjects = [];
        }
        
        this.setState({
          all_projects: allProjects,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching projects:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load projects. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_projects: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchProjects();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_projects) ? this.state.all_projects : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_projects")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="project_id"
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
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                  <div className="contentHeader">
                    <CreateProjectModal onProjectCreated={this.fetchProjects} />
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

export default AllProjects;
