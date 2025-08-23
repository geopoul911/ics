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

const DELETE_TRAVELDAY = "http://localhost:8000/api/groups/delete_travelday/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function DeleteTravelday(props) {
  const [open, setOpen] = React.useState(false);

  const deleteTravelday = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    props.updateIsLoaded();
    axios({
      method: "post",
      url: DELETE_TRAVELDAY + getRefcode(),
      headers: headers,
      data: {
        type: "Group",
        travelday_id: props.traveldays[props.active_row - 1]["id"],
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
      trigger={<Button color="red" disabled={props.active_row < 1}> Delete travelday</Button>}
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete selected travelday</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this travelday?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          inverted
          color="red"
          onClick={() => {setOpen(false); deleteTravelday(); }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteTravelday;
