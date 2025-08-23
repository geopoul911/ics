// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

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

const CHANGE_ROOM_DESC = "http://localhost:8000/api/groups/change_room_desc/";

function renderRoomDescString(sgl, dblForSglUse, dbl, twin, triple, quad, suite, fiveBed, sixBed, sevenBed, eightBed) {
  let descString = "";
  
  if (sgl !== "0") {
    descString += `Single: ${sgl} // `;
  }
  if (dblForSglUse !== "0") {
    descString += `Double for single use: ${dblForSglUse} // `;
  }
  if (dbl !== "0") {
    descString += `Double: ${dbl} // `;
  }
  if (twin !== "0") {
    descString += `Twin: ${twin} // `;
  }
  if (triple !== "0") {
    descString += `Triple: ${triple} // `;
  }
  if (quad !== "0") {
    descString += `Quad: ${quad} // `;
  }
  if (suite !== "0") {
    descString += `Suite: ${suite} // `;
  }
  if (fiveBed !== "0") {
    descString += `Five Bed: ${fiveBed} // `;
  }
  if (sixBed !== "0") {
    descString += `Six Bed: ${sixBed} // `;
  }
  if (sevenBed !== "0") {
    descString += `Seven Bed: ${sevenBed} // `;
  }
  if (eightBed !== "0") {
    descString += `Eight Bed: ${eightBed}`;
  }

 
  // Remove trailing ' // ' if it exists
  if (descString.endsWith(" // ")) {
    descString = descString.slice(0, -3);
  }
  
  return descString;
}

function ChangeRoomDesc(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [sgl, setSGL] = useState("0");
  const [dblForSglUse, setDblForSglUse] = useState("0");
  const [dbl, setDBL] = useState("0");
  const [twin, setTwin] = useState("0");
  const [triple, setTriple] = useState("0");
  const [quad, setQuad] = useState("0");

  const [suite, setSuite] = useState("0");

  const [suiteValues, setSuiteValues] = useState([]);

  const [fiveBed, setFiveBed] = useState("0");
  const [sixBed, setSixBed] = useState("0");
  const [sevenBed, setSevenBed] = useState("0");
  const [eightBed, setEightBed] = useState("0");

  const updateRoomDesc = () => {
    axios({
      method: "post",
      url: CHANGE_ROOM_DESC + props.group.refcode,
      headers: headers,
      data: {
        room_desc: renderRoomDescString(sgl, dblForSglUse, dbl, twin, triple, quad, suite, fiveBed, sixBed, sevenBed, eightBed),
        suite_values: suiteValues.reduce((sum, value) => sum + (parseInt(value) || 0), 0),
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

    // Handle change for individual suite inputs
    const handleSuiteChange = (index, value) => {
      const updatedValues = [...suiteValues];
      updatedValues[index] = value;
      setSuiteValues(updatedValues);
    };

  return (
    <>
      <FiEdit2
        title={"Edit Room Description"}
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
            Change Room Description For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Single :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={sgl}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setSGL(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Double For Single Use:
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={dblForSglUse}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setDblForSglUse(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Double :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={dbl}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setDBL(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Twin :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={twin}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setTwin(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Triple :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={triple}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setTriple(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Quad :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={quad}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setQuad(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Five Bed :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={fiveBed}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setFiveBed(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Six Bed :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={sixBed}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setSixBed(e.currentTarget.value)}
              ></input>
            </Col>

            <Form.Label column sm="3">
              Seven Bed :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={sevenBed}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setSevenBed(e.currentTarget.value)}
              ></input>
            </Col>
            <Form.Label column sm="3">
              Eight Bed :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={eightBed}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setEightBed(e.currentTarget.value)}
              ></input>
            </Col>


            <Form.Label column sm="3">
              Suite :
            </Form.Label>
            <Col sm="9">
              <input style={{ width: 200, marginBottom: 10 }} type="number" value={suite}
                onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                className="form-control"
                onChange={(e) => setSuite(e.currentTarget.value)}
              ></input>
            </Col>

            {Array.from({ length: Number(suite) }, (_, i) => (
              <>
                <Form.Label column sm="3">Suite's # {i + 1} Total PAX:</Form.Label>
                <Col sm="9">
                  <input
                    style={{ width: 200, marginBottom: 10 }}
                    type="number"
                    value={suiteValues[i] || "0"}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3); }}
                    className="form-control"
                    onChange={(e) => handleSuiteChange(i, e.currentTarget.value)}
                  />
                </Col>
              </>
            ))}

          </Form.Group>
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
            Room Description input maximum characters is 255
            {!renderRoomDescString(sgl, dblForSglUse, dbl, twin, triple, quad, suite, fiveBed, sixBed, sevenBed, eightBed) ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  <li>
                    <>
                      <AiOutlineWarning style={warningStyle} />
                      Add At least one room.
                    </>
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
                    <AiOutlineCheckCircle style={checkStyle} /> Validated
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
            disabled={!renderRoomDescString(sgl, dblForSglUse, dbl, twin, triple, quad, suite, fiveBed, sixBed, sevenBed, eightBed)}
            onClick={() => {
              handleClose();
              updateRoomDesc();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeRoomDesc;
