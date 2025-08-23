// Built-ins
import React from "react";

// Functions / Modules
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Icons / Images
import { AiFillDelete } from "react-icons/ai";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const DELETE_DRIVER_DOCUMENT =
  "http://localhost:8000/api/data_management/delete_driver_document/";

let delDocIconStyle = {
  color: "red",
  fontSize: "1.7em",
  marginRight: 10,
  marginTop: 5,
  float: "right",
};

function DeleteDriverDocument(props) {
  const [open, setOpen] = React.useState(false);
  const deleteDriverDocument = () => {
    axios({
      method: "post",
      url: DELETE_DRIVER_DOCUMENT,
      headers: headers,
      data: {
        driver_id: props.driver_id,
        document_id: props.document_id,
        document_name: props.document_name,
        type: props.type,
      },
    })
      .then((res) => {
        window.location.reload(false);
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
          className="driver_doc_icon"
          style={delDocIconStyle}
          id="delete_group_document_icon"
          title="delete Driver Document"
        />
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Document</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this document?</p>
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
            deleteDriverDocument();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteDriverDocument;
