// Built-ins
import { useState } from "react";
import { BsInfoSquare } from "react-icons/bs";

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

const CHANGE_MAKE = "http://localhost:8000/api/data_management/change_make/";

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

function ChangeMake(props) {
  const [show, setShow] = useState(false);
  const [make, setMake] = useState(props.make ? props.make : "");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Make = () => {
    axios({
      method: "post",
      url: CHANGE_MAKE,
      headers: headers,
      data: {
        coach_id: props.coach_id,
        make: make,
      },
    })
      .then((res) => {
        props.update_state(res.data.coach);
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
        title={"edit coach's make"}
        id={"edit_coach_name"}
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
          <Modal.Title>Change make for {props.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            maxLength="63"
            value={make}
            className="form-control"
            onChange={(e) =>
              setMake(allowAlpha(e.currentTarget.value).toUpperCase())
            }
          ></input>
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
            Coach's make is a free text field
            {make.length < 3 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {make.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Make Field.
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
            disabled={make.length < 3}
            onClick={() => {
              handleClose();
              update_Make();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeMake;
