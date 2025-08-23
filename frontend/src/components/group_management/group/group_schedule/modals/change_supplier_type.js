// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal, ListGroup } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PAYMENT_DATE =
  "http://localhost:8000/api/groups/change_supplier_type/";

function ChangeSupplierType(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [supplierType, setSupplierType] = useState("AG");

  const updateSupplierType = () => {
    axios({
      method: "post",
      url: CHANGE_PAYMENT_DATE,
      headers: headers,
      data: {
        td_id: props.td_id,
        supplier_type: supplierType,
        payment_id: props.payment_id,
        refcode: props.refcode,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
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
    <>
      <FiEdit2
        title={"Edit Payment's Date"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
        }}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change Supplier Type for Payment ( ID: {props.payment_id} )
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <select
              className="form-control"
              onChange={(e) => setSupplierType(e.target.value)}
              style={{ marginBottom: 10, width: "40%" }}
            >
              <option value="AG"> Agent </option>
              <option value="AL"> Airline </option>
              <option value="CO"> Coach Operator</option>
              <option value="CC"> Cruising Company</option>
              <option value="DMC"> DMC</option>
              <option value="FTA"> Ferry Ticket Agency</option>
              <option value="GD"> Guide</option>
              <option value="HTL"> Hotel</option>
              <option value="RS"> Repair Shop</option>
              <option value="RST"> Restaurant</option>
              <option value="SES"> Sport Event Supplier</option>
              <option value="TC"> Teleferik Company</option>
              <option value="TH"> Theater</option>
              <option value="TTA"> Train Ticket Agency</option>
            </select>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <BsInfoSquare
              style={{
                color: "#F3702D",
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
            Choose the type of supplier from the above categories
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              setSupplierType("AG");
              handleClose();
              updateSupplierType();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeSupplierType;
