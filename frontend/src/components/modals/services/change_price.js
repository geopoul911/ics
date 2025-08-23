// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PRICE = "http://localhost:8000/api/data_management/change_price/";

// Modal's content
function ChangeDate(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [price, setPrice] = useState(0);

  const update_Price = () => {
    axios({
      method: "post",
      url: CHANGE_PRICE,
      headers: headers,
      data: {
        service_id: props.service_id,
        price: price,
      },
    })
      .then((res) => {
        props.update_state(res.data.service);
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
        title={"edit service's date"}
        id={"edit_service_name"}
        onClick={() => {
          handleShow();
          setPrice(0);
        }}
        className={"edit_icon"}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change price for {props.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: 35 }}>
            <label style={{ paddingTop: 5 }}> Enter Price: </label>
            <input
              type="number"
              onInput={(e) => {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, 5);
              }}
              className="form-control add_service_input"
              onChange={(e) => setPrice(e.currentTarget.value)}
            ></input>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Price();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeDate;
