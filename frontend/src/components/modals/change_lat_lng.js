// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import { BsInfoSquare } from "react-icons/bs";
import Swal from "sweetalert2";

// Global Variables
import { headers, isValidLatLng } from "../global_vars";

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

const CHANGE_LAT_LNG =
  "http://localhost:8000/api/data_management/change_latlng/";

function ChangeLatLng(props) {
  const [show, setShow] = useState(false);
  const [latlng, setLatLng] = useState(props.lat && props.lng ? props.lat + ", " + props.lng : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_LatLng = () => {
    axios({
      method: "post",
      url: CHANGE_LAT_LNG,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        lat_lng: latlng,
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
        title={"edit lat / lng"}
        id={"edit_airport_latlng"}
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
          <Modal.Title>Change lat / lng for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Lat / Lng
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                maxLength="80"
                placeholder="37.984035, 23.728024"
                onChange={(e) => {
                  setLatLng(e.target.value);
                }}
                value={latlng}
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
            Updating Lat/Lng will update map's pin location
            {!isValidLatLng(latlng) ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Lat/Lng Field.
                    </>
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
            disabled={!isValidLatLng(latlng)}
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

export default ChangeLatLng;
