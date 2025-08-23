// Built-ins
import React, { useState, useEffect } from "react";

// Icons - Images
import { BsCloudDownload } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { Modal, Form, Col, Row } from "react-bootstrap";

// Modules / Functions
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

// Global Variables
import {
  headers,
  // paginationOptions,
} from "../../../global_vars";

const GET_ALL_GROUPS = "http://localhost:8000/api/view/get_all_groups/";
const VIEW_GROUP = "http://localhost:8000/api/groups/group/";
const DOWNLOAD_DOCUMENT =
  "http://localhost:8000/api/groups/download_financial_document/";
const GET_GROUP_DEPOSITS =
  "http://localhost:8000/api/groups/get_group_deposits/";

// Variables
window.Swal = Swal;

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

const AddPaymentsFromGroup = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [allGroups, setAllGroups] = useState([]);
  let [group, setGroup] = useState({ group_payment: [] });
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    axios
      .get(GET_ALL_GROUPS, {
        headers: headers,
      })
      .then((res) => {
        setAllGroups(res.data.all_groups);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }, []);

  const getGroupInfo = (refcode) => {
    axios
      .get(VIEW_GROUP + refcode, {
        headers: headers,
      })
      .then((res) => {
        setGroup(res.data.group);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Try again",
          text: e.response.data.errormsg,
        });
      });

    axios
      .get(GET_GROUP_DEPOSITS + refcode, {
        headers: headers,
      })
      .then((res) => {
        setDeposits(res.data.deposits);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  };

  const downloadDocument = (fileName, financial_document_id, doc_type) => {
    axios
      .get(
        DOWNLOAD_DOCUMENT +
          financial_document_id +
          "?file=" +
          fileName +
          "&doc_type=" +
          doc_type +
          "&refcode=" +
          group.refcode,
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
            group.refcode
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
        <IoMdAdd /> Add Payments From Group
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Add Payments From a Group</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: 270 }}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Select Group:
            </Form.Label>
            <Col sm="6">
              <Autocomplete
                options={allGroups}
                className={"select_airport"}
                onChange={(e) => {
                  getGroupInfo(e.target.innerText);
                }}
                style={{ width: 300, margin: 0 }}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Group"
                    variant="outlined"
                  />
                )}
              />
            </Col>
            <div className="grey-powerline"></div>
            {group.group_payment.length > 0 ? (
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
                    {group.group_payment
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
                        const depositsForPayment = deposits
                          .filter(
                            (deposit) => deposit.payment.id === payment.id
                          )
                          .reduce(
                            (total, deposit) => total + deposit.amount,
                            0
                          );
                        const finalAmount = payment.amount - depositsForPayment;

                        if (finalAmount >= 0.01) {
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
                                              "proforma"
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
                                              "invoice"
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
                                {finalAmount.toFixed(2)}
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
                        } else {
                          return null;
                        }
                      })}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                {group.refcode ? (
                  <h3
                    className="dox_h3"
                    style={{
                      color: "green",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {group.refcode} Has No Pending Payments.
                  </h3>
                ) : (
                  ""
                )}
              </>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="red"
            onClick={() => {
              handleClose();
              setSelectedPayments([]);
              setGroup({ group_payment: [] });
            }}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              props.setPayments(selectedPayments);
              setSelectedPayments([]);
              setGroup({ group_payment: [] });
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

export default AddPaymentsFromGroup;
