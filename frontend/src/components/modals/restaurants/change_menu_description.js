// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form, Col } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import { TextArea } from "semantic-ui-react";

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

const CHANGE_DESCRIPTION = "http://localhost:8000/api/data_management/change_menu_description/";

function ChangeDescription(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [description, setDescription] = useState(props.description ? props.description : "");

  const updateDescription = () => {
    axios({
      method: "post",
      url: CHANGE_DESCRIPTION,
      headers: headers,
      data: {
        menu_id: props.object_id,
        description: description,
      },
    })
      .then((res) => {
        props.update_state(res.data.object);
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
        style={{
          height: 20,
          width: 20,
          marginLeft: 10,
          color: '#797979',
        }}
        onClick={() => {
          handleShow();
        }}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Menu's Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Description:
          </Form.Label>
          <Col sm="10">
            <TextArea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={7}
              cols={40}
              maxLength={500}
              className="form-control"
            />
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {description.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {description.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Description Field
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
            disabled={description.length === 0}
            onClick={() => {
              setDescription("");
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
