// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";

// CSS
import "react-phone-number-input/style.css";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_TEL_DETAILS =
  "http://localhost:8000/api/data_management/change_tel_details/";

function ChangeTelDetails(props) {
  const [show, setShow] = useState(false);
  const [tel, setTel] = useState(props.telephone ? props.telephone : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Website = () => {
    axios({
      method: "post",
      url: CHANGE_TEL_DETAILS,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        tel: tel,
        tel_num: props.tel_num,
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

  return (
    <>
      <FiEdit2
        title={"edit Tel"}
        id={"edit_agent_website"}
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
            Change {props.tel_num} for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} style={{ margin: 2 }} className="mb-3">
            <Form.Label column sm="2">
              {props.tel_num}
            </Form.Label>
            <Col sm="10">
              <PhoneInput
                international
                maxLength={24}
                value={tel}
                countryCallingCodeEditable={false}
                defaultCountry="GR"
                onChange={setTel}
              />
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
              update_Website();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeTelDetails;
