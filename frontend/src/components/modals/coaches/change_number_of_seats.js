// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const CHANGE_NUMBER_OF_SEATS =
  "http://localhost:8000/api/data_management/change_number_of_seats/";

function ChangeNumberOfSeats(props) {
  const [show, setShow] = useState(false);
  const [number_of_passenger_seats, setNumberOfPassengerSeats] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_NumberOfSeats = () => {
    axios({
      method: "post",
      url: CHANGE_NUMBER_OF_SEATS,
      headers: headers,
      data: {
        coach_id: props.coach_id,
        number_of_seats: number_of_passenger_seats,
      },
    })
      .then((res) => {
        props.update_state(res.data.coach);
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
        title={"edit coach's number of seats"}
        id={"edit_coach_name"}
        onClick={() => {
          handleShow();
          setNumberOfPassengerSeats(0);
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
          <Modal.Title>Change number of seats for {props.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item>
              <label>Number of passenger seats : </label>
              <input
                type="number"
                style={{ marginLeft: 35 }}
                id="rest_of_code_input"
                required
                value={number_of_passenger_seats}
                className="form-control"
                onInput={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value))
                    .toString()
                    .slice(0, 2);
                }}
                onChange={(e) =>
                  setNumberOfPassengerSeats(e.currentTarget.value)
                }
              ></input>
            </ListGroup.Item>
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
            Passenger seats max value is 99
            {number_of_passenger_seats === 0 ||
            number_of_passenger_seats === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {number_of_passenger_seats === 0 ||
                    number_of_passenger_seats === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Passenger Seats Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} />
                    Validated
                  </li>
                </ul>
              </>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={
              number_of_passenger_seats === 0 ||
              number_of_passenger_seats === ""
            }
            onClick={() => {
              handleClose();
              update_NumberOfSeats();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeNumberOfSeats;
