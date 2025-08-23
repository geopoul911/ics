// Built-ins
import React from "react";

// Icons
import { AiFillDelete } from "react-icons/ai";

// Functions / Modules
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const DELETE_SERVICE = "http://localhost:8000/api/groups/delete_offer_service/";

function DeleteOfferServiceModal(props) {
  const [open, setOpen] = React.useState(false);
  const deleteOfferService = () => {
    axios({
      method: "post",
      url: DELETE_SERVICE,
      headers: headers,
      data: {
        offer_id: props.offer_id,
        offer_service_id: props.offer_service_id,
      },
    })
      .then((res) => {
        props.update_state(res.data.offer);
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
          id="delete_group_document_icon"
          title="delete Offer's Service"
        />
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Offer's Service</h1>
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
            deleteOfferService();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteOfferServiceModal;
