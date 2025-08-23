// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import { Modal, ListGroup, Spinner, Form, Col, Row } from "react-bootstrap";
import { Button, Checkbox } from "semantic-ui-react";
import axios from "axios";
import DatePicker from "react-date-picker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Swal from "sweetalert2";

// Custom Made Components
import AddHotelModal from "../../../../modals/create/add_hotel_modal";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_HOTEL = "http://localhost:8000/api/groups/change_hotel/";
const GET_HOTELS = "http://localhost:8000/api/view/get_all_hotels/";
const GET_HOTEL = "http://localhost:8000/api/view/get_hotel/";

function ChangeHotel(props) {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Hotel, setHotel] = useState(props.hotel ? props.hotel.name : "");
  const [UpdateRestOfDays, setUpdateRestOfDays] = React.useState(false);
  let [AllHotels, setAllHotels] = useState([]);
  const [optionDate, setOptionDate] = useState();
  const [payUntil, setPayUntil] = useState();
  const [currency, setCurrency] = useState(props.group.refcode.startsWith("COA") ? 'EUR' : 'GBP');

  const [sgl, setSGL] = useState("0.00");
  const [dblForSglUse, setDblForSglUse] = useState("0.00");
  const [dbl, setDBL] = useState("0.00");
  const [twin, setTwin] = useState("0.00");
  const [triple, setTriple] = useState("0.00");
  const [quad, setQuad] = useState("0.00");
  const [suite, setSuite] = useState("0.00");
  const [fiveBed, setFiveBed] = useState("0.00");
  const [sixBed, setSixBed] = useState("0.00");
  const [sevenBed, setSevenBed] = useState("0.00");
  const [eightBed, setEightBed] = useState("0.00");

  const [freeSingles, setFreeSingles] = useState("0");
  const [freeHalfTwins, setFreeHalfTwins] = useState("0");
  const [freeHalfDoubles, setFreeHalfDoubles] = useState("0");

  const updateHotel = () => {
    props.updateIsLoaded();
    axios({
      method: "post",
      url: CHANGE_HOTEL + props.group.refcode,
      headers: headers,
      data: {
        type: "Group",
        td_id: props.td_id,
        hotel: Hotel,
        update_rest_of_days: UpdateRestOfDays,
        option_date: optionDate ? moment(optionDate).format("YYYY-MM-DD") : null,
        pay_until: payUntil ? moment(payUntil).format("YYYY-MM-DD") : null,
        currency: currency,
        sgl: sgl,
        double_for_single_use: dblForSglUse,
        dbl: dbl,
        twin: twin,
        triple: triple,
        quad: quad,
        suite: suite,
        five_bed: fiveBed,
        six_bed: sixBed,
        seven_bed: sevenBed,
        eight_bed: eightBed,
        free_singles: freeSingles,
        free_half_twins: freeHalfTwins,
        free_half_doubles: freeHalfDoubles,
      },
    })
      .then((res) => {
        props.update_state(res.data.model);
        props.updateIsLoaded();
      })
      .catch((e) => {
        props.updateIsLoaded();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const getHotels = () => {
    axios
      .get(GET_HOTELS, {
        headers: headers,
      })
      .then((res) => {
        setAllHotels(res.data.all_hotels.map((hotel) => hotel.name));
        setLoaded(true);
      });
  };

  const handleCheckBox = () => {
    setUpdateRestOfDays(!UpdateRestOfDays);
  };

  const getHotelObject = (hotel) => {
    axios
      .get(GET_HOTEL + Hotel, {
        headers: headers,
        params: {
          hotel_name: hotel,
          date: props.date,
        },
      })
      .then((res) => {
        setLoaded(true);
      });
  };

  return (
    <>
      <FiEdit2
        title={"Edit Hotel"}
        id={"edit_refcode"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getHotels();
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
          <Modal.Title>Change Hotel for {props.date}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item>
              <Autocomplete
                options={AllHotels}
                className={"select_airport"}
                onChange={(e) => {
                  setHotel(e.target.innerText);
                  getHotelObject(e.target.innerText);
                }}
                style={{ width: 300 }}
                disabled={!loaded}
                value={Hotel}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select hotel"
                    variant="outlined"
                  />
                )}
              />
              <div style={{ float: "right" }}>
                <AddHotelModal redir={false} set_hotel={(e) => setHotel(e)} />
              </div>
              <div className='grey-powerline'></div>
              <div style={{ margin: 20 }}>
                Select Option Date :
                <DatePicker
                  wrapperClassName="datePicker"
                  name="date"
                  onChange={(e) => setOptionDate(e)}
                  value={optionDate}
                  format="dd/MM/yyyy"
                  minDate={new Date()}
                />
              </div>

              {Hotel ? 
                <>
                  <div className='grey-powerline'></div>
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
                              <input
                                style={{ width: 120, marginBottom: 10 }}
                                type="number"
                                step="0.01"
                                min="0"
                                value={sgl}
                                onInput={(e) => {
                                  const val = e.target.value;
                                  const [intPart] = val.split(".");
                                  if (intPart.length <= 3) setSGL(val);
                                }}
                                onBlur={(e) => {
                                  const num = parseFloat(e.target.value);
                                  if (!isNaN(num)) setSGL(num.toFixed(2));
                                }}
                                className="form-control"
                                onChange={() => {}}
                              />
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
                              <input
                                style={{ width: 120, marginBottom: 10 }}
                                type="number"
                                step="0.01"
                                min="0"
                                value={dblForSglUse}
                                onInput={(e) => {
                                  const val = e.target.value;
                                  const [intPart] = val.split(".");
                                  if (intPart.length <= 3) setDblForSglUse(val);
                                }}
                                onBlur={(e) => {
                                  const num = parseFloat(e.target.value);
                                  if (!isNaN(num)) setDblForSglUse(num.toFixed(2));
                                }}
                                className="form-control"
                                onChange={() => {}}
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
                                style={{ width: 120, marginBottom: 10 }}
                                type="number"
                                step="0.01"
                                min="0"
                                value={dbl}
                                onInput={(e) => {
                                  const val = e.target.value;
                                  const [intPart] = val.split(".");
                                  if (intPart.length <= 3) setDBL(val);
                                }}
                                onBlur={(e) => {
                                  const num = parseFloat(e.target.value);
                                  if (!isNaN(num)) setDBL(num.toFixed(2));
                                }}
                                className="form-control"
                                onChange={() => {}}
                              />
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
                            <input
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={twin}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setTwin(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setTwin(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
                            />

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
                            <input
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={triple}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setTriple(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setTriple(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
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
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={quad}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setQuad(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setQuad(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
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
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={fiveBed}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setFiveBed(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setFiveBed(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
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
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={sixBed}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setSixBed(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setSixBed(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
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
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={sevenBed}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setSevenBed(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setSevenBed(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
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
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={eightBed}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setEightBed(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setEightBed(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
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
                              style={{ width: 120, marginBottom: 10 }}
                              type="number"
                              step="0.01"
                              min="0"
                              value={suite}
                              onInput={(e) => {
                                const val = e.target.value;
                                const [intPart] = val.split(".");
                                if (intPart.length <= 3) setSuite(val);
                              }}
                              onBlur={(e) => {
                                const num = parseFloat(e.target.value);
                                if (!isNaN(num)) setSuite(num.toFixed(2));
                              }}
                              className="form-control"
                              onChange={() => {}}
                            />
                          </Col>
                        </>
                      }

                    <div className='grey-powerline'></div>
                    <div style={{ margin: 20 }}>
                      Pay Until:
                      <DatePicker
                        wrapperClassName="datePicker"
                        name="date"
                        onChange={(e) => setPayUntil(e)}
                        value={payUntil}
                        format="dd/MM/yyyy"
                        minDate={new Date()}
                      />
                    </div>

                  </Form.Group>
                </>
                :
                  <>
                  </>
                }

              <hr/>
              {loaded ? (
                ""
              ) : (
                <Spinner
                  animation="border"
                  variant="info"
                  size="sm"
                  style={{ position: "fixed", marginTop: 20, marginLeft: 10 }}
                />
              )}
              <div style={{ marginLeft: 20, marginTop: 20 }}>
                <Checkbox
                  label={"All upcoming days?"}
                  value={UpdateRestOfDays}
                  onChange={handleCheckBox}
                />
              </div>
              <hr />
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <CgDanger style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }} />
            Updating travelday's hotel will also update the location
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            // disabled={!pricePerPerson}
            onClick={() => {
              handleClose();
              updateHotel();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeHotel;
