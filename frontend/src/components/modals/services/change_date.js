import React, { useState } from "react";
import { BsInfoSquare } from "react-icons/bs";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import moment from "moment";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_GROUP_DAYS = "http://localhost:8000/api/view/get_group_days/";
const CHANGE_DATE = "http://localhost:8000/api/data_management/change_date/";

function ChangeDate(props) {
  let [AllGroupDays, setAllGroupDays] = React.useState([]);

  const [selectedDate, setSelectedDate] = React.useState("");
  const handleSetSelectedDate = (e) => {
    setSelectedDate(e.target.value);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getGroupDays = (refcode) => {
    axios
      .get(GET_GROUP_DAYS, {
        headers: headers,
        params: {
          refcode: refcode,
        },
      })
      .then((res) => {
        setAllGroupDays(res.data.all_group_days);
      });
  };

  const update_Date = () => {
    axios({
      method: "post",
      url: CHANGE_DATE,
      headers: headers,
      data: {
        service_id: props.service_id,
        selected_td: selectedDate,
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
        title={"edit service's date"}
        id={"edit_service_name"}
        onClick={() => {
          handleShow();
          setSelectedDate("");
          getGroupDays(props.refcode);
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
          <Modal.Title>Change date for {props.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="groupsPerPageSelect">Select date</label>
          <select
            className="form-control add_service_input"
            onChange={(e) => handleSetSelectedDate(e)}
          >
            <option selected disabled hidden>
              Choose from available dates
            </option>
            {props.is_loaded
              ? AllGroupDays.map((j, k) => (
                  <option key={k} value={j.id}>
                    {moment(j.date).format("DD/MM/yyyy")}
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
            Available dates are fetched from Group's Schedule
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Date();
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
