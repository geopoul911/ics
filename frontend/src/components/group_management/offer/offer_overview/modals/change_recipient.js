// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Custom Made Components
import AddAgentModal from "../../../../modals/create/add_agent_modal";

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

const CHANGE_OFFER_RECIPIENT =
  "http://localhost:8000/api/groups/change_offer_recipient/";
const GET_ALL_AGENTS = "http://localhost:8000/api/view/get_all_agents/";

// This function replaces the abbreviation included in refcode
// Therefore, when agent changes => refcode changes => url needs redirect
function ChangeOffersAgent(props) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [Agent, setAgent] = useState("");
  const handleClose = () => {
    setShow(false);
    setAgent("");
  };
  const handleShow = () => setShow(true);

  const [AllAgents, setAllAgents] = useState([]);

  const getAllAgents = () => {
    axios
      .get(GET_ALL_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllAgents(res.data.all_agents.map((agent) => agent.name));
        setLoaded(true);
      });
  };

  const updateOffersAgent = () => {
    axios({
      method: "post",
      url: CHANGE_OFFER_RECIPIENT + props.offer_id,
      headers: headers,
      data: { recipient: Agent },
    })
      .then((res) => {
        props.update_state(res.data.offer);
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
        title={"edit agent"}
        id={"edit_agent"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getAllAgents();
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
          <Modal.Title>Change Agent For {props.name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            onChange={(e) => {
              setAgent(e.target.innerText);
            }}
            options={AllAgents}
            disabled={!loaded}
            disableClearable
            value={Agent}
            style={{ width: "40%", display: "inline-block", marginLeft: 15 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Agent" variant="outlined" />
            )}
          />

          <div style={{ float: "right" }}>
            <AddAgentModal redir={false} set_agent={(e) => setAgent(e)} />
          </div>

          {loaded ? (
            ""
          ) : (
            <Spinner
              animation="border"
              variant="info"
              size="sm"
              style={{ position: "fixed", marginLeft: 5, marginTop: 20 }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {Agent === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Agent === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select an Agent
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
            disabled={!Agent}
            onClick={() => {
              handleClose();
              updateOffersAgent();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeOffersAgent;
