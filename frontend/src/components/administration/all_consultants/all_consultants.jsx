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
import AddConsultantModal from "../../modals/create/add_consultant";
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

// API endpoint for consultants
const GET_CONSULTANTS = "http://localhost:8000/api/administration/all_consultants/";

const columns = [
  {
    dataField: "consultant_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/administration/consultant/" + row.consultant_id} basic id="cell_link">
          {row.consultant_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "fullname",
    text: "Full Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "username",
    text: "Username",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "email",
    text: "Email",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "role",
    text: "Role",
    sort: true,
    filter: textFilter(),
    formatter: (cell) => {
      const roleMap = {
        'A': 'Admin',
        'S': 'Supervisor',
        'U': 'Superuser',
        'C': 'User'
      };
      return roleMap[cell] || cell;
    }
  },
  {
    dataField: "orderindex",
    text: "Order Index",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell) => cell ? "Yes" : "No"
  },
];

const defaultSorted = [
  {
    dataField: "orderindex",
    order: "asc",
  },
];


class AllConsultants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_consultants: [],
      is_loaded: true,
      currentPage: 1,
      consultantsPerPage: 10,
    };
  }

  fetchConsultants() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(GET_CONSULTANTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allConsultants = [];

        if (Array.isArray(res.data)) {
          allConsultants = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allConsultants = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allConsultants = res.data.data;
        } else if (res.data && res.data.all_consultants) {
          allConsultants = res.data.all_consultants;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allConsultants = [];
        }
        
        this.setState({
          all_consultants: allConsultants,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching consultants:', e);
        if (e.response?.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occurred.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_consultants: [],
          is_loaded: true,
        });
      });
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchConsultants();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_consultants) ? this.state.all_consultants : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_consultants", "All Consultants")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="consultant_id"
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
                    <AddConsultantModal />
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

export default AllConsultants;
