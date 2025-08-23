import React, { useState } from "react";
// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_TYPE =
  "http://localhost:8000/api/data_management/change_template_type/";

let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

function ChangeType(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [type, setType] = useState(props.tt_type ? props.tt_type : "AI");

  const update_Type = () => {
    axios({
      method: "post",
      url: CHANGE_TYPE,
      headers: headers,
      data: {
        text_template_id: props.object_id,
        type: type,
      },
    })
      .then((res) => {
        props.update_state(res.data.text_template);
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
        title={"edit text_template's type"}
        id={"edit_text_template_name"}
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
            Change type for Template with id : {props.object_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Type:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setType(e.target.value)}
                style={formControlStyle}
                value={type}
              >
                <option value={"AI"}> Additional Information </option>
                <option value={"I"}> Included </option>
                <option value={"NI"}> Not Included </option>
                <option value={"N"}> Notes </option>
                <option value={"EP"}> Entry Price </option>
                <option value={"PC"}> Payment & Cancellation Policy </option>
                <option value={"CP"}> Children Policy </option>
                <option value={"EL"}> Epilogue </option>
              </select>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Type();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeType;
