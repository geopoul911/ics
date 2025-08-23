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

const CHANGE_IMEI = "http://localhost:8000/api/data_management/change_imei/";

function ChangeIMEI(props) {
  const [show, setShow] = useState(false);
  const [imei, setIMEI] = useState(props.IMEI ? props.IMEI : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_IMEI = () => {
    axios({
      method: "post",
      url: CHANGE_IMEI,
      headers: headers,
      data: {
        coach_id: props.coach_id,
        imei: imei,
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
          <Modal.Title>Change IMEI for {props.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="number"
            maxLength="50"
            value={imei}
            style={{ width: 240 }}
            className="form-control"
            onChange={(e) => setIMEI(e.currentTarget.value)}
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
            Coach's IMEI is an integer field.
            {imei.length < 4 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {imei.length < 4 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The IMEI Field.
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
            disabled={imei.length < 4}
            onClick={() => {
              handleClose();
              update_IMEI();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeIMEI;
