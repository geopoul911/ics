// Built-ins
import { useState } from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { Col, Form, Row } from "react-bootstrap";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const SEND_ROOMING_LIST =
  "http://127.0.0.1:8000/api/groups/send_rooming_list_to_leader/";

function removeCommas(str) {
  return str.replace(",", "");
}

let form_control_style = {
  marginBottom: 10,
};

function SendRoomingListEmail(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendRoomingList = () => {
    axios({
      method: "post",
      url: SEND_ROOMING_LIST,
      headers: headers,
      data: {
        from: props.user_email,
        to: props.leader_emails,
        refcode: props.refcode,
      },
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: res.data.recipients.map((e) => e + " \n"),
        });
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
        style={{ margin: 10 }}
        onClick={handleShow}
        color="green"
        disabled={props.leader_emails.length === 0}
      >
        <AiOutlineMail style={{ marginBottom: 2, marginRight: 5 }} />
        Send Rooming list to group's leaders
      </Button>
      {props.leader_emails.length === 0 ? (
        <>
          <hr />
          <div style={{ color: "red", width: "100%", textAlign: "center" }}>
            Enter Group Leader(s) with valid email address to enable "Send
            Rooming List" button
          </div>
        </>
      ) : (
        ""
      )}
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Send Rooming List to Group Leader</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Send From :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="200"
                style={form_control_style}
                disabled
                value={props.user_email}
              />
            </Col>
            <Form.Label column sm="2">
              Send To :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="200"
                disabled
                style={form_control_style}
                value={removeCommas(
                  String(props.leader_emails.map((email) => email + "; "))
                )}
              />
            </Col>
          </Form.Group>
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
            Rooming List will be sent to Group Leader's email address.
          </small>

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={props.leader_emails.length === 0}
            onClick={() => {
              handleClose();
              sendRoomingList();
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SendRoomingListEmail;
