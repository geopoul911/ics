// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const DELETE_SCHEDULE = "http://localhost:8000/api/groups/delete_schedule/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function DeleteSchedule(props) {
  const [open, setOpen] = React.useState(false);

  const deleteSchedule = () => {
    props.updateIsLoaded();
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: DELETE_SCHEDULE + getRefcode(),
      headers: headers,
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
        text: e.response.data["errormsg"],
      });
    });
  };

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <Button color="red" disabled={props.group.group_travelday.length === 0}>
          Delete Whole Schedule
        </Button>
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete selected schedule</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete All of the days?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          inverted
          color="red"
          onClick={() => {
            setOpen(false);
            deleteSchedule();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteSchedule;
