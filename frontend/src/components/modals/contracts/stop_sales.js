// Built-ins
import { useState } from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { GiStopSign } from "react-icons/gi";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const STOP_SALES = "http://localhost:8000/api/data_management/stop_sales/";

function StopSales(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [stopAll, setStopAll] = useState("SAR");

  const updateSales = () => {
    axios({
      method: "post",
      url: STOP_SALES,
      headers: headers,
      data: {
        contract_id: props.object_id,
        stop_all_rooms: stopAll,
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
      <Button
        color="red"
        onClick={() => {
          handleShow();
        }}
      >
        <GiStopSign
          style={{
            fontSize: "1.5em",
            marginRight: "0.5em",
          }}
        />
        Stop Sales
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Stop Sales For {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.contract.period.split(", ").map((period, i) => (
            <>
              {i + 1}) {period}
              <br />
            </>
          ))}
          <hr />
          <Form.Check
            type={"radio"}
            checked={stopAll === "SAR"}
            onChange={() => setStopAll("SAR")}
            label="Stop All Rooms"
          />
          <Form.Check
            type={"radio"}
            checked={stopAll === "SAROASP"}
            onChange={() => setStopAll("SAROASP")}
            label="Stop All Rooms of a specific Period"
          />
          <Form.Check
            type={"radio"}
            checked={stopAll === "SSRDBD"}
            onChange={() => setStopAll("SSRDBD")}
            label="Stop Specific Rooms Day By Day"
          />

          {/* if false, map period strings.
          add sgl/dbl/etc. for each period.
          send data to back end.
          change the room statuses with a loop.
          write logs 
          check permissions */}

          {!stopAll ? (
            <>
              <hr />
              map period strings
            </>
          ) : (
            ""
          )}
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
            {/* Stopping Sales will fail if you pick a room that has been used. */}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateSales();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StopSales;
