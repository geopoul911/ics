// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import TimePicker from "rc-time-picker";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const now = moment().hour(0).minute(0);

const CHANGE_START_TIME =
  "http://localhost:8000/api/data_management/change_start_time/";

function ChangeTime(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Time, setTime] = useState(new Date());

  const update_Time = () => {
    axios({
      method: "post",
      url: CHANGE_START_TIME,
      headers: headers,
      data: {
        service_id: props.service_id,
        start_time: moment(Time).format("hh:mm a"),
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
        title={"edit service's start_time"}
        id={"edit_service_name"}
        onClick={() => {
          handleShow();
          setTime("");
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change start_time for {props.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TimePicker
            showSecond={false}
            defaultValue={now}
            className="add_service_input"
            onChange={(e) => setTime(e)}
            format={"hh:mm a"}
            inputReadOnly
            clearIcon={true}
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
              update_Time();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeTime;
