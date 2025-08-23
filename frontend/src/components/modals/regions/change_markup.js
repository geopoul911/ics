// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_MARKUP =
  "http://localhost:8000/api/data_management/change_markup/";

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

function ChangeMarkup(props) {
  const [show, setShow] = useState(false);
  const [markup, setMarkup] = useState(props.markup ? props.markup : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Markup = () => {
    axios({
      method: "post",
      url: CHANGE_MARKUP + props.object_type + "/" + props.object_id,
      headers: headers,
      data: {
        markup: markup,
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

  const handleMarkup = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setMarkup(value);
    }
  };

  return (
    <>
      <FiEdit2
        title={"edit markup"}
        id={"edit_place_name"}
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
          <Modal.Title>Change markup for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2" style={{ marginTop: 10 }}>
              Markup ( % ):
            </Form.Label>
            <Col sm="9">
              <input
                type="number"
                className="form-control"
                value={markup}
                onChange={handleMarkup}
                min="0"
                max="100"
                step="1"
                style={{ width: 100, marginTop: 10 }}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {markup === "" || markup < 0 || markup > 100 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, color: "red" }}
                >
                  <li>
                    {markup === "" || markup < 0 || markup > 100 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Markup Field
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
                  style={{ margin: 0, padding: 0, color: "green" }}
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
            onClick={() => {
              handleClose();
              update_Markup();
            }}
            disabled={markup === "" || markup < 0 || markup > 100}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeMarkup;
