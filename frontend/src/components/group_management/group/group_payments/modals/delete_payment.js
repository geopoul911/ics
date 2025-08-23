// Built-ins
import React from "react";

// Modules / Functions
import axios from "axios";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Icons-Images
import { AiFillDelete } from "react-icons/ai";

// Variables
window.Swal = Swal;

const DELETE_PAYMENT = "http://localhost:8000/api/groups/delete_payment/";

let del_doc_icon_style = {
  color: "red",
  fontSize: "1.7em",
  marginRight: 10,
  marginTop: 5,
};

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function DeletePayment(props) {
  const [open, setOpen] = React.useState(false);

  const deletePayment = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: DELETE_PAYMENT,
      headers: headers,
      data: {
        type: "Group",
        payment_id: props.payment_id,
        refcode: getRefcode(),
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
      })
      .catch((e) => {
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
        <AiFillDelete
          className="payment_doc_icon"
          style={del_doc_icon_style}
          title="delete Contract Document"
        />
      }
    >
      <Header icon>
        <Icon name="delete" style={{ color: "red" }} />
        <h1 style={{ color: "red" }}>Delete selected payment</h1>
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete this payment?</p>
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
            deletePayment();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default DeletePayment;
