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
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;
const CHANGE_PAX = "http://localhost:8000/api/groups/change_number_of_people/";

function ChangeNumberOfPeople(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [NumberOfPeople, setNumberOfPeople] = useState(
    props.group.number_of_people
  );
  // Hit back end to update number of people
  const updateNumberOfPeople = () => {
    axios({
      method: "post",
      url: CHANGE_PAX + props.group.refcode,
      headers: headers,
      data: { number_of_people: NumberOfPeople },
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
        title={"edit PAX"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={handleShow}
      />
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change Number of people For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            style={{ width: 200 }}
            type="number"
            value={NumberOfPeople}
            onInput={(e) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 3);
            }}
            className="form-control"
            onChange={(e) => setNumberOfPeople(e.currentTarget.value)}
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
            Number of people input maximum number is 999
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateNumberOfPeople();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeNumberOfPeople;
