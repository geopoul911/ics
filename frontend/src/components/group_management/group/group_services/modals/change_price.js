// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, Col, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PRICE = "http://localhost:8000/api/groups/change_price/";

function ChangePrice(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [price, setPrice] = useState(props.price);
  const [currency, setCurrency] = useState("EUR");

  const updatePrice = () => {
    axios({
      method: "post",
      url: CHANGE_PRICE,
      headers: headers,
      data: {
        service_id: props.service_id,
        price: price,
        currency: currency,
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
      <FiEdit2
        title={"edit price"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
        }}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change price for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Add Price:
          </Form.Label>
          <Col sm="10">
            <input
              style={{ width: 200 }}
              type="text"
              value={price}
              onInput={(e) => {
                // Allow only numbers and up to 2 decimal places
                e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                e.target.value = e.target.value.replace(/(\.\d{2}).*$/, "$1"); // Keep only up to 2 decimal places
              }}
              className="form-control"
              onChange={(e) => setPrice(e.currentTarget.value)}
            />
          </Col>
          <Form.Label column sm="2">
            Add Currency:
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
            Price is an integer field with max value of 99999.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              setPrice("");
              handleClose();
              updatePrice();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePrice;
