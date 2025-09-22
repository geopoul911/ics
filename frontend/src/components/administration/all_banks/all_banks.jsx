// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import AddBankModal from "../../modals/create/add_bank";

// Modules / Functions
import filterFactory, { textFilter, selectFilter } from "react-bootstrap-table2-filter";
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

// API endpoint for banks
const ALL_BANKS = "https://ultima.icsgr.com/api/administration/all_banks/";

const columns = [
  {
    dataField: "bank_id",
    text: "Bank ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/administration/bank/" + row.bank_id} basic id="cell_link">
          {row.bank_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "bankname",
    text: "Bank",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "country.title",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.country?.title || "",
  },
  {
    dataField: "orderindex",
    text: "Order by",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "institutionnumber",
    text: "Bank code",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "swiftcode",
    text: "Swift code",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: selectFilter({
      options: { "": "All", true: "Yes", false: "No" },
      defaultValue: "",
      onFilter: (filterVal, data) => {
        if (filterVal === "" || filterVal === undefined || filterVal === null) return data;
        return data.filter((row) => String(row.active) === String(filterVal));
      },
    }),
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

class AllBanksComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_banks: [],
      is_loaded: false,
    };
  }

  fetchBanks = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_BANKS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allBanks = [];

        if (Array.isArray(res.data)) {
          allBanks = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allBanks = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allBanks = res.data.data;
        } else if (res.data && res.data.all_banks) {
          allBanks = res.data.all_banks;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allBanks = [];
        }
        
        this.setState({
          all_banks: allBanks,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching banks:', e);
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
          all_banks: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchBanks();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_banks) ? this.state.all_banks : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_banks", "All Banks")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="bank_id"
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
                    <AddBankModal />
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

export default AllBanksComponent;
