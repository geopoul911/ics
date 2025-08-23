// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PRICE =
  "http://localhost:8000/api/groups/change_offer_service_price/";

// contains a dropdown which shows results from backend after user has focused in its field
function ChangePrice(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Price, setPrice] = useState("");

  const updatePrice = () => {
    axios({
      method: "post",
      url: CHANGE_PRICE,
      headers: headers,
      data: {
        type: props.type,
        offer_id: props.offer_id,
        service_id: props.service_id,
        price: Price,
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
    <>
      <FiEdit2
        title={"edit price"}
        className={"edit_icon"}
        style={{}}
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
          <Modal.Title>Change price for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            style={{ width: 200 }}
            type="number"
            value={Price}
            onInput={(e) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 5);
            }}
            className="form-control"
            onChange={(e) => setPrice(e.currentTarget.value)}
          ></input>
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
            Price is an integer field with max value of 99999.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              setPrice("");
              handleClose();
              updatePrice();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePrice;
