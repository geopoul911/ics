// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button, Icon, Header, Modal as SUIModal } from "semantic-ui-react";
import axios from "axios";
import DatePicker from "react-date-picker";
import moment from "moment";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_DATE = "http://localhost:8000/api/groups/change_travelday_date/";
const CHECK_FOR_DATE_CONFLICTS = "http://localhost:8000/api/groups/check_for_date_conflict/";

function ChangeDate(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedDate, setSelectedDate] = useState(new Date(props.date));
  let [invalid_drivers, setinvalid_drivers] = useState([]);
  let [invalid_coaches, setinvalid_coaches] = useState([]);
  let [date_conflict, set_date_conflict] = useState(false);

  const updateDate = () => {
    axios({
      method: "post",
      url: CHECK_FOR_DATE_CONFLICTS + props.group.refcode,
      headers: headers,
      data: {
        type: "Group",
        td_id: props.td_id,
        // Make date human readable
        date: moment(selectedDate).format("YYYY-MM-DD"),
      },
    })
      .then((res) => {
        if (res.data.driver_conflict) {
          setinvalid_drivers(res.data.invalid_drivers);
          setinvalid_coaches(res.data.invalid_coaches);
          set_date_conflict(true);
        } else {
          props.updateIsLoaded();
          axios({
            method: "post",
            url: CHANGE_DATE,
            headers: headers,
            data: {
              type: "Group",
              td_id: props.td_id,
              // Make date human readable
              date: moment(selectedDate).format("YYYY-MM-DD"),
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

  const updateDateAnyway = () => {
    axios({
      method: "post",
      url: CHANGE_DATE,
      headers: headers,
      data: {
        type: "Group",
        td_id: props.td_id,
        date: moment(selectedDate).format("YYYY-MM-DD"),
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

  return (
    <>
      <FiEdit2
        title={"Edit Date"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
        }}
      />
      {date_conflict ? (
        <>
          <SUIModal basic open={date_conflict} className="conflict_modal">
            <Header icon>
              <Icon name="warning sign" style={{ color: "orange" }} />
              <h1 style={{ color: "orange" }}>Date Conflict</h1>
            </Header>
            <SUIModal.Content>
              <p style={{ textAlign: "center", color: 'red' }}>
                Date's driver or coach exists in another group with the same
                date provided
              </p>
              <ul>
                {invalid_drivers.map((e) => (
                  <li style={{ fontSize: 12, textAlign: "center" }}>
                    Driver already exists in Group :
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={"/group_management/group/" + e.split(" - ")[0]}
                    >
                      {e.split(" - ")[0]}
                    </a>
                    Date : {e.split(" - ")[1]}
                  </li>
                ))}
                {invalid_coaches.map((e) => (
                  <li style={{ fontSize: 12, textAlign: "center" }}>
                    Coach already exists in Group :
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={"/group_management/group/" + e.split(" - ")[0]}
                    >
                      {e.split(" - ")[0]}
                    </a>
                    Date : {e.split(" - ")[1]}
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
                  set_date_conflict(false);
                }}
              >
                <Icon name="remove" /> No
              </Button>
              <Button
                inverted
                style={{ color: "white" }}
                color="orange"
                onClick={() => {
                  set_date_conflict(false);
                  updateDateAnyway();
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
            <Modal.Title>Change Date for {props.date} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePicker
              clearIcon={null}
              value={selectedDate}
              format="dd/MM/yyyy"
              onChange={(e) => {
                setSelectedDate(e);
              }}
            />
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
              Changing travelday's date might cause conflicts
            </small>
            <Button color="red" onClick={handleClose}>
              Close
            </Button>
            <Button
              color="green"
              onClick={() => {
                updateDate();
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

export default ChangeDate;
