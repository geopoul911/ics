// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { DateRange } from "react-date-range";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;
function getRefcode() {
  return window.location.pathname.split("/")[3];
}

const ADD_TRAVELDAY = "http://localhost:8000/api/groups/add_new_travelday/";

// Modal that gets a date from the user and adds travelday to the group
// the modal's trigger is only visible if there are no traveldays
function AddFirstTravelday(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const createNewTD = () => {
    props.updateIsLoaded();
    axios({
      method: "post",
      url: ADD_TRAVELDAY + getRefcode(window.location.pathname),
      headers: headers,
      data: {
        type: "Group",
        start_date: moment(state[0]["startDate"]).format("DD-MM-YYYY"),
        end_date: moment(state[0]["endDate"]).format("DD-MM-YYYY"),
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

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <>
      <Button color="green" onClick={handleShow} style={{ margin: 10 }}>
        Create Group's Schedule
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select group's start/end dates</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginLeft: "12%" }}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
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
            Arrival / Departure Dates
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewTD();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddFirstTravelday;
