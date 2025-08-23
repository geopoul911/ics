// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_CHILD_AGE =
  "http://localhost:8000/api/data_management/change_child_age/";

function ChangeChildAge(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [childAge, setChildAge] = useState(0);

  const update_ChildAge = () => {
    axios({
      method: "post",
      url: CHANGE_CHILD_AGE,
      headers: headers,
      data: {
        contract_id: props.object_id,
        child_age: childAge,
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
        title={"edit contract's CHILD AGE"}
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
          <Modal.Title>Change Child Age for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            style={{ width: 80, display: "inline" }}
            type="number"
            className="form-control"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
          />
          {props.currency}
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
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_ChildAge();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeChildAge;
