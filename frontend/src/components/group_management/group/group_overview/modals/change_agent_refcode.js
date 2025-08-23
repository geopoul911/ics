// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";

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

const CHANGE_AGENT_REFCODE =
  "http://localhost:8000/api/groups/change_agents_refcode/";

function ChangeAgentRefcode(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [AgentsRefcode, setAgentsRefcode] = useState("");

  const updateAgentRefcode = () => {
    axios({
      method: "post",
      url: CHANGE_AGENT_REFCODE + props.group.refcode,
      headers: headers,
      data: { agents_refcode: AgentsRefcode },
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
        title={"edit refcode"}
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
            Change Agent's refcode For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            value={AgentsRefcode}
            className="form-control"
            maxLength="100"
            onChange={(e) =>
              setAgentsRefcode(e.currentTarget.value.toUpperCase())
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
            Agent's refcode is the name the agent gave to the group
            {AgentsRefcode.length < 3 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {AgentsRefcode.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill the
                        Agent's Refcode Field
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
            disabled={AgentsRefcode.length < 3}
            onClick={() => {
              handleClose();
              updateAgentRefcode();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeAgentRefcode;
