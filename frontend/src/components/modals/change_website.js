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

const CHANGE_EMAIL =
  "http://localhost:8000/api/data_management/change_website/";

function ChangeWebsite(props) {
  const [show, setShow] = useState(false);
  const [website, setWebsite] = useState(props.website ? props.website : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Website = () => {
    axios({
      method: "post",
      url: CHANGE_EMAIL,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_website: website,
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
        title={"edit website"}
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
          <Modal.Title>Change website for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={120}
            value={website}
            className="form-control"
            onChange={(e) => setWebsite(e.currentTarget.value.toLowerCase())}
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

export default ChangeWebsite;
