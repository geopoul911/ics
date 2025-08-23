// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_EMAIL =
  "http://localhost:8000/api/data_management/change_hotel_number_of_rooms/";

function ChangeNumberOfRooms(props) {
  const [show, setShow] = useState(false);
  const [numberOfRooms, setNumberOfRooms] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_NumberOfRooms = () => {
    axios({
      method: "post",
      url: CHANGE_EMAIL,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_number_of_rooms: numberOfRooms,
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

  const handleChange = (e) => {
    let value = e.target.value;
    // Parse the input value as an integer
    value = parseInt(value);

    // Ensure the value is within the range [0, 100]
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > 999) {
      value = 999;
    }

    // Update the state with the new value
    setNumberOfRooms(value.toString());
  };

  return (
    <>
      <FiEdit2
        title={"edit number of rooms"}
        id={"edit_agent_number_of_rooms"}
        onClick={() => {
          handleShow();
          setNumberOfRooms(0);
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
            Change Number Of Rooms for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Number Of Rooms:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Form.Control
                type="number"
                value={numberOfRooms}
                style={{ width: 300 }}
                onChange={handleChange}
                max={999}
                min={0}
              />
            </Col>
          </Form.Group>
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
            Number Of Rooms's values should be from 0 to 999.
          </small>
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
