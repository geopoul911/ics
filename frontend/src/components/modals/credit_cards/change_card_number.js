// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

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

let formControlStyle = {
  marginBottom: 10,
  width: "40%",
  display: "inline-block",
};

const CHANGE_CARD_NUMBER =
  "http://localhost:8000/api/data_management/change_card_number/";

const renderCreditCard = (str) => {
  return str.substring(0, 2) + "** **** **** " + str.substring(15, 19);
};

function ChangeCardNumber(props) {
  const [show, setShow] = useState(false);
  const [cardNumber, setCardNumber] = useState(
    props.card_number ? renderCreditCard(props.card_number) : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_CardNumber = () => {
    axios({
      method: "post",
      url: CHANGE_CARD_NUMBER,
      headers: headers,
      data: {
        credit_card_id: props.object_id,
        card_number: cardNumber,
      },
    })
      .then((res) => {
        props.update_state(res.data.credit_card);
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
      <FiEdit2
        title={"edit Credit Card's Number"}
        id={"edit_coach_name"}
        onClick={() => {
          handleShow();
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change card number for {renderCreditCard(props.object_name)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            maxLength={19}
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
            style={formControlStyle}
            value={cardNumber}
          />
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {cardNumber.length !== 19 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {cardNumber.length !== 19 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Credit Card Number Field.
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
            disabled={cardNumber.length !== 19}
            onClick={() => {
              handleClose();
              update_CardNumber();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeCardNumber;
