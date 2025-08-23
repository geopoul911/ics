// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";

// CSS
import "react-phone-input-2/lib/style.css";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PHONE_NUMBER =
  "http://localhost:8000/api/site_admin/change_phone_number/";

function ChangePhoneNumber(props) {
  const [show, setShow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    props.telephone ? props.telephone : ""
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_PhoneNum = () => {
    axios({
      method: "post",
      url: CHANGE_PHONE_NUMBER,
      headers: headers,
      data: {
        user_id: props.user_id,
        phone_number: phoneNumber,
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
        title={"edit user's phone number"}
        id={"edit_user_email"}
        onClick={() => {
          handleShow();
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change phone number for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="RU"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_PhoneNum();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePhoneNumber;
