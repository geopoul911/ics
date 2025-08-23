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

// Icons / Images
import { MdOutlineUnfoldMore } from "react-icons/md";

// Variables
window.Swal = Swal;

const GET_PAYMENTS =
  "http://localhost:8000/api/financial/get_all_pending_payments";

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const paymentTypes = {
  CC: "Credit Card",
  DC: "Debit Card",
  CS: "Cash",
  BT: "Bank Transfer",
};

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

const supplierTypes = {
  AG: "Agent",
  AL: "Airline",
  CO: "Coach Operator",
  CC: "Cruising Company",
  DMC: "DMC",
  FTA: "Ferry Ticket Agency",
  GD: "Guide",
  HTL: "Hotel",
  RS: "Repair Shop",
  RST: "Restaurant",
  SES: "Sport Event Supplier",
  TC: "Teleferik Company",
  TH: "Theater",
  TTA: "Train Ticket Agency",
  TL: "Tour Leader",
};

const renderCreditCard = (str) => {
  return str.substring(0, 2) + "** **** **** " + str.substring(15, 19);
};

class AllPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false,
      payments: [],
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
          dataField: "refcode",
          text: "Group Refcode",
          sort: true,
          formatter: (cell, row) => (
            <>
              <a
                href={"/group_management/group/" + row.group_transfer.refcode}
                basic
              >
                {row.group_transfer.refcode}
              </a>
            </>
          ),
        },
        {
          dataField: "recipient",
          text: "Recipient",
          sort: true,
          formatter: (cell, row) => <>{row.supplier}</>,
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cell, row) => (
            <>
              {Currencies[row.currency]} {row.amount.toFixed(2)}
            </>
          ),
        },
        {
          dataField: "supplier_type",
          text: "Supplier Type",
          sort: true,
          formatter: (cell, row) => <>{supplierTypes[row.supplier_type]}</>,
        },
        {
          dataField: "Bank",
          text: "Bank",
          sort: true,
          formatter: (cell, row) => <>{row.bank ? Banks[row.bank] : "N/A"}</>,
        },
        {
          dataField: "transaction_date",
          text: "Transaction Date",
          sort: true,
          formatter: (cell, row) => (
            <>{moment(row.transaction_date).format("DD/MM/YYYY - HH:mm:ss")}</>
          ),
        },
        {
          dataField: "payment_type",
          text: "Payment Type",
          sort: true,
          formatter: (cell, row) => (
            <div>
              {row.payment_type === "CC" ? (
                <>
                  <label>Credit Card</label>
                  <MdOutlineUnfoldMore
                    className="show_more_icon"
                    onClick={this.handleToggleBankDetails}
                  />
                  {this.state.show_bank_details ? (
                    <>
                      <br />
                      {row.card ? (
                        <> {renderCreditCard(row.card.card_number)} </>
                      ) : (
                        "N/A"
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <>
                  <label>{paymentTypes[row.payment_type]}</label>
                  <MdOutlineUnfoldMore
                    className="show_more_icon"
                    onClick={this.handleToggleBankDetails}
                  />
                  {this.state.show_bank_details ? (
                    <>
                      {row.iban && row.currency !== "GBP" ? (
                        <>
                          <br />
                          IBAN: {row.iban}
                        </>
                      ) : (
                        ""
                      )}
                      {row.iban && row.currency === "GBP" ? (
                        <>
                          <br />
                          Account Number: {row.iban}
                        </>
                      ) : (
                        ""
                      )}
                      {row.swift && row.currency !== "GBP" ? (
                        <>
                          <br />
                          Swift: {row.swift}
                        </>
                      ) : (
                        ""
                      )}
                      {row.swift && row.currency === "GBP" ? (
                        <>
                          <br />
                          Sort Code: {row.swift}
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
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
    .get(GET_PAYMENTS, {
      headers: headers,
    })
    .then((res) => {
      this.setState({
        is_loaded: true,
        payments: res.data.all_payments,
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

  handleToggleBankDetails = () => {
    this.setState((prevState) => ({
      show_bank_details: !prevState.show_bank_details,
    }));
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("all_payments")}
          {this.state.forbidden ? 
            <>
              {forbidden("Financial Payments")}
            </>
            :
            this.state.is_loaded ? (             
              <>
                <Grid>
                  <Grid.Column>
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.payments}
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
                            key={this.state.show_bank_details}
                            pagination={paginationFactory(paginationOptions)}
                            hover
                            bordered={false}
                            id='all_payments_table'
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

export default AllPayments;
