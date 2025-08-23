// Built-ins
import React, { useState, useEffect } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning } from "react-icons/ai";


// Modules / Functions
import { Button } from "semantic-ui-react";
import { Modal, Form, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

function ChangePricePerPerson(props) {
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currency, setCurrency] = useState("EUR");

  const [sgl, setSGL] = useState(props.td.price_per_sgl ? props.td.price_per_sgl : "0");
  const [dblForSglUse, setDblForSglUse] = useState(props.td.price_per_dbl_for_single_use ? props.td.price_per_dbl_for_single_use : "0");
  const [dbl, setDBL] = useState(props.td.price_per_dbl ? props.td.price_per_dbl : "0");
  const [twin, setTwin] = useState(props.td.price_per_twin ? props.td.price_per_twin : "0");
  const [triple, setTriple] = useState(props.td.price_per_triple ? props.td.price_per_triple : "0");
  const [quad, setQuad] = useState(props.td.price_per_quad ? props.td.price_per_quad : "0");
  const [suite, setSuite] = useState(props.td.price_per_suite ? props.td.price_per_suite : "0");
  const [fiveBed, setFiveBed] = useState(props.td.price_per_five_bed ? props.td.price_per_five_bed : "0");
  const [sixBed, setSixBed] = useState(props.td.price_per_six_bed ? props.td.price_per_six_bed : "0");
  const [sevenBed, setSevenBed] = useState(props.td.price_per_seven_bed ? props.td.price_per_seven_bed : "0");
  const [eightBed, setEightBed] = useState(props.td.price_per_eight_bed ? props.td.price_per_eight_bed : "0");
  const [freeSingles, setFreeSingles] = useState(props.td.free_singles ? props.td.free_singles : "0");
  const [freeHalfTwins, setFreeHalfTwins] = useState(props.td.free_half_twins ? props.td.free_half_twins : "0");
  const [freeHalfDoubles, setFreeHalfDoubles] = useState(props.td.free_half_doubles ? props.td.free_half_doubles : "0");


  useEffect(() => {
    setSGL(props.td.price_per_sgl || "0");
    setDblForSglUse(props.td.price_per_dbl_for_single_use || "0");
    setDBL(props.td.price_per_dbl || "0");
    setTwin(props.td.price_per_twin || "0");
    setTriple(props.td.price_per_triple || "0");
    setQuad(props.td.price_per_quad || "0");
    setSuite(props.td.price_per_suite || "0");
    setFiveBed(props.td.price_per_five_bed || "0");
    setSixBed(props.td.price_per_six_bed || "0");
    setSevenBed(props.td.price_per_seven_bed || "0");
    setEightBed(props.td.price_per_eight_bed || "0");
    setFreeSingles(props.td.free_singles || "0");
    setFreeHalfTwins(props.td.free_half_twins || "0");
    setFreeHalfDoubles(props.td.free_half_doubles || "0");
  }, [props.td]); // Depend on props.td to re-run if it changes

  // const updatePricePerPerson = () => {
  //   props.updateIsLoaded();
  //   axios({
  //     method: "post",
  //     url: CHANGE_PRICE_PER_PERSON + props.group.refcode,
  //     headers: headers,
  //     data: {
  //       td_id: props.td_id,
  //       price_per_person: pricePerPerson ? currencies[currency] + ' ' + String(pricePerPerson) : null,
  //     },
  //   })
  //     .then((res) => {
  //       props.update_state(res.data.model);
  //       props.updateIsLoaded();
  //     })
  //     .catch((e) => {
  //       props.updateIsLoaded();
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: e.response.data.errormsg,
  //       });
  //     });
  // };

  return (
    <>
      <FiEdit2
        title={"Edit Price Per Room"}
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
          <Modal.Title>Change Price Per Room for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="1">
            Currency:
          </Form.Label>
          <Col sm="10">
            <select
              className="form-control"
              onChange={(e) => setCurrency(e.target.value)}
              style={{ margin: 10, width: 200 }}
              value={currency}
            >
              <option value="EUR"> € Euro (EUR) </option>
              <option value="GBP"> £ Pound Sterling (GBP) </option>
              <option value="USD"> $ US Dollar (USD) </option>
              <option value="CAD"> $ Canadian Dollar (CAD) </option>
              <option value="AUD"> $ Australian Dollar (AUD) </option>
              <option value="CHF"> ₣ Swiss Franc (CHF) </option>
              <option value="JPY"> ¥ Japanese Yen (JPY) </option>
              <option value="NZD"> $ New Zealand Dollar (NZD) </option>
              <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
              <option value="SGD"> $ Singapore Dollar (SGD) </option>
            </select>
          </Col>
          <div className='grey-powerline'></div>
            {props.group.room_desc && props.group.room_desc.includes("Single") &&
              <>
                <Form.Label column sm="3">
                  Price per Single:
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={sgl}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setSGL(e.currentTarget.value)}
                  ></input>
                </Col>
                <Form.Label column sm="3">
                  Free Singles:
                </Form.Label>
                <Col sm="2">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={freeSingles}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setFreeSingles(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Double for single use") &&
              <>
                <Form.Label column sm="3">
                  Price per Double for Single Use:
                </Form.Label>
                <Col sm="8">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={dblForSglUse}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setDblForSglUse(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Double:") &&
              <>
                <Form.Label column sm="3">
                  Price per Double :
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={dbl}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setDBL(e.currentTarget.value)}
                  ></input>
                </Col>
                <Form.Label column sm="3">
                  Free Half ( 1/2 ) Doubles :
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={freeHalfDoubles}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setFreeHalfDoubles(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Twin") &&
              <>
                <Form.Label column sm="3">
                  Price per Twin :
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={twin}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setTwin(e.currentTarget.value)}
                  ></input>
                </Col>
                <Form.Label column sm="3">
                  Free Half ( 1/2 ) Twins :
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={freeHalfTwins}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setFreeHalfTwins(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Triple:") &&
              <>
                <Form.Label column sm="3">
                  Price per Triple:
                </Form.Label>
                <Col sm="8">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={triple}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setTriple(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Quad") &&
              <>
                <Form.Label column sm="3">
                  Price per Quad:
                </Form.Label>
                <Col sm="8">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={quad}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setQuad(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Five Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Five Bed :
                </Form.Label>
                <Col sm="8">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={fiveBed}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setFiveBed(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Six Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Six Bed :
                </Form.Label>
                <Col sm="8">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={sixBed}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setSixBed(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Seven Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Seven Bed :
                </Form.Label>
                <Col sm="8">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={sevenBed}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setSevenBed(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Eight Bed") &&
              <>
              <Form.Label column sm="3">
                Price per Eight Bed :
              </Form.Label>
              <Col sm="8">
                <input style={{ width: 120, marginBottom: 10 }} type="number" value={eightBed}
                  onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                  className="form-control"
                  onChange={(e) => setEightBed(e.currentTarget.value)}
                ></input>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Eight Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Suite :
                </Form.Label>
                <Col sm="6">
                  <input style={{ width: 120, marginBottom: 10 }} type="number" value={suite}
                    onInput={(e) => { e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3);}}
                    className="form-control"
                    onChange={(e) => setSuite(e.currentTarget.value)}
                  ></input>
                </Col>
              </>
            }
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <ul className="mr-auto" style={{ margin: 0, padding: 0, color: "red" }}>
              <li>
                 <AiOutlineWarning style={warningStyle} /> Updating Price Per Room will also affect pending payments.
              </li>
            </ul>
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            // disabled={!pricePerPerson}
            onClick={() => {
              handleClose();
              // updatePricePerPerson();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePricePerPerson;
