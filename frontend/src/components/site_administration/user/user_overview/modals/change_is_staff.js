// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_IS_STAFF = "http://localhost:8000/api/site_admin/change_is_staff/";

function ChangeIsStaff(props) {
  const [show, setShow] = useState(false);
  const [value, setStatus] = useState("true");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Status = () => {
    axios({
      method: "post",
      url: CHANGE_IS_STAFF,
      headers: headers,
      data: {
        user_id: props.user_id,
        value: value,
      },
    })
      .then((res) => {
        props.update_state(res.data.user);
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
        title={"edit value"}
        id={"edit_value"}
        onClick={handleShow}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Include {props.name} to staff?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <select
              required
              style={{ width: "25%" }}
              className="form-control"
              value={value}
              onChange={(e) => setStatus(e.currentTarget.value)}
            >
              <option value="true"> Yes </option>
              <option value="false"> No </option>
            </select>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare
              style={{
                color: "#F3702D",
                fontSize: "1.2em",
                marginRight: "0.5em",
              }}
            />
            Staff are user who are employees of Cosmoplan.
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

export default ChangeIsStaff;
