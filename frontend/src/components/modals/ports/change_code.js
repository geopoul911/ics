// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
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

const CHANGE_CODE = "http://localhost:8000/api/data_management/change_code/";

const allowAlpha = (value) => {
  return value.replace(/[^\w]/g, "").replace(/[0-9]/g, "");
};

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

function ChangeCode(props) {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState(props.code ? props.code : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Name = () => {
    axios({
      method: "post",
      url: CHANGE_CODE,
      headers: headers,
      data: {
        port_id: props.port_id,
        code: code,
      },
    })
    .then((res) => {
      props.update_state(res.data.port);
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
        title={"edit port's Code"}
        id={"edit_port_name"}
        onClick={() => { handleShow();}}
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
          <Modal.Title>Change code for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={3}
            value={code}
            className="form-control"
            onChange={(e) => {
              setCode(allowAlpha(e.currentTarget.value.toUpperCase()));
            }}
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
            Ports code is a 3 capitalized letter field
            {code.length !== 3 ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  <li>
                    {code.length !== 3 ? (
                      <> <AiOutlineWarning style={warningStyle} /> Fill The Code Field. </>
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
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
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
            disabled={code.length !== 3}
            onClick={() => {
              handleClose();
              update_Name();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeCode;
