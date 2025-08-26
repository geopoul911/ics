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
import AddCityModal from "../../modals/create/add_city";
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

// Using regions API
const GET_CITIES = "http://localhost:8000/api/regions/all_cities/";

const columns = [
  {
    dataField: "city_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/regions/city/" + row.city_id} basic id="cell_link">
          {row.city_id}
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
  },
  {
    dataField: "province",
    text: "Province",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const provinceData = row.province;
      
      // Handle null/undefined province data
      if (!provinceData) {
        return (
          <span style={{ color: '#999', fontStyle: 'italic' }}>
            No Province
          </span>
        );
      }
      
      const provinceId = typeof provinceData === 'object' ? provinceData.province_id : provinceData;
      const provinceTitle = typeof provinceData === 'object' ? provinceData.title : provinceId;
      
      return (
        <Button>
          <a href={"/regions/province/" + provinceId} basic id="cell_link">
            {provinceTitle}
          </a>
        </Button>
      );
    },
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

class AllCities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_cities: [],
      is_loaded: true,
      currentPage: 1,
      citiesPerPage: 10,
    };
  }

  fetchCities() {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(GET_CITIES, {
        headers: currentHeaders,
      })
      .then((res) => {
        console.log('API Response:', res.data); // Debug log
        
        // Handle different response structures
        let allCities = [];
        if (Array.isArray(res.data)) {
          allCities = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allCities = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allCities = res.data.data;
        } else if (res.data && res.data.all_cities) {
          allCities = res.data.all_cities;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allCities = [];
        }
        
        console.log('Processed cities:', allCities); // Debug log
        
        this.setState({
          all_cities: allCities,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching cities:', e);
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
          all_cities: [],
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
    this.fetchCities();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_cities) ? this.state.all_cities : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_cities", "All Cities")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="city_id"
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
                    <AddCityModal />
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

export default AllCities;
