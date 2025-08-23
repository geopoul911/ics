// Built-ins
import React, { useState } from "react";

// Icons / Images
import { BiMailSend } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { Col, Form, Row, Modal } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";

// Modules / Functions
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const SEND_PROFORMA = "http://localhost:8000/api/groups/send_proforma/";

let form_control_style = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

let preBody = `
    <div class="container">
      <div class="header">
          <h2>Proforma Invoice</h2>
      </div>
      <div>
        <p>Dear Partner,</p>
        <p>We are pleased to provide you with the attached proforma invoice for the services/products as requested.</p>
        <p>Please review the details of the invoice and let us know if you have any questions or require any further information.</p>
        <p>To ensure timely processing, we kindly ask that you make the payment by the specified due date.</p>
        <p>The bank details for the transfer are included in the proforma invoice.</p>
        <p>Please note that <span class="highlight">100% of the total amount</span> is payable before the due date to confirm your order/service.</p>
        <p>If you have already made the payment, please disregard this message. Otherwise, please process the payment at your earliest convenience.</p>
        <p>Thank you for your time. We look forward to serving you.</p>
      </div>
      <br/>
      <br/>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Cosmoplan International Travel. All rights reserved.</p>
      </div>
  </div>
`


const SendProforma = (props) => {
  const [subject, setSubject] = React.useState("Cosmoplan Proforma Invoice");
  const [recipients, setRecipients] = React.useState(props.recipient ? props.recipient : "");
  const [file, setFile] = React.useState();
  const [body, setBody] = React.useState(preBody);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [messageVisible, setMessageVisible] = useState(false);

  const send = () => {
    const formData = new FormData();
    formData.append("refcode", props.refcode);
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("recipients", recipients);
    formData.append("body", body);
    formData.append("from", localStorage.user_email);

    axios({
      method: "post",
      url: SEND_PROFORMA,
      headers: headers,
      data: formData,
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "Email Successfully Sent to : ",
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

  const handleFocus = () => {
    setMessageVisible(true);
  };

  const handleBlur = () => {
    setMessageVisible(false);
  };

  return (
    <>
      <Button
        color="green"
        onClick={() => { handleShow(); }}
      >
        <BiMailSend /> Send Proforma By Email
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select the recipients to send the email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              From :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                disabled={true}
                style={form_control_style}
                value={localStorage.user_email}
              />
            </Col>
            <Form.Label column sm="2">
              To :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={form_control_style}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => {
                  setRecipients(e.target.value);
                }}
                value={recipients}
              />
              {messageVisible && (
                <p style={{ color: "red" }}>
                  Separate email addresses with a ";" otherwise they will not be
                  included in the recipients list.
                </p>
              )}
            </Col>
            <Form.Label column sm="2">
              Subject :
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={form_control_style}
                maxLength="200"
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                value={subject}
              />
            </Col>
            <Form.Label column sm="2">
              Attached :
            </Form.Label>
            <Col sm="10">
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  style={form_control_style}
                  maxLength="200"
                  disabled
                  value={props.fileName}
                />
              </Form.Group>
            </Col>
            <Form.Label column sm="2">
              Email Body :
            </Form.Label>
            <Col sm="10" style={{ maxWidth: 1000 }}>
              <Editor
                apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
                value={body}
                onEditorChange={(e) => {
                  setBody(e);
                }}
                init={{
                  height: 400,
                  menubar: false,
                  skin: "snow",
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            Your email will be included in the recipients list.
          </small>
          <Button
            color="red"
            onClick={() => {
              handleClose();
              setSubject();
              setFile();
              setBody();
            }}
          >
            <ImCross /> Cancel
          </Button>
          <Button
            color="green"
            disabled={recipients.length === 0}
            onClick={() => {
              handleClose();
              send();
            }}
          >
            <BiMailSend /> Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendProforma;
