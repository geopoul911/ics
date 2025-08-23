// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";

// Custom Made Components
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

const CHANGE_GROUPS_CLIENT =
  "http://localhost:8000/api/groups/change_groups_client/";
const GET_ALL_CLIENTS = "http://localhost:8000/api/view/get_all_clients/";

// This function replaces the abbreviation included in refcode
// Therefore, when client changes => refcode changes => url needs redirect
function ChangeGroupsClient(props) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [Client, setClient] = useState("");
  const handleClose = () => {
    setShow(false);
    setClient("");
  };
  const handleShow = () => setShow(true);

  const [AllClients, setAllClients] = useState([]);

  const getAllClients = () => {
    axios
      .get(GET_ALL_CLIENTS, {
        headers: headers,
      })
      .then((res) => {
        setAllClients(res.data.all_clients.map((client) => client.name));
        setLoaded(true);
      });
  };

  const updateGroupsClient = () => {
    axios({
      method: "post",
      url: CHANGE_GROUPS_CLIENT + props.group.refcode,
      headers: headers,
      data: { client: Client },
    })
      .then((res) => {
        window.location.href =
          "/group_management/group/" + res.data.new_refcode;
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
        title={"edit client"}
        id={"edit_client"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
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
          <Modal.Title>Change Client For {props.group.refcode} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            onChange={(e) => {
              setClient(e.target.innerText);
            }}
            options={AllClients}
            disabled={!loaded}
            disableClearable
            value={Client}
            style={{ width: "40%", display: "inline-block", marginLeft: 15 }}
            renderInput={(params) => (
              <TextField {...params} label="Select Client" variant="outlined" />
            )}
          />

          <div style={{ float: "right" }}>
            <AddClientModal redir={false} set_client={(e) => setClient(e)} />
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
            <BsInfoSquare
              style={{
                color: "#F3702D",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            If client is changed, group's refcode will change too
            {Client === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Client === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select an Client
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
            disabled={!Client}
            onClick={() => {
              handleClose();
              updateGroupsClient();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeGroupsClient;
