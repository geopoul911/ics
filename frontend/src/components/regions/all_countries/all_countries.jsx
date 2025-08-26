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
import AddCountryModal from "../../modals/create/add_country";
import { Button } from "semantic-ui-react";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  headers,
  pageHeader,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// Updated to use new data_management API
const GET_COUNTRIES = "http://localhost:8000/api/data_management/countries/";

const columns = [
  {
    dataField: "country_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/regions/country/" + row.country_id} basic id="cell_link">
          {row.country_id}
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
    dataField: "currency",
    text: "Currency",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "orderindex",
    text: "Order Index",
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

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class AllCountries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_countries: [],
      is_loaded: true,
      currentPage: 1,
      countriesPerPage: 10,
    };
  }

  fetchCountries() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(GET_COUNTRIES, {
        headers: currentHeaders,
      })
      .then((res) => {
        console.log('API Response:', res.data); // Debug log
        
        // Handle different response structures
        let allCountries = [];
        if (Array.isArray(res.data)) {
          allCountries = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allCountries = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allCountries = res.data.data;
        } else if (res.data && res.data.all_countries) {
          allCountries = res.data.all_countries;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allCountries = [];
        }
        
        console.log('Processed countries:', allCountries); // Debug log
        
        this.setState({
          all_countries: allCountries,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching countries:', e);
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
          all_countries: [],
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
    this.fetchCountries();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_countries) ? this.state.all_countries : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_countries", "All Countries")}
          <div className="contentContainer">
            <div className="contentHeader">
              <AddCountryModal />
            </div>
            <div className="contentBody">
              {this.state.is_loaded ? (
                <ToolkitProvider
                  bootstrap4
                  keyField="country_id"
                  data={tableData}
                  columns={columns}
                  search
                >
                  {(props) => (
                    <div>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory(paginationOptions)}
                        filter={filterFactory()}
                        defaultSorted={defaultSorted}
                        noDataIndication={() => <NoDataToShow />}
                      />
                    </div>
                  )}
                </ToolkitProvider>
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

export default AllCountries;
