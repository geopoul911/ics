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

const GET_CASH = "http://localhost:8000/api/cash/";

// Helper function to get transaction type color
const getTransactionTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'income': return 'success';
    case 'expense': return 'danger';
    case 'transfer': return 'info';
    case 'payment': return 'primary';
    default: return 'secondary';
  }
};

// Helper function to format currency
const formatCurrency = (amount, currency = 'CAD') => {
  if (!amount) return '';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const columns = [
  {
    dataField: "cash_id",
    text: "ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button variant="link" className="p-0">
        <a href={"/data_management/cash/" + row.cash_id} className="text-decoration-none">
          {row.cash_id}
        </a>
      </Button>
    ),
  },
  {
    dataField: "transactiondate",
    text: "Transaction Date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      return row.transactiondate ? new Date(row.transactiondate).toLocaleDateString() : '';
    },
  },
  {
    dataField: "transactiontype",
    text: "Transaction Type",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const type = row.transactiontype || 'Unknown';
      const color = getTransactionTypeColor(type);
      return (
        <Badge bg={color}>
          {type}
        </Badge>
      );
    },
  },
  {
    dataField: "amount",
    text: "Amount",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const amount = row.amount || 0;
      const isExpense = row.transactiontype?.toLowerCase() === 'expense';
      return (
        <span className={isExpense ? 'text-danger' : 'text-success'}>
          {formatCurrency(amount)}
        </span>
      );
    },
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
    dataField: "project.title",
    text: "Project",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const projectTitle = row.project?.title || '';
      return projectTitle.length > 40 ? projectTitle.substring(0, 40) + '...' : projectTitle;
    },
  },
  {
    dataField: "description",
    text: "Description",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const description = row.description || '';
      return description.length > 50 ? description.substring(0, 50) + '...' : description;
    },
  },
  {
    dataField: "paymentmethod",
    text: "Payment Method",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      const method = row.paymentmethod || '';
      return method.charAt(0).toUpperCase() + method.slice(1);
    },
  },
  {
    dataField: "reference",
    text: "Reference",
    sort: true,
    filter: textFilter(),
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
    text: "Account",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (!row.accountnumber) return '';
      // Mask account number for security
      const account = row.accountnumber.toString();
      return account.length > 4 ? '****' + account.slice(-4) : account;
    },
  },
  {
    dataField: "reconciled",
    text: "Reconciled",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Badge bg={row.reconciled ? 'success' : 'warning'}>
        {row.reconciled ? 'Yes' : 'No'}
      </Badge>
    ),
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
    dataField: "transactiondate",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

class Cash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash_transactions: [],
      is_loaded: false,
      currentPage: 1,
      transactionsPerPage: 10,
    };
  }

  fetchCashTransactions() {
    this.setState({ is_loaded: false });
    axios
      .get(GET_CASH, {
        headers: headers,
      })
      .then((res) => {
        const transactions = res.data;
        this.setState({
          cash_transactions: transactions,
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
            text: "Failed to load cash transactions.",
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
    this.fetchCashTransactions();
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Cash Transactions</h2>
            <Button
              variant="primary"
              onClick={() => this.props.history.push('/data_management/cash/new')}
            >
              New Cash Transaction
            </Button>
          </div>
          <ToolkitProvider
            keyField="cash_id"
            data={this.state.cash_transactions}
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

export default Cash;
