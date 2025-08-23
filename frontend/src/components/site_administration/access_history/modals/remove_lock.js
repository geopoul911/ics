// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
const REMOVE_LOCK = "http://localhost:8000/api/site_admin/remove_lock/";

function RemoveLock(props) {
  const [open, setOpen] = React.useState(false);

  const unlock_User = () => {
    axios({
      method: "post",
      url: REMOVE_LOCK,
      headers: headers,
      data: {
        username: props.username,
      },
    }).then((res) => {
      props.reset_filters();
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
          onClick={() => {
            setOpen();
          }}
        >
          Unlock User
        </Button>
      }
    >
      <Header icon>
        <Icon name="lock open" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}> Unlock User </h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to unlock access for this user?</p>
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
            unlock_User();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default RemoveLock;
