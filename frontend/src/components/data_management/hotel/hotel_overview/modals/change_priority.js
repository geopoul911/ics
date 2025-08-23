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
  "http://localhost:8000/api/data_management/change_priority/";

function ChangePriority(props) {
  const [show, setShow] = useState(false);
  const [priority, setPriority] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Priority = () => {
    axios({
      method: "post",
      url: CHANGE_EMAIL,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_priority: priority,
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
    } else if (value > 100) {
      value = 100;
    }

    // Update the state with the new value
    setPriority(value.toString());
  };

  return (
    <>
      <FiEdit2
        title={"edit priority"}
        id={"edit_agent_priority"}
        onClick={() => {
          handleShow();
          setPriority(0);
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
          <Modal.Title>Change priority for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Priority:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <Form.Control
                type="number"
                value={priority}
                style={{ width: 300 }}
                onChange={handleChange}
                max={100}
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
            Priority's values should be from 0 to 100.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Priority();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePriority;
