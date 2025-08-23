// Built-ins
import React, { useState, useEffect } from "react";

// Icons / Images
import { IoMdAdd } from "react-icons/io";
// import { FaMinus } from "react-icons/fa";
import { BsCloudDownload } from "react-icons/bs";

// Modules / Functions
import { Button } from "semantic-ui-react";
import { Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../global_vars";

const DOWNLOAD_DOCUMENT =
  "http://localhost:8000/api/groups/download_financial_document/";
const GET_PAYMENTS_BY_SUPPLIER =
  "http://localhost:8000/api/financial/get_payments_by_supplier/";

const GET_AGENTS = "http://localhost:8000/api/view/get_all_agents/";
const GET_HOTELS = "http://localhost:8000/api/view/get_all_hotels/";
const GET_AIRLINES = "http://localhost:8000/api/view/get_all_airlines/";
const GET_GROUND_HANDLING_COMPANIES =
  "http://localhost:8000/api/view/get_all_dmcs/";
const GET_FERRY_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_ferry_ticket_agencies/";
const GET_CRUISING_COMPANIES =
  "http://localhost:8000/api/view/get_all_cruising_companies/";
const GET_TOUR_LEADERS = "http://localhost:8000/api/view/get_group_leaders/";
const GET_GUIDES = "http://localhost:8000/api/view/get_all_guides/";
const GET_RESTAURANTS = "http://localhost:8000/api/view/get_all_restaurants/";
const GET_REPAIR_SHOPS = "http://localhost:8000/api/view/get_all_repair_shops/";
const GET_SPORT_EVENT_SUPPLIERS =
  "http://localhost:8000/api/view/get_all_sport_event_suppliers/";
const GET_TELEFERIK_COMPANIES =
  "http://localhost:8000/api/view/get_all_teleferik_companies/";
const GET_THEATERS = "http://localhost:8000/api/view/get_all_theaters/";
const GET_TRAIN_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_train_ticket_agencies/";
const GET_COACH_OPERATORS =
  "http://localhost:8000/api/view/get_all_coach_operators/";

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

// Variables
window.Swal = Swal;

const AddPaymentsFromSupplier = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [payments, setPayments] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [supplierType, setSupplierType] = useState("AG");
  const [supplier, setSupplier] = useState("");
  const [allSuppliers, setAllSuppliers] = useState([]);

  const getAllAgents = () => {
    axios
      .get(GET_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_agents);
      });
  };

  const getAllHotels = () => {
    axios
      .get(GET_HOTELS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_hotels);
      });
  };

  const getAllAirlines = () => {
    axios
      .get(GET_AIRLINES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_airlines);
      });
  };

  const getAllTourLeaders = () => {
    axios
      .get(GET_TOUR_LEADERS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_leaders);
      });
  };

  const getAllDMCs = () => {
    axios
      .get(GET_GROUND_HANDLING_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_dmcs);
      });
  };

  const getAllFerryTicketAgencies = () => {
    axios
      .get(GET_FERRY_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_ferry_ticket_agencies);
      });
  };

  const getAllCruisingCompanies = () => {
    axios
      .get(GET_CRUISING_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_cruising_companies);
      });
  };

  const getAllGuides = () => {
    axios
      .get(GET_GUIDES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_guides);
      });
  };

  const getAllRestaurants = () => {
    axios
      .get(GET_RESTAURANTS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_restaurants);
      });
  };

  const getAllRepairShops = () => {
    axios
      .get(GET_REPAIR_SHOPS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_repair_shops);
      });
  };

  const getAllSportEventSuppliers = () => {
    axios
      .get(GET_SPORT_EVENT_SUPPLIERS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_sport_event_suppliers);
      });
  };

  const getAllTeleferikCompanies = () => {
    axios
      .get(GET_TELEFERIK_COMPANIES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_teleferik_companies);
      });
  };

  const getAllTheaters = () => {
    axios
      .get(GET_THEATERS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_theaters);
      });
  };

  const getAllTrainTicketAgencies = () => {
    axios
      .get(GET_TRAIN_TICKET_AGENCIES, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_train_ticket_agencies);
      });
  };

  const getAllCoachOperators = () => {
    axios
      .get(GET_COACH_OPERATORS, {
        headers: headers,
      })
      .then((res) => {
        setAllSuppliers(res.data.all_coach_operators);
      });
  };

  useEffect(() => {
    setSupplier("");
    if (supplierType === "AG") {
      getAllAgents();
    } else if (supplierType === "AL") {
      getAllAirlines();
    } else if (supplierType === "CO") {
      getAllCoachOperators();
    } else if (supplierType === "CC") {
      getAllCruisingCompanies();
    } else if (supplierType === "DMC") {
      getAllDMCs();
    } else if (supplierType === "FTA") {
      getAllFerryTicketAgencies();
    } else if (supplierType === "GD") {
      getAllGuides();
    } else if (supplierType === "HTL") {
      getAllHotels();
    } else if (supplierType === "RS") {
      getAllRepairShops();
    } else if (supplierType === "RST") {
      getAllRestaurants();
    } else if (supplierType === "SES") {
      getAllSportEventSuppliers();
    } else if (supplierType === "TL") {
      getAllTourLeaders();
    } else if (supplierType === "TC") {
      getAllTeleferikCompanies();
    } else if (supplierType === "TH") {
      getAllTheaters();
    } else if (supplierType === "TTA") {
      getAllTrainTicketAgencies();
    }
    axios
      .get(GET_PAYMENTS_BY_SUPPLIER, {
        headers: headers,
        params: {
          supplier_type: supplierType,
          supplier: supplier,
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
    return () => {
      // Cleanup code goes here
    };
  }, [supplierType, supplier]);

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
      >
        <IoMdAdd /> Add Payments From Supplier
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Add Payments From Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: 270 }}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Supplier Type:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                style={{ width: 300, display: "inline" }}
                onChange={(e) => setSupplierType(e.target.value)}
              >
                {Object.entries(SUPPLIER_TYPES).map(([key, value], index) => (
                  <option key={index} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Supplier:
            </Form.Label>
            <Col sm="10">
              <Autocomplete
                options={allSuppliers}
                disableClearable
                key={supplierType}
                onChange={(e) => {
                  setSupplier(e.target.innerText);
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Supplier"
                    variant="outlined"
                  />
                )}
              />
            </Col>
            <div className="grey-powerline"></div>

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
            onClick={() => {
              handleClose();
              setSelectedPayments([]);
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

export default AddPaymentsFromSupplier;
