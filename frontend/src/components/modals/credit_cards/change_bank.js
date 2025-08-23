// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import alphaBankLogo from "../../../images/core/banks/alphabank.png";
import eurobank from "../../../images/core/banks/eurobank.png";
import piraeusLogo from "../../../images/core/banks/piraeus.png";
import nbgLogo from "../../../images/core/banks/nbg.png";
import metrobankLogo from "../../../images/core/banks/metrobank.png";
import hsbcLogo from "../../../images/core/banks/hsbc.png";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_BANK = "http://localhost:8000/api/data_management/change_bank/";

function ChangeBank(props) {
  const [show, setShow] = useState(false);
  const [bank, setBank] = useState(props.bank ? props.bank : "AB");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateBank = () => {
    axios({
      method: "post",
      url: CHANGE_BANK,
      headers: headers,
      data: {
        credit_card_id: props.object_id,
        bank: bank,
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
        title={"edit Credit Card's Bank"}
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
          <Modal.Title>Change bank for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              className="form-control"
              onChange={(e) => setBank(e.target.value)}
              style={{ marginBottom: 10, width: "40%" }}
              value={bank}
            >
              <option value="AB"> Alpha bank </option>
              <option value="EB"> Eurobank </option>
              <option value="PIR"> Piraeus</option>
              <option value="NBG"> NBG</option>
              <option value="HSBC"> HSBC</option>
              <option value="MB"> Metro bank</option>
            </select>
            {bank === "AB" ? (
              <img src={alphaBankLogo} alt="bank-icon" className="bank-icon" />
            ) : (
              ""
            )}
            {bank === "EB" ? (
              <img src={eurobank} alt="bank-icon" className="bank-icon" />
            ) : (
              ""
            )}
            {bank === "PIR" ? (
              <img src={piraeusLogo} alt="bank-icon" className="bank-icon" />
            ) : (
              ""
            )}
            {bank === "NBG" ? (
              <img src={nbgLogo} alt="bank-icon" className="bank-icon" />
            ) : (
              ""
            )}
            {bank === "MB" ? (
              <img src={metrobankLogo} alt="bank-icon" className="bank-icon" />
            ) : (
              ""
            )}
            {bank === "HSBC" ? (
              <img src={hsbcLogo} alt="bank-icon" className="bank-icon" />
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
              updateBank();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeBank;
