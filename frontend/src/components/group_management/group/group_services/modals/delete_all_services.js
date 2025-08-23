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

const DELETE_ALL_SERVICES =
  "http://localhost:8000/api/groups/delete_all_services/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function DeleteAllServices(props) {
  const [open, setOpen] = React.useState(false);

  const deleteAllServices = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: DELETE_ALL_SERVICES + getRefcode(),
      headers: headers,
    })
      .then((res) => {
        props.update_state(res.data.model);
      })
      .catch((e) => {
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
          Delete All Services
        </Button>
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete All Services</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete All of the services?</p>
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
            deleteAllServices();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteAllServices;
