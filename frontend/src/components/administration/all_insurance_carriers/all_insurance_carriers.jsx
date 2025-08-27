// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddInsuranceCarrierModal from "../../modals/create/add_insurance_carrier";

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

// API endpoint for insurance carriers
const ALL_INSURANCE_CARRIERS = "http://localhost:8000/api/administration/all_insurance_carriers/";

const columns = [
  {
    dataField: "insucarrier_id",
    text: "Insurance Carrier ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/administration/insurance_carrier/" + row.insucarrier_id} basic id="cell_link">
          {row.insucarrier_id}
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
    formatter: (cell, row) => (
      <span className={row.active ? "text-success" : "text-danger"}>
        {row.active ? "Yes" : "No"}
      </span>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "orderindex",
    order: "asc",
  },
];

class AllInsuranceCarriersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_insurance_carriers: [],
      is_loaded: false,
    };
  }

  fetchInsuranceCarriers = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_INSURANCE_CARRIERS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allInsuranceCarriers = [];

        if (Array.isArray(res.data)) {
          allInsuranceCarriers = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allInsuranceCarriers = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allInsuranceCarriers = res.data.data;
        } else if (res.data && res.data.all_insurance_carriers) {
          allInsuranceCarriers = res.data.all_insurance_carriers;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allInsuranceCarriers = [];
        }
        
        this.setState({
          all_insurance_carriers: allInsuranceCarriers,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching insurance carriers:', e);
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
          all_insurance_carriers: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchInsuranceCarriers();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_insurance_carriers) ? this.state.all_insurance_carriers : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_insurance_carriers", "All Insurance Carriers")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="insucarrier_id"
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
                    <AddInsuranceCarrierModal onInsuranceCarrierCreated={this.fetchInsuranceCarriers} />
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

export default AllInsuranceCarriersComponent;
