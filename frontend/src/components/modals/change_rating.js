// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_RATING =
  "http://localhost:8000/api/data_management/change_rating/";

let rating_options = {
  "1 Star": 10,
  "2 Stars": 20,
  "3 Stars": 30,
  "4 Stars": 40,
  "4 Stars plus": 45,
  "5 Stars": 50,
  "5 Stars plus": 55,
};

function ChangeRating(props) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(10);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_LatLng = () => {
    axios({
      method: "post",
      url: CHANGE_RATING,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        rating: rating,
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
        title={"edit rating"}
        id={"edit_hotel_rating"}
        onClick={() => {
          handleShow();
          setRating(10);
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
          <Modal.Title>Change rating for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Rating:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                style={{ width: "93%", marginBottom: 10 }}
                onChange={(e) => setRating(e.target.value)}
              >
                {Object.keys(rating_options).map((e) => (
                  <option value={rating_options[e]}>{e}</option>
                ))}
              </select>
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
            Rating can be used as a filter
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_LatLng();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeRating;
