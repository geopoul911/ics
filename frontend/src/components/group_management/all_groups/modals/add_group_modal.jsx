// Built-ins
import { useState } from "react";

// CSS
import "react-phone-number-input/style.css";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Custom Made Components
import AddAgentModal from "../../../modals/create/add_agent_modal";
import AddClientModal from "../../../modals/create/add_client_modal";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import moment from "moment";
import DatePicker from "react-date-picker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
window.Swal = Swal;

const ADD_GROUP = "http://localhost:8000/api/groups/add_group";
const GET_ALL_AGENTS = "http://localhost:8000/api/view/get_all_agents/";
const GET_ALL_CLIENTS = "http://localhost:8000/api/view/get_all_clients/";

// Regexp that allows alphabetical and numerical characters
function allowAlphaNumeric(value, regex = /^[a-zA-Z0-9 \-_.~]*$/) {
  return value.split('').filter((char) => regex.test(char)).join('');
}

// Style used for inputs on modal
let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

function AddGroupModal() {
  // Refcode's structure :
  // 1) Office ( COA )
  // 2) dash (-)
  // 3) Agent or client abbreviation ( ELE )
  // 4) Date ( 31082021 )
  // 5) Rest of code ( aaaaa )

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // show = true , pop ups modal in the center of screen
  const [show, setShow] = useState(false);

  // COA, COL
  const [office, setOffice] = useState("COA");

  // Agent / Client
  const [AgentOrClient, setAgentOrClient] = useState("Agent");

  // Agent value
  const [Agent, setAgent] = useState("");

  // Client value
  const [Client, setClient] = useState("");

  // Free text, max 5 chars, not required
  const [restOfCode, setrestOfCode] = useState("");

  // list for autocomplete from backend
  const [AllAgents, setAllAgents] = useState([]);

  // list for autocomplete from backend
  const [AllClients, setAllClients] = useState([]);

  // Date object, using datepicker
  const [Date, setDate] = useState("");

  const getAllAgents = () => {
    axios
      .get(GET_ALL_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllAgents(res.data.all_agents.map((agent) => agent.name));
      });
  };

  const getAllClients = () => {
    axios
      .get(GET_ALL_CLIENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllClients(res.data.all_clients.map((client) => client.name));
      });
  };

  const addGroup = () => {
    axios({
      method: "post",
      url: ADD_GROUP,
      headers: headers,
      data: {
        office: office,
        agent_or_client: AgentOrClient,
        Agent: Agent,
        Client: Client,
        rest_of_code: restOfCode,
        date: moment(Date).format("DD-MM-YYYY"),
      },
    })
      .then((res) => {
        window.location.href =
          "/group_management/group/" + res.data.new_refcode;
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Group Created successfully",
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

  return (
    <>
      <Button
        color="green"
        style={{ marginLeft: 20, marginBottom: 20, marginTop: -10 }}
        onClick={() => {
          handleShow();
          getAllAgents();
          getAllClients();
        }}
      >
        <BiPlus style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}/>
        Create new Group
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Group </Modal.Title>
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
                wrapperClassName="datePicker"
                name="date"
                onChange={(e) => setDate(e)}
                value={Date}
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
                onChange={(e) => setrestOfCode(allowAlphaNumeric(e.currentTarget.value.toUpperCase(), /^[a-zA-Z0-9 \-_.~]*$/))}
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
            {Date === "" || Date === null || (Agent === "" && Client === "") ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Agent === "" && Client === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select an
                        Agent / Client.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {Date === "" || Date === null ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Select a Date.
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

export default AddGroupModal;
