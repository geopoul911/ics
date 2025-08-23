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
const DELETE_GROUP = "http://localhost:8000/api/groups/del_grp/";

function DeleteGroupModal(props) {
  const [open, setOpen] = React.useState(false);

  const deleteGroup = () => {
    axios({
      method: "post",
      url: DELETE_GROUP + props.group.refcode,
      headers: headers,
    })
      .then(() => {
        window.location.href = "/group_management/all_groups";
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Group deleted successfully",
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
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <Button
          color="red"
          disabled={!props.can_del}
          style={{ float: "right" }}
        >
          Delete Group
        </Button>
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Group</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this Group?</p>
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
            deleteGroup();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteGroupModal;
