// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import { BsInfoSquare } from "react-icons/bs";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_SIGNATURE =
  "http://localhost:8000/api/site_admin/change_secondary_signature/";

function ChangeSignature(props) {
  const [show, setShow] = useState(false);
  const [signature, setSignature] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Signature = () => {
    axios({
      method: "post",
      url: CHANGE_SIGNATURE,
      headers: headers,
      data: {
        user_id: props.user_id,
        signature: signature,
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
        title={"edit user's signature"}
        id={"edit_user_name"}
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
          <Modal.Title>Change Secondary Signature for {props.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Editor
            apiKey="gbn17r35npt722cfkbjivwssdep33fkit1sa1zg7976rhjzc"
            initialValue={props.signature}
            onEditorChange={(e) => setSignature(e)}
            value={signature}
            init={{
              height: 400,
              menubar: false,
              skin: "snow",
              paste_data_images: true,
              selector: "html",
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help paste",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
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
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Signature();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeSignature;
