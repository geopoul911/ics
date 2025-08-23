// Built-ins
import { useState } from "react";

// CSS
import "react-phone-number-input/style.css";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import DatePicker from "react-date-picker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

// Custom Made Components
import MonthPicker from "./monthPicker";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
window.Swal = Swal;

const ADD_OFFER = "http://localhost:8000/api/groups/add_offer";
const GET_AGENTS = "http://localhost:8000/api/view/get_all_agents/";

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

function AddOfferModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [AllAgents, setAllAgents] = useState([]);
  const [name, setName] = useState("");
  const [groupRef, setGroupRef] = useState("");
  const [offerType, setOfferType] = useState("PP");
  const [documentType, setDocumentType] = useState("B2BINT");
  const [currency, setCurrency] = useState("EUR");
  const [destination, setDestination] = useState("");
  const [pax, setPax] = useState(0);
  const [profit, setProfit] = useState(0);
  const [cancellationDeadline, setCancellationDeadline] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [agent, setAgent] = useState("");
  const [date, setDate] = useState(new Date());

  const [selectedMonthsRange, setSelectedMonthsRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleMonthRangeChange = (range) => {
    setSelectedMonthsRange(range);
  };

  const getAgents = () => {
    axios
      .get(GET_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllAgents(res.data.all_agents);
        setLoaded(true);
      });
  };

  const createNewOffer = () => {
    axios({
      method: "post",
      url: ADD_OFFER,
      headers: headers,
      data: {
        name: name,
        recipient: agent,
        date: moment(date).format("YYYY-MM-DD"),
        group_ref: groupRef,
        offer_type: offerType,
        document_type: documentType,
        currency: currency,
        destination: destination,
        pax: pax,
        profit: profit,
        cancellation_deadline: cancellationDeadline,
        start_date: `${selectedMonthsRange.startDate.toLocaleString("default", {
          month: "long",
        })} ${selectedMonthsRange.startDate.getFullYear()}`,
        end_date: `${selectedMonthsRange.endDate.toLocaleString("default", {
          month: "long",
        })} ${selectedMonthsRange.endDate.getFullYear()}`,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href = "/group_management/offer/" + res.data.offer_id;
        } else {
          props.set_offer(name);
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          setOfferType("PP");
          setDocumentType("B2BINT");
          setCurrency("EUR");
          setDestination("");
          setPax(0);
          setProfit(0);
          setCancellationDeadline(0);
          getAgents();
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Offer
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Offer </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Name:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Form.Control
                maxLength="50"
                onChange={(e) =>
                  setName(allowAlpha(e.currentTarget.value).toUpperCase())
                }
                value={name}
              />
            </Col>

            <Form.Label column sm="2">
              Recipient:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Autocomplete
                options={AllAgents}
                onChange={(e) => {
                  setAgent(e.target.innerText);
                }}
                getOptionLabel={(option) => option.name}
                style={{ width: "100%" }}
                disabled={!loaded}
                disableClearable
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
              {loaded ? (
                ""
              ) : (
                <Spinner
                  animation="border"
                  variant="info"
                  size="sm"
                  style={{ position: "fixed", marginTop: 20, marginLeft: 10 }}
                />
              )}
            </Col>

            <Form.Label column sm="2">
              Group Ref:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Form.Control
                maxLength="50"
                onChange={(e) =>
                  setGroupRef(allowAlpha(e.currentTarget.value).toUpperCase())
                }
                value={groupRef}
              />
            </Col>
            <Form.Label column sm="2">
              Date:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <DatePicker
                clearIcon={null}
                value={date}
                format="dd/MM/yyyy"
                onChange={(e) => {
                  setDate(e);
                }}
              />
            </Col>

            <Form.Label column sm="2">
              Offer Type:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <select
                className="form-control"
                onChange={(e) => setOfferType(e.target.value)}
              >
                <option value="PP">Per Person</option>
                <option value="BS">By Scale</option>
              </select>
            </Col>

            <Form.Label column sm="2">
              Document Type:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <select
                className="form-control"
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="B2BINT">b2b International</option>
                <option value="B2BGR">b2b Greece</option>
                <option value="B2CINT">b2c International</option>
                <option value="B2CGR">b2c Greece</option>
              </select>
            </Col>

            <Form.Label column sm="2">
              Currency:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <select
                className="form-control"
                style={{ width: 300 }}
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                }}
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
              Period:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <MonthPicker onMonthRangeChange={handleMonthRangeChange} />
            </Col>
            <Form.Label column sm="2">
              Destination:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Form.Control
                maxLength="255"
                onChange={(e) =>
                  setDestination(allowAlpha(e.currentTarget.value))
                }
                value={destination}
              />
            </Col>

            {offerType === "PP" ? (
              <>
                <Form.Label column sm="2">
                  PAX:
                </Form.Label>
                <Col sm="10" style={{ marginTop: 10 }}>
                  <Form.Control
                    type="number"
                    value={pax}
                    onChange={(e) => {
                      setPax(e.currentTarget.value);
                    }}
                  />
                </Col>
                <Form.Label column sm="2">
                  Profit:
                </Form.Label>
                <Col sm="10" style={{ marginTop: 10 }}>
                  <Form.Control
                    type="number"
                    value={profit}
                    onChange={(e) => {
                      setProfit(e.currentTarget.value);
                      e.target.value = Math.max(0, parseInt(e.target.value))
                        .toString()
                        .slice(0, 3);
                    }}
                  />
                </Col>
              </>
            ) : (
              ""
            )}

            <Form.Label column sm="4" style={{ marginTop: 10 }}>
              Cancellation Deadline ( Days ) :
            </Form.Label>
            <Col sm="8" style={{ marginTop: 10 }}>
              <Form.Control
                type="number"
                value={cancellationDeadline}
                onChange={(e) => {
                  setCancellationDeadline(e.currentTarget.value);
                }}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare
              style={{
                color: "#F3702D",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            Name is the only required field. PAX field will disappear if you
            select By Scale type.
            <br />
            <AiOutlineWarning
              style={{ fontSize: 18, marginRight: 6, color: "orange" }}
            />
            Period Will not be editable upon creation.
            {name.length < 2 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {name.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Name Field.
                      </>
                    ) : (
                      ""
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
              createNewOffer();
            }}
            disabled={name.length < 2}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddOfferModal;
