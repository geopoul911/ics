// Built-ins
import { useState } from "react";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PASSWORD = "http://localhost:8000/api/site_admin/change_password/";

function ChangePassword(props) {
  const [show, setShow] = useState(false);
  const [Password, setPassword] = useState("");
  const [Password2, setPassword2] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Password = () => {
    axios({
      method: "post",
      url: CHANGE_PASSWORD,
      headers: headers,
      data: {
        user_id: props.user_id,
        password: Password,
      },
    })
      .then((res) => {
        props.update_state(res.data.user);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Password updated successfully",
        });
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
        color="blue"
        onClick={() => {
          handleShow();
          setPassword("");
        }}
      >
        Change User's Password
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password for {props.password}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Enter Password
          <input
            type="password"
            maxLength={20}
            value={Password}
            className="form-control"
            style={{ margin: 10, width: "70%" }}
            onChange={(e) => setPassword(e.currentTarget.value)}
          ></input>
          Repeat Password
          <input
            type="password"
            maxLength={20}
            value={Password2}
            className="form-control"
            style={{ margin: 10, width: "70%" }}
            onChange={(e) => setPassword2(e.currentTarget.value)}
          ></input>
          <hr />
          <ul style={{ listStyleType: "square", marginLeft: 20 }}>
            <li>
              Your password cannot be too similar to your other personal
              information.
            </li>
            <li>Your password must contain at least 8 characters.</li>
            <li>Your password can't be a commonly used password</li>
            <li>Your password can't be entirely numeric</li>
          </ul>
          {Password !== Password2 ? (
            <div style={{ color: "red" }}>Passwords does not match.</div>
          ) : (
            ""
          )}
          {/^\d+$/.test(Password) ? (
            <div style={{ color: "red" }}>
              Your password can't be entirely numeric
            </div>
          ) : (
            ""
          )}
          {Password.length < 8 ? (
            <div style={{ color: "red" }}>
              Your password must contain at least 8 characters.
            </div>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Password();
            }}
            disabled={
              Password !== Password2 ||
              Password.length < 8 ||
              /^\d+$/.test(Password) // regexp that returns true only if value has only digits
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePassword;
