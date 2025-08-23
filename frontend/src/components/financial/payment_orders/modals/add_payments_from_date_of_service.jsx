// Built-ins
import React, { useState, useEffect } from "react";

// Icons / Images
import { IoMdAdd } from "react-icons/io";
import { BsCloudDownload } from "react-icons/bs";
import { Modal, Form, Col, Row } from "react-bootstrap";
import moment from "moment";

// Modules / Functions
import { Button } from "semantic-ui-react";
import DatePicker from "react-date-picker";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
window.Swal = Swal;
const DOWNLOAD_DOCUMENT =
  "http://localhost:8000/api/groups/download_financial_document/";
const GET_PAYMENTS_BY_DATERANGE =
  "http://localhost:8000/api/financial/get_payments_by_daterange/";

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

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();

const AddPaymentsFromDate = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [startDate, setStartDate] = useState(new Date(year, month, day - 7));
  let [endDate, setEndDate] = useState(new Date(year, month, day + 7));

  const [payments, setPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);

  useEffect(() => {
    axios
      .get(GET_PAYMENTS_BY_DATERANGE, {
        headers: headers,
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        setPayments(res.data.payments);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }, [startDate, endDate]);

  const downloadDocument = (
    fileName,
    financial_document_id,
    doc_type,
    refcode
  ) => {
    axios
      .get(
        DOWNLOAD_DOCUMENT +
          financial_document_id +
          "?file=" +
          fileName +
          "&doc_type=" +
          doc_type +
          "&refcode=" +
          refcode,
        {
          headers: headers,
          params: {
            file: fileName,
          },
        }
      )
      .then(() => {
        window.open(
          DOWNLOAD_DOCUMENT +
            financial_document_id +
            "?file=" +
            fileName +
            "&doc_type=" +
            doc_type +
            "&refcode=" +
            refcode
        );
      });
  };

  const handleCheckboxClick = (payment) => {
    setSelectedPayments((prevSelectedPayments) => {
      // Check if the payment is already in the selectedPayments array
      const isSelected = prevSelectedPayments.some(
        (selectedPayment) => selectedPayment.id === payment.id
      );

      if (isSelected) {
        // If it exists, remove it
        return prevSelectedPayments.filter(
          (selectedPayment) => selectedPayment.id !== payment.id
        );
      } else {
        // If it does not exist, include it
        return [...prevSelectedPayments, payment];
      }
    });
  };

  return (
    <>
      <Button
        color="blue"
        onClick={() => {
          handleShow();
        }}
        style={{ marginBottom: 10 }}
      >
        <IoMdAdd /> Add Payments From Date Of Service
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Add Payments from Date Of Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2"></Form.Label>
            <Col sm="6">
              <b>Date From:</b>
              <DatePicker
                clearIcon={null}
                value={startDate}
                format="dd/MM/yyyy"
                onChange={(e) => {
                  setStartDate(e);
                }}
              />
              <br />
              <b>Date To:</b>
              <DatePicker
                clearIcon={null}
                value={endDate}
                format="dd/MM/yyyy"
                onChange={(e) => {
                  setEndDate(e);
                }}
              />
            </Col>
            <div className="grey-powerline"></div>
            {payments.length > 0 ? (
              <>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Supplier</th>
                      <th>Service Date</th>
                      <th>Document</th>
                      <th>Amount</th>
                      <th>Pay Until</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments
                      .filter(
                        (payment) =>
                          !props.payments.some(
                            (existingPayment) =>
                              existingPayment.id === payment.id
                          )
                      )
                      .sort(
                        (a, b) => new Date(a.pay_until) - new Date(b.pay_until)
                      )
                      .map((payment) => {
                        return (
                          <tr
                            className={
                              selectedPayments.some(
                                (selectedPayment) =>
                                  selectedPayment.id === payment.id
                              )
                                ? "mass_mail_selected_box"
                                : ""
                            }
                          >
                            <td>{SUPPLIER_TYPES[payment.supplier_type]}</td>
                            <td>{payment.supplier}</td>
                            <td>{payment.date_of_service}</td>
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
                              {Currencies[payment.currency]}
                              {payment.amount.toFixed(2)}
                            </td>
                            <td>
                              {moment(payment.pay_until).format("DD-MM-YYYY")}
                            </td>
                            <td>
                              <Form.Check
                                type={"checkbox"}
                                id={`checkbox-${payment.id}`}
                                onClick={() => handleCheckboxClick(payment)}
                                checked={selectedPayments.includes(payment)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <h3
                  className="dox_h3"
                  style={{ color: "green", textAlign: "center", width: "100%" }}
                >
                  No Results.
                </h3>
              </>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="red"
            onClick={() => { handleClose(); setSelectedPayments([]); }}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              props.setPayments(selectedPayments);
              setSelectedPayments([]);
            }}
            disabled={selectedPayments.length === 0}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddPaymentsFromDate;
