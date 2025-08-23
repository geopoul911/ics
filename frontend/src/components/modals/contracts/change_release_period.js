// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, Col } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_RELEASE_PERIOD =
  "http://localhost:8000/api/data_management/change_release_period/";

function ChangeReleasePeriod(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [releasePeriod, setReleasePeriod] = useState(0);

  const update_ReleasePeriod = () => {
    axios({
      method: "post",
      url: CHANGE_RELEASE_PERIOD,
      headers: headers,
      data: {
        contract_id: props.object_id,
        release_period: releasePeriod,
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
        title={"edit contract's Release Period"}
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
            Change Release Period for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col sm="10">
            <input
              style={{ width: 60, display: "inline" }}
              type="number"
              className="form-control"
              value={releasePeriod}
              onChange={(e) => setReleasePeriod(e.target.value)}
            />
            Days
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
            Changing Release Period will affect availability of Rooms.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_ReleasePeriod();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeReleasePeriod;
