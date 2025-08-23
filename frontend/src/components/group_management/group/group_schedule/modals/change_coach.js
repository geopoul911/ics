// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { CgDanger } from "react-icons/cg";
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {
  Button,
  Checkbox,
  Icon,
  Header,
  Modal as SUIModal,
} from "semantic-ui-react";
import { Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Custom Made Components
import AddCoachModal from "../../../../modals/create/add_coach_modal";

// Variables
window.Swal = Swal;

const CHANGE_COACH = "http://localhost:8000/api/groups/change_coach/";
const GET_COACHES_ = "http://localhost:8000/api/view/get_all_coaches/";
const CHECK_FOR_COACH_CONFLICTS =
  "http://localhost:8000/api/groups/check_for_coach_conflict/";

function ChangeCoach(props) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  let [coach_conflict, set_coach_conflict] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Coach, setCoach] = useState(props.coach ? props.coach : "");
  let [AllCoaches, setAllCoaches] = useState([]);
  let [conflicted_groups, setconflicted_groups] = useState([]);
  const [UpdateRestOfDays, setUpdateRestOfDays] = React.useState(false);

  const handleCheckBox = () => {
    setUpdateRestOfDays(!UpdateRestOfDays);
  };

  const updateCoach = () => {
    axios({
      method: "post",
      url: CHECK_FOR_COACH_CONFLICTS + props.group.refcode,
      headers: headers,
      data: {
        td_id: props.td_id,
        coach: Coach,
        update_rest_of_days: UpdateRestOfDays,
      },
    })
      .then((res) => {
        if (res.data.has_conflict) {
          setconflicted_groups(res.data.conflicted_groups);
          set_coach_conflict(true);
        } else {
          props.updateIsLoaded();
          axios({
            method: "post",
            url: CHANGE_COACH + props.group.refcode,
            headers: headers,
            data: {
              td_id: props.td_id,
              coach: Coach,
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
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const updateCoachAnyway = () => {
    axios({
      method: "post",
      url: CHANGE_COACH + props.group.refcode,
      headers: headers,
      data: {
        td_id: props.td_id,
        coach: Coach,
        update_rest_of_days: UpdateRestOfDays,
      },
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

  const getCoaches = () => {
    axios
      .get(GET_COACHES_, {
        headers: headers,
      })
      .then((res) => {
        setAllCoaches(
          res.data.all_coaches.map(
            (coach) =>
              coach.id +
              ") " +
              coach.name +
              "--" +
              coach.coach_operator +
              "--" +
              coach.plate_number
          )
        );
        setLoaded(true);
      });
  };

  return (
    <>
      <FiEdit2
        title={"Edit Coach"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getCoaches();
          setUpdateRestOfDays(false);
        }}
      />
      {coach_conflict ? (
        <>
          <SUIModal basic open={coach_conflict} className="conflict_modal">
            <Header icon>
              <Icon name="warning sign" style={{ color: "orange" }} />
              <h1 style={{ color: "orange" }}>Coach Conflict</h1>
            </Header>
            <SUIModal.Content id="coach_conflict_content">
              <p style={{ textAlign: "center", color: 'red' }}>
                This coach exists in another travelday with the same date
                provided.
              </p>
              <ul>
                {conflicted_groups.map((e) => (
                  <li style={{ fontSize: 12, textAlign: "center" }}>
                    Group :
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={"/group_management/group/" + e.split(" - ")[0]}
                    >
                      {e.split(" - ")[0]}
                    </a>
                    Date : {e.split(" - ")[1]}
                    Coach : {Coach.split(")")[1]}
                  </li>
                ))}
              </ul>
              <p style={{ textAlign: "center", color: 'red' }}> Update anyway?</p>
            </SUIModal.Content>
            <SUIModal.Actions>
              <Button
                basic
                inverted
                onClick={() => {
                  setShow(false);
                  set_coach_conflict(false);
                }}
              >
                <Icon name="remove" /> No
              </Button>
              <Button
                inverted
                style={{ color: "white" }}
                color="orange"
                onClick={() => {
                  setShow(false);
                  updateCoachAnyway();
                  set_coach_conflict(false);
                }}
              >
                <Icon name="checkmark" /> Yes
              </Button>
            </SUIModal.Actions>
          </SUIModal>
        </>
      ) : (
        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Coach for {props.date} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Autocomplete
              options={AllCoaches}
              className={"select_coach"}
              onChange={(e) => {
                setCoach(e.target.innerText);
              }}
              value={Coach}
              style={{ width: 300, display: "inline-block" }}
              disabled={!loaded}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select coach"
                  variant="outlined"
                />
              )}
            />
            <div style={{ float: "right" }}>
              <AddCoachModal redir={false} set_coach={(e) => setCoach(e)} />
            </div>
            {loaded ? (
              ""
            ) : (
              <Spinner
                animation="border"
                variant="info"
                size="sm"
                style={{ position: "fixed", marginTop: 20, marginLeft: 10 }}
              />
            )}
            <div style={{ marginTop: 20 }}>
              <Checkbox
                label={"All upcoming days?"}
                value={UpdateRestOfDays}
                onChange={handleCheckBox}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <small className="mr-auto">
              <CgDanger
                style={{
                  color: "red",
                  fontSize: "1.5em",
                  marginRight: "0.5em",
                }}
              />
              Changing travelday's coach might cause conflicts
            </small>
            <Button color="red" onClick={handleClose}>
              Close
            </Button>
            <Button
              color="green"
              onClick={() => {
                updateCoach();
                handleClose();
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default ChangeCoach;
