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
import AddBankProjectAccountModal from "../../modals/create/add_bank_project_account";
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
const ALL_BANK_PROJECT_ACCOUNTS = "http://localhost:8000/api/data_management/bank_project_accounts/";

const columns = [
  {
    dataField: "bankprojacco_id",
    text: "Bank Project Account ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/bank_project_account/" + row.bankprojacco_id} basic id="cell_link">
          {row.bankprojacco_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.project?.title || "",
  },
  {
    dataField: "client.name",
    text: "Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.client?.name || "",
  },
  {
    dataField: "bankclientacco.accountnumber",
    text: "Account Number",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.bankclientacco?.accountnumber || "",
  },
  {
    dataField: "notes",
    text: "Notes",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.notes || "",
  },
];

const defaultSorted = [
  {
    dataField: "bankprojacco_id",
    order: "asc",
  },
];

class AllBankProjectAccounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_bank_project_accounts: [],
      is_loaded: false,
    };
  }

  fetchBankProjectAccounts = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_BANK_PROJECT_ACCOUNTS, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allBankProjectAccounts = [];

        if (Array.isArray(res.data)) {
          allBankProjectAccounts = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allBankProjectAccounts = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allBankProjectAccounts = res.data.data;
        } else if (res.data && res.data.all_bank_project_accounts) {
          allBankProjectAccounts = res.data.all_bank_project_accounts;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allBankProjectAccounts = [];
        }
        
        this.setState({
          all_bank_project_accounts: allBankProjectAccounts,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching bank project accounts:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load bank project accounts. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_bank_project_accounts: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchBankProjectAccounts();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_bank_project_accounts) ? this.state.all_bank_project_accounts : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_bank_project_accounts")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="bankprojacco_id"
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
                    <AddBankProjectAccountModal onBankProjectAccountCreated={this.fetchBankProjectAccounts} />
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

export default AllBankProjectAccounts;
