// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning } from "react-icons/ai";

// Custom Made Components
import Roles from "./roles";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row, Alert } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
window.Swal = Swal;

const ADD_USER = "http://localhost:8000/api/site_admin/add_user";

let formControlStyle = {
  marginBottom: 10,
  width: "50%",
  display: "inline-block",
};

const allowAlpha = (value) => {
  return value.replace(/[^\w]/g, "").replace(/[0-9]/g, "");
};

function AddUserModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [UserName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("No Permissions");

  const createNewUser = () => {
    axios({
      method: "post",
      url: ADD_USER,
      headers: headers,
      data: {
        username: UserName,
        first_name: FirstName,
        last_name: LastName,
        email: email,
        password: password,
        role: role,
      },
    })
      .then((res) => {
        window.location.href =
          "/site_administration/user/" + res.data.new_user_id;
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
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setUserName("");
          setEmail("");
        }}
      >
        <BiPlus style={{ color: "white", marginRight: "0.3em" }} />
        Create new user
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new User </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Username:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="20"
                onChange={(e) => setUserName(allowAlpha(e.currentTarget.value))}
                style={formControlStyle}
                value={UserName}
              />
            </Col>
            <Form.Label column sm="2">
              First Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="200"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                style={formControlStyle}
                value={FirstName}
              />
            </Col>
            <Form.Label column sm="2">
              Last Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="200"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                style={formControlStyle}
                value={LastName}
              />
            </Col>
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={formControlStyle}
                maxLength="100"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </Col>
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={formControlStyle}
                type="password"
                maxLength="20"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
            </Col>
            <Form.Label column sm="2">
              Confirm pwd
            </Form.Label>
            <Col sm="10">
              <Form.Control
                style={formControlStyle}
                type="password"
                maxLength="20"
                onChange={(e) => {
                  setPassword2(e.target.value);
                }}
                value={password2}
              />
              {password === password2 || password === "" || password2 === "" ? (
                ""
              ) : (
                <Alert variant={"danger"} style={{ float: "right" }}>
                  Passwords do not match
                </Alert>
              )}
            </Col>
            <Form.Label column sm="2">
              User Role
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                style={{ width: "50%" }}
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                <option value="No Permissions"> No Permissions </option>
                <option value="Read Only"> Read Only </option>
                <option value="Basic"> Basic </option>
                <option value="Back Office"> Back Office </option>
                <option value="Administrator"> Administrator </option>
              </select>
              <Roles />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <AiOutlineWarning style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}/>
            User will get enabled, staff and superuser status based on role upon creation.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              createNewUser();
            }}
            disabled={
              UserName.length === 0 ||
              FirstName.length === 0 ||
              LastName.length === 0 ||
              email.length === 0 ||
              password.length === 0 ||
              password2.length === 0 ||
              password !== password2
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddUserModal;
