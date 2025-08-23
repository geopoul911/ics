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

const DELETE_IMAGE =
  "http://localhost:8000/api/data_management/delete_gallery_image/";

function getObjectId() {
  return window.location.pathname.split("/")[3];
}

function DeleteImageModal(props) {
  const [open, setOpen] = React.useState(false);
  const deleteImage = () => {
    axios({
      method: "post",
      url: DELETE_IMAGE + getObjectId(),
      headers: headers,
      data: {
        object_type: props.object_type,
        object_id: props.object_id,
        image_id: props.image_id,
      },
    })
      .then((res) => {
        props.remount(res.data.object);
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
      trigger={<Button color="red"> Delete Photo</Button>}
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Image</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this image?</p>
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
            deleteImage();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteImageModal;
