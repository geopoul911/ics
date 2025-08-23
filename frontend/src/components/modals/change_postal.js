// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_POSTAL =
  "http://localhost:8000/api/data_management/change_postal/";

function ChangePostal(props) {
  const [show, setShow] = useState(false);
  const [postal, setPostal] = useState(props.postal ? props.postal : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Postal = () => {
    axios({
      method: "post",
      url: CHANGE_POSTAL,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_postal: postal,
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
        title={"edit postal"}
        id={"edit_agent_postal"}
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
          <Modal.Title>Change postal for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={50}
            value={postal}
            className="form-control"
            onChange={(e) => setPostal(e.currentTarget.value.toUpperCase())}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Postal();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePostal;
