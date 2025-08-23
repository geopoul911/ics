// Built-ins
import React, { useState, useEffect } from "react";

// Modules / Functions
import { Button } from "semantic-ui-react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-date-picker";
import moment from "moment";

// Icons
import {
  AiOutlineWarning,
  AiOutlineCheckCircle,
  AiOutlineMinusSquare,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { CgDanger } from "react-icons/cg";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
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
};

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
const ADD_PENDING_PAYMENT =
  "http://localhost:8000/api/groups/add_pending_payment/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function AddPendingPayment(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [supplierType, setSupplierType] = useState("AG");
  const [supplier, setSupplier] = useState("");
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [dateOfService, setDateOfService] = useState(new Date());
  const [currency, setCurrency] = useState("EUR");

  const [fileType, setFileType] = useState("No File");
  const [file, setFile] = React.useState();

  const [payments, setPayments] = useState([
    { amount: 0, payUntil: new Date() },
  ]);

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

  const uploadNewPendingPayment = () => {
    const formData = new FormData();
    formData.append("refcode", getRefcode());
    formData.append("supplier_type", supplierType);
    formData.append("supplier", supplier);
    formData.append(
      "date_of_service",
      moment(dateOfService).format("YYYY-MM-DD")
    );
    formData.append("currency", currency);
    formData.append("payments", JSON.stringify(payments));
    formData.append("doc_type", fileType);
    formData.append("file", file);

    axios({
      method: "post",
      url: ADD_PENDING_PAYMENT,
      headers: headers,
      data: formData,
    })
      .then((res) => {
        props.update_state(res.data.model);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const handleAddPayment = () => {
    setPayments([...payments, { amount: 0, payUntil: new Date() }]);
  };

  const handleRemovePayment = (index) => {
    if (payments.length > 1) {
      const updatedPayments = [...payments];
      updatedPayments.splice(index, 1);
      setPayments(updatedPayments);
    }
  };

  const handleAmountChange = (index, value) => {
    const updatedPayments = [...payments];
    updatedPayments[index].amount = value;
    setPayments(updatedPayments);
  };

  const handlePayUntilChange = (index, date) => {
    const updatedPayments = [...payments];
    updatedPayments[index].payUntil = date;
    setPayments(
      updatedPayments.sort((a, b) => (a.payUntil > b.payUntil ? 1 : -1))
    );
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
    return () => {
      // Cleanup code goes here
    };
  }, [supplierType]); // The empty dependency array means this effect will only run once on mount

  return (
    <>
      <Button
        color="green"
        style={{ marginLeft: 30, marginTop: 20 }}
        onClick={() => {
          handleShow();
          setFile();
        }}
      >
        Add Pending Payment
      </Button>
      <Modal
        show={show}
        onHide={() => {
          handleClose();
          setSupplier("");
          setFileType("No File");
          setFile();
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Pending Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                {Object.entries(supplierTypes).map(([key, value], index) => (
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
            <Form.Label column sm="2">
              Date Of Service:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <DatePicker
                clearIcon={null}
                value={dateOfService}
                format="dd/MM/yyyy"
                onChange={(e) => {
                  setDateOfService(e);
                }}
              />
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Add Currency:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setCurrency(e.target.value)}
                style={{ marginBottom: 10, width: 300 }}
              >
                <option value="EUR"> € Euro (EUR) </option>
                <option value="GBP"> £ Pound Sterling (GBP) </option>
                <option value="USD"> $ US Dollar (USD) </option>
                <option value="CAD"> $ Canadian Dollar (CAD) </option>
                <option value="AUD"> $ Australian Dollar (AUD) </option>
                <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                <option value="NZD"> $ New Zealand Dollar (NZD) </option>
                <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                <option value="SGD"> $ Singapore Dollar (SGD) </option>
              </select>
            </Col>
            {payments.map((payment, index) => (
              <>
                <div className="grey-powerline"></div>
                <Form.Label column sm="2">
                  Amount:
                </Form.Label>
                <Col sm="4">
                  <Form.Control
                    type="text"
                    value={payment.amount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    onInput={(e) => {
                      // Remove non-numeric and non-dot characters
                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      // Allow only one dot
                      const dotCount = (e.target.value.match(/\./g) || [])
                        .length;
                      if (dotCount > 1) {
                        e.target.value = e.target.value.substr(
                          0,
                          e.target.value.lastIndexOf(".")
                        );
                      }
                      // Keep only up to 2 decimal places
                      e.target.value = e.target.value.replace(
                        /(\.\d{2}).*$/,
                        "$1"
                      );
                    }}
                  />
                </Col>
                <Form.Label column sm="2">
                  Pay Until:
                </Form.Label>
                <Col sm="3">
                  <DatePicker
                    clearIcon={null}
                    value={payment.payUntil}
                    format="dd/MM/yyyy"
                    onChange={(date) => handlePayUntilChange(index, date)}
                  />
                </Col>
                {payments.length > 1 ? (
                  <AiOutlineMinusSquare
                    className="minus-icon"
                    onClick={() => handleRemovePayment(index)}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Add Payment
            </Form.Label>
            <Col sm="2">
              <AiOutlinePlusSquare
                className="plus-icon"
                onClick={handleAddPayment}
              />
            </Col>
            <div className="grey-powerline"></div>
            <Form.Label column sm="2">
              Upload Document:
            </Form.Label>
            <Col sm="10">
              <Button
                color={fileType === "No File" ? "green" : ""}
                onClick={() => setFileType("No File")}
              >
                No File
              </Button>
              <Button
                color={fileType === "proforma" ? "green" : ""}
                onClick={() => setFileType("proforma")}
              >
                Proforma
              </Button>
              <Button
                color={fileType === "invoice" ? "green" : ""}
                onClick={() => setFileType("invoice")}
              >
                Invoice
              </Button>
              <Form.Control
                type="file"
                style={{ marginTop: 20, marginBottom: 20 }}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <small>
                <CgDanger
                  style={{
                    color: "red",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                Allowed extensions : .PDF .DOCX .DOC .TIF .TIFF .BMP .JPG .JPEG
                .PNG .ZIP .RAR
                <br />
                <CgDanger
                  style={{
                    color: "red",
                    fontSize: "1.5em",
                    marginRight: "0.5em",
                  }}
                />
                File's size should not exceed 20 megabytes of data
              </small>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {supplier === "" ||
            payments.reduce(
              (total, payment) => total + parseFloat(payment.amount) || 0,
              0
            ) <= 0 ? (
              <>
                <ul
                  key={payments}
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {supplier === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Supplier is a
                        required field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>

                  <li>
                    {payments.reduce(
                      (total, payment) =>
                        total + parseFloat(payment.amount) || 0,
                      0
                    ) > 0 ? (
                      ""
                    ) : (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Amount has to
                        be greater than 0.
                      </>
                    )}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
                  </li>
                </ul>
              </>
            )}
          </small>
          <Button
            color="red"
            onClick={() => {
              handleClose();
              setSupplier("");
              setFileType("No File");
              setFile();
            }}
          >
            Close
          </Button>
          <Button
            color="green"
            disabled={
              supplier === "" ||
              payments.reduce(
                (total, payment) => total + parseFloat(payment.amount) || 0,
                0
              ) <= 0
            }
            onClick={() => {
              handleClose();
              setSupplier("");
              setFileType("No File");
              setFile();
              uploadNewPendingPayment();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddPendingPayment;
