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
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_ENABLED =
  "http://localhost:8000/api/data_management/change_enabled/";

function ChangeEnabled(props) {
  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState("True");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Enabled = () => {
    axios({
      method: "post",
      url: CHANGE_ENABLED,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_name: props.object_name, // used for airports.
        object_type: props.object_type,
        enabled: enabled,
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
        title={"edit enabled status"}
        id={"edit_airline_abbreviation"}
        onClick={() => {
          handleShow();
          setEnabled("True");
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
            Change enabled status for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <select
              required
              style={{ width: "25%" }}
              className="form-control"
              value={enabled}
              onChange={(e) => setEnabled(e.currentTarget.value)}
            >
              <option value="True"> Enabled </option>
              <option value="False"> Disabled </option>
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
            Disabled Entries will not be able to be used.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Enabled();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeEnabled;
