// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

function getAirportName() {
  return window.location.pathname.split("/")[3];
}

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const ADD_TERMINAL = "http://localhost:8000/api/data_management/add_terminal/";

function AddTerminal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Name, setName] = useState("");

  const createNewAirport = () => {
    axios({
      method: "post",
      url: ADD_TERMINAL,
      headers: headers,
      data: {
        name: Name,
        airport_name: getAirportName(),
      },
    })
      .then((res) => {
        props.update_state(res.data.airport);
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
        onClick={() => {
          handleShow();
          setName("");
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Add a new terminal
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Add a new terminal </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <input
              type="text"
              maxLength={63}
              value={Name}
              className="form-control"
              onChange={(e) => setName(e.currentTarget.value.toUpperCase())}
            ></input>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {Name.length < 3 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Name.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Name Field.
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
            onClick={() => {
              handleClose();
              createNewAirport();
            }}
            disabled={Name.length < 3}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTerminal;
