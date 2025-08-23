// Built-ins
import React, { useState, useEffect } from "react";

// Icons / Images
import { FaListAlt } from "react-icons/fa";

// Modules / Functions
import { Modal, Form, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";

// Variables
window.Swal = Swal;

const currencies = {
  'EUR': '€',
  'GBP': '£',
  'USD': '$',
  'CAD': '$',
  'AUD': '$',
  'CHF': '₣',
  'JPY': '¥',
  'NZD': '$',
  'CNY': '¥',
  'SGD': '$',
}


function PricePerRoomList(props) {
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  return (
    <>
      <FaListAlt className='list-icon'
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
          <Modal.Title>Price Per Room for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            Currency: {props.td.currency ? props.td.currency : 'EUR'} {currencies[props.td.currency ? props.td.currency : 'EUR']}
          </Form.Label>
          <div className='grey-powerline'></div>
            {props.group.room_desc && props.group.room_desc.includes("Single") &&
              <>
                <Form.Label column sm="3">
                  Price per Single:
                </Form.Label>
                <Col sm="3">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${sgl}`}
                    disabled
                    className="form-control"
                  />
                </Col>
                <Form.Label column sm="3">
                  Free Singles:
                </Form.Label>
                <Col sm="2">
                  <input style={{ width: 80, marginBottom: 10 }} type="text" value={`# ${freeSingles}`} disabled className="form-control"/>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Double for single use") &&
              <>
                <Form.Label column sm="3">
                  Price per Double for Single Use:
                </Form.Label>
                <Col sm="8">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${dblForSglUse}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Double:") &&
              <>
                <Form.Label column sm="3">
                  Price per Double :
                </Form.Label>
                <Col sm="3">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${dbl}`}
                    disabled
                    className="form-control"
                  />
                </Col>
                <Form.Label column sm="3">
                  Free Half ( 1/2 ) Doubles :
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="text" value={`# ${freeHalfDoubles}`} disabled className="form-control"/>
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Twin") &&
              <>
                <Form.Label column sm="3">
                  Price per Twin :
                </Form.Label>
                <Col sm="3">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${twin}`}
                    disabled
                    className="form-control"
                  />

                </Col>
                <Form.Label column sm="3">
                  Free Half ( 1/2 ) Twins :
                </Form.Label>
                <Col sm="3">
                  <input style={{ width: 120, marginBottom: 10 }} type="text" disabled value={`# ${freeHalfTwins}`}
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Triple:") &&
              <>
                <Form.Label column sm="3">
                  Price per Triple:
                </Form.Label>
                <Col sm="8">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${triple}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Quad") &&
              <>
                <Form.Label column sm="3">
                  Price per Quad:
                </Form.Label>
                <Col sm="8">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${quad}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Five Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Five Bed :
                </Form.Label>
                <Col sm="8">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${fiveBed}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Six Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Six Bed :
                </Form.Label>
                <Col sm="8">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${sixBed}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Seven Bed") &&
              <>
                <Form.Label column sm="3">
                  Price per Seven Bed :
                </Form.Label>
                <Col sm="8">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${sevenBed}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Eight Bed") &&
              <>
              <Form.Label column sm="3">
                Price per Eight Bed :
              </Form.Label>
              <Col sm="8">
                <input
                  style={{ width: 80, marginBottom: 10 }}
                  type="text"
                  value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${eightBed}`}
                  disabled
                  className="form-control"
                />
              </Col>
            </>
            }

            {props.group.room_desc && props.group.room_desc.includes("Suite") &&
              <>
                <Form.Label column sm="3">
                  Price per Suite :
                </Form.Label>
                <Col sm="6">
                  <input
                    style={{ width: 80, marginBottom: 10 }}
                    type="text"
                    value={`${currencies[props.td.currency ? props.td.currency : 'EUR']} ${suite}`}
                    disabled
                    className="form-control"
                  />
                </Col>
              </>
            }
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PricePerRoomList;
