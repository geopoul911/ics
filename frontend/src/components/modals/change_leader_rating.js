// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_RATING =
  "http://localhost:8000/api/data_management/change_rating/";

// Modal's content
function ChangeRating(props) {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState("G");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Rating = () => {
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
        title={"edit group_leader's rating"}
        id={"edit_group_leader_rating"}
        onClick={() => {
          handleShow();
          setRating("G");
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
          <Modal.Title>Change rating for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Rating
          </Form.Label>
          <select
            className="form-control"
            style={{ width: "74%", marginLeft: 15 }}
            onChange={(e) => {
              setRating(e.target.value);
            }}
          >
            <option value="G"> Good </option>
            <option value="Y"> Medium </option>
            <option value="R"> Bad </option>
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
            Group Leader's rating can be used as a filter
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Rating();
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
