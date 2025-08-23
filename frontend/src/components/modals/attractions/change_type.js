// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";

// Modules / Functions
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Modules / Functions
import { Modal, Col } from "react-bootstrap";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_ATT_TYPE =
  "http://localhost:8000/api/data_management/change_att_type/";

const AttractionDescr = {
  HS: "Monuments, Landmarks, Ancient Ruins, and heritage sites.",
  MS: "Art Museums, History Museums, Science Museums, and Cultural Museums",
  TP: "Amusement parks with rides, shows, and entertainment.",
  NP: "National parks, wildlife reserves, and nature conservation areas.",
  ZA: "Places to observe and learn about animals and marine life.",
  BG: "Gardens with diverse plant collections and landscapes.",
  LM: "Iconic structures or sites that hold significance.",
  AM: "Unique and impressive architectural structures.",
  AG: "Spaces to showcase and appreciate various forms of art.",
  CF: "Celebrations of local traditions, music, and cuisine.",
  SA: "Stadiums and arenas for sporting events and concerts",
  BC: "Scenic shorelines for relaxation and water activities.",
  SD: "Vibrant markets, malls, and shopping streets.",
  AD: "Places for thrilling activities like zip-lining, rock climbing, and rope courses.",
  SC: "Interactive museums that explore science and technology.",
  OS: "Facilities for stargazing and learning about astronomy.",
  CP: "Historical royal residences and fortresses.",
  WV: " Historical royal residences and fortresses.",
  CT: "Food and beverage-related tours and tastings.",
  CD: "Cathedrals And Churches.",
};

function ChangeBodyNumber(props) {
  const [show, setShow] = useState(false);
  const [Type, setType] = useState(
    props.attraction_type ? props.attraction_type : "HS"
  );
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateType = () => {
    axios({
      method: "post",
      url: CHANGE_ATT_TYPE,
      headers: headers,
      data: {
        attraction_id: props.object_id,
        type: Type,
      },
    })
      .then((res) => {
        props.update_state(res.data.attraction);
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
        title={"Edit Attraction's Type"}
        id={"edit_attraction_name"}
        onClick={() => {
          handleShow();
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
          <Modal.Title> Change type for {props.object_name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col sm="10" style={{ marginBottom: 20 }}>
            <select
              className="form-control"
              style={{ width: "93%", marginLeft: 0 }}
              onChange={(e) => {
                setType(e.target.value);
              }}
              value={Type}
            >
              <option value="HS"> Historical Sites </option>
              <option value="MS"> Museums </option>
              <option value="TP"> Theme Parks </option>
              <option value="NP"> Natural Parks </option>
              <option value="ZA"> Zoos And Aquariums </option>
              <option value="BG"> Botanical Gardens </option>
              <option value="LM"> Landmarks </option>
              <option value="AM"> Architectural Marvels </option>
              <option value="AG"> Art Galleries </option>
              <option value="CF"> Cultural Festivals </option>
              <option value="SA"> Sport Arenas </option>
              <option value="BC"> Beaches and Coastal Areas </option>
              <option value="SD"> Shopping Districts </option>
              <option value="AD"> Adventure Parks </option>
              <option value="SC"> Science Centers </option>
              <option value="OS"> Observatory </option>
              <option value="CP"> Castles and Palaces </option>
              <option value="WV"> Wineries and Vineyards </option>
              <option value="CT"> Culinary Tours </option>
              <option value="CD"> Cathedrals And Churches </option>
            </select>
          </Col>
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
            {AttractionDescr[Type]}
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateType();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeBodyNumber;
