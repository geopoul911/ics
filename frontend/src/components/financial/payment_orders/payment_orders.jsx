// Built-ins
import React from "react";

// Functions / Modules
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import DatePicker from "react-date-picker";
import { FaEye } from "react-icons/fa";
import { Grid, Button } from "semantic-ui-react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import ReactCountryFlag from "react-country-flag";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import BuildPaymentOrder from "./modals/build_payment_order";
import DeleteDeposit from "./modals/delete_deposit";

import { AiOutlineFilePdf } from "react-icons/ai";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  iconStyle
} from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_PAYMENT_ORDER =
  "http://localhost:8000/api/financial/get_payment_order";
const DOWNLOAD_TRAVELDAY_DOCUMENT =
  "http://localhost:8000/api/groups/download_travelday_document/";
const DOWNLOAD_PAYMENT_ORDER =
  "http://localhost:8000/api/financial/download_payment_order/";

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

let flagStyle = { width: "2.5em", height: "2.5em" }
let btnStyle = {
  paddingTop: 5,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 5,
  margin: 20,
}

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

class PaymentOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false,
      forbidden: false,
      selected_date: new Date(),
      payment_order_uk: [],
      payment_order_gr: [],
      show_bank_details: false,
      payment_id: -1,
      columns: [
        {
          dataField: "id",
          text: "ID",
          sort: true,
        },
        {
          dataField: "refcode",
          text: "Refcode",
          sort: true,
          formatter: (cell, row) => <>
            <a
              href={"/group_management/group/" + row.payment.group_transfer.refcode}
              basic
            >
              {row.payment.group_transfer.refcode}
            </a>
          </>,
        },
        {
          dataField: "date_of_service",
          text: "Service Date",
          sort: true,
          formatter: (cell, row) => <>{row.payment.date_of_service}</>,
        },
        {
          dataField: "supplier",
          text: "Supplier",
          sort: true,
          formatter: (cell, row) => <>{row.payment.supplier}</>,
        },
        {
          dataField: "supplier_type",
          text: "Supplier Type",
          sort: true,
          formatter: (cell, row) => (
            <>
              {SUPPLIER_TYPES[row.payment.supplier_type]}
            </>
          ),
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
          formatter: (cell, row) => (
            <>
              {Currencies[row.payment.currency]} {row.amount}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Bank",
          sort: true,
          formatter: (cell, row) => <> {Banks[row.bank]} </>,
        },
        {
          dataField: "transaction_date",
          text: "Datetime",
          sort: true,
          formatter: (cell, row) => (
            <> {moment(row.transaction_date).format("MM/DD/YYYY [at] hh:mm")}</>
          ),
        },
        {
          dataField: "delete",
          text: "Delete",
          sort: true,
          formatter: (cell, row) => (
            <>
              <DeleteDeposit
                deposit_id={row.id}
                update_state={this.update_state}
              />
            </>
          ),
        },
      ],
    };
    this.ChangeDate = this.ChangeDate.bind(this);
  }

  downloadPaymentOrder = (branch) => {
    const params = `?date=${moment(this.state.selected_date).format(
      "YYYY-MM-DD"
    )}&branch=${branch}`;

    axios
      .get(DOWNLOAD_PAYMENT_ORDER + params, {
        headers: headers,
      })
      .then(() => {
        window.open(DOWNLOAD_PAYMENT_ORDER + params);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }

    axios
      .get(GET_PAYMENT_ORDER, {
        headers: headers,
        params: {
          selected_date: moment(this.state.selected_date).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          payment_order_uk: res.data.payment_order_uk,
          payment_order_gr: res.data.payment_order_gr,
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

  update_state = () => {
    axios
      .get(GET_PAYMENT_ORDER, {
        headers: headers,
        params: {
          selected_date: moment(this.state.selected_date).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          payment_order_uk: res.data.payment_order_uk,
          payment_order_gr: res.data.payment_order_gr,
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
  };

  downloadTraveldayDocument = (fileName, travelday_id, doc_type) => {
    axios
      .get(
        DOWNLOAD_TRAVELDAY_DOCUMENT +
          travelday_id +
          "?file=" +
          fileName +
          "&doc_type=" +
          doc_type,
        {
          headers: headers,
          params: {
            file: fileName,
          },
        }
      )
      .then(() => {
        window.open(
          DOWNLOAD_TRAVELDAY_DOCUMENT +
            travelday_id +
            "?file=" +
            fileName +
            "&doc_type=" +
            doc_type
        );
      });
  };

  ChangeDate(e) {
    this.setState({
      selected_date: e,
    });
    axios
      .get(GET_PAYMENT_ORDER, {
        headers: headers,
        params: {
          selected_date: moment(e).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          payment_order_uk: res.data.payment_order_uk,
          payment_order_gr: res.data.payment_order_gr,
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

  onPRowClick = (row_id) => {
    this.setState({
      payment_id: row_id,
    });
  };

  render() {
    const today = new Date();
    const selectedDate = this.state.selected_date;
    const isToday = (
      today.getDate() === selectedDate.getDate() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear()
    );

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("payment_orders")}
          {this.state.forbidden ? 
              <>
          {forbidden("Financial Payment Orders")}
        </>
          :
            this.state.is_loaded ? (             
              <>
                <Grid columns={2} style={{ margin: 10 }} divided>
                  <Grid.Column width={2}>
                    <label> Select a date : </label>
                    <DatePicker
                      wrapperClassName="datePicker"
                      clearIcon={null}
                      format={"dd/MM/y"}
                      name="date_from"
                      value={this.state.selected_date}
                      onChange={this.ChangeDate}
                    />
                    {isToday ?
                      <>
                        <hr/>
                        <BuildPaymentOrder date={moment(this.state.selected_date).format("YYYY-MM-DD")} update_state={this.update_state}/>
                      </>
                      :
                      <>
                        <FaEye style={iconStyle} /> View Mode.
                        <br/>
                        <small> You cannot Edit a future or past date.</small>
                      </>
                    }
                  </Grid.Column>
                  <Grid.Column width={14}>
                    {this.state.payment_order_uk.deposits.length === 0 ? 
                      <>
                        <Button style={btnStyle} title="United Kingdom">
                          <ReactCountryFlag countryCode={'GB'} value={'GB'} style={flagStyle} svg />
                        </Button>
                        <h3 className='dox_h3' style={{display: 'inline'}}>
                          Cosmoplan International Travel LTD
                          <br/>
                          Has no Payments for {moment(this.state.selected_date).format("DD-MM-YYYY")}.
                        </h3>
                        {moment(this.state.selected_date).format("DD-MM-YYYY") === moment(new Date()).format("DD-MM-YYYY") ?
                          <p>
                            Click on the Build Payment Order Button On The Left to create The Payment Order.
                          </p>
                          :
                          <p>
                            <FaEye style={iconStyle} /> This Payment order is in View Mode. Therefore it cannot be edited.
                          </p>
                        }
                      </>
                    :
                      <> 
                        <Button style={btnStyle} title="United Kingdom">
                          <ReactCountryFlag countryCode={'GB'} value={'GB'} style={flagStyle} svg />
                        </Button>
                        <h3 className='dox_h3' style={{display: 'inline'}}>Cosmoplan International Travel LTD</h3>
                        <ToolkitProvider
                          keyField="id"
                          data={this.state.payment_order_uk.deposits}
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
                                id='payment_order_table'
                                striped
                                rowStyle={this.rowStyle}
                              />
                            </div>
                          )}
                        </ToolkitProvider>
                        <Button onClick={() => this.downloadPaymentOrder('UK')} style={{marginLeft: 20}} disabled={this.state.payment_order_uk.deposits.length === 0}>
                          <AiOutlineFilePdf style={{color: 'red', fontSize: 18}} /> Download Payment Order
                        </Button>
                      </>
                    }
                    <hr/>
                    {this.state.payment_order_gr.deposits.length === 0 ? 
                      <>
                        <Button style={btnStyle} title="Greece">
                          <ReactCountryFlag countryCode={'GR'} value={'GR'} style={flagStyle} svg />
                        </Button>
                        <h3 className='dox_h3' style={{display: 'inline'}}>
                          Cosmoplan International Travel LTD Greek Branch
                          <br/>
                          Has no Payments for {moment(this.state.selected_date).format("DD-MM-YYYY")}.
                        </h3>
                        {moment(this.state.selected_date).format("DD-MM-YYYY") === moment(new Date()).format("DD-MM-YYYY") ?
                          'Click on the Build Payment Order Button On The Left to create The Payment Order.'
                          :
                          <p>
                            <FaEye style={iconStyle} /> This Payment order is in View Mode. Therefore it cannot be edited.
                          </p>
                        }
                        </>
                    :
                      <> 
                        <Button style={btnStyle} title="Greece">
                          <ReactCountryFlag countryCode={'GR'} value={'GR'} style={flagStyle} svg />
                        </Button>
                        <h3 className='dox_h3' style={{display: 'inline'}}>Cosmoplan International Travel LTD Greek Branch</h3>
                        <ToolkitProvider
                          keyField="id"
                          data={this.state.payment_order_gr.deposits}
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
                                id='payment_order_table'
                                striped
                                rowStyle={this.rowStyle}
                              />
                            </div>
                          )}
                        </ToolkitProvider>
                        <Button onClick={() => this.downloadPaymentOrder('GR')} style={{marginLeft: 20}} disabled={this.state.payment_order_gr.deposits.length === 0}>
                          <AiOutlineFilePdf style={{color: 'red', fontSize: 18}} /> Download Payment Order
                        </Button>
                      </>
                    }
                  </Grid.Column>
                </Grid>
                <hr/>
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

export default PaymentOrder;
