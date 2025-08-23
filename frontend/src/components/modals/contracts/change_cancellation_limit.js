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

const CHANGE_CANCELLATION_LIMIT =
  "http://localhost:8000/api/data_management/change_cancellation_limit/";

function ChangeCancellationLimit(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [cancellationLimit, setCancellationLimit] = useState(0);

  const update_CancellationLimit = () => {
    axios({
      method: "post",
      url: CHANGE_CANCELLATION_LIMIT,
      headers: headers,
      data: {
        contract_id: props.object_id,
        cancellation_limit: cancellationLimit,
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
        title={"edit contract's Cancellation Limit"}
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
          <Modal.Title>
            Change Cancellation Limit for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            style={{ width: 60, display: "inline" }}
            type="number"
            className="form-control"
            value={cancellationLimit}
            onChange={(e) => setCancellationLimit(e.target.value)}
          />
          Days
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
              update_CancellationLimit();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeCancellationLimit;
