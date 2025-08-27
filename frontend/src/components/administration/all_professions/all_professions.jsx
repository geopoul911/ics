// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddProfessionModal from "../../modals/create/add_profession";

// Modules / Functions
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Headers
import { headers } from "../../global_vars";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Global Variables
import {
  paginationOptions,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for professions
const ALL_PROFESSIONS = "http://localhost:8000/api/administration/all_professions/";

const columns = [
  {
    dataField: "profession_id",
    text: "Profession ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/administration/profession/" + row.profession_id} basic id="cell_link">
          {row.profession_id}
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
];

const defaultSorted = [
  {
    dataField: "title",
    order: "asc",
  },
];

class AllProfessionsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_professions: [],
      is_loaded: false,
    };
  }

  fetchProfessions = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_PROFESSIONS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allProfessions = [];

        if (Array.isArray(res.data)) {
          allProfessions = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allProfessions = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allProfessions = res.data.data;
        } else if (res.data && res.data.all_professions) {
          allProfessions = res.data.all_professions;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allProfessions = [];
        }
        
        this.setState({
          all_professions: allProfessions,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching professions:', e);
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
          all_professions: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchProfessions();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_professions) ? this.state.all_professions : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_professions", "All Professions")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="profession_id"
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
                    <AddProfessionModal onProfessionCreated={this.fetchProfessions} />
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

export default AllProfessionsComponent;
