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
import AddCashModal from "../../modals/create/add_cash";
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
const ALL_CASH = "http://localhost:8000/api/data_management/cash/";

const columns = [
  {
    dataField: "cash_id",
    text: "Cash ID",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <Button>
        <a href={"/data_management/cash/" + row.cash_id} basic id="cell_link">
          {row.cash_id}
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
    dataField: "country.title",
    text: "Country",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.country?.title || "",
  },
  {
    dataField: "trandate",
    text: "Transaction date",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => {
      if (row.trandate) {
        return new Date(row.trandate).toLocaleDateString();
      }
      return "";
    },
  },
  {
    dataField: "consultant.fullname",
    text: "Consultant",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.consultant?.fullname || "",
  },
  {
    dataField: "kind",
    text: "Kind",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (row.kind === 'E' ? 'Expense' : 'Payment'),
  },
  {
    dataField: "amountexp",
    text: "Amount expense",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.amountexp || "",
  },
  {
    dataField: "amountpay",
    text: "Amount payment",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.amountpay || "",
  },
  {
    dataField: "reason",
    text: "Reason",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => row.reason || "",
  },
];

const defaultSorted = [
  {
    dataField: "trandate",
    order: "desc",
  },
];

class AllCash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_cash: [],
      is_loaded: false,
    };
  }

  fetchCash = () => {
    // Update headers with current token
    const currentHeaders = {
      ...headers,
      "Authorization": "Token " + localStorage.getItem("userToken")
    };

    axios
      .get(ALL_CASH, {
        headers: currentHeaders,
      })
      .then((res) => {
        // Handle different response structures
        let allCash = [];

        if (Array.isArray(res.data)) {
          allCash = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          allCash = res.data.results;
        } else if (res.data && Array.isArray(res.data.data)) {
          allCash = res.data.data;
        } else if (res.data && res.data.all_cash) {
          allCash = res.data.all_cash;
        } else {
          console.warn('Unexpected API response structure:', res.data);
          allCash = [];
        }
        
        this.setState({
          all_cash: allCash,
          is_loaded: true,
        });
      })
      .catch((e) => {
        console.error('Error fetching cash entries:', e);
        if (e?.response?.status === 401) {
          this.setState({ forbidden: true });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load cash entries. Please try again.",
          });
        }
        // Set empty array on error to prevent filter issues
        this.setState({
          all_cash: [],
          is_loaded: true,
        });
      });
  };

  componentDidMount() {
    this.fetchCash();
  }

  render() {
    // Ensure we always have an array for the table
    const tableData = Array.isArray(this.state.all_cash) ? this.state.all_cash : [];
    
    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader("all_cash")}
          <div className="contentContainer">
            <div className="contentBody">
              {this.state.is_loaded ? (
                <>
                  <ToolkitProvider
                    bootstrap4
                    keyField="cash_id"
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
                    <AddCashModal onCashCreated={this.fetchCash} />
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

export default AllCash;
