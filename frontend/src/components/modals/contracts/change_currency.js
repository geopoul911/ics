// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_CURRENCY =
  "http://localhost:8000/api/data_management/change_currency/";

function ChangeCurrency(props) {
  const [show, setShow] = useState(false);
  const [currency, setCurrency] = useState("EUR");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Currency = () => {
    axios({
      method: "post",
      url: CHANGE_CURRENCY,
      headers: headers,
      data: {
        contract_id: props.object_id,
        currency: currency,
      },
    })
      .then((res) => {
        props.update_state(res.data.contract);
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
        title={"edit contract's currency"}
        id={"edit_contract_name"}
        onClick={() => {
          handleShow();
          setCurrency("EUR");
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
          <Modal.Title>Change currency for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            style={{ width: 300 }}
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
            Contract's currency dropdown list includes the 10 most common
            currencies in the world.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Currency();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeCurrency;
