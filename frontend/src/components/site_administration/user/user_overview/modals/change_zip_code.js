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

const CHANGE_ZIP_CODE = "http://localhost:8000/api/site_admin/change_zip_code/";

function ChangeZipCode(props) {
  const [show, setShow] = useState(false);
  const [zip_code, setZipCode] = useState(props.zip_code ? props.zip_code : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_ZipCode = () => {
    axios({
      method: "post",
      url: CHANGE_ZIP_CODE,
      headers: headers,
      data: {
        user_id: props.user_id,
        zip_code: zip_code,
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
        title={"edit user's zip code"}
        id={"edit_user_name"}
        onClick={() => {handleShow();}}
        className={"edit_icon"}
      />
      <Modal show={show} onHide={handleClose} size="m" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Change zip code for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" maxLength={10} value={zip_code} className="form-control" onChange={(e) => setZipCode(e.currentTarget.value)}></input>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {zip_code.length < 2 ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  <li>
                    {zip_code.length < 2 ? (
                      <> <AiOutlineWarning style={warningStyle} /> Fill The Zip Code Field. </>
                    ) : ("")}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "green"}}>
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
            disabled={zip_code.length < 2}
            onClick={() => { handleClose(); update_ZipCode();}}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeZipCode;
