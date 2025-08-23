// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-multi-date-picker";

// Modules / Functions
import { Modal, Spinner, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// CSS
import "react-daterange-picker/dist/css/react-calendar.css";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const commonServices = [
  "Transfers", // Common
  "Tolls", // Common
  "Permits", // Common
  "Driver Accomodation", // Common
  "Coach's Ferry Ticket", // Common
  "Local Guide", // Common
  "Tour Leader", // Common
  "Tour Leader's Accomodation",
  "Tour Leader's Air Ticket", // Common
  "Transfer",
  "Restaurant",
  "Other",
];

const nonCommonServices = [
  "Air Ticket",
  "Meals",
  "Ferry Ticket",
  "Train Ticket",
  "Cruise",
  "Theater",
  "Sport Event",
  "Teleferik",
  "Hotel Porterage",
  "Airport Porterage",
  "Toll",
  "Permit",
];

const AllServiceOptions = [
  "Accomodation",
  "Air Ticket",
  "Airport Porterage",
  "Coach's Ferry Ticket",
  "Cruise",
  "Driver Accomodation",
  "Ferry Ticket",
  "Hotel Porterage",
  "Local Guide",
  "Restaurant",
  "Sport Event",
  "Teleferik",
  "Theater",
  "Toll",
  "Tour Leader",
  "Tour Leader's Accomodation",
  "Tour Leader's Air Ticket",
  "Train Ticket",
  "Transfer",
  "Other",
  "Permit",
];

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

const ADD_SERVICE = "http://localhost:8000/api/groups/add_off_service/";
const GET_RESTAURANTS = "http://localhost:8000/api/view/get_all_restaurants/";

// Modal that gets a date from the user and adds travelday to the group
// the modal's trigger is only visible if there are no traveldays
function AddOfferService(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [AllRestaurants, setAllRestaurants] = useState([]);

  const [loaded, setLoaded] = useState(false);
  const [restaurant, setRestaurant] = useState("");

  const [single, setSingle] = useState(0);
  const [double, setDouble] = useState(0);
  const [triple, setTriple] = useState(0);
  const [twin, setTwin] = useState(0);
  const [quadrable, setQuadrable] = useState(0);

  const [free_single, setFreeSingle] = useState(0);
  const [free_double, setFreeDouble] = useState(0);
  const [free_triple, setFreeTriple] = useState(0);
  const [free_twin, setFreeTwin] = useState(0);
  const [free_quadrable, setFreeQuadrable] = useState(0);

  const [dates, setDates] = useState([]);

  const [selectedServiceType, setSelectedServiceType] = React.useState("");
  const handleSelectedServiceType = (e) => {
    setSelectedServiceType(e.target.value);
  };

  const [price, setPrice] = useState(0);

  const createNewSrv = () => {
    axios({
      method: "post",
      url: ADD_SERVICE + getRefcode(window.location.pathname),
      headers: headers,
      data: {
        service_type: selectedServiceType,
        dates: dates,
        price: price,
        sgl: single,
        dbl: double,
        twin: twin,
        trpl: triple,
        quad: quadrable,
        free_sgl: free_single,
        free_dbl: free_double,
        free_twin: free_twin,
        free_trpl: free_triple,
        free_quad: free_quadrable,
        restaurant: restaurant,
      },
    })
      .then((res) => {
        props.update_state(res.data.offer);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const getRestaurants = () => {
    axios
      .get(GET_RESTAURANTS, {
        headers: headers,
      })
      .then((res) => {
        setAllRestaurants(res.data.all_restaurants);
        setLoaded(true);
      });
  };

  function getCategory() {
    if (commonServices.includes(selectedServiceType)) {
      return "Common Services";
    } else if (nonCommonServices.includes(selectedServiceType)) {
      return "Non Common Services";
    } else if (selectedServiceType === "Accomodation") {
      return "Accomodation";
    } else {
      return "N/A";
    }
  }

  return (
    <>
      <Button
        color="green"
        onClick={() => {
          handleShow();
          getRestaurants();
        }}
      >
        Add Service
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2 row">
              <Form.Label className="col-sm-2 col-form-label">
                Select date(s):
              </Form.Label>
              <div className="col-sm-10">
                <DatePicker multiple value={dates} onChange={setDates} />
              </div>
            </Form.Group>
            <Form.Group className="mb-2 row">
              <Form.Label className="col-sm-2 col-form-label">
                Service type :
              </Form.Label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  defaultValue={props.defaultValue}
                  onChange={(e) => handleSelectedServiceType(e)}
                >
                  <option selected disabled hidden>
                    Choose from available types
                  </option>
                  {AllServiceOptions.map((j, k) => (
                    <option key={k} value={j.id}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </Form.Group>

            <Form.Group className="mb-2 row">
              <Form.Label className="col-sm-2 col-form-label">
                Category
              </Form.Label>
              <div className="col-sm-10">
                <div className="form-control disabled">{getCategory()}</div>
              </div>
            </Form.Group>
            {selectedServiceType === "Restaurant" ? (
              <>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Select Restaurant :
                  </Form.Label>
                  <div className="col-sm-10">
                    <Autocomplete
                      options={AllRestaurants}
                      onChange={(e) => {
                        setRestaurant(e.target.innerText);
                      }}
                      getOptionLabel={(option) => option.name}
                      style={{ width: "100%" }}
                      disabled={!loaded}
                      disableClearable
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
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
                          marginTop: 20,
                          marginLeft: 10,
                        }}
                      />
                    )}
                  </div>
                </Form.Group>
              </>
            ) : (
              <></>
            )}

            {selectedServiceType === "Accomodation" &&
            props.offer.offer_type === "PP" ? (
              <>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Single Price:
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setSingle(e.currentTarget.value);
                      }}
                      value={single}
                      className="form-control"
                    />
                  </div>
                  <Form.Label className="col-sm-2 col-form-label">
                    Free Singles :
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setFreeSingle(e.currentTarget.value);
                      }}
                      value={free_single}
                      className="form-control"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Double Price:
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setDouble(e.currentTarget.value);
                      }}
                      value={double}
                      className="form-control"
                    />
                  </div>
                  <Form.Label className="col-sm-2 col-form-label">
                    Free Doubles :
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setFreeDouble(e.currentTarget.value);
                      }}
                      value={free_double}
                      className="form-control"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Twin Price:
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setTwin(e.currentTarget.value);
                      }}
                      value={twin}
                      className="form-control"
                    />
                  </div>
                  <Form.Label className="col-sm-2 col-form-label">
                    Free Twins :
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setFreeTwin(e.currentTarget.value);
                      }}
                      value={free_twin}
                      className="form-control"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Triple Price:
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setTriple(e.currentTarget.value);
                      }}
                      value={triple}
                      className="form-control"
                    />
                  </div>
                  <Form.Label className="col-sm-2 col-form-label">
                    Free Triples :
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setFreeTriple(e.currentTarget.value);
                      }}
                      value={free_triple}
                      className="form-control"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Quad Price:
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{
                        display: "inline",
                      }}
                      onChange={(e) => {
                        setQuadrable(e.currentTarget.value);
                      }}
                      value={quadrable}
                      className="form-control"
                    />
                  </div>
                  <Form.Label className="col-sm-2 col-form-label">
                    Free Quads :
                  </Form.Label>
                  <div className="col-sm-4">
                    <Form.Control
                      type="number"
                      style={{
                        display: "inline",
                      }}
                      onChange={(e) => {
                        setFreeQuadrable(e.currentTarget.value);
                      }}
                      value={free_quadrable}
                      className="form-control"
                    />
                  </div>
                </Form.Group>
              </>
            ) : (
              ""
            )}

            {selectedServiceType === "Accomodation" &&
            props.offer.offer_type === "BS" ? (
              <>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-4 col-form-label">
                    Price Per Night Per Person:
                  </Form.Label>
                  <div className="col-sm-2">
                    <Form.Control
                      type="number"
                      style={{ display: "inline" }}
                      onChange={(e) => {
                        setPrice(e.currentTarget.value);
                      }}
                      value={price}
                      className="form-control"
                    />
                  </div>
                </Form.Group>
              </>
            ) : (
              ""
            )}

            {nonCommonServices.includes(selectedServiceType) ? (
              <>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-4 col-form-label">
                    Enter Price Per Person for each day:
                  </Form.Label>
                  <div className="col-sm-6">
                    <Form.Control
                      type="number"
                      style={{ width: 200, display: "inline", marginLeft: 20 }}
                      onChange={(e) => {
                        setPrice(e.currentTarget.value);
                      }}
                      maxLength="5"
                      value={price}
                      className="form-control"
                    />
                  </div>
                </Form.Group>
              </>
            ) : (
              ""
            )}

            {commonServices.includes(selectedServiceType) ? (
              <>
                <Form.Group className="mb-2 row">
                  <Form.Label className="col-sm-2 col-form-label">
                    Cost Per Day:
                  </Form.Label>
                  <div className="col-sm-10">
                    <Form.Control
                      type="number"
                      onChange={(e) => {
                        setPrice(e.currentTarget.value);
                      }}
                      maxLength="5"
                      value={price}
                      className="form-control"
                    />
                  </div>
                </Form.Group>
              </>
            ) : (
              ""
            )}
          </Form>
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
            Price for each room type is per night per person
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              setSelectedServiceType("");
              setSingle(0);
              setDouble(0);
              setTriple(0);
              setTwin(0);
              setQuadrable(0);
              setFreeSingle(0);
              setFreeDouble(0);
              setFreeTriple(0);
              setFreeTwin(0);
              setFreeQuadrable(0);
              setPrice(0);
              createNewSrv();
            }}
            disabled={dates.length === 0 || selectedServiceType === ""}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddOfferService;
