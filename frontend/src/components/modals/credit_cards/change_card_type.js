// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import visaLogo from "../../../images/core/banks/visa.jpg";
import mastercardLogo from "../../../images/core/banks/mastercard.jpg";
import americanExpressLogo from "../../../images/core/banks/american_express.jpg";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_CARD_TYPE =
  "http://localhost:8000/api/data_management/change_card_type/";

function ChangeBodyType(props) {
  const [show, setShow] = useState(false);
  const [cardType, setCardType] = useState(
    props.card_type ? props.card_type : "VS"
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_CardType = () => {
    axios({
      method: "post",
      url: CHANGE_CARD_TYPE,
      headers: headers,
      data: {
        credit_card_id: props.object_id,
        card_type: cardType,
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
        title={"edit Credit Card's Type"}
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
          <Modal.Title>Change card type for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              className="form-control"
              onChange={(e) => setCardType(e.target.value)}
              style={{ marginBottom: 10, width: "40%" }}
              value={cardType}
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
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_CardType();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeBodyType;
