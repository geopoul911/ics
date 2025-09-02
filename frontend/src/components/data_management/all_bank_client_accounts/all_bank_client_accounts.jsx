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
import CreateBankClientAccountModal from "../../modals/create/add_bank_client_account";
import { Button } from "react-bootstrap";

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
const ALL_BANK_CLIENT_ACCOUNTS = "http://localhost:8000/api/data_management/bank_client_accounts/";

const columns = [
  {
    dataField: "bankclientacco_id",
    text: "Account ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" href={"/data_management/bank_client_account/" + row.bankclientacco_id} id="cell_link">
        {row.bankclientacco_id}
      </Button>
    ),
  },
  {
    dataField: "client.fullname",
    text: "Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.fullname || "",
  },
  {
    dataField: "bank.bankname",
    text: "Bank",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.bank?.bankname || "",
  },
  {
    dataField: "transitnumber",
    text: "Transit Number",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.transitnumber || "",
  },
  {
    dataField: "accountnumber",
    text: "Account Number",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.accountnumber || "",
  },
  {
    dataField: "iban",
    text: "IBAN",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.iban || "",
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
    dataField: "accountnumber",
    order: "asc",
  },
];

class AllBankClientAccounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_bank_client_accounts: [],
      is_loaded: false,
    };
  }

  fetchBankClientAccounts = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_BANK_CLIENT_ACCOUNTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allBankClientAccounts = [];

        if (Array.isArray(res.data)) {
          allBankClientAccounts = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allBankClientAccounts = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allBankClientAccounts = res.data.data;
        } else if (res.data && res.data.all_bank_client_accounts) {
          allBankClientAccounts = res.data.all_bank_client_accounts;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allBankClientAccounts = [];
        }
        
        this.setState({
          all_bank_client_accounts: allBankClientAccounts,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching bank client accounts:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load bank client accounts. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_bank_client_accounts: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchBankClientAccounts();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_bank_client_accounts) ? this.state.all_bank_client_accounts : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_bank_client_accounts")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="bankclientacco_id"
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
                    <CreateBankClientAccountModal refreshData={this.fetchBankClientAccounts} />
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

export default AllBankClientAccounts;
