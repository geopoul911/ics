// Built-ins
import { useState } from "react";
import React from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const UPLOAD_DOCUMENT =
  "http://localhost:8000/api/data_management/upload_contract_document/";

let addDocumentIconStyle = {
  color: "green",
  fontSize: "1.7em",
  marginRight: "1em",
  float: "right",
};

function AddContractDocument(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [file, setFile] = React.useState();

  const uploadNewContractDocument = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append("file", file);
    formData.append("contract_id", props.contract_id);

    axios({
      method: "post",
      url: UPLOAD_DOCUMENT,
      headers: headers,
      data: formData,
    })
      .then((res) => {
        props.refresh(res);
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
      <BiPlus
        title="add document"
        className="contract_doc_icon"
        style={addDocumentIconStyle}
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
          <Modal.Title>Add Contract Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </Form.Group>
          <hr />
          <small>
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            Allowed extensions : .PDF .DOCX .DOC .TIF .TIFF .BMP .JPG .JPEG .PNG
            .ZIP .RAR
            <hr />
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            File's size should not exceed 20 megabytes of data
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={!file}
            onClick={() => {
              handleClose();
              uploadNewContractDocument();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddContractDocument;
