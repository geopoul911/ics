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

const CHANGE_EMISSION =
  "http://localhost:8000/api/data_management/change_emission/";

function ChangeEmission(props) {
  const [show, setShow] = useState(false);
  const [emission, setEmission] = useState(
    props.emission ? props.emission : "0"
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Emission = () => {
    axios({
      method: "post",
      url: CHANGE_EMISSION,
      headers: headers,
      data: {
        coach_id: props.coach_id,
        emission: emission,
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
        title={"edit coach's emission"}
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
          <Modal.Title>Change emission for {props.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            style={{ width: "93%", marginLeft: 0 }}
            onChange={(e) => {
              setEmission(e.target.value);
            }}
            value={emission}
          >
            <option value="0"> N/A </option>
            <option value="3"> Euro 3 </option>
            <option value="4"> Euro 4 </option>
            <option value="5"> Euro 5 </option>
            <option value="6"> Euro 6 </option>
            <option value="7"> Euro 7 </option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          {emission === "0" ? (
            <>
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
              >
                <li>
                  {emission === "0" ? (
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Emission Field.
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
                style={{ margin: 0, padding: 0, marginTop: 10, color: "green" }}
              >
                <li>
                  <AiOutlineCheckCircle style={checkStyle} />
                  Validated
                </li>
              </ul>
            </>
          )}

          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={emission === "0"}
            onClick={() => {
              handleClose();
              update_Emission();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeEmission;
