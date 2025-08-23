// Built-ins
import { useState } from "react";

// Icons / Images
import { BsFillCalendar3WeekFill, BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import moment from "moment";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const GET_DRIVER_HEATMAP =
  "http://localhost:8000/api/groups/get_driver_heatmap";

const calendarStyle = {
  color: "#F3702D",
  fontSize: "2em",
  cursor: "pointer",
};

function GetDriverHeatmap(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [driverHeatmap, setDriverHeatmap] = useState([]);

  const getDriverHeatMap = (driver_id) => {
    axios
      .get(GET_DRIVER_HEATMAP, {
        headers: headers,
        params: {
          driver_id: driver_id,
        },
      })
      .then((res) => {
        setDriverHeatmap(res.data.driver_heatmap);
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
      <BsFillCalendar3WeekFill
        title={"edit user's address"}
        style={calendarStyle}
        onClick={() => {
          handleShow();
          getDriverHeatMap(props.driver_id);
        }}
      />
      <Modal
        show={show}
        fullscreen={true}
        size="lg"
        style={{ width: "1700px !important" }}
        onHide={handleClose}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Driver's {props.driver} Heatmap </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="heatmap_container">
            {driverHeatmap.map((date) =>
              // eslint-disable-next-line
              Object.entries(date).map(([key, val]) => {
                if (val === true) {
                  return (
                    <div id="available_box">{moment(key).format("DD-MMM")}</div>
                  );
                } else {
                  return (
                    <div title={val} id="not_available_box">
                      {moment(key).format("DD-MMM")}
                    </div>
                  );
                }
              })
            )}
          </div>
          <hr />
          <ol>
            {driverHeatmap.map((date) =>
              // eslint-disable-next-line
              Object.entries(date).map(([key, val]) => {
                if (val !== true) {
                  return (
                    <li style={{ color: "red" }}>
                      ) {moment(key).format("DD-MMM-YYYY")} / {val}
                    </li>
                  );
                }
              })
            )}
          </ol>
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
            Driver's Availability is based on group traveldays
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GetDriverHeatmap;
