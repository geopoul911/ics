// Built-ins
import React, { useEffect } from "react";
import { useState } from "react";

// Icons / Images
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import alphaBankLogo from "../../../images/core/banks/alphabank.png";
import eurobank from "../../../images/core/banks/eurobank.png";
import piraeusLogo from "../../../images/core/banks/piraeus.png";
import nbgLogo from "../../../images/core/banks/nbg.png";
import metrobankLogo from "../../../images/core/banks/metrobank.png";
import hsbcLogo from "../../../images/core/banks/hsbc.png";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import { Col, Form, Row } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import DatePicker from "react-date-picker";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const ADD_PAYMENT = "http://localhost:8000/api/view/add_payment/";
const GET_PAYMENT_DETAILS =
  "http://localhost:8000/api/view/get_payment_details/";
const GET_AGENTS = "http://localhost:8000/api/view/get_all_agents/";
const GET_AIRLINES = "http://localhost:8000/api/view/get_all_airlines/";
const GET_CREDIT_CARDS = "http://localhost:8000/api/view/get_all_credit_cards/";
const GET_COACH_OPERATORS =
  "http://localhost:8000/api/view/get_all_coach_operators/";
const GET_CRUISING_COMPANIES =
  "http://localhost:8000/api/view/get_all_cruising_companies/";
const GET_DMCS = "http://localhost:8000/api/view/get_all_dmcs/";
const GET_FERRY_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_ferry_ticket_agencies/";
const GET_GUIDES = "http://localhost:8000/api/view/get_all_guides/";
const GET_HOTELS = "http://localhost:8000/api/view/get_all_hotels/";
const GET_REPAIR_SHOPS = "http://localhost:8000/api/view/get_all_repair_shops/";
const GET_RESTAURANTS = "http://localhost:8000/api/view/get_all_restaurants/";
const GET_TELEFERIK_COMPANIES =
  "http://localhost:8000/api/view/get_all_teleferik_companies/";
const GET_THEATERS = "http://localhost:8000/api/view/get_all_theaters/";
const GET_TRAIN_TICKET_AGENCIES =
  "http://localhost:8000/api/view/get_all_train_ticket_agencies/";
const GET_SPORT_EVENT_SUPPLIERS =
  "http://localhost:8000/api/view/get_all_sport_event_suppliers/";

