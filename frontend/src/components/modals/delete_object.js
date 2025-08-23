// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const DELETE_AGENT = "http://localhost:8000/api/data_management/delete_object/";

function DeleteObjectModal(props) {
  const [open, setOpen] = React.useState(false);

  const deleteObject = () => {
    axios({
      method: "post",
      url: DELETE_AGENT + props.object_id,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_name: props.object_name,
        object_type: props.object_type,
        refcode: props.refcode,
      },
    })
      .then((res) => {
        if (res.data.object_type === "Offer") {
          window.location.href = "/group_management/all_group_offers";
        } else {
          window.location.href = "/data_management/root";
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

  return (
    <Modal
      basic
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        <Button color="red" style={{ float: "right" }}>
          Delete {props.object_type}
        </Button>
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete {props.object_type}</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this {props.object_type}?</p>
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
            deleteObject();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteObjectModal;
