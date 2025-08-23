// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import DatePicker from "react-date-picker";
import moment from "moment";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_OPTION_DATE = "http://localhost:8000/api/groups/change_option_date/";

function ChangeOptionDate(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [optionDate, setOptionDate] = useState();

  const updateOptionDate = () => {
    props.updateIsLoaded();
    axios({
      method: "post",
      url: CHANGE_OPTION_DATE + props.group.refcode,
      headers: headers,
      data: {
        td_id: props.td_id,
        option_date: optionDate ? moment(optionDate).format("YYYY-MM-DD") : null,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
        props.updateIsLoaded();
      })
      .catch((e) => {
        props.updateIsLoaded();
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
        title={"Edit Option Date"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
        }}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Option Date for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginLeft: 20, marginTop: 20 }}>
            Select Option Date :
            <DatePicker
              wrapperClassName="datePicker"
              name="date"
              onChange={(e) => setOptionDate(e)}
              value={optionDate}
              format="dd/MM/yyyy"
              minDate={new Date()}
            />
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
              updateOptionDate();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeOptionDate;
