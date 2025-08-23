// Built-ins
import { useState } from "react";

// Modules / Functions
import axios from "axios";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { TextArea } from "semantic-ui-react";
import Swal from "sweetalert2";

// Icons / Images
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Global Variables
import { headers } from "../global_vars";

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

function getObjectId() {
  return window.location.pathname.split("/")[3];
}

const CHANGE_IMAGE_CAPTION =
  "http://localhost:8000/api/data_management/change_gallery_image_caption/";

function ChangeImageCaption(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [caption, setCaption] = useState(props.caption ? props.caption : "");
  const updateImageCaption = () => {
    axios({
      method: "post",
      url: CHANGE_IMAGE_CAPTION + getObjectId(),
      headers: headers,
      data: {
        caption: caption,
        object_type: props.object_type,
        object_id: props.object_id,
        image_id: props.image_id,
      },
    })
      .then((res) => {
        props.remount(res.data.object);
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
        onClick={() => {
          handleShow();
        }}
      >
        Change Caption
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Change image's Caption </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextArea
            onChange={(e) => setCaption(e.target.value.toUpperCase())}
            rows={5}
            cols={40}
            value={caption}
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {caption.length < 3 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {caption.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Caption Field
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
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
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
            disabled={caption.length < 3}
            onClick={() => {
              handleClose();
              updateImageCaption();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeImageCaption;
