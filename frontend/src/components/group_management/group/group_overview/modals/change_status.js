// Built-ins
import { useState } from "react";
import { BsInfoSquare } from "react-icons/bs";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_STATUS = "http://localhost:8000/api/groups/change_status/";

function ChangeStatus(props) {
  // Status is required and can only be Confirmed or Cancelled
  // 5 = Confirmed
  // 4 = Cancelled
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("5"); // By default , state's status is confirmed
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Status = () => {
    axios({
      method: "post",
      url: CHANGE_STATUS + props.group.refcode,
      headers: headers,
      data: {
        status: status,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
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
        title={"edit status"}
        id={"edit_status"}
        onClick={handleShow}
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
          <Modal.Title>Change status for {props.group.refcode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <select
              required
              style={{ width: "50%" }}
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.currentTarget.value)}
            >
              <option value="5"> Confirmed </option>
              <option value="4"> Cancelled </option>
            </select>
          </ListGroup>
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
            Cancelled groups will not be considered on reporting
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
