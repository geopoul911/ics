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

const CHANGE_ADDRESS = "http://localhost:8000/api/site_admin/change_address/";

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
        user_id: props.user_id,
        address: address,
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
        title={"edit user's address"}
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
          <Modal.Title>Change address for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength={255}
            value={address}
            className="form-control"
            onChange={(e) => setAddress(e.currentTarget.value)}
          ></input>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {address.length < 4 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {address.length < 4 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Address Field.
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
            disabled={address.length < 4}
            onClick={() => {
              handleClose();
              update_Address();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeAddress;
