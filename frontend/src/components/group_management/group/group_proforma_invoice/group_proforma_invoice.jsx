// Built-ins
import React from "react";

// Icons
import { MdAlternateEmail } from "react-icons/md";
import { BsInfoSquare, BsTable, BsCalendarDay, BsBank, BsCalendar2Date, BsFillTelephoneFill } from "react-icons/bs";
import { FaAddressCard, FaFilePdf } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { FaCheckCircle, FaHashtag } from "react-icons/fa";

// Functions
import { Button, Grid } from "semantic-ui-react";
import { Col, Form, Row, Card } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import DatePicker from "react-date-picker";
import moment from "moment";
import PhoneInput from "react-phone-input-2";

// Custom Made Components
import SendProforma from "./modals/send_proforma.js";
import CancelProforma from "./modals/cancel_proforma.js";

// CSS
import "react-tabs/style/react-tabs.css";

// Global Variables
import {
  pageHeader,
  loader,
  headers,
} from "../../../global_vars";

import Swal from "sweetalert2";

// Variables
let overviewIconStyle = { color: "#F3702D", marginRight: "0.5em", fontSize: "1.5em" };

const bankOptions = {
  'EUR METROBANK GB': '€ Metrobank Greek Branch',
  'GBP METROBANK GB': '£ Metrobank Greek Branch',
  'EUR METROBANK EB': '€ Metrobank UK Branch',
  'GBP METROBANK EB': '£ Metrobank UK Branch',
  'EUR HSBC': '€ HSBC',
  'GBP HSBC': '£ HSBC',
  'EUR NBG': '€ NBG',
  'EUR ALPHABANK': '€ Alphabank',
  'EUR EUROBANK': '€ Eurobank',
  'EUR PIREAUS': '€ Pireaus',
};

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

const CREATE_PROFORMA = "http://localhost:8000/api/groups/create_proforma/";
const ISSUE_PROFORMA = "http://localhost:8000/api/groups/issue_proforma/";
const DOWNLOAD_PROFORMA = "http://localhost:8000/api/groups/download_proforma_pdf/";

class GroupProformaInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table_text: '',
      proforma: {
        date: new Date(),
        payable_until: new Date(),
        banks: 'N/A',
        is_paid: false,
      },
      currency: getRefcode().startsWith("COA") ? "€" : "£"
    };
    this.issueProforma = this.issueProforma.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleTelChange = this.handleTelChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handlePayableDateChange = this.handlePayableDateChange.bind(this);
    this.handleBankChange = this.handleBankChange.bind(this);
    this.deleteProformaInfo = this.deleteProformaInfo.bind(this);
  }
  downloadProforma = () => {
    axios
      .get(DOWNLOAD_PROFORMA + getRefcode(), {
        headers: headers,
      })
      .then((res) => {
        window.open(DOWNLOAD_PROFORMA + getRefcode());
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  changeTableText(e) {
    // Parse the HTML string to extract data
    const parser = new DOMParser();
    const doc = parser.parseFromString(e, 'text/html');
    const tableRows = doc.querySelectorAll('tbody tr');
    let totalPriceSum = 0; // Initialize sum variable for total price
  
    // Iterate over each table row
    tableRows.forEach(row => {
      // Check if row and its children exist
      if (row && row.children && row.children.length >= 5) {
        // Get the relevant cell values
        const pax = parseInt(row.children[2].textContent);
        const nights = parseInt(row.children[3].textContent);
  
        // Calculate the total
        const totalPrice = isNaN(pax) || isNaN(nights) ? 'N/A' : (pax * nights).toFixed(2);

        // Update the TOTALS cell
        row.children[4].textContent = this.state.currency + ' ' + totalPrice;

        // Add totalPrice to totalPriceSum
        if (!isNaN(totalPrice)) {
          totalPriceSum += parseFloat(totalPrice);
        }
      }
    });
  
    // Update the total price in the last row if it exists and has the expected format
    const lastRow = doc.querySelector('tbody tr:last-child');

    if (lastRow && lastRow.children && lastRow.children.length >= 5) { // Check if last row and has at least 6 children
      lastRow.children[4].textContent = this.state.currency + ' ' + totalPriceSum.toFixed(2);
    }
  
    // Update the state with the modified table HTML
    this.setState({
      table_text: doc.body.innerHTML,
    });
  }
  
  generateHtmlTableString() {
    let tableString = '<table border="1">';
    tableString += '<thead><tr><th>#</th><th></th><th>PAX</th><th>Price ( per person )</th><th>Total</th></tr></thead>';
    tableString += '<tbody>';
    let counter = 1;
  
    tableString += `
      <tr>
        <td>${counter++}</td>
        <td>Group tour - Package Accomodation & Transfers</td>
        <td>${this.props.group.number_of_people}</td>
        <td>0</td>
        <td>${this.state.currency} 0</td>
      </tr>`;
  
    tableString += `<tr><td>${counter++}</td><td>Single Supplement</td><td>1</td><td>0</td><td> ${this.state.currency} 0</td></tr>`
    tableString += `<tr><td>${counter++}</td><td>Tour Leader Free Of Charge</td><td>1</td><td>0</td><td> ${this.state.currency} 0</td></tr>`
    tableString += `<tr><td>${counter++}</td><td>Driver Free Of Charge</td><td>1</td><td>0</td><td> ${this.state.currency} 0</td></tr>`
    tableString += `<tr><td>${counter++}</td><td></td><td>1</td><td>0</td><td> ${this.state.currency} 0</td></tr>`
    tableString += `<tr><td>${counter++}</td><td></td><td>1</td><td>0</td><td> ${this.state.currency} 0</td></tr>`
    tableString += `<tr><td></td><td></td><td></td><td style="text-align: right">Total:</td><td>${this.state.currency} 0</td></tr>`
    tableString += '</tbody></table>';
  
    return tableString;
  }

  componentDidMount() {
    if (!this.props.group.proforma) {
      axios({
        method: "post",
        url: CREATE_PROFORMA,
        headers: headers,
        data: {
          offices: 'N/A',
          date: moment(new Date()).format("YYYY-MM-DD"),
          payable_until: moment(new Date()).format("YYYY-MM-DD"),
          banks: this.props.group.refcode.startsWith('COA') ? 'EUR METROBANK GB': 'GBP METROBANK EB',
          group: this.props.group.id,
          table_text: this.generateHtmlTableString(),
        },
        })
      .then((res) => {
        this.setState({
          proforma: res.data.model.proforma,
          table_text: this.generateHtmlTableString(),
        })
      })
    } else {
      this.setState({
        proforma: this.props.group.proforma,
        table_text: this.props.group.proforma.table_text.length !== 0 ? this.props.group.proforma.table_text : this.generateHtmlTableString(),
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.group.proforma !== this.props.group.proforma) {
      this.setState({
        proforma: this.props.group.proforma,
      });
    }
  }

  issueProforma() {
    axios({
      method: "post",
      url: ISSUE_PROFORMA + getRefcode(),
      headers: headers,
      data: {
        address: this.state.proforma.address,
        tel: this.state.proforma.tel,
        email: this.state.proforma.email,
        date: moment(this.state.proforma.date).format("YYYY-MM-DD"),
        payable_until: moment(this.state.proforma.payable_until).format("YYYY-MM-DD"),
        banks: this.state.proforma.banks,
        table_text: this.state.table_text,
      },
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Successfully Issued Proforma",
      });
      this.setState({
        proforma: res.data.proforma,
      });
    })
    .catch((e) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.response.data.errormsg,
      });
    });
  }

  changeCurrency(e) {
    this.setState({
      currency: e,
    });
  }

  deleteProformaInfo() {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        address: '',
        tel: '',
        email: '',
      },
    }));
  }

  update_state = (update_state) => {
    this.setState({ proforma: update_state });
  };

  handleAddressChange(e) {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        address: e.target.value,
      },
    }));
  }

  handleTelChange(e) {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        tel: e,
      },
    }));
  }

  handleEmailChange(e) {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        email: e.target.value,
      },
    }));
  }
  
  handleDateChange(e) {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        date: e,
      },
    }));
  }

  handlePayableDateChange(e) {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        payable_until: e,
      },
    }));
  }

  handleBankChange(e) {
    this.setState((prevState) => ({
      proforma: {
        ...prevState.proforma,
        banks: e.target.value,
      },
    }));
  }

  render() {
    return this.props.isLoaded ? (
      <>
        <div className="rootContainer">
          {pageHeader("group_proforma_invoice", this.props.group.refcode)}
          <Grid columns={2}>
            <Grid.Row style={{marginLeft: 10}}>
              <Grid.Column width={5}>
                <Card>
                  <Card.Header>
                    <BsInfoSquare style={{ color: "#F3702D", fontSize: "1.5em", marginRight: "0.5em",}}/> Proforma Information
                  </Card.Header>
                  <Card.Body>
                    <Form.Group as={Row} className="mb-3">
                      
                      {this.props.group.agent ?
                        <>
                        <Form.Label column sm="6">
                          <FaHashtag style={overviewIconStyle} /> Agent's Name
                          </Form.Label>
                          <Col sm="10">
                            <Form.Control
                              disabled={true}
                              value={this.props.group.agent ? this.props.group.agent.name : ""}
                            />
                          </Col>
                        </>
                        :
                        <>
                        <Form.Label column sm="6">
                        <FaHashtag style={overviewIconStyle} /> Client's Name
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            disabled={true}
                            value={this.props.group.client ? this.props.group.client.name : ""}
                          />
                        </Col>
                      </>
                    }

                      <Form.Label column sm="6">
                        <FaAddressCard style={overviewIconStyle} /> Customer's Address
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          onChange={this.handleAddressChange}
                          disabled={this.state.proforma.is_issued}
                          value={this.state.proforma.address ? this.state.proforma.address : ""}
                        />
                      </Col>
                      <Form.Label column sm="6">
                        <BsFillTelephoneFill style={overviewIconStyle} /> Customer's Tel
                      </Form.Label>
                      <Col sm="10">
                        <PhoneInput
                          international
                          maxLength={24}
                          disabled={this.state.proforma.is_issued}
                          value={this.state.proforma.tel}
                          countryCallingCodeEditable={false}
                          defaultCountry="GR"
                          onChange={this.handleTelChange}
                        />
                      </Col>
                      <Form.Label column sm="6">
                        <MdAlternateEmail style={overviewIconStyle} /> Customer's Email
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          disabled={this.state.proforma.is_issued}
                          value={this.state.proforma.email ? this.state.proforma.email : ""}
                          onChange={this.handleEmailChange}
                        />
                      </Col>
                      </Form.Group>
                      <hr/>
                      <Button 
                        color={'blue'} 
                        disabled={this.state.proforma.is_issued}
                        onClick={() => this.deleteProformaInfo()}
                      >
                        Delete Proforma's Information
                      </Button>
                      <hr/>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5">
                          <BsCalendar2Date style={overviewIconStyle} /> Issue Date :
                        </Form.Label>
                        <Col sm="5">
                          <DatePicker
                            clearIcon={null}
                            disabled={this.state.proforma.is_issued}
                            value={new Date(this.state.proforma.date)}
                            format="dd/MM/yyyy"
                            onChange={this.handleDateChange}
                          />
                        </Col>
                        <Form.Label column sm="5">
                          <BsCalendarDay style={overviewIconStyle} /> Payable Until : 
                        </Form.Label>
                        <Col sm="5">
                          <DatePicker
                            clearIcon={null}
                            disabled={this.state.proforma.is_issued}
                            value={new Date(this.state.proforma.payable_until)}
                            format="dd/MM/yyyy"
                            onChange={this.handlePayableDateChange}
                          />
                        </Col>
                        <Form.Label column sm="6">
                          <BsBank  style={overviewIconStyle} /> Bank
                        </Form.Label>
                        <Col sm="10">
                          <select
                            disabled={this.state.proforma.is_issued}
                            className="form-control"
                            onChange={this.handleBankChange}
                            value={this.state.proforma.banks}
                          >
                            {Object.keys(bankOptions).map((key) => (
                              <option key={key} value={key}>
                                {bankOptions[key]}
                              </option>
                            ))}
                          </select>
                        </Col>
                        <Form.Label column sm="6">
                        <GiMoneyStack style={overviewIconStyle} /> Currency
                        </Form.Label>
                        <Col sm="10">
                          <Button
                            disabled={this.state.proforma.is_issued}
                            color={this.state.currency === '€' ? 'green' : ''}
                            onClick={() => this.changeCurrency("€")}
                          >
                            €
                          </Button>
                          <Button
                            disabled={this.state.proforma.is_issued}
                            color={this.state.currency === '£' ? 'green' : ''}
                            onClick={() => this.changeCurrency("£")}
                            >
                              £
                          </Button>
                        </Col>
                      </Form.Group>
                  </Card.Body>
                  <Card.Footer>
                  </Card.Footer>
                </Card>
              </Grid.Column>
              <Grid.Column width={10}>
                <Card>
                  <Card.Header>
                    <BsTable style={{ color: "#F3702D", fontSize: "1.5em", marginRight: "0.5em",}}/> Proforma Table
                  </Card.Header>
                  <Card.Body>
                    <Editor
                      apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
                      onEditorChange={(e) => this.changeTableText(e)}
                      key={this.state.currency}
                      disabled={this.state.proforma.is_issued}
                      value={this.state.table_text}
                      init={{
                        height: 440,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | " +
                          "bold italic backcolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </Card.Body>
                  <Card.Footer>
                      {this.state.proforma.is_issued ? 
                        <>
                          <Button
                            onClick={this.downloadProforma}
                            disabled={(localStorage.user_id !== "84" && localStorage.user_id !== "87" && localStorage.user_id !== "88")}
                          >
                            <FaFilePdf style={{color: 'red'}}/> Download Proforma
                          </Button>
                          <SendProforma
                            recipient={this.state.proforma.email ? this.state.proforma.email : ''}
                            fileName={getRefcode() + '_proforma.pdf'}
                            refcode={getRefcode()}
                          />
                          <CancelProforma update_state={this.update_state}/>
                        </>
                      :
                        <>
                          <Button color="green" onClick={this.issueProforma}>
                            <FaCheckCircle style={{marginRight: '0.5em', fontWeight: 'bold'}}/> Issue Proforma
                          </Button>
                        </>
                      }
                  </Card.Footer>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </>
    ) : (
      <div style={{ minHeight: 776 }}>
        {loader()}
      </div>
    );
  }
}

export default GroupProformaInvoice;
