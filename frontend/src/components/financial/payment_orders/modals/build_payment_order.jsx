// Built-ins
import React, { useState } from "react";

// Icons / Images
import { MdBuild } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { BsCloudDownload } from "react-icons/bs";
import { Modal } from "react-bootstrap";

// Custom Made Components
import AddPaymentsFromPayments from "./add_payments_from_all_payments";
import AddPaymentsFromGroup from "./add_payments_from_group";
import AddPaymentsFromDateOfService from "./add_payments_from_date_of_service";
import AddPaymentsFromSupplier from "./add_payments_from_supplier";

// Modules / Functions
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
window.Swal = Swal;

const BUILD_PAYMENT_ORDER = "http://localhost:8000/api/view/build_payment_order/";
const DOWNLOAD_DOCUMENT = "http://localhost:8000/api/groups/download_financial_document/";

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

let flagStyle = { width: "2.5em", height: "2.5em" };
let btnStyle = {
  paddingTop: 5,
  paddingLeft: 10,
  paddingRight: 10,
  paddingBottom: 5,
  margin: 4,
};

const BuildPaymentOrder = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [payments, setPayments] = useState([]);
  const [branch, setBranch] = useState("GR");

  const handleRemovePayment = (td) => {
    setPayments((prevSelectedPayments) =>
      prevSelectedPayments.filter((payment) => payment !== td)
    );
  };

  const addPayments = (newPayments) => {
    // Add the default bank property to each new payment
    const paymentsWithDefaultBank = newPayments.map((payment) => ({
      ...payment,
      bank: "MB", // Set the default bank value here
      deposit_amount: 0,
    }));
    // Update the state with the modified array
    setPayments((prevPayments) => [
      ...prevPayments,
      ...paymentsWithDefaultBank,
    ]);
  };

  const handleBankChange = (payment, selectedBank) => {
    // Update the payment object with the selected bank
    const updatedPayment = { ...payment, bank: selectedBank };
    const paymentIndex = payments.findIndex((p) => p === payment);
    // Create a new array with the updated payment at the correct index
    const updatedPayments = [
      ...payments.slice(0, paymentIndex),
      updatedPayment,
      ...payments.slice(paymentIndex + 1),
    ];
    // Update the state or perform any necessary side effects
    setPayments(updatedPayments);
  };

  const handleDepositAmountChange = (payment, depositAmount) => {
    // Update the payment object with the selected bank
    const updatedPayment = { ...payment, deposit_amount: depositAmount };
    // Find the index of the original payment in the payments array
    const paymentIndex = payments.findIndex((p) => p === payment);
    // Create a new array with the updated payment at the correct index
    const updatedPayments = [
      ...payments.slice(0, paymentIndex),
      updatedPayment,
      ...payments.slice(paymentIndex + 1),
    ];
    // Update the state or perform any necessary side effects
    setPayments(updatedPayments);
  };

  const buildPaymentOrder = () => {
    axios({
      method: "post",
      url: BUILD_PAYMENT_ORDER,
      headers: headers,
      data: {
        date: props.date,
        payments: payments,
        branch: branch,
      },
    })
      .then((res) => {
        props.update_state();
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const downloadDocument = (
    fileName,
    financial_document_id,
    doc_type,
    refcode
  ) => {
    axios
      .get(
        DOWNLOAD_DOCUMENT + financial_document_id + "?file=" + fileName + "&doc_type=" + doc_type + "&refcode=" + refcode, {
          headers: headers,
          params: {
            file: fileName,
          },
        }
      )
      .then(() => {
        window.open(
          DOWNLOAD_DOCUMENT + financial_document_id + "?file=" + fileName + "&doc_type=" + doc_type + "&refcode=" + refcode
        );
      });
  };

  return (
    <>
      <Button
        color="green"
        onClick={() => {
          handleShow();
        }}
      >
        <MdBuild /> Build Payment Order
      </Button>
      <Modal
        show={show}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <Modal.Header>
          <Modal.Title>Build a Payment Order for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: 270 }}>
          Select Branch:
          <br />
          <Button style={btnStyle} color={branch === "UK" ? "blue" : ""} title="United Kingdom" onClick={() => setBranch("UK")}>
            <ReactCountryFlag countryCode={"GB"} value={"GB"} style={flagStyle} svg/>
          </Button>
          <Button style={btnStyle} color={branch === "GR" ? "blue" : ""} title="Greece" onClick={() => setBranch("GR")}>
            <ReactCountryFlag countryCode={"GR"} value={"GR"} style={flagStyle} svg/>
          </Button>
          {branch === "UK" ? "Cosmoplan International Travel LTD" : "Cosmoplan International Travel LTD Greek Branch"}
          <hr />
          <ul>
            <li>
              <AddPaymentsFromPayments
                payments={payments}
                setPayments={addPayments}
              />
            </li>
            <li>
              <AddPaymentsFromGroup
                payments={payments}
                setPayments={addPayments}
              />
            </li>
            <li>
              <AddPaymentsFromDateOfService
                payments={payments}
                setPayments={addPayments}
              />
            </li>
            <li>
              <AddPaymentsFromSupplier
                payments={payments}
                setPayments={addPayments}
              />
            </li>
          </ul>
          {payments.length > 0 ? (
            <>
              <hr />
              <label>Selected Payments: </label>
              <table id="selected_payments_table">
                <thead>
                  <th>Group Ref</th>
                  <th>Service Date</th>
                  <th>Supplier</th>
                  <th>Document</th>
                  <th>Amount</th>
                  <th>Bank</th>
                  <th>Pay Until</th>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    return (
                      <>
                        <tr key={payment.date}>
                          <td> {payment.group_transfer.refcode} </td>
                          <td> {payment.date_of_service} </td>
                          <td>
                            ({SUPPLIER_TYPES[payment.supplier_type]})
                            {payment.supplier}
                          </td>
                          <td>
                            {payment.proforma || payment.invoice ? (
                              <>
                                {payment.proforma ? (
                                  <>
                                    Proforma: {payment.proforma.name}
                                    <BsCloudDownload
                                      className="download_driver_doc_icon payment_doc_icon"
                                      onClick={() => {
                                        downloadDocument(
                                          payment.proforma.name,
                                          payment.id,
                                          "proforma",
                                          payment.group_transfer.refcode
                                        );
                                      }}
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                      }}
                                    />
                                  </>
                                ) : (
                                  <>
                                    Invoice: {payment.invoice.name}
                                    <BsCloudDownload
                                      className="download_driver_doc_icon payment_doc_icon"
                                      onClick={() => {
                                        downloadDocument(
                                          payment.invoice.name,
                                          payment.id,
                                          "invoice",
                                          payment.group_transfer.refcode
                                        );
                                      }}
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                      }}
                                    />
                                  </>
                                )}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              style={{
                                width: 70,
                                height: 20,
                                display: "inline",
                              }}
                              className="form-control"
                              value={payment.deposit_amount}
                              onInput={(e) => {
                                // Allow only numbers and up to 2 decimal places
                                e.target.value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                ); // Remove non-numeric characters
                                e.target.value = e.target.value.replace(
                                  /(\.\d{2}).*$/,
                                  "$1"
                                ); // Keep only up to 2 decimal places
                                if (
                                  parseFloat(e.target.value) > payment.amount
                                ) {
                                  e.target.value = payment.amount.toFixed(2);
                                }
                              }}
                              onChange={(e) =>
                                handleDepositAmountChange(
                                  payment,
                                  e.target.value
                                )
                              }
                            />
                            / {Currencies[payment.currency]}
                            {payment.amount.toFixed(2)}
                          </td>
                          <td>
                            <select
                              className="form-control"
                              value={payment.bank} // Set the value based on payment's bank property
                              onChange={(e) =>
                                handleBankChange(payment, e.target.value)
                              }
                              style={{ marginBottom: 10, width: 120 }}
                            >
                              <option value="AB"> Alpha bank </option>
                              <option value="EB"> Eurobank </option>
                              <option value="PIR"> Piraeus </option>
                              <option value="NBG"> NBG </option>
                              <option value="HSBC"> HSBC </option>
                              <option value="MB"> Metro bank </option>
                            </select>
                          </td>
                          <td>
                            {moment(payment.pay_until).format("DD-MM-YYYY")}
                            <FaMinus
                              className="remove_from_payments_icon"
                              onClick={() => handleRemovePayment(payment)}
                            />
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={() => { handleClose();}}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => { handleClose(); buildPaymentOrder(); setPayments([]);}}
            disabled={payments.length === 0}
          >
            Build Payment Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BuildPaymentOrder;
