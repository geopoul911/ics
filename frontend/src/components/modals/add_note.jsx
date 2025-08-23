// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button, TextArea } from "semantic-ui-react";
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

const ADD_NOTE = "http://localhost:8000/api/data_management/add_note/";

function ChangeText(props) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Text = () => {
    axios({
      method: "post",
      url: ADD_NOTE + props.object_id,
      headers: headers,
      data: {
        object_type: props.object_type,
        note_text: text,
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
      <Button
        positive
        onClick={() => {
          handleShow();
          setText("");
        }}
      >
        <BiPlus
          style={{
            color: "white",
            fontWeight: "bold",
            marginRight: "0.5em",
          }}
        />
        Add Note
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new note for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextArea
            onChange={(e) => setText(e.currentTarget.value.toUpperCase())}
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
                color: "#93ab3c",
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
            disabled={text.length < 3}
            onClick={() => {
              handleClose();
              update_Text();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeText;
