// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form, Col } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
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

const CHANGE_PRICE = "http://localhost:8000/api/data_management/change_menu_price/";

function ChangePrice(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [price, setPrice] = useState(props.price ? props.price : "");
  const [currency, setCurrency] = useState("EUR");

  const updatePrice = () => {
    axios({
      method: "post",
      url: CHANGE_PRICE,
      headers: headers,
      data: {
        menu_id: props.object_id,
        currency: currency,
        price: price,
      },
    })
      .then((res) => {
        props.update_state(res.data.object);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const handleBlur = (e) => {
    let value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      value = value.toFixed(2);
      setPrice(value);
    } else {
      setPrice("");
    }
  };

  return (
    <>
      <FiEdit2
        title={"edit price"}
        style={{
          height: 20,
          width: 20,
          marginLeft: 10,
          color: '#797979',
        }}
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
          <Modal.Title>Change Menu's Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            Price:
          </Form.Label>
          <Col sm="10">
          <input
            style={{ width: 200, marginBottom: 10 }}
            type="text"
            value={price}
            onBlur={handleBlur}
            onInput={(e) => {
              // Allow only numbers and up to 2 decimal places
              e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
              e.target.value = e.target.value.replace(/(\.\d{2}).*$/, "$1"); // Keep only up to 2 decimal places
            }}
            className="form-control"
            onChange={(e) => setPrice(e.currentTarget.value)}
          />
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {price.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {price.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Price Field
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
            disabled={price.length === 0}
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
