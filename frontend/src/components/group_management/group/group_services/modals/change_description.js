// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_DESCRIPTION =
  "http://localhost:8000/api/groups/change_description/";

function ChangeDescription(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Description, setDescription] = useState(props.description);

  const updateDescription = () => {
    axios({
      method: "post",
      url: CHANGE_DESCRIPTION,
      headers: headers,
      data: {
        service_id: props.service_id,
        description: Description,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
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
        title={"edit description"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
        }}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="s"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change service's description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            rows={4}
            cols={30}
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            value={Description}
            maxLength={255}
          ></textarea>
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
            Description is a free text field.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateDescription();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeDescription;
