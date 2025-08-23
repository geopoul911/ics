// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form, Col } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
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

const CHANGE_CAPACITY =
  "http://localhost:8000/api/data_management/change_capacity/";

function ChangeCapacity(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Capacity, setCapacity] = useState(
    props.capacity ? props.capacity : ""
  );

  const updateCapacity = () => {
    axios({
      method: "post",
      url: CHANGE_CAPACITY,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        capacity: Capacity,
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
        title={"edit capacity"}
        id={"edit_capacity"}
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
          <Modal.Title>Change location for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Capacity:
          </Form.Label>
          <Col sm="10">
            <input
              type="number"
              maxLength="3"
              className="form-control"
              style={{ width: 130, marginBottom: 20 }}
              value={Capacity}
              onChange={(e) =>
                setCapacity(
                  Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                )
              }
            ></input>
          </Col>
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
            Updating capacity will not change Lat/Lng
            {Capacity.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Capacity.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Capacity Field
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
            disabled={Capacity.length === 0}
            onClick={() => {
              setCapacity("");
              handleClose();
              updateCapacity();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeCapacity;
