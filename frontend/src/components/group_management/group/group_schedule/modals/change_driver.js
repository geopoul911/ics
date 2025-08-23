// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import { Modal, ListGroup, Spinner } from "react-bootstrap";
import {
  Button,
  Checkbox,
  Icon,
  Header,
  Modal as SUIModal,
} from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Custom Made Components
import AddDriverModal from "../../../../modals/create/add_driver_modal";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_DRIVER = "http://localhost:8000/api/groups/change_driver/";
const GET_DRIVERS = "http://localhost:8000/api/view/get_all_drivers/";
const CHECK_FOR_DRIVER_CONFLICTS =
  "http://localhost:8000/api/groups/check_for_driver_conflict/";

function ChangeDriver(props) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  let [driver_conflict, set_driver_conflict] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Driver, setDriver] = useState(
    props.driver ? props.driver.id + ") " + props.driver.name : ""
  );
  let [AllDrivers, setAllDrivers] = useState([]);
  let [conflicted_groups, setconflicted_groups] = useState([]);
  const [UpdateRestOfDays, setUpdateRestOfDays] = React.useState(false);

  const handleCheckBox = () => {
    setUpdateRestOfDays(!UpdateRestOfDays);
  };

  const updateDriver = () => {
    axios({
      method: "post",
      url: CHECK_FOR_DRIVER_CONFLICTS + props.group.refcode,
      headers: headers,
      data: {
        td_id: props.td_id,
        driver: Driver,
        update_rest_of_days: UpdateRestOfDays,
      },
    })
      .then((res) => {
        if (res.data.has_conflict) {
          setconflicted_groups(res.data.conflicted_groups);
          set_driver_conflict(true);
        } else {
          props.updateIsLoaded();
          axios({
            method: "post",
            url: CHANGE_DRIVER + props.group.refcode,
            headers: headers,
            data: {
              td_id: props.td_id,
              driver: Driver,
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

  const updateDriverAnyway = () => {
    axios({
      method: "post",
      url: CHANGE_DRIVER + props.group.refcode,
      headers: headers,
      data: {
        td_id: props.td_id,
        driver: Driver,
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

  const getDrivers = () => {
    axios
      .get(GET_DRIVERS, {
        headers: headers,
      })
      .then((res) => {
        setAllDrivers(
          res.data.all_drivers.map(
            (driver) =>
              driver.id + ") " + driver.name + " - " + driver.coach_operator
          )
        );
        setLoaded(true);
      });
  };

  return (
    <>
      <FiEdit2
        title={"Edit Driver"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getDrivers();
          setUpdateRestOfDays(false);
        }}
      />
      {driver_conflict ? (
        <>
          <SUIModal basic open={driver_conflict} className="conflict_modal">
            <Header icon>
              <Icon name="warning sign" style={{ color: "orange" }} />
              <h1 style={{ color: "orange" }}>Driver Conflict</h1>
            </Header>
            <SUIModal.Content id="driver_conflict_content">
              <p style={{ textAlign: "center", color: 'red' }}>
                This driver exists in another travelday with the same date
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
                    Driver : {Driver.split(")")[1]}
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
                  set_driver_conflict(false);
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
                  updateDriverAnyway();
                  set_driver_conflict(false);
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
            <Modal.Title>Change Driver for {props.date} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              <ListGroup.Item>
                <Autocomplete
                  options={AllDrivers}
                  disabled={!loaded}
                  className={"select_airport"}
                  value={Driver}
                  onChange={(e) => {
                    setDriver(e.target.innerText);
                  }}
                  style={{ width: 400, display: "inline-block" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select driver"
                      variant="outlined"
                    />
                  )}
                />
                <div style={{ float: "right" }}>
                  <AddDriverModal
                    redir={false}
                    set_driver={(e) => setDriver(e)}
                  />
                </div>

                <div style={{ marginTop: 20 }}>
                  <Checkbox
                    label={"All upcoming days?"}
                    value={UpdateRestOfDays}
                    onChange={handleCheckBox}
                  />
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
              </ListGroup.Item>
            </ListGroup>
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
              Changing travelday's driver might cause conflicts
            </small>
            <Button color="red" onClick={handleClose}>
              Close
            </Button>
            <Button
              color="green"
              onClick={() => {
                updateDriver();
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

export default ChangeDriver;
