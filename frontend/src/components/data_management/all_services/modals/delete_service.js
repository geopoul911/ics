// Built-ins
import React from "react";

// Modules / Functions
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Icons / Images
import { AiFillDelete } from "react-icons/ai";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const DELETE_SERVICE = "http://localhost:8000/api/groups/delete_service/";

function getRefcode(pathname) {
  return pathname.split("/")[3];
}

function DeleteServiceModal(props) {
  const [open, setOpen] = React.useState(false);
  const deleteService = () => {
    axios({
      method: "post",
      url: DELETE_SERVICE + getRefcode(window.location.pathname),
      headers: headers,
      data: {
        service_id: props.service_id,
      },
    })
      .then((res) => {
        props.update_state(res.data.group);
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
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <AiFillDelete id="delete_group_document_icon" title="delete Service" />
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Service</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this Service?</p>
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
            deleteService();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteServiceModal;
