// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_DATE = "http://localhost:8000/api/groups/change_date/";

function ChangeDate(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [selectedDate, setSelectedDate] = useState();

  const updateDate = () => {
    axios({
      method: "post",
      url: CHANGE_DATE,
      headers: headers,
      data: {
        service_id: props.service_id,
        selected_date: moment(selectedDate).format("YYYY-MM-DD"),
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
        title={"edit date"}
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
          <Modal.Title>Change date for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="groupsPerPageSelect">Select date</label>
          <select
            className="form-control add_service_input"
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option selected disabled hidden>
              Choose from available dates
            </option>
            {props.is_loaded
              ? props.group.group_travelday.map((j, k) => (
                  <option key={k} value={j.date}>
                    {j.date}
                  </option>
                ))
              : ""}
          </select>
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
            Available dates come from group's schedule.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              setSelectedDate("");
              handleClose();
              updateDate();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeDate;
