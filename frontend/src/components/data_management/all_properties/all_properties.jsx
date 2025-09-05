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
import CreatePropertyModal from "../../modals/create/add_property";
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
const ALL_PROPERTIES = "http://localhost:8000/api/data_management/all_properties/";

const columns = [
  {
    dataField: "property_id",
    text: "Property ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/property/" + row.property_id} basic id="cell_link">
          {row.property_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "description",
    text: "Description",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.description || "",
  },
  {
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.project?.title || "",
  },
  {
    dataField: "type",
    text: "Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.type || "",
  },
  {
    dataField: "location",
    text: "Location",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.location || "",
  },
  {
    dataField: "country.name",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.country?.name || "",
  },
  {
    dataField: "province.name",
    text: "Province",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.province?.name || "",
  },
  {
    dataField: "city.name",
    text: "City",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.city?.name || "",
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.status || "",
  },
  {
    dataField: "market",
    text: "Market",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.market || "",
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.active ? "Yes" : "No",
  },
];

const defaultSorted = [
  {
    dataField: "property_id",
    order: "asc",
  },
];

class AllProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_properties: [],
      is_loaded: false,
    };
  }

  fetchProperties = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_PROPERTIES, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allProperties = [];

        if (Array.isArray(res.data)) {
          allProperties = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allProperties = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allProperties = res.data.data;
        } else if (res.data && res.data.all_properties) {
          allProperties = res.data.all_properties;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allProperties = [];
        }
        
        this.setState({
          all_properties: allProperties,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching properties:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load properties. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_properties: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchProperties();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_properties) ? this.state.all_properties : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_properties")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="property_id"
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
                    <CreatePropertyModal onClientCreated={this.fetchProperties} />
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

export default AllProperties;
