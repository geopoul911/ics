// Built-ins
import React from "react";

// Modules - Functions
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import { Grid } from "semantic-ui-react";
import filterFactory from "react-bootstrap-table2-filter";
import moment from "moment";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Custom Made Components
import AddPendingPayment from "./modals/add_pending_payment";
import DeletePayment from "./modals/delete_payment";
import UploadDocument from "./modals/upload_document";

// Icons - Images
import { BsCloudDownload } from "react-icons/bs";
import { BsClockHistory } from "react-icons/bs";
import { FaPiggyBank } from "react-icons/fa";

// Global Variables
import {
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  headers,
  paginationOptions,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const DOWNLOAD_FINANCIAL_DOCUMENT =
  "http://localhost:8000/api/groups/download_financial_document/";
const GET_GROUP_DEPOSITS =
  "http://localhost:8000/api/groups/get_group_deposits/";

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

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

const SUPPLIER_TYPES = {
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
  TL: "Tour Leader",
  TH: "Theater",
  TTA: "Train Ticket Agency",
};

const Banks = {
  AB: "Alpha bank",
  EB: "Eurobank",
  PIR: "Piraeus",
  NBG: "NBG",
  HSBC: "HSBC",
  MB: "Metro bank",
};

const iconStyle = {
  color: "#F3702D",
  fontSize: "1.2em",
  margin: 10,
};

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

class GroupPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forbidden: false,
      show_bank_details: false,
      deposits: [],
      columns: [
        {
          dataField: "supplier_type",
          text: "Type",
          sort: true,
          formatter: (cell, row) => <>{SUPPLIER_TYPES[row.supplier_type]}</>,
        },
        {
          dataField: "supplier",
          text: "Supplier",
          sort: true,
        },
        {
          dataField: "date_of_service",
          text: "Service Date",
          sort: true,
        },
        {
          dataField: "document",
          text: "Document",
          sort: true,
          formatter: (cell, row) => (
            <>
              {row.proforma || row.invoice ? (
                <>
                  {row.proforma ? (
                    <>
                      Proforma: {row.proforma.name}
                      <BsCloudDownload
                        className="download_driver_doc_icon payment_doc_icon"
                        onClick={() => {
                          this.downloadDocument(
                            row.proforma.name,
                            row.id,
                            "proforma"
                          );
                        }}
                        style={{ color: "#F3702D", fontSize: "1.5em" }}
                      />
                    </>
                  ) : (
                    <>
                      Invoice: {row.invoice.name}
                      <BsCloudDownload
                        className="download_driver_doc_icon payment_doc_icon"
                        onClick={() => {
                          this.downloadDocument(
                            row.invoice.name,
                            row.id,
                            "invoice"
                          );
                        }}
                        style={{ color: "#F3702D", fontSize: "1.5em" }}
                      />
                    </>
                  )}
                </>
              ) : (
                "N/A"
              )}
              <UploadDocument
                payment_id={row.id}
                update_state={this.props.update_state}
                refcode={this.props.group.refcode}
              />
            </>
          ),
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cell, row) => {
            const depositsForPayment = this.state.deposits.filter(
              (deposit) => deposit.payment.id === row.id
            );
            const totalAmount = depositsForPayment.reduce(
              (acc, deposit) => acc + deposit.amount,
              0
            );
            return (
              <>
                {Currencies[row.currency]} {totalAmount} /
                {Currencies[row.currency]} {row.amount}
              </>
            );
          },
        },
        {
          dataField: "pay_until",
          text: "Pay Until",
          sort: true,
        },
        {
          dataField: "delete",
          text: "Delete",
          sort: true,
          formatter: (cell, row) => (
            <>
              <DeletePayment
                update_state={this.props.update_state}
                payment_id={row.id}
              />
            </>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }

    axios
      .get(GET_GROUP_DEPOSITS + getRefcode(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          deposits: res.data.deposits,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  handleToggleBankDetails = () => {
    this.setState((prevState) => ({
      show_bank_details: !prevState.show_bank_details,
    }));
  };

  downloadDocument = (fileName, financial_document_id, doc_type) => {
    axios
      .get(
        DOWNLOAD_FINANCIAL_DOCUMENT +
          financial_document_id +
          "?file=" +
          fileName +
          "&doc_type=" +
          doc_type +
          "&refcode=" +
          this.props.group.refcode,
        {
          headers: headers,
          params: {
            file: fileName,
          },
        }
      )
      .then(() => {
        window.open(
          DOWNLOAD_FINANCIAL_DOCUMENT +
            financial_document_id +
            "?file=" +
            fileName +
            "&doc_type=" +
            doc_type +
            "&refcode=" +
            this.props.group.refcode
        );
      });
  };

  render() {
    return (
      <>
        <div className="rootContainer">
          {pageHeader("group_payments", this.props.group.refcode)}
          {this.state.forbidden ? (
            <>{forbidden("Group Payments")}</>
          ) : this.props.isLoaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Row style={{ marginLeft: 10 }}>
                  <Grid.Column width={9}>
                    <h3 className="dox_h3" style={{ marginLeft: 30 }}>
                      <BsClockHistory style={iconStyle} /> Pending Payments
                    </h3>
                    <ToolkitProvider
                      keyField="id"
                      data={this.props.group.group_payment}
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
                            pagination={paginationFactory(paginationOptions)}
                            hover
                            key={this.state.deposits}
                            bordered={false}
                            striped
                            id="group_pending_payments_table"
                            filter={filterFactory()}
                            rowClasses={(row) => {
                              const depositsForPayment =
                                this.state.deposits.filter(
                                  (deposit) => deposit.payment.id === row.id
                                );
                              const totalAmount = depositsForPayment.reduce(
                                (acc, deposit) => acc + deposit.amount,
                                0
                              );
                              return totalAmount === row.amount
                                ? "equal-amount"
                                : "";
                            }}
                          />
                        </div>
                      )}
                    </ToolkitProvider>
                    <AddPendingPayment update_state={this.props.update_state} />
                  </Grid.Column>
                  <Grid.Column width={7}>
                    <h3 className="dox_h3">
                      <FaPiggyBank style={iconStyle} /> Deposits
                    </h3>
                    <table style={{ width: "95%" }}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Supplier</th>
                          <th>Amount</th>
                          <th>Transaction Datetime</th>
                          <th>Bank</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.deposits.map((deposit, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{deposit.payment.supplier}</td>
                              <td>
                                {Currencies[deposit.payment.currency]}
                                {deposit.amount}
                              </td>
                              <td>
                                {moment(deposit.transaction_date).format(
                                  "MM/DD/YYYY [at] hh:mm"
                                )}
                              </td>
                              <td>{Banks[deposit.bank]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default GroupPayments;
