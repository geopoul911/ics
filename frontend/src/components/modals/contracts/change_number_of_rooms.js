// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const fullTextRoomTypes = {
  SGL: "Single",
  DBL: "Double",
  TWIN: "Twin",
  TRPL: "Triple",
  Quad: "Quadruple",
};

const CHANGE_NUMBER_OF_ROOMS =
  "http://localhost:8000/api/data_management/change_number_of_rooms/";

function ChangeNumberOfRooms(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [numberOfRooms, setNumberOfRooms] = useState(0);

  const update_NumberOfRooms = () => {
    axios({
      method: "post",
      url: CHANGE_NUMBER_OF_ROOMS,
      headers: headers,
      data: {
        contract_id: props.object_id,
        number_of_rooms: numberOfRooms,
        room_type: props.room_type,
        period: props.period,
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
        title={"edit contract's Number Of Rooms"}
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
            Change {props.room_type} for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Total Number Of {fullTextRoomTypes[props.room_type]} Rooms for period:
          {props.period}
          <br />
          <input
            style={{ width: 80, display: "inline" }}
            type="number"
            className="form-control"
            value={numberOfRooms}
            onChange={(e) => setNumberOfRooms(e.target.value)}
          />
          {props.currency}
        </Modal.Body>
        <Modal.Footer>
          <label className="mr-auto" style={{ color: "red" }}>
            <AiOutlineWarning
              style={{
                color: "red",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            Updating Room Values will remove previous period's Rooms
            <br />
            <AiOutlineWarning
              style={{
                color: "red",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            If period ({props.period}) has used
            {fullTextRoomTypes[props.room_type]} rooms, this function will fail.
          </label>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_NumberOfRooms();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeNumberOfRooms;
