// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import axios from "axios";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button, Badge } from "react-bootstrap";

// CSS
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Global Variables
import {
  paginationOptions,
  headers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_BANK_CLIENT_ACCOUNTS = "http://localhost:8000/api/bank_client_accounts/";

const columns = [
  {
    dataField: "bankclientacco_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/bank_client_accounts/" + row.bankclientacco_id} className="text-decoration-none">
          {row.bankclientacco_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "client.surname",
    text: "Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const client = row.client;
      if (!client) return '';
      return `${client.surname} ${client.name}`;
    },
  },
  {
    dataField: "bank.bankname",
    text: "Bank",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.bank?.bankname || '',
  },
  {
    dataField: "accountnumber",
    text: "Account Number",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "iban",
    text: "IBAN",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const iban = row.iban || '';
      // Format IBAN with spaces for better readability
      return iban.replace(/(.{4})/g, '$1 ').trim();
    },
  },
  {
    dataField: "transitnumber",
    text: "Transit Number",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "active",
    text: "Active",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.active ? 'success' : 'secondary'}>
        {row.active ? 'Yes' : 'No'}
      </Badge>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "client.surname",
    order: "asc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class BankClientAccounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bank_client_accounts: [],
      is_loaded: false,
      currentPage: 1,
      accountsPerPage: 10,
    };
  }

  fetchBankClientAccounts() {
    this.setState({ is_loaded: false });
    axios
      .get(GET_BANK_CLIENT_ACCOUNTS, {
        headers: headers,
      })
      .then((res) => {
        const accounts = res.data;
        this.setState({
          bank_client_accounts: accounts,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.log(e);
        if (e.response?.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load bank client accounts.",
          });
        }
        this.setState({ is_loaded: true });
      });
  }

  handlePageChange = (selectedPage) => {
    this.setState({
      currentPage: selectedPage.selected + 1,
    });
  };

  componentDidMount() {
    this.fetchBankClientAccounts();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Bank Client Accounts</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/bank_client_accounts/new')}
            >
              New Bank Client Account
            </Button>
          </div>
          <ToolkitProvider
            keyField="bankclientacco_id"
            data={this.state.bank_client_accounts}
            columns={columns}
            search
            noDataIndication={<NoDataToShow />}
            bootstrap4
            condensed
            defaultSorted={defaultSorted}
            exportCSV
          >
            {(props) => (
              <div>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory(paginationOptions)}
                  hover
                  bordered={false}
                  striped
                  filter={filterFactory()}
                  loading={!this.state.is_loaded}
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
        <Footer />
      </>
    );
  }
}

export default BankClientAccounts;
