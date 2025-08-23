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

const CHANGE_FIRST_NAME =
  "http://localhost:8000/api/site_admin/change_first_name/";

const allowAlpha = (value) => {
  return value
    .replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "")
    .replace(/[0-9]/g, "");
};

function ChangeFirstName(props) {
  const [show, setShow] = useState(false);
  const [FirstName, setFirstName] = useState(
    props.first_name ? props.first_name : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_FirstName = () => {
    axios({
      method: "post",
      url: CHANGE_FIRST_NAME,
      headers: headers,
      data: {
        user_id: props.user_id,
        first_name: FirstName,
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
        title={"edit user's First Name"}
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
          <Modal.Title>Change First Name for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={20}
            value={FirstName}
            className="form-control"
            onChange={(e) => setFirstName(allowAlpha(e.currentTarget.value))}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          {FirstName.length < 4 ? (
            <>
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
              >
                <li>
                  {FirstName.length < 4 ? (
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The First Name Field.
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
            disabled={FirstName.length < 4}
            onClick={() => {
              handleClose();
              update_FirstName();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeFirstName;
