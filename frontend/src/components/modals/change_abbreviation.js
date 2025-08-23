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

const allowAlpha = (value) => {
  return value.replace(/[^\w]/g, "").replace(/[0-9]/g, "");
};

const CHANGE_ABBREVIATION =
  "http://localhost:8000/api/data_management/change_abbreviation/";

function ChangeAbbreviation(props) {
  const [show, setShow] = useState(false);
  const [abbreviation, setAbbreviation] = useState(
    props.abbreviation ? props.abbreviation : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Abbreviation = () => {
    axios({
      method: "post",
      url: CHANGE_ABBREVIATION,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        abbreviation: abbreviation,
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
        title={"edit abbreviation"}
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
          <Modal.Title>Change abbreviation for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={props.object_type === "Airline" ? 3 : 5}
            value={abbreviation}
            className="form-control"
            onChange={(e) =>
              setAbbreviation(allowAlpha(e.currentTarget.value.toUpperCase()))
            }
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {props.object_type === "Airline" ? (
              abbreviation.length === 0 || abbreviation.length > 3 ? (
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "red",
                  }}
                >
              <li>
                    <AiOutlineWarning style={warningStyle} />
                    Abbreviation must be 1–3 characters
                  </li>
                </ul>
              ) : (
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
              )
            ) : abbreviation.length === 0 || abbreviation.length > 3 ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
              >
                <li>
                  <AiOutlineWarning style={warningStyle} />
                  Abbreviation must be 1–3 characters
                </li>
              </ul>
            ) : (
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
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={
              props.object_type === "Airline"
                ? abbreviation.length > 3 || abbreviation.length === 0
                : abbreviation.length < 3
            }
            onClick={() => {
              handleClose();
              update_Abbreviation();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeAbbreviation;
