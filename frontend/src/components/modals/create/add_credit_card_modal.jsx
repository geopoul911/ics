// Built-ins
import { useState } from "react";

// CSS
import "react-phone-number-input/style.css";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";

import { AiOutlineWarning } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

import visaLogo from "../../../images/core/banks/visa.jpg";
import mastercardLogo from "../../../images/core/banks/mastercard.jpg";
import americanExpressLogo from "../../../images/core/banks/american_express.jpg";
import alphaBankLogo from "../../../images/core/banks/alphabank.png";
import eurobank from "../../../images/core/banks/eurobank.png";
import piraeusLogo from "../../../images/core/banks/piraeus.png";
import nbgLogo from "../../../images/core/banks/nbg.png";
import metrobankLogo from "../../../images/core/banks/metrobank.png";
import hsbcLogo from "../../../images/core/banks/hsbc.png";

// Global Variables
import { headers } from "../../global_vars";

import "react-calendar/dist/Calendar.css";

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

const ADD_CREDIT_CARD = "http://localhost:8000/api/view/add_credit_card/";

function AddCreditCardModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [cardNumber, setCardNumber] = useState("");
  const [bank, setBank] = useState("AB");
  const [cardType, setCardType] = useState("VS");

  const createNewCreditCard = () => {
    axios({
      method: "post",
      url: ADD_CREDIT_CARD,
      headers: headers,
      data: {
        card_number: cardNumber,
        bank: bank,
        card_type: cardType,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/credit_card/" + res.data.model.id;
        } else {
          props.set_credit_card(cardNumber);
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
          setCardNumber("");
          setBank("AB");
          setCardType("VS");
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Credit Card
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Credit Card </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label column sm="2">
                    Card Number:
                  </Form.Label>
                  <Form.Control
                    maxLength={19}
                    style={{ width: 400 }}
                    onChange={(e) => {
                      // Remove existing spaces and non-numeric characters
                      const inputWithoutSpaces = e.currentTarget.value.replace(
                        /\s/g,
                        ""
                      );
                      const inputFormatted = inputWithoutSpaces
                        .replace(/\D/g, "") // Remove non-numeric characters
                        .replace(/(\d{4})(?=\d)/g, "$1 "); // Add a space after every 4 characters except the last group
                      setCardNumber(inputFormatted);
                    }}
                    value={cardNumber}
                  />
                  <Form.Label column sm="2">
                    Card Type:
                  </Form.Label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <select
                      className="form-control"
                      onChange={(e) => setCardType(e.target.value)}
                      style={{ marginBottom: 10, width: "40%" }}
                    >
                      <option value="VS"> Visa </option>
                      <option value="MC"> Mastercard </option>
                      <option value="AE"> American Express</option>
                      <option value="OT"> Other</option>
                    </select>
                    {cardType === "VS" ? (
                      <img
                        src={visaLogo}
                        alt="bank-icon"
                        className="bank-icon"
                        style={{ maxHeight: 40 }}
                      />
                    ) : (
                      ""
                    )}
                    {cardType === "MC" ? (
                      <img
                        src={mastercardLogo}
                        alt="bank-icon"
                        className="bank-icon"
                        style={{ maxHeight: 40 }}
                      />
                    ) : (
                      ""
                    )}
                    {cardType === "AE" ? (
                      <img
                        src={americanExpressLogo}
                        alt="bank-icon"
                        className="bank-icon"
                        style={{ maxHeight: 40 }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <Form.Label column sm="2">
                    Bank:
                  </Form.Label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <select
                      className="form-control"
                      onChange={(e) => setBank(e.target.value)}
                      style={{ marginBottom: 10, width: "40%" }}
                    >
                      <option value="AB"> Alpha bank </option>
                      <option value="EB"> Eurobank </option>
                      <option value="PIR"> Piraeus</option>
                      <option value="NBG"> NBG</option>
                      <option value="HSBC"> HSBC</option>
                      <option value="MB"> Metro bank</option>
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
                      <img
                        src={eurobank}
                        alt="bank-icon"
                        className="bank-icon"
                      />
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
                      <img
                        src={nbgLogo}
                        alt="bank-icon"
                        className="bank-icon"
                      />
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
                      <img
                        src={hsbcLogo}
                        alt="bank-icon"
                        className="bank-icon"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </Form.Group>
              </Form>
            </Col>
          </Row>
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
            All fields except Tel2 and Tel3 are required to create a credit
            card.
            {cardNumber.length !== 19 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {cardNumber.length !== 19 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The Card
                        Number Field.
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
              createNewCreditCard();
            }}
            disabled={cardNumber.length !== 19}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCreditCardModal;
