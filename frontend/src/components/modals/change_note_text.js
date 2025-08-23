// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import { TextArea } from "semantic-ui-react";
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

const CHANGE_NOTE_TEXT = "http://localhost:8000/api/data_management/change_note_text/";

function ChangeNoteText(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [text, setText] = useState(props.text ? props.text : "");
  const updateGroupNoteText = () => {
    axios({
      method: "post",
      url: CHANGE_NOTE_TEXT + props.object_id,
      headers: headers,
      data: {
        note_text: text,
        object_type: props.object_type,
        note_id: props.note_id,
      },
    })
      .then((res) => {
        props.update_notes(res.data.notes);
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
        title={"edit note's text"}
        id={"edit_note"}
        className={"edit_icon"}
        onClick={handleShow}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Note's text</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextArea
            onChange={(e) => setText(e.target.value.toUpperCase())}
            value={text}
            rows={7}
            cols={40}
            maxLength={500}
            className="form-control"
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
            Note Text is a free text field. It has a maximum length of 500
            characters.
            {text.length < 3 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {text.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Please fill the text area field
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
            disabled={text.length < 3}
            onClick={() => { handleClose(); updateGroupNoteText(); }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeNoteText;
