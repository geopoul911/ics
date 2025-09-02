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
import AddTaxationProjectModal from "../../modals/create/add_taxation_project";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint
const ALL_TAXATION_PROJECTS = "http://localhost:8000/api/data_management/taxation_projects/";

const columns = [
  {
    dataField: "taxproj_id",
    text: "Taxation ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/taxation_project/" + row.taxproj_id} basic id="cell_link">
          {row.taxproj_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "client.fullname",
    text: "Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client ? `${row.client.surname ? row.client.surname + ' ' : ''}${row.client.name || row.client.fullname || ''}` : "",
  },
  {
    dataField: "consultant.fullname",
    text: "Consultant",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.consultant?.fullname || "",
  },
  {
    dataField: "taxuse",
    text: "Tax Use",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "deadline",
    text: "Deadline",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "declaredone",
    text: "Declared",
    sort: true,
    formatter: (cell) => (cell ? "Yes" : "No"),
  },
  {
    dataField: "declarationdate",
    text: "Declaration Date",
    sort: true,
    filter: textFilter(),
  },
];

const defaultSorted = [
  {
    dataField: "deadline",
    order: "desc",
  },
];

class AllTaxationProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_taxation_projects: [],
      is_loaded: false,
    };
  }

  fetchTaxationProjects = () => {
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_TAXATION_PROJECTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        let allItems = [];
        if (Array.isArray(res.data)) {
          allItems = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allItems = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allItems = res.data.data;
        } else if (res.data && res.data.all_taxation_projects) {
          allItems = res.data.all_taxation_projects;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allItems = [];
        }
        this.setState({
          all_taxation_projects: allItems,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching taxation projects:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load taxation projects. Please try again.",
          });
        }
        this.setState({ all_taxation_projects: [], is_loaded: true });
      });
  };

  componentDidMount() {
    this.fetchTaxationProjects();
  }

  render() {
    const tableData = Array.isArray(this.state.all_taxation_projects) ? this.state.all_taxation_projects : [];

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_taxation_projects")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="taxproj_id"
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
                    <AddTaxationProjectModal onTaxationProjectCreated={this.fetchTaxationProjects} />
                  </div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default AllTaxationProjects;