function AddNewPaymentOrder(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [supplierType, setSupplierType] = useState("AG");
  const [company, setCompany] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState(0);
  const [bank, setBank] = useState("AB");
  const [paymentType, setPaymentType] = useState("BT");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [invoice, setInvoice] = useState();
  const [refcode, setRefcode] = useState(props.refcode);
  const [creditCard, setCreditCard] = useState("");
  const [allCreditCards, setAllCreditCards] = useState([]);
  const [supplier, setSupplier] = useState({});
  const [allSuppliers, setAllSuppliers] = useState([]);

  const createNewPaymentOrder = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append("refcode", refcode);
    formData.append("supplier_type", supplierType);
    formData.append("company", company);
    formData.append("currency", currency);
    formData.append("amount", amount);
    formData.append("bank", bank);
    formData.append("payment_type", paymentType);
    formData.append("iban", iban);
    formData.append("swift", swift);
    formData.append("card_number", creditCard);
    formData.append("date", moment(selectedDate).format("YYYY-MM-DD"));
    formData.append("invoice", invoice);

    axios({
      method: "post",
      url: ADD_PAYMENT,
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

  const getCreditCards = (bank_name) => {
    axios
      .get(GET_CREDIT_CARDS, {
        headers: headers,
      })
      .then((res) => {
        setAllCreditCards(
          res.data.all_credit_cards
            .filter((credit_card) => credit_card.bank === bank_name)
            .map((credit_card) => credit_card.card_number)
        );
      });
  };

  const setPaymentDetails = (obj_name, obj_type) => {
    axios
      .get(GET_PAYMENT_DETAILS, {
        headers: headers,
        params: {
          obj_name: obj_name,
          obj_type: obj_type,
        },
      })
      .then((res) => {
        setCompany(res.data.payment_details["company"]);
        setCurrency(res.data.payment_details["currency"]);
        setIban(res.data.payment_details["iban"]);
        setSwift(res.data.payment_details["swift"]);
      });
  };

  useEffect(() => {
    getCreditCards(bank);
    if (supplierType === "AG") {
      axios.get(GET_AGENTS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_agents);
      });
    } else if (supplierType === "AL") {
      axios.get(GET_AIRLINES, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_airlines);
      });
    } else if (supplierType === "CO") {
      axios.get(GET_COACH_OPERATORS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_coach_operators);
      });
    } else if (supplierType === "CC") {
      axios.get(GET_CRUISING_COMPANIES, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_cruising_companies);
      });
    } else if (supplierType === "DMC") {
      axios.get(GET_DMCS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_dmcs);
      });
    } else if (supplierType === "FTA") {
      axios.get(GET_FERRY_TICKET_AGENCIES, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_ferry_ticket_agencies);
      });
    } else if (supplierType === "GD") {
      axios.get(GET_GUIDES, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_guides);
      });
    } else if (supplierType === "HTL") {
      axios.get(GET_HOTELS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_hotels);
      });
    } else if (supplierType === "RS") {
      axios.get(GET_REPAIR_SHOPS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_repair_shops);
      });
    } else if (supplierType === "RST") {
      axios.get(GET_RESTAURANTS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_restaurants);
      });
    } else if (supplierType === "SES") {
      axios.get(GET_SPORT_EVENT_SUPPLIERS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_sport_event_suppliers);
      });
    } else if (supplierType === "TC") {
      axios.get(GET_TELEFERIK_COMPANIES, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_teleferik_companies);
      });
    } else if (supplierType === "TH") {
      axios.get(GET_THEATERS, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_theaters);
      });
    } else if (supplierType === "TTA") {
      axios.get(GET_TRAIN_TICKET_AGENCIES, { headers: headers }).then((res) => {
        setAllSuppliers(res.data.all_train_ticket_agencies);
      });
    }
  }, [bank, supplierType]);

  return (
    <>
      <Button color="green" onClick={handleShow} style={{ margin: 10 }}>
        Create New Payment Order
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Fill The Payment's Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            {props.refcode.length > 0 ? (
              ""
            ) : (
              <>
                <Form.Label column sm="2">
                  Group Refcode:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={props.all_groups}
                    onChange={(e) => {
                      setRefcode(e.target.innerText);
                    }}
                    style={{ width: 300, marginBottom: 10 }}
                    value={refcode}
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
              </>
            )}

            <Form.Label column sm="2">
              Date:
            </Form.Label>
            <Col sm="10" style={{ marginBottom: 10 }}>
              <DatePicker
                clearIcon={null}
                value={selectedDate}
                format="dd/MM/yyyy"
                onChange={(e) => {
                  setSelectedDate(e);
                }}
              />
            </Col>

            <Form.Label column sm="2">
              Supplier Type:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setSupplierType(e.target.value)}
                style={{ marginBottom: 10, width: "40%" }}
              >
                <option value="AG"> Agent </option>
                <option value="AL"> Airline </option>
                <option value="CO"> Coach Operator</option>
                <option value="CC"> Cruising Company</option>
                <option value="DMC"> DMC</option>
                <option value="FTA"> Ferry Ticket Agency</option>
                <option value="GD"> Guide</option>
                <option value="HTL"> Hotel</option>
                <option value="RS"> Repair Shop</option>
                <option value="RST"> Restaurant</option>
                <option value="SES"> Sport Event Supplier</option>
                <option value="TC"> Teleferik Company</option>
                <option value="TH"> Theater</option>
                <option value="TTA"> Train Ticket Agency</option>
              </select>
            </Col>

            <Form.Label column sm="2">
              Supplier:
            </Form.Label>
            <Col sm="10">
              <Autocomplete
                options={allSuppliers}
                onChange={(e) => {
                  setSupplier(e.target.innerText);
                  setPaymentDetails(e.target.innerText, supplierType);
                }}
                style={{ width: 300, marginBottom: 10 }}
                value={supplier}
                disableClearable
                getOptionLabel={(sup) => sup.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Supplier"
                    variant="outlined"
                  />
                )}
              />
            </Col>

            <Form.Label column sm="2">
              Company:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="255"
                onChange={(e) => setCompany(e.currentTarget.value)}
                style={formControlStyle}
                value={company}
              />
            </Col>
            <Form.Label column sm="2">
              Currency:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setCurrency(e.target.value)}
                style={{ marginBottom: 10, width: "40%" }}
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
            <Form.Label column sm="2">
              Amount:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="50"
                type="number"
                onChange={(e) => setAmount(e.currentTarget.value)}
                value={amount}
                className="form-control"
                style={{ marginBottom: 10, width: "40%" }}
              />
            </Col>
            <Form.Label column sm="2">
              Bank:
            </Form.Label>
            <Col sm="10">
              <div style={{ display: "flex", alignItems: "center" }}>
                <select
                  className="form-control"
                  onChange={(e) => setBank(e.target.value)}
                  style={{ marginBottom: 10, width: "40%" }}
                >
                  <option value="AB"> Alpha Bank </option>
                  <option value="EB"> Eurobank </option>
                  <option value="PIR"> Piraeus </option>
                  <option value="NBG"> NBG </option>
                  <option value="HSBC"> HSBC </option>
                  <option value="MB"> Metro bank </option>
                </select>
                {bank === "AB" ? (
                  <img
                    src={alphaBankLogo}
                    alt="bank-icon"
                    className="bank-icon"
                  />
                ) : (
                  ""
                )}
                {bank === "EB" ? (
                  <img src={eurobank} alt="bank-icon" className="bank-icon" />
                ) : (
                  ""
                )}
                {bank === "PIR" ? (
                  <img
                    src={piraeusLogo}
                    alt="bank-icon"
                    className="bank-icon"
                  />
                ) : (
                  ""
                )}
                {bank === "NBG" ? (
                  <img src={nbgLogo} alt="bank-icon" className="bank-icon" />
                ) : (
                  ""
                )}
                {bank === "MB" ? (
                  <img
                    src={metrobankLogo}
                    alt="bank-icon"
                    className="bank-icon"
                  />
                ) : (
                  ""
                )}
                {bank === "HSBC" ? (
                  <img src={hsbcLogo} alt="bank-icon" className="bank-icon" />
                ) : (
                  ""
                )}
              </div>
            </Col>
            <Form.Label column sm="2">
              Payment Type:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setPaymentType(e.target.value)}
                style={{ marginBottom: 10, width: "40%" }}
              >
                <option value="BT"> Bank Transfer</option>
                <option value="CC"> Card</option>
              </select>
            </Col>

            {paymentType === "BT" ? (
              <>
                <Form.Label column sm="2">
                  {currency === "GBP" ? "Account Number" : "IBAN"}:
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    maxLength="50"
                    onChange={(e) =>
                      setIban(e.currentTarget.value.toUpperCase())
                    }
                    style={formControlStyle}
                    value={iban}
                  />
                </Col>
                <Form.Label column sm="2">
                  {currency === "GBP" ? "Sort Code" : "Swift"}:
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    maxLength="50"
                    onChange={(e) =>
                      setSwift(e.currentTarget.value.toUpperCase())
                    }
                    style={formControlStyle}
                    value={swift}
                  />
                </Col>
              </>
            ) : (
              <>
                <Form.Label column sm="2">
                  Credit Card:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={allCreditCards}
                    onChange={(e) => {
                      setCreditCard(e.target.innerText);
                    }}
                    style={{ width: 300, marginBottom: 10 }}
                    value={creditCard}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Credit Card"
                        variant="outlined"
                      />
                    )}
                  />
                </Col>
              </>
            )}
            <Form.Label column sm="2">
              Invoice:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Form.Control
                type="file"
                onChange={(e) => {
                  setInvoice(e.target.files[0]);
                }}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {company.length < 1 || amount < 1 || refcode.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  {refcode.length === 0 ? (
                    <li>
                      <AiOutlineWarning style={warningStyle} /> Select A Group.
                    </li>
                  ) : (
                    ""
                  )}
                  {company.length < 1 ? (
                    <li>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Company Field.
                    </li>
                  ) : (
                    ""
                  )}
                  {amount < 1 ? (
                    <li>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Amount Field.
                    </li>
                  ) : (
                    ""
                  )}
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
                    <AiOutlineCheckCircle style={checkStyle} />
                    Validated
                  </li>
                </ul>
              </>
            )}
          </small>

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewPaymentOrder();
            }}
            disabled={
              company.length === 0 || amount < 1 || refcode.length === 0
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddNewPaymentOrder;
