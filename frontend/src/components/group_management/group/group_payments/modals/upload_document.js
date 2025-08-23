// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { CgDanger } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import axios from "axios";
import {
  Button,
} from "semantic-ui-react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const UPLOAD_DOCUMENT = "http://localhost:8000/api/groups/upload_payment_document/";

function UploadDocument(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [fileType, setFileType] = useState("No File");
  const [file, setFile] = React.useState();


  const uploadPaymentDocument = () => {
    const formData = new FormData();

    formData.append("refcode", props.refcode);
    formData.append("payment_id", props.payment_id);
    formData.append("doc_type", fileType);
    formData.append("file", file);

    axios({
      method: "post",
      url: UPLOAD_DOCUMENT,
      headers: headers,
      data: formData,
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
        title={"Edit Coach"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          setFileType("No File");
          setFile();
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
          <Modal.Title>Upload Document </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Upload Document:
            </Form.Label>
            <Col sm="10">
              <Button
                color={fileType === "proforma" ? "green" : ""}
                onClick={() => setFileType("proforma")}
              >
                Proforma
              </Button>
              <Button
                color={fileType === "invoice" ? "green" : ""}
                onClick={() => setFileType("invoice")}
              >
                Invoice
              </Button>
              <Form.Control
                type="file"
                style={{ marginTop: 20, marginBottom: 20 }}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </Col>
          </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <small className="mr-auto">
              <CgDanger
                style={{
                  color: "red",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Allowed extensions : .PDF .DOCX .DOC .TIF .TIFF .BMP .JPG .JPEG .PNG .ZIP .RAR
              <br />
              <CgDanger style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em",}}/>
              File's size should not exceed 20 megabytes of data
            </small>
            <Button color="red" onClick={handleClose}>
              Close
            </Button>
            <Button
              color="green"
              disabled={!file}
              onClick={() => {
                handleClose();
                uploadPaymentDocument();
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  );
}

export default UploadDocument;
