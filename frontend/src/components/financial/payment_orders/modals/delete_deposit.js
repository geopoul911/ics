// Built-ins
import React from "react";

// Modules / Functions
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Icons / Images
import { AiFillDelete } from "react-icons/ai";

// Global Variables
import { headers } from "../../../global_vars";

// Variables
window.Swal = Swal;

const DELETE_DEPOSIT = "http://localhost:8000/api/financial/delete_deposit/";

let del_doc_icon_style = {
  color: "red",
  fontSize: "1.7em",
  marginRight: 10,
};

function DeleteDeposit(props) {
  const [open, setOpen] = React.useState(false);

  const deleteDeposit = () => {
    axios({
      method: "post",
      url: DELETE_DEPOSIT,
      headers: headers,
      data: {
        deposit_id: props.deposit_id,
        date: props.date,
      },
    })
      .then(() => {
        props.update_state();
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
          className="payment_doc_icon"
          style={del_doc_icon_style}
          title="Delete Deposit"
        />
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete Deposit</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to Remove this Deposit?</p>
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
            deleteDeposit();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeleteDeposit;
