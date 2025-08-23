// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

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

const UPDATE_AIRPORT_DISTANCE =
  "http://localhost:8000/api/data_management/update_airport_distance/";

function ChangeAirportDistance(props) {
  const [show, setShow] = useState(false);
  const [distance, setDistance] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const update_Distance = () => {
    axios({
      method: "post",
      url: UPDATE_AIRPORT_DISTANCE,
      headers: headers,
      data: {
        src_id: props.src_id,
        dst_id: props.dst_id,
        distance: distance,
      },
    })
      .then((res) => {
        props.show_report(res.data);
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
        title={"edit airport's distance"}
        onClick={() => {
          handleShow();
          setDistance("");
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
            Update Airport's Distance From {props.src_id} To {props.dst_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              {props.src_id} {"--->"} {props.dst_id}
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="number"
                onChange={(e) => {
                  setDistance(e.target.value);
                }}
                value={distance}
                onInput={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value))
                    .toString()
                    .slice(0, 5);
                }}
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
            Distance is calculated in kilometers ( KM )
            {!distance ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!distance ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Add Distance between Airports
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
            disabled={!distance}
            onClick={() => {
              handleClose();
              update_Distance();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeAirportDistance;
