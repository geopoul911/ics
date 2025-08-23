// Built-ins
import { useState, useEffect } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import moment from "moment";
import Swal from "sweetalert2";
import DatePicker from "react-date-picker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Custom Made Components
import AddAgentModal from "../../../../modals/create/add_agent_modal";
import AddClientModal from "../../../../modals/create/add_client_modal";

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

const CHANGE_REFCODE = "http://localhost:8000/api/groups/change_refcode/";
const GET_ALL_AGENTS = "http://localhost:8000/api/view/get_all_agents/";
const GET_ALL_CLIENTS = "http://localhost:8000/api/view/get_all_clients/";

function allowAlphaNumeric(value, regex = /^[a-zA-Z0-9 \-_.~]*$/) {
  return value.split('').filter((char) => regex.test(char)).join('');
}

// Style used for inputs on modal
let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

function ChangeRefcode(props) {

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // show = true , pop ups modal in the center of screen
  const [show, setShow] = useState(false);

  const [office, setOffice] = useState("COA");
  const [AgentOrClient, setAgentOrClient] = useState("Agent");
  const [Agent, setAgent] = useState("");
  const [Client, setClient] = useState("");
  const [restOfCode, setRestOfCode] = useState("");
  const [AllAgents, setAllAgents] = useState([]);
  const [AllAgentData, setAllAgentData] = useState([]);

  const [AllClientData, setAllClientData] = useState([]);
  const [AllClients, setAllClients] = useState([]);

  const [Daate, setDaate] = useState("");

  const getAllAgents = () => {
    axios
      .get(GET_ALL_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllAgents(res.data.all_agents.map((agent) => agent.name));
        setAllAgentData(res.data.all_agents);
      });
  };

  const getAllClients = () => {
    axios
      .get(GET_ALL_CLIENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllClients(res.data.all_clients.map((client) => client.name));
        setAllClientData(res.data.all_clients);
      });
  };

  const addGroup = () => {
    axios({
      method: "post",
      url: CHANGE_REFCODE + props.group.refcode,
      headers: headers,
      data: {
        office: office,
        agent_or_client: AgentOrClient,
        Agent: Agent,
        Client: Client,
        rest_of_code: restOfCode,
        date: moment(Daate).format("DD-MM-YYYY"),
      },
    })
      .then((res) => {
        window.location.href =
          "/group_management/group/" + res.data.new_refcode;
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Refcode Changed Successfully",
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  // useEffect hook to parse the code only once when the component is mounted
  useEffect(() => {
    
    const officePrefix = props.group.refcode.split('-')[0]; // "COA"
    const isAgent = props.group.agent
    
    const datePart = props.group.refcode.split('-')[1].slice(3, 11); // "25102024"
    const restCode = props.group.refcode.split('-')[1].slice(11); // "SSS"

    // Update the state variables
    setOffice(officePrefix);
    setAgentOrClient(isAgent ? 'Agent' : 'Client')

    if (isAgent) {
      let abbr = props.group.refcode.substring(4, 7)
      let preselectedAgent = AllAgentData.filter(agent => agent.abbreviation === abbr)[0];
      if (preselectedAgent) {
        setAgent(preselectedAgent.name)
      }
    } else {
      let abbr = props.group.refcode.substring(4, 7)
      let preselectedClient = AllClientData.filter(client => client.abbreviation === abbr)[0];
      if (preselectedClient) {
        setClient(preselectedClient.name)
      }
    }

    const result = new Date(
      datePart.slice(4, 8), // Extract year and add to 2000
      +datePart.slice(2, 4) - 1,    // Extract month (0-based)
      +datePart.slice(0, 2)         // Extract day
    );
    setDaate(result)
    setRestOfCode(restCode);

  }, [AllAgentData, AllClientData, props.group.agent, props.group.refcode]); // Empty dependency array means this runs only once when the component mounts

  return (
    <>
      <FiEdit2
        title={"edit refcode"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getAllAgents();
          getAllClients();
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
          <Modal.Title>Change refcode for {props.group.refcode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Select Office :
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                style={formControlStyle}
                id="officeSelect"
                onChange={(e) => setOffice(e.currentTarget.value)}
                value={office}
              >
                <option value="COA"> Athens (COA) </option>
                <option value="COL"> London (COL) </option>
              </select>
            </Col>

            <Form.Label column sm="2">
              Agent/Client :
            </Form.Label>
            <Col sm="10">
              <select
                id="officeSelect"
                className="form-control"
                style={formControlStyle}
                value={AgentOrClient}
                onChange={(e) => {
                  setAgentOrClient(e.currentTarget.value);
                  setAgent("");
                  setClient("");
                }}
              >
                <option value="Agent">Agent</option>
                <option value="Client">Client</option>
              </select>
            </Col>

            {AgentOrClient === "Agent" ? (
              <>
                <Form.Label column sm="2">
                  Select Agent:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={AllAgents}
                    className={"select_airport"}
                    onChange={(e) => {
                      setAgent(e.target.innerText);
                    }}
                    disableClearable
                    value={Agent}
                    style={{ width: 300, margin: 16 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Agent"
                        variant="outlined"
                      />
                    )}
                  />
                  <div style={{ float: "right" }}>
                    <AddAgentModal
                      redir={false}
                      set_agent={(e) => setAgent(e)}
                    />
                  </div>
                </Col>
              </>
            ) : (
              <>
                <Form.Label column sm="2">
                  Select Client:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={AllClients}
                    className={"select_airport"}
                    onChange={(e) => {
                      setClient(e.target.innerText);
                    }}
                    disableClearable
                    value={Client}
                    style={{ width: 300, margin: 16 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Client"
                        variant="outlined"
                      />
                    )}
                  />
                  <div style={{ float: "right" }}>
                    <AddClientModal
                      redir={false}
                      set_client={(e) => setClient(e)}
                    />
                  </div>
                </Col>
              </>
            )}

            <Form.Label column sm="2">
              Select Date :
            </Form.Label>
            <Col
              sm="9"
              style={{
                marginLeft: 30,
                marginBottom: 20,
                border: "1px solid #ced4da",
                borderRadius: 4,
              }}
              className="form-control"
            >
              <DatePicker
                id="select_date_for_refcode_change"
                wrapperClassName="datePicker"
                name="date"
                onChange={(e) => setDaate(e)}
                value={Daate}
                format="dd/MM/yyyy"
              />
            </Col>
            <Form.Label column sm="2">
              Rest of code :
            </Form.Label>
            <Col sm="10">
              <input
                type="text"
                style={formControlStyle}
                id="rest_of_code_input"
                value={restOfCode}
                className="form-control"
                onChange={(e) =>
                  setRestOfCode(
                    allowAlphaNumeric(
                      e.currentTarget.value.toUpperCase(),
                      /^[a-zA-Z0-9 \-_.~]*$/ // Allows alphanumeric, spaces, -, _, ., ~
                    )
                  )
                }
                pattern="[0-9\.]+"
                maxLength="100"
                placeholder="e.g. BJA"
              />
            </Col>
          </Form.Group>
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
            All fields are required to create a Group.
            {Date === "" ||
            Date === null ||
            (Agent === "" && Client === "") ||
            restOfCode.length <= 1 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Agent === "" && Client === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select an Agent / Client.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {restOfCode.length <= 1 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill the Rest Of Code Form.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {Date === "" || Date === null ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select a Date.
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
              addGroup();
            }}
            disabled={
              Date === "" || Date === null || (Agent === "" && Client === "")
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeRefcode;
