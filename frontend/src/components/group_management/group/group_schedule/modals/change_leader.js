// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, ListGroup, Spinner } from "react-bootstrap";
import { Button, Checkbox } from "semantic-ui-react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Custom Made Components
import AddLeaderModal from "../../../../modals/create/add_group_leader_modal";

// Variables
window.Swal = Swal;

const CHANGE_GROUP_LEADER =
  "http://localhost:8000/api/groups/change_group_leader/";
const GET_LEADERS = "http://localhost:8000/api/view/get_group_leaders/";

function ChangeGroupLeader(props) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [UpdateRestOfDays, setUpdateRestOfDays] = React.useState(false);

  const handleCheckBox = () => {
    setUpdateRestOfDays(!UpdateRestOfDays);
  };

  const [GroupLeader, setGroupLeader] = useState(
    props.leader ? props.leader : ""
  );
  let [AllLeaders, setAllLeaders] = useState([]);

  const updateGroupLeader = () => {
    props.updateIsLoaded();
    axios({
      method: "post",
      url: CHANGE_GROUP_LEADER,
      headers: headers,
      data: {
        group_leader: GroupLeader,
        td_id: props.td_id,
        update_rest_of_days: UpdateRestOfDays,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
        props.updateIsLoaded();
      })
      .catch((e) => {
        props.updateIsLoaded();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const getGroupLeaders = () => {
    axios
      .get(GET_LEADERS, {
        headers: headers,
      })
      .then((res) => {
        setAllLeaders(res.data.all_leaders.map((leader) => leader.name));
        setLoaded(true);
      });
  };

  return (
    <>
      <FiEdit2
        title={"Edit Leader"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getGroupLeaders();
        }}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change Group Leader For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item>
              <Autocomplete
                options={AllLeaders}
                className={"select_airport"}
                onChange={(e) => {
                  setGroupLeader(e.target.innerText);
                }}
                value={GroupLeader}
                style={{ width: "40%", margin: 10 }}
                disabled={!loaded}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Group Leader"
                    variant="outlined"
                  />
                )}
              />
              <div style={{ float: "right" }}>
                <AddLeaderModal
                  redir={false}
                  set_leader={(e) => setGroupLeader(e)}
                />
              </div>
              {loaded ? (
                ""
              ) : (
                <Spinner
                  animation="border"
                  variant="info"
                  size="sm"
                  style={{ position: "fixed", marginTop: 30 }}
                />
              )}
              <div style={{ marginTop: 20 }}>
                <Checkbox
                  label={"All upcoming days?"}
                  value={UpdateRestOfDays}
                  onChange={handleCheckBox}
                />
              </div>
            </ListGroup.Item>
          </ListGroup>
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
            You can manage Group leader's data at
            <a href="/data_management/all_group_leaders"> Data management </a>
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateGroupLeader();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeGroupLeader;
