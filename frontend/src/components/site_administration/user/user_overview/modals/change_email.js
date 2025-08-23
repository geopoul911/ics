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

const CHANGE_EMAIL = "http://localhost:8000/api/site_admin/change_email/";

function ChangeEmail(props) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState(props.email ? props.email : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const update_Email = () => {
    axios({
      method: "post",
      url: CHANGE_EMAIL,
      headers: headers,
      data: {
        user_id: props.user_id,
        email: email,
      },
    })
      .then((res) => {
        props.update_state(res.data.user);
        localStorage.setItem("user_email", res.data.user.email);
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
        title={"edit user's email"}
        id={"edit_user_email"}
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
          <Modal.Title>Change email for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={255}
            value={email}
            className="form-control"
            onChange={(e) => setEmail(e.currentTarget.value)}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          {email.length < 4 || !email.includes("@") || !email.includes(".") ? (
            <>
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
              >
                <li>
                  {email.length < 4 ? (
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Email Field.
                    </>
                  ) : (
                    ""
                  )}
                </li>
                <li>
                  {!email.includes("@") ? (
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Email Field must contain "@"
                    </>
                  ) : (
                    ""
                  )}
                </li>
                <li>
                  {!email.includes(".") ? (
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Email Field must contain at least one "."
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
            disabled={
              email.length < 4 || !email.includes("@") || !email.includes(".")
            }
            onClick={() => {
              handleClose();
              update_Email();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeEmail;
