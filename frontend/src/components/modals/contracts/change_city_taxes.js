// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_STATUS =
  "http://localhost:8000/api/data_management/change_status/";

function ChangeStatus(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [status, setStatus] = useState(true);

  const update_Status = () => {
    axios({
      method: "post",
      url: CHANGE_STATUS,
      headers: headers,
      data: {
        contract_id: props.object_id,
        status: status,
      },
    })
      .then((res) => {
        props.update_state(res.data.contract);
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
        title={"edit contract's status"}
        id={"edit_contract_name"}
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
          <Modal.Title>Change status for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            style={{ marginTop: 6 }}
            checked={status}
            onChange={() => setStatus(!status)}
            label="Enabled"
          />
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare
              style={{
                color: "#F3702D",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            Disabling a Contract will also affect the availabillities of the
            rooms.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Status();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeStatus;
