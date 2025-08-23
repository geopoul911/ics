// Built-ins
import React from "react";

// Icons / Images
import { AiFillDelete } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

const DELETE_NOTE = "http://localhost:8000/api/data_management/delete_note/";

function DeleteNote(props) {
  const [open, setOpen] = React.useState(false);

  const deleteNote = () => {
    axios({
      method: "post",
      url: DELETE_NOTE + props.object_id,
      headers: headers,
      data: {
        object_type: props.object_type,
        note_id: props.note_id,
      },
    })
      .then((res) => {
        props.update_notes(res.data.notes);
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
      trigger={<AiFillDelete id="delete_note_icon" title="delete note" />}
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Note</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this note?</p>
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
            deleteNote();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteNote;
