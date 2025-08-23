// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const EDIT_PAYMENT_DETAILS =
  "http://localhost:8000/api/data_management/edit_payment_details/";

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

function ChangePaymentDetails(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [company, setCompany] = useState(
    props.payment_details.company ? props.payment_details.company : ""
  );
  const [currency, setCurrency] = useState(
    props.payment_details.currency ? props.payment_details.currency : "EUR"
  );
  const [iban, setIban] = useState(
    props.payment_details.iban ? props.payment_details.iban : ""
  );
  const [swift, setSwift] = useState(
    props.payment_details.swift ? props.payment_details.swift : ""
  );

  const UpdatePaymentDetails = () => {
    axios({
      method: "post",
      url: EDIT_PAYMENT_DETAILS,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        company: company,
        currency: currency,
        iban: iban,
        swift: swift,
      },
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

  return (
    <>
      <Button
        color="orange"
        onClick={() => {
          handleShow();
        }}
      >
        <BiPlus
          style={{ color: "white", fontWeight: "bold", marginRight: "0.5em" }}
        />
        Edit Payment Details
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Payment Details for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Company:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="255"
                onChange={(e) => setCompany(e.currentTarget.value.toUpperCase())}
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
                value={currency}
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
              {currency === "GBP" ? "Account Number" : "IBAN"}:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="50"
                onChange={(e) => setIban(e.currentTarget.value.toUpperCase())}
                style={formControlStyle}
                value={iban}
              />
            </Col>
            <Form.Label column sm="2">
              {currency === "GBP" ? "Sort Code" : "Swift"}
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="50"
                onChange={(e) => setSwift(e.currentTarget.value.toUpperCase())}
                style={formControlStyle}
                value={swift}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare style={{ color: "#F3702D", fontSize: "1.5em", marginRight: "0.5em",}}/>
            Payment Details are used for payment orders in group schedules.
            {!iban || !swift ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }} >
                  <li>
                    {!iban ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Payment Details must include an IBAN.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!swift ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Payment Details must include a Swift code.
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
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
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
              UpdatePaymentDetails();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePaymentDetails;
