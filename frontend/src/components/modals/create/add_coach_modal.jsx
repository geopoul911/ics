// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Custom Made Components
import AddCoachOperatorModal from "../../modals/create/add_coach_operator_modal";

// Global Variables
import { headers } from "../../global_vars";

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

const ADD_COACH = "http://localhost:8000/api/view/add_coach/";
const GET_COACH_OPERATORS =
  "http://localhost:8000/api/view/get_all_coach_operators/";

const valid_coach_years = [
  2024, 2023, 2022, 2021, 2000, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
  2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
];

function AddCoachModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [make, setMake] = useState("");
  const [year, setYear] = useState(2023);
  const [coachOperator, setCoachOperator] = useState("");
  let [allCoachOperators, setAllCoachOperators] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [passengerSeats, setPassengerSeats] = useState(0);
  const [emission, setEmission] = useState("0");
  let [loaded, setLoaded] = useState(false);

  const getCoachOperators = () => {
    axios
    .get(GET_COACH_OPERATORS, {
      headers: headers,
    })
    .then((res) => {
      setAllCoachOperators(
        res.data.all_coach_operators.map((coop) => coop.name)
      );
      setLoaded(true);
    });
  };

  const createNewCoach = () => {
    axios({
      method: "post",
      url: ADD_COACH,
      headers: headers,
      data: {
        make: make,
        coach_operator: props.coach_operator ? props.coach_operator.name : coachOperator,
        passenger_seats: passengerSeats,
        plate_number: plateNumber,
        emission: emission,
        year: year,
      },
    })
      .then((res) => {
        if (props.redir) {
          window.location.href =
            "/data_management/coach/" + res.data.new_coach_id;
        } else {
          if (props.coach_operator) {
            props.update_state()
          } else {
            props.set_coach(
              res.data.new_coach_id +
                ") " +
                make +
                "--" +
                coachOperator +
                "--" +
                plateNumber
            );
          }
        }
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
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          getCoachOperators();
          setMake("");
          setCoachOperator("");
          setPlateNumber("");
          setPassengerSeats(0);
          setMake("");
          setEmission("");
          setYear(2024);
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Coach
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Coach </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-md-center">
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>Make:</Form.Label>
                  <Form.Control
                    maxLength="63"
                    style={{ width: 400 }}
                    onChange={(e) => {
                      setMake(e.target.value.toUpperCase());
                    }}
                    value={make}
                  />
                  <Form.Label>Plate number</Form.Label>
                  <Form.Control
                    maxLength="63"
                    style={{ width: 400 }}
                    onChange={(e) => {
                      setPlateNumber(e.target.value.toUpperCase());
                    }}
                    value={plateNumber}
                  />
                  <Form.Label>Passenger seats</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    style={{ marginBottom: 10, width: 400 }}
                    value={passengerSeats}
                    onInput={(e) => {
                      e.target.value = Math.max(0, parseInt(e.target.value))
                        .toString()
                        .slice(0, 2);
                    }}
                    onChange={(e) => setPassengerSeats(e.currentTarget.value)}
                  ></Form.Control>
                  <Form.Label>Emission stds</Form.Label>
                  <select
                    className="form-control"
                    style={{ width: 400, marginLeft: 0 }}
                    onChange={(e) => {
                      setEmission(e.target.value);
                    }}
                  >
                    <option value="0"> N/A </option>
                    <option value="3"> Euro 3 </option>
                    <option value="4"> Euro 4 </option>
                    <option value="5"> Euro 5 </option>
                    <option value="6"> Euro 6 </option>
                    <option value="7"> Euro 7 </option>
                  </select>
                  <Form.Label>Year</Form.Label>
                  <select
                    className="form-control"
                    style={{ width: 400, marginLeft: 0, marginTop: 10 }}
                    onChange={(e) => {
                      setYear(e.target.value);
                    }}
                  >
                    {valid_coach_years.map((e) => (
                      <option value={e}>{e}</option>
                    ))}
                  </select>
                  <Form.Label style={{ marginTop: 30 }}>
                    Coach Operator
                  </Form.Label>
                  <br />
                  {props.coach_operator ? 
                    <Autocomplete
                      options={allCoachOperators}
                      className={"select_airport"}
                      disabled
                      value={props.coach_operator.name}
                      style={{ width: 300, margin: 0 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                        />
                      )}
                    />
                  :
                    <>
                      <Autocomplete
                        options={allCoachOperators}
                        className={"select_airport"}
                        disabled={!loaded}
                        onChange={(e) => {
                          setCoachOperator(e.target.innerText);
                        }}
                        disableClearable
                        value={coachOperator}
                        style={{ width: 300, margin: 0 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Coach Operator"
                            variant="outlined"
                          />
                        )}
                      />
                      {loaded ? (
                        ""
                      ) : (
                        <Spinner
                          animation="border"
                          variant="info"
                          size="sm"
                          style={{
                            position: "fixed",
                            marginTop: 40,
                            marginLeft: 20,
                          }}
                        />
                      )}
                      <div style={{ float: "right" }}>
                        <AddCoachOperatorModal
                          redir={false}
                          set_coach_operator={(e) => setCoachOperator(e)}
                        />
                      </div>
                    </>
                  }
                </Form.Group>
              </Form>
            </Col>
          </Row>
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
            All fields except body number are required to create a coach.
            {make.length < 3 ||
            plateNumber.length < 3 ||
            coachOperator.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {make.length < 3 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Make Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {plateNumber.length < 4 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Plate Number Field.
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {(!props.coach_operator && coachOperator.length === 0) ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Coach Operator Field.
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
            onClick={() => {
              handleClose();
              createNewCoach();
            }}
            disabled={
              make.length < 3 ||
              plateNumber.length < 3 ||
              (!props.coach_operator && coachOperator.length === 0)
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCoachModal;
