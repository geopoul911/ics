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

const DELETE_CONTACT_PERSON =
  "http://localhost:8000/api/data_management/delete_contact_person/";

function DeleteContactPerson(props) {
  const [open, setOpen] = React.useState(false);

  const deleteContactPerson = () => {
    axios({
      method: "post",
      url: DELETE_CONTACT_PERSON + props.object_id,
      headers: headers,
      data: {
        object_type: props.object_type,
        contact_person_id: props.contact_person_id,
      },
    })
      .then((res) => {
        props.add_contact_person(res.data.contact_persons);
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
        <AiFillDelete
          id="delete_contact_person_icon"
          title="Delete Contact Person"
        />
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Contact Person</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this contact person?</p>
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
            deleteContactPerson();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteContactPerson;
