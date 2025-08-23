// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import DatePicker from "react-date-picker";
import moment from "moment";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_EMAIL =
  "http://localhost:8000/api/data_management/change_date_of_birth/";

function ChangeDateOfBirth(props) {
  const [show, setShow] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    props.date_of_birth ? new Date(props.date_of_birth) : new Date()
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_DateOfBirth = () => {
    axios({
      method: "post",
      url: CHANGE_EMAIL,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_date_of_birth: moment(dateOfBirth).format("YYYY-MM-DD"),
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
        title={"edit email"}
        id={"edit_agent_email"}
        onClick={() => {
          handleShow();
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change date of birth for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePicker
            clearIcon={null}
            value={dateOfBirth}
            format="dd/MM/yyyy"
            onChange={(e) => {
              setDateOfBirth(e);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_DateOfBirth();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeDateOfBirth;
