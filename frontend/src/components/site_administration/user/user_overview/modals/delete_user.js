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

const DELETE_USER = "http://localhost:8000/api/site_admin/del_usr/";

function DeleteUserModal(props) {
  const [open, setOpen] = React.useState(false);

  const deleteUser = () => {
    axios({
      method: "post",
      url: DELETE_USER,
      headers: headers,
      data: {
        user_id: props.user_id,
      },
    })
      .then((res) => {
        window.location.href = "/site_administration/all_users";
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User deleted successfully",
        });
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
    <Modal basic onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} size="small" trigger={<Button color="red"> Delete User </Button>}>
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete User</h1>
      </Header>
      <Modal.Content>
        <p> Are you sure you want to delete this User? </p>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          inverted
          color="red"
          onClick={() => {setOpen(false); deleteUser();}}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteUserModal;
