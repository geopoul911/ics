// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import { BsInfoSquare } from "react-icons/bs";

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

const CHANGE_PLATE_NUMBER =
  "http://localhost:8000/api/data_management/change_plate_number/";

function ChangePlateNumber(props) {
  const [show, setShow] = useState(false);
  const [plate_number, setPlateNumber] = useState(
    props.plate_number ? props.plate_number : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_PlateNumber = () => {
    axios({
      method: "post",
      url: CHANGE_PLATE_NUMBER,
      headers: headers,
      data: {
        coach_id: props.coach_id,
        plate_number: plate_number,
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
        title={"edit coach's plate number"}
        id={"edit_coach_name"}
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
          <Modal.Title>Change plate number for {props.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength="63"
            value={plate_number}
            className="form-control"
            onChange={(e) =>
              setPlateNumber(e.currentTarget.value.toUpperCase())
            }
          ></input>
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
            Coach's body number is a free text field
            {plate_number.length < 4 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {plate_number.length < 4 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Plate Number Field.
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
            disabled={plate_number.length < 4}
            onClick={() => {
              handleClose();
              update_PlateNumber();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePlateNumber;
