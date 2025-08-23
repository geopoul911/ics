// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import { BsInfoSquare } from "react-icons/bs";
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

const CHANGE_LANDMARK =
  "http://localhost:8000/api/data_management/change_landmark/";

function ChangeLandmark(props) {
  const [show, setShow] = useState(false);
  const [landmark, setLandmark] = useState(
    props.landmark ? props.landmark : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Landmark = () => {
    axios({
      method: "post",
      url: CHANGE_LANDMARK,
      headers: headers,
      data: {
        place_id: props.place_id,
        landmark: landmark,
      },
    })
      .then((res) => {
        props.update_state(res.data.place);
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
        title={"edit place's landmark"}
        id={"edit_place_name"}
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
          <Modal.Title>Change landmark for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength="63"
            value={landmark}
            className="form-control"
            onChange={(e) => setLandmark(e.currentTarget.value.toUpperCase())}
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
            Place's landmark is a free text field
            {landmark.length < 4 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {landmark.length < 4 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Landmark Field.
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
            disabled={landmark.length < 4}
            onClick={() => {
              handleClose();
              update_Landmark();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeLandmark;
