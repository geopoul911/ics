// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import { TextArea } from "semantic-ui-react";

// Global Variables
import { headers } from "../../../../global_vars";

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

const CHANGE_EMPLOYEE_INFO =
  "http://localhost:8000/api/groups/change_employee_info/";

function ChangeEmployeeInfo(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [EmployeeInfo, setEmployeeInfo] = useState("");

  const updateEmployeeInfo = () => {
    axios({
      method: "post",
      url: CHANGE_EMPLOYEE_INFO + props.group.refcode,
      headers: headers,
      data: { employee_info: EmployeeInfo },
    })
      .then((res) => {
        props.update_state(res.data.model);
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
        title={"Edit Employee Info"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={handleShow}
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
            Change Employee Info For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextArea
            onChange={(e) => setEmployeeInfo(e.target.value.toUpperCase())}
            value={EmployeeInfo}
            rows={4}
            cols={25}
            max={255}
            className="form-control"
            placeholder={"Name : \nTel: \nEmail:"}
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
            Employee Info input maximum characters is 255
            {EmployeeInfo.length < 3 || EmployeeInfo.length > 255 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {EmployeeInfo.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill the Employee's Info Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {EmployeeInfo.length > 255 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Make it less than 255 characters.
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
            disabled={EmployeeInfo.length < 3 || EmployeeInfo.length > 255}
            onClick={() => {
              handleClose();
              updateEmployeeInfo();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeEmployeeInfo;
