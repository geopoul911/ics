// Built-ins
import { useState } from "react";
import React from "react";

// Icons / Images
import { Form } from "react-bootstrap";
import { CgDanger } from "react-icons/cg";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

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

const ADD_DOCUMENT = "http://localhost:8000/api/groups/upload_group_document/";

const HEADERS = {
  "Content-type": "multipart/form-data",
  "User-Token": localStorage.userToken,
};

function getRefcode(pathname) {
  return pathname.split("/")[3];
}

function AddGroupDocument(props) {
  const [description, setDescription] = React.useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [file, setFile] = React.useState();

  const uploadNewGroupDocument = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append("file", file);
    formData.append("description", description);
    axios({
      method: "post",
      url: ADD_DOCUMENT + getRefcode(window.location.pathname),
      headers: HEADERS,
      data: formData,
    })
      .then((res) => {
        props.update_state(res.data.model);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Group document has been successfully uploaded",
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
        color="green"
        style={{ margin: 10 }}
        onClick={() => {
          handleShow();
        }}
      >
        Upload new file
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add a new document for {getRefcode(window.location.pathname)}
          </Modal.Title>
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
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Add document's description : </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength="255"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <small>
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            Allowed extensions :
            <hr /> .PDF .XLSX .XLSM .XLSX .DOCX .DOC .TIF .TIFF .BMP .JPG .JPEG
            .PNG .CSV .DOT .DOTX .MP3 .MP4 .PPTX .ZIP .RAR .TXT .WAV .FLV
            <hr />
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            File's size should not exceed 20 megabytes of data
          </small>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!file || description.length < 3 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!file ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Upload a file.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {description.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill the file's description field
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
            disabled={!file || description.length < 3}
            onClick={() => {
              handleClose(false);
              setDescription("");
              setFile();
              uploadNewGroupDocument();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddGroupDocument;
