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
import { headers } from "../../../../global_vars";

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

const CHANGE_USERNAME = "http://localhost:8000/api/site_admin/change_username/";

const allowAlpha = (value) => {
  return value.replace(/[^\w]/g, "").replace(/[0-9]/g, "");
};

function ChangeUsername(props) {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(
    props.username ? props.username : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Username = () => {
    axios({
      method: "post",
      url: CHANGE_USERNAME,
      headers: headers,
      data: {
        user_id: props.user_id,
        username: username,
      },
    })
    .then((res) => {
      props.update_state(res.data.user);
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
        title={"edit user's username"}
        id={"edit_user_name"}
        onClick={() => {
          handleShow();
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="m"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change username for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={20}
            value={username}
            className="form-control"
            onChange={(e) => setUsername(allowAlpha(e.currentTarget.value))}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          {username.length < 3 ? (
            <>
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
              >
                <li>
                  {username.length < 3 ? (
                    <>
                      <AiOutlineWarning style={warningStyle} /> Fill The
                      Username Field.
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
                  <AiOutlineCheckCircle style={checkStyle} /> Validated
                </li>
              </ul>
            </>
          )}
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={username.length < 3}
            onClick={() => {
              handleClose();
              update_Username();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeUsername;
