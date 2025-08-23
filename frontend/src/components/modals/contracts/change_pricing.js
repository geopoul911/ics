// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PRICING =
  "http://localhost:8000/api/data_management/change_pricing/";

function ChangePricing(props) {
  const [show, setShow] = useState(false);
  const [pricing, setPricing] = useState("PR");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Pricing = () => {
    axios({
      method: "post",
      url: CHANGE_PRICING,
      headers: headers,
      data: {
        contract_id: props.object_id,
        pricing: pricing,
      },
    })
      .then((res) => {
        props.update_state(res.data.contract);
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
        title={"edit contract's pricing"}
        id={"edit_contract_name"}
        onClick={() => {
          handleShow();
          setPricing("PR");
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
          <Modal.Title>Change pricing for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            style={{ width: 300 }}
            onChange={(e) => {
              setPricing(e.target.value);
            }}
          >
            <option value="PR"> Per Room </option>
            <option value="PP"> Per Person </option>
          </select>
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
            Contract's pricing dropdown list includes the 10 most common
            currencies in the world.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Pricing();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePricing;
