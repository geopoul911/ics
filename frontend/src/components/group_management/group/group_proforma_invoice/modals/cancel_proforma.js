// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

import { MdCancel } from "react-icons/md";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CANCEL_PROFORMA = "http://localhost:8000/api/groups/cancel_proforma/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function CancelProforma(props) {
  const [open, setOpen] = React.useState(false);

  const cancelProforma = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: CANCEL_PROFORMA + getRefcode(),
      headers: headers,
    })
      .then((res) => {
        props.update_state(res.data.proforma);
      })
      .catch((e) => {
        console.log(e)
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
          color='red'
          style={{float: 'right', marginBottom: 0}}
          disabled={(localStorage.user_id !== "84" && localStorage.user_id !== "87" && localStorage.user_id !== "88")}
        >
          <MdCancel /> Cancel Proforma
        </Button>
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Cancel Proforma</h1>
      </Header>
      <Modal.Content>
        <p style={{textAlign: 'center', color: 'white'}}>
          Are you sure you want to cancel this proforma?
        </p>
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
            cancelProforma();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default CancelProforma;
