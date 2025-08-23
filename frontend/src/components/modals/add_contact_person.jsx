// Built-ins
import { useState } from "react";

// CSS
import "react-phone-number-input/style.css";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import PhoneInput from "react-phone-input-2";

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

const ADD_CONTACT_PERSON =
  "http://localhost:8000/api/data_management/add_contact_person/";

let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

function AddContactPersonModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [tel, setTel] = useState("");

  const addContactPerson = () => {
    axios({
      method: "post",
      url: ADD_CONTACT_PERSON,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        name: Name,
        email: email,
        position: position,
        tel: tel,
      },
    })
      .then((res) => {
        props.add_contact_person(res.data.contact_persons);
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
      <BiPlus
        style={{ color: "green", fontSize: "2em", float: "right" }}
        id="add_contact_person_icon"
        onClick={() => {
          handleShow();
          setName("");
          setEmail("");
        }}
      />
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add New Contact Person For {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="50"
                onChange={(e) => setName(allowAlpha(e.currentTarget.value.toUpperCase()))}
                style={formControlStyle}
                value={Name}
              />
            </Col>
            <Form.Label column sm="2">
              Tel
            </Form.Label>
            <Col sm="10">
              <PhoneInput
                international
                maxLength={20}
                defaultCountry="GR"
                countryCallingCodeEditable={false}
                value={tel}
                style={{ width: 590, marginBottom: 10 }}
                onChange={setTel}
              />
            </Col>
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={formControlStyle}
                maxLength="100"
                onChange={(e) => {setEmail(e.target.value);}}
                value={email}
              />
            </Col>
            <Form.Label column sm="2">
              Position
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={formControlStyle}
                maxLength="255"
                onChange={(e) => { setPosition(e.target.value);}}
                value={position}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare style={{ color: "#93ab3c", fontSize: "1.5em", marginRight: "0.5em" }}/>
            All fields except Tel2, Tel3 and Fax are required to create a agent.
            {Name.length < 3 ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  <li>
                    {Name.length < 3 ? (<> <AiOutlineWarning style={warningStyle} /> Fill The Name Field.</>) : ("")}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "green" }}>
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
            onClick={() => { handleClose(); addContactPerson();}}
            disabled={Name.length < 3}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddContactPersonModal;
