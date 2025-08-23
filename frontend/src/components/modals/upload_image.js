// Built-ins
import { useState } from "react";
import React from "react";

// Icons / Images
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import { Button, Icon } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// // Modules / Functions
// import { Button, Header, Icon, Modal } from "semantic-ui-react";
// import { Form } from "react-bootstrap";
// import axios from "axios";
// import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const UPLOAD_AGENT_IMAGE =
  "http://localhost:8000/api/data_management/upload_gallery_image/";

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

function AddObjectImage(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [file, setFile] = React.useState();
  const [description, setDescription] = React.useState("");

  const uploadNewGroupDocument = () => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("description", description);
    formData.append("object_id", props.object_id);
    formData.append("object_type", props.object_type);

    axios({
      method: "post",
      url: UPLOAD_AGENT_IMAGE + props.object_id,
      headers: headers,
      data: formData,
    })
      .then((res) => {
        props.remount(res);
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
        onClick={() => setShow(true)}
      >
        Upload new image
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload new image</Modal.Title>
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
            <Form.Label>Add image's Caption : </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              maxLength="63"
              onChange={(e) => setDescription(e.target.value.toUpperCase())}
            />
          </Form.Group>
          <small>
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            Allowed extensions : JPEG, JPG, PNG ,TIFF, TIF
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
                        Upload A File.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {description.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Description Field.
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

          <Button color="red" onClick={() => setShow(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            disabled={!file || description.length < 3}
            onClick={() => {
              setShow(false);
              setDescription("");
              setFile();
              uploadNewGroupDocument();
            }}
          >
            <Icon name="checkmark" /> Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddObjectImage;
