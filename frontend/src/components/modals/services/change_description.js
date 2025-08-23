// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_DESCRIPTION =
  "http://localhost:8000/api/data_management/change_description/";

function ChangeDescription(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [description, setDescription] = useState("");

  const update_Description = () => {
    axios({
      method: "post",
      url: CHANGE_DESCRIPTION,
      headers: headers,
      data: {
        service_id: props.service_id,
        description: description,
      },
    })
      .then((res) => {
        props.update_state(res.data.service);
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
        title={"edit service's description"}
        id={"edit_service_name"}
        onClick={() => {
          handleShow();
          setDescription("");
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
          <Modal.Title>Change description for {props.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label style={{ paddingTop: 25 }}> Add Service description </label>
            <textarea
              className="add_service_input"
              rows={4}
              cols={50}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Description();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeDescription;
