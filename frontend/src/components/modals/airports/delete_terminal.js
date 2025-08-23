// Built-ins
import React from "react";

// Icons / Images
import { AiFillDelete } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const DELETE_TERMINAL =
  "http://localhost:8000/api/data_management/delete_terminal/";

// It shows a dark background with the delete option or cancel only
function DeleteTerminalModal(props) {
  const [open, setOpen] = React.useState(false);

  const deleteTerminal = () => {
    axios({
      method: "post",
      url: DELETE_TERMINAL,
      headers: headers,
      data: {
        terminal_id: props.terminal_id,
      },
    })
      .then((res) => {
        props.update_state(res.data.airport);
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
        <h1 style={{ color: "red" }}>Delete terminal</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this terminal?</p>
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
            deleteTerminal();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteTerminalModal;
