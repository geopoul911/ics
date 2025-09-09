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
import AddProvinceModal from "../../modals/create/add_province";
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

// Updated to use new data_management API
const GET_PROVINCES = "http://localhost:8000/api/regions/all_provinces/";

const columns = [
  {
    dataField: "province_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/regions/province/" + row.province_id} basic id="cell_link">
          {row.province_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "title",
    text: "Province",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "country",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const countryData = row.country;
      const countryId = typeof countryData === 'object' ? countryData.country_id : countryData;
      const countryTitle = typeof countryData === 'object' ? countryData.title : countryId;
      return (
        <Button>
          <a href={"/regions/country/" + countryId} basic id="cell_link">
            {countryTitle}
          </a>
        </Button>
      );
    },
    filterValue: (cell, row) => {
      const countryData = row.country;
      if (!countryData) return "";
      return typeof countryData === 'object' ? (countryData.title || "") : String(countryData || "");
    },
  },
  {
    dataField: "orderindex",
    text: "Order by",
    sort: true,
    filter: textFilter(),
  },
];

const defaultSorted = [
  {
    dataField: "orderindex",
    order: "asc",
  },
];

class AllProvinces extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_provinces: [],
      is_loaded: true,
      currentPage: 1,
      provincesPerPage: 10,
    };
  }

  fetchProvinces() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(GET_PROVINCES, {
        headers: currentHeaders,
      })
      .then((res) => {
        console.log('API Response:', res.data); // Debug log
        
        // Handle different response structures
        let allProvinces = [];
        if (Array.isArray(res.data)) {
          allProvinces = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allProvinces = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allProvinces = res.data.data;
        } else if (res.data && res.data.all_provinces) {
          allProvinces = res.data.all_provinces;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allProvinces = [];
        }
        
        console.log('Processed provinces:', allProvinces); // Debug log
        
        this.setState({
          all_provinces: allProvinces,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching provinces:', e);
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
          all_provinces: [],
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
    this.fetchProvinces();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_provinces) ? this.state.all_provinces : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_provinces", "All Provinces")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="province_id"
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
                    <AddProvinceModal />
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

export default AllProvinces;
