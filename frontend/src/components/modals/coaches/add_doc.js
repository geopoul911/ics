// Built-ins
import { useState } from "react";
import React from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { CgDanger } from "react-icons/cg";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import DatePicker from "react-date-picker";
import Swal from "sweetalert2";
import moment from "moment";

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

const UPLOAD_DOCUMENT =
  "http://localhost:8000/api/data_management/upload_coach_document/";

let addDocumentIconStyle = {
  color: "green",
  fontSize: "1.7em",
  marginRight: "1em",
  float: "right",
};

function AddCoachDocument(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [file, setFile] = React.useState();
  const [expirationDate, setExpirationDate] = React.useState();

  const uploadNewCoachDocument = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append("file", file);
    formData.append("coach_id", props.coach_id);
    formData.append("type", props.type);
    formData.append(
      "expiration_date",
      moment(expirationDate).format("YYYY-MM-DD")
    );
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
        className="add_to_payments_icon"
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
          <Modal.Title>Add {props.type} document</Modal.Title>
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
          <label> Set document's expiration date </label>
          <Form.Group controlId="formFile" className="mb-3">
            <DatePicker
              clearIcon={null}
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e);
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
          <small className="mr-auto">
            {!expirationDate || !file ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!file ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Upload A File.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {!expirationDate ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Expiration Date Field.
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
            disabled={!expirationDate || !file}
            onClick={() => {
              handleClose();
              uploadNewCoachDocument();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCoachDocument;
