// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

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

const CHANGE_TEXT =
  "http://localhost:8000/api/data_management/change_template_text/";

function ChangeText(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [text, setText] = useState(props.text ? props.text : "");

  const update_Text = () => {
    axios({
      method: "post",
      url: CHANGE_TEXT,
      headers: headers,
      data: {
        text_template_id: props.object_id,
        text: text,
      },
    })
      .then((res) => {
        props.update_state(res.data.text_template);
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
        title={"edit text_template's text"}
        id={"edit_text_template_name"}
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
          <Modal.Title>
            Change text for Template with id : {props.object_id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label> Add Template text </label>
            <textarea
              className="form-control"
              rows={4}
              cols={50}
              onChange={(e) => setText(e.target.value)}
              value={text}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {text.length === 0 ? (
            <>
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
              >
                <li>
                  {text.length === 0 ? (
                    <>
                      <AiOutlineWarning style={warningStyle} /> Fill The Text
                      Field.
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
            disabled={text.length === 0}
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
