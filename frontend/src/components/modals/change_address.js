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

const CHANGE_ADDRESS =
  "http://localhost:8000/api/data_management/change_address/";

function ChangeAddress(props) {
  const [show, setShow] = useState(false);
  const [address, setAddress] = useState(props.address ? props.address : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Address = () => {
    axios({
      method: "post",
      url: CHANGE_ADDRESS,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_address: address,
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
        title={"Edit address"}
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
          <Modal.Title>Change address for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={100}
            value={address}
            className="form-control"
            onChange={(e) => setAddress(e.currentTarget.value.toUpperCase())}
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
            Address is a free text field. It has a maximum length of 100
            characters.
            {address.length < 4 ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  <li>
                    {address.length < 4 ? (
                      <><AiOutlineWarning style={warningStyle} /> Fill the Address Field. </>
                      ) : ("")
                    }
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "green" }}>
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
            disabled={address.length < 4}
            onClick={() => { handleClose(); update_Address();}}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeAddress;
