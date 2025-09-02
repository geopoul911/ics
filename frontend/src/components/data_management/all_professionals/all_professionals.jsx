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
import AddProfessionalModal from "../../modals/create/add_professional";
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
const ALL_PROFESSIONALS = "http://localhost:8000/api/data_management/all_professionals/";

const columns = [
  {
    dataField: "professional_id",
    text: "Professional ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/professional/" + row.professional_id} basic id="cell_link">
          {row.professional_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "fullname",
    text: "Fullname",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "profession.title",
    text: "Profession",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.profession?.title || "",
  },
  {
    dataField: "city.title",
    text: "City",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.city?.title || "",
  },
  {
    dataField: "reliability",
    text: "Reliability",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    formatter: (cell) => (cell ? "Yes" : "No"),
  },
];

const defaultSorted = [
  {
    dataField: "fullname",
    order: "asc",
  },
];

class AllProfessionals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_professionals: [],
      is_loaded: false,
    };
  }

  fetchProfessionals = () => {
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_PROFESSIONALS, {
        headers: currentHeaders,
      })
      .then((res) => {
        let allProfessionals = [];

        if (Array.isArray(res.data)) {
          allProfessionals = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allProfessionals = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allProfessionals = res.data.data;
        } else if (res.data && res.data.all_professionals) {
          allProfessionals = res.data.all_professionals;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allProfessionals = [];
        }

        this.setState({
          all_professionals: allProfessionals,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching professionals:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load professionals. Please try again.",
          });
        }
        this.setState({
          all_professionals: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchProfessionals();
  }

  render() {
    const tableData = Array.isArray(this.state.all_professionals) ? this.state.all_professionals : [];

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_professionals")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="professional_id"
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
                    <AddProfessionalModal onProfessionalCreated={this.fetchProfessionals} />
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

export default AllProfessionals;
