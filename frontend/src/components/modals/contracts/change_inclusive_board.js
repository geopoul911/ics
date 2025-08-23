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

const CHANGE_INCLUSIVE_BOARD =
  "http://localhost:8000/api/data_management/change_inclusive_board/";

function ChangeInclusiveBoard(props) {
  const [show, setShow] = useState(false);
  const [inclusiveBoard, setInclusiveBoard] = useState("BB");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_InclusiveBoard = () => {
    axios({
      method: "post",
      url: CHANGE_INCLUSIVE_BOARD,
      headers: headers,
      data: {
        contract_id: props.object_id,
        inclusive_board: inclusiveBoard,
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
        title={"edit contract's Inclusive Board"}
        id={"edit_contract_name"}
        onClick={() => {
          handleShow();
          setInclusiveBoard("BB");
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
          <Modal.Title>
            Change Inclusive Board for {props.object_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            style={{ width: 300 }}
            onChange={(e) => {
              setInclusiveBoard(e.target.value);
            }}
          >
            <option value="BB">Bed & Breakfast</option>
            <option value="HB">Half Board</option>
            <option value="FB">Full Board</option>
            <option value="AI">All inclusive</option>
            <option value="RO">Room Only</option>
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
            Contract's Inclusive Board
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_InclusiveBoard();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeInclusiveBoard;
