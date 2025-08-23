// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import { TextArea } from "semantic-ui-react";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const CHANGE_MEAL_DESC = "http://localhost:8000/api/groups/change_meal_desc/";

function ChangeMealDesc(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mealDesc, setMealDesc] = useState("");

  const updateMealDesc = () => {
    axios({
      method: "post",
      url: CHANGE_MEAL_DESC + props.group.refcode,
      headers: headers,
      data: { meal_desc: mealDesc },
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
        title={"Edit Meal Description"}
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
            Change Meal Description For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextArea
            onChange={(e) => setMealDesc(e.target.value.toUpperCase())}
            value={mealDesc}
            rows={4}
            cols={25}
            max={255}
            className="form-control"
            placeholder={"BB"}
          />
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
            Meal Description input maximum characters is 255
            {mealDesc.length < 3 || mealDesc.length > 255 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {mealDesc.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill the Meal Description Field
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {mealDesc.length > 255 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Make it less than 255 characters.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul
                  className="mr-auto"
                  style={{
                    margin: 0,
                    padding: 0,
                    marginTop: 10,
                    color: "green",
                  }}
                >
                  <li>
                    <AiOutlineCheckCircle style={checkStyle} />
                    Validated
                  </li>
                </ul>
              </>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={mealDesc.length < 2 || mealDesc.length > 255}
            onClick={() => {
              handleClose();
              updateMealDesc();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeMealDesc;
