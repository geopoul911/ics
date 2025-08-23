// Built-ins
import React from "react";

// Functions / Modules
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { Grid } from "semantic-ui-react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-daterange-picker/dist/css/react-calendar.css";
import "react-virtualized-select/styles.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_DEPOSITS = "http://localhost:8000/api/financial/get_all_deposits";

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const Banks = {
  AB: "Alpha bank",
  EB: "Eurobank",
  PIR: "Piraeus",
  NBG: "NBG",
  HSBC: "HSBC",
  MB: "Metro bank",
};

const Currencies = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  CAD: "CA$",
  AUD: "AU$",
  CHF: "₣",
  JPY: "JP¥",
  NZD: "NZ$",
  CNY: "CN¥",
  SGD: "S$",
};

class AllDeposits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false,
      deposits: [],
      forbidden: false,
      show_bank_details: false,
      columns: [
        {
          dataField: "id",
          text: "#",
          sort: true,
          formatter: (cell, row, ind) => <>{ind + 1}</>,
        },
        {
          dataField: "payment",
          text: "Payment",
          sort: true,
          formatter: (cell, row, ind) => <>{row.payment.amount}</>,
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cell, row, ind) => (
            <>
              {Currencies[row.payment.currency]} {row.amount}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Bank",
          sort: true,
          formatter: (cell, row, ind) => <>{Banks[row.bank]}</>,
        },
        {
          dataField: "transaction_date",
          text: "Transaction Date",
          sort: true,
          formatter: (cell, row, ind) => (
            <> {moment(row.transaction_date).format("DD/MM/YYYY - HH:mm:ss")} </>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.setState({
      is_loaded: false,
    });

    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }

    axios
      .get(GET_DEPOSITS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          deposits: res.data.all_deposits,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_deposits")}
          {this.state.forbidden ? 
            <>
              {forbidden("Financial Deposits")}
            </>
            :
              this.state.is_loaded ? (             
                <>
                  <Grid>
                    <Grid.Column>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.deposits}
                        columns={this.state.columns}
                        search
                        bootstrap4
                        condensed
                        defaultSorted={defaultSorted}
                        exportCSV
                      >
                        {(props) => (
                          <div>
                            <BootstrapTable
                              {...props.baseProps}
                              // key={this.state.show_bank_details}
                              pagination={paginationFactory(paginationOptions)}
                              hover
                              bordered={false}
                              id='all_deposits_table'
                              striped
                            />
                          </div>
                        )}
                      </ToolkitProvider>
                    </Grid.Column>
                  </Grid>
                </>
              ) : (
                loader()
              )}
        </div>
        <Footer />
      </>
    );
  }
}

export default AllDeposits;
