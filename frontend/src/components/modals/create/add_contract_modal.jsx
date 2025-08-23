// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import DatePicker from "react-datepicker";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Custom Made Components
import AddHotelModal from "../../modals/create/add_hotel_modal";

// Global Variables
import { headers } from "../../global_vars";

// CSS
import "react-datepicker/dist/react-datepicker.css";

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

const ADD_CONTRACT = "http://localhost:8000/api/view/add_contract/";
const GET_HOTELS = "http://localhost:8000/api/view/get_all_hotels/";

let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

const allowAlpha = (value) => {
  return value.replace(/[^\w\s.\-/&\u4e00-\u9eff]{1,20}$/g, "");
};

function AddContractModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [loaded, setLoaded] = useState(false);

  const [Name, setName] = useState("");
  const [Type, setType] = useState("HT");
  const [Status, setStatus] = useState(true);
  const [Currency, setCurrency] = useState("EUR");

  const [differentRoomNumbersPerPeriod, setDifferentRoomNumbersPerPeriod] =
    useState(true);
  const [cityTaxesIncluded, setCityTaxesIncluded] = useState(false);
  const [releasePeriod, setReleasePeriod] = useState(0);
  const [cancellationLimit, setCancellationLimit] = useState(0);
  const [cancellationCharge, setCancellationCharge] = useState(0);

  const [Hotel, setHotel] = useState("");
  let [AllHotels, setAllHotels] = useState([]);

  const [infantAge, setInfantAge] = useState(0);
  const [childAge, setChildAge] = useState(0);
  const [pricing, setPricing] = useState("PR");
  const [inclusiveBoard, setInclusiveBoard] = useState("BB");

  const [file, setFile] = useState();

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

  const createNewContract = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append("file", file);
    formData.append("name", Name);
    formData.append("type", Type);
    formData.append("status", Status);
    formData.append("currency", Currency);
    formData.append("period", JSON.stringify(savedDateRanges));
    formData.append("hotel", Hotel);
    formData.append("infant_age", infantAge);
    formData.append("child_age", childAge);
    formData.append("pricing", pricing);
    formData.append("inclusive_board", inclusiveBoard);
    formData.append("release_period", releasePeriod);
    formData.append("cancellation_limit", cancellationLimit);
    formData.append("cancellation_charge", cancellationCharge);
    formData.append("city_taxes_included", cityTaxesIncluded);

    axios({
      method: "post",
      url: ADD_CONTRACT,
      headers: headers,
      data: formData,
    })
    .then((res) => {
      if (props.redir) {
        window.location.href =
          "/data_management/contract/" + res.data.new_contract_id;
      } else {
        props.set_contract(Name);
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

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [savedDateRanges, setSavedDateRanges] = useState([]);

  const handleDateChange = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (date <= selectedStartDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      setSelectedEndDate(date);
    }
  };

  const isDateDisabled = (date) => {
    return disabledDates.some((range) => date >= range.startDate && date <= range.endDate);
  };

  const handleDateRangeSubmit = () => {
    if ( !selectedStartDate || !selectedEndDate || selectedStartDate > selectedEndDate) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid date range!",
      });
      return;
    }

    const isDateRangeOverlapping = (newStartDate, newEndDate) => {
      // Check if the new date range overlaps with any existing date range.
      return disabledDates.some(
        (range) =>
          (newStartDate >= range.startDate && newStartDate <= range.endDate) ||
          (newEndDate >= range.startDate && newEndDate <= range.endDate) ||
          (newStartDate <= range.startDate && newEndDate >= range.endDate)
      );
    };

    // Check if the new date range overlaps with any existing date range.
    if (isDateRangeOverlapping(selectedStartDate, selectedEndDate)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Date range overlaps with an existing range!",
      });
      return;
    }

    // Create a new date range object and add it to the disabledDates array.
    const newDateRange = {
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      rooms: {
        sgl: 0,
        dbl: 0,
        twin: 0,
        trpl: 0,
        quad: 0,
      },
    };

    // If there are existing periods, use the last period's room values for the new date range.
    if (savedDateRanges.length > 0) {
      const lastPeriod = savedDateRanges[savedDateRanges.length - 1];
      newDateRange.rooms = { ...lastPeriod.rooms };
    }

    setDisabledDates([...disabledDates, newDateRange]);

    // Save the new date range to the savedDateRanges array.
    setSavedDateRanges([...savedDateRanges, newDateRange]);

    // Reset the selected dates.
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  // Show only available dates between selected start and end dates.
  const filterDates = (date) => {
    return (
      !isDateDisabled(date) &&
      (!selectedStartDate ||
        !selectedEndDate ||
        (date >= selectedStartDate && date <= selectedEndDate))
    );
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleResetDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleResetPeriods = () => {
    setDisabledDates([]);
    setSavedDateRanges([]);
  };

  // Function to update the value of a specific room type in a specific object
  const updateRoomValue = (index, roomType, newValue) => {
    // Make a copy of the object at the given index
    const updatedObject = { ...savedDateRanges[index] };
    // Update the value of the specified room type with the new value
    updatedObject.rooms[roomType] = newValue;
    // Make a copy of the savedDateRanges array
    const updatedDateRanges = [...savedDateRanges];
    // Update the specific object in the array
    updatedDateRanges[index] = updatedObject;
    // Set the state with the updated array
    setSavedDateRanges(updatedDateRanges);
  };

  // Function to update the value of a specific room type in all objects
  const updateAllRoomValues = (roomType, newValue) => {
    // Create a new array by mapping over the existing savedDateRanges
    const updatedDateRanges = savedDateRanges.map((obj) => {
      // Make a copy of the object
      const updatedObject = { ...obj };
      // Update the value of the specified room type with the new value
      updatedObject.rooms[roomType] = newValue;
      return updatedObject;
    });

    // Set the state with the updated array
    setSavedDateRanges(updatedDateRanges);
  };

  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setName("");
          getHotels();
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Contract
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Contract </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label
              column
              sm="12"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                color: "#000050",
                fontSize: 20,
              }}
            >
              Contract Information
            </Form.Label>
            <Form.Label column sm="2">
              Name:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="50"
                onChange={(e) => setName(allowAlpha(e.currentTarget.value).toUpperCase())}
                style={formControlStyle}
                value={Name}
              />
            </Col>
            <Form.Label column sm="2">
              Currency:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                style={{ width: 300 }}
                onChange={(e) => { setCurrency(e.target.value);}}
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

            <Form.Label column sm="2" style={{ marginTop: 10 }}>
              Period:
            </Form.Label>
            <Col sm="10" style={{ marginTop: 10 }}>
              <div>
                {savedDateRanges.length > 0 ? (
                  <ul>
                    {savedDateRanges.map((dateRange, index) => (
                      <li key={index}>
                        {index + 1})
                        {`${formatDate(dateRange.startDate)} - ${formatDate(
                          dateRange.endDate
                        )}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
                <DatePicker
                  selected={selectedStartDate}
                  onChange={handleDateChange}
                  selectsStart
                  startDate={selectedStartDate}
                  endDate={selectedEndDate}
                  minDate={new Date()}
                  filterDate={filterDates}
                  placeholderText="Select Start Date"
                />
                <DatePicker
                  selected={selectedEndDate}
                  onChange={handleDateChange}
                  selectsEnd
                  startDate={selectedStartDate}
                  endDate={selectedEndDate}
                  minDate={selectedStartDate}
                  filterDate={filterDates}
                  placeholderText="Select End Date"
                />
                <div style={{ marginTop: 10 }}>
                  <Button color="green" onClick={handleDateRangeSubmit}>
                    Add Date
                  </Button>
                  <Button color="red" onClick={handleResetDates}>
                    Reset Dates
                  </Button>
                  <Button
                    color="red"
                    disabled={savedDateRanges.length === 0}
                    onClick={handleResetPeriods}
                  >
                    Reset Periods
                  </Button>
                </div>
              </div>
            </Col>

            <Form.Label column sm="2">
              Status :
            </Form.Label>
            <Col sm="10">
              <Form.Check
                style={{ marginTop: 6 }}
                checked={Status}
                onChange={() => setStatus(!Status)}
                label="Enabled"
              />
            </Col>
            <Form.Label column sm="2">
              Supplier Type:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                style={{ width: 300, marginBottom: 10 }}
                // disabled
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value="HT"> Hotel </option>
                <option value="AG"> Agent </option>
                <option value="AL"> Airline </option>
                <option value="CO"> Coach Operator </option>
                <option value="CC"> Cruising Company </option>
                <option value="DM"> DMC </option>
                <option value="FT"> Ferry Ticket Agency </option>
                <option value="SE"> Sport Event Supplier </option>
                <option value="TH"> Theater </option>
                <option value="TT"> Train Ticket Agency </option>
              </select>
            </Col>
            {Type === "HT" ? (
              <>
                <Form.Label column sm="2">
                  Select Hotel:
                </Form.Label>
                <Col sm="10">
                  <Autocomplete
                    options={AllHotels}
                    onChange={(e) => {
                      setHotel(e.target.innerText);
                    }}
                    style={{ width: 300, display: "inline-block" }}
                    disabled={!loaded}
                    value={Hotel}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select hotel"
                        variant="outlined"
                      />
                    )}
                  />
                  <div style={{ float: "right" }}>
                    <AddHotelModal
                      redir={false}
                      set_hotel={(e) => setHotel(e)}
                    />
                  </div>
                </Col>

                <Form.Label column sm="2">
                  File Upload :
                </Form.Label>
                <Col sm="10" style={{ marginTop: 10 }}>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </Col>
                {Hotel && savedDateRanges.length > 0 ? (
                  <>
                    {savedDateRanges.length > 0 ? (
                      <>
                        <Form.Label
                          column
                          sm="12"
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#000050",
                            fontSize: 20,
                          }}
                        >
                          Rooms Description
                        </Form.Label>
                        {/* If False, set specific room # for each period. */}
                        <Col sm="12">
                          <Form.Check
                            style={{ marginTop: 6 }}
                            checked={differentRoomNumbersPerPeriod}
                            onChange={() => setDifferentRoomNumbersPerPeriod(!differentRoomNumbersPerPeriod)}
                            label="Room quantity is the same for all of the periods"
                          />
                        </Col>
                        {differentRoomNumbersPerPeriod ? (
                          <>
                            <Form.Label column sm="2">
                              # Single Rooms
                            </Form.Label>
                            <Col sm="10">
                              <input
                                style={{ width: 60 }}
                                type="number"
                                value={Number(savedDateRanges[0].rooms.sgl)}
                                onChange={(e) => updateAllRoomValues("sgl", Number(e.target.value))}
                              />
                              ( SGL )
                            </Col>
                            <Form.Label column sm="2">
                              # Double Rooms
                            </Form.Label>
                            <Col sm="10">
                              <input
                                style={{ width: 60 }}
                                type="number"
                                value={Number(savedDateRanges[0].rooms.dbl)}
                                onChange={(e) => updateAllRoomValues("dbl", Number(e.target.value))}
                              />
                              ( DBL )
                            </Col>
                            <Form.Label column sm="2">
                              # Twin Rooms
                            </Form.Label>
                            <Col sm="10">
                              <input
                                style={{ width: 60 }}
                                type="number"
                                value={Number(savedDateRanges[0].rooms.twin)}
                                onChange={(e) => updateAllRoomValues("twin", Number(e.target.value))}
                              />
                              ( TWIN )
                            </Col>
                            <Form.Label column sm="2">
                              # Triple Rooms
                            </Form.Label>
                            <Col sm="10">
                              <input
                                style={{ width: 60 }}
                                type="number"
                                value={Number(savedDateRanges[0].rooms.trpl)}
                                onChange={(e) => updateAllRoomValues("trpl", Number(e.target.value))}
                              />
                              ( TRPL )
                            </Col>
                            <Form.Label column sm="2">
                              # Quad Rooms
                            </Form.Label>
                            <Col sm="10">
                              <input
                                style={{ width: 60 }}
                                type="number"
                                value={Number(savedDateRanges[0].rooms.quad)}
                                onChange={(e) => updateAllRoomValues("quad", Number(e.target.value))}
                              />
                              ( QUAD )
                            </Col>
                          </>
                        ) : (
                          <>
                            {savedDateRanges.map((dateRange, index) => (
                              <>
                                <Form.Label
                                  column
                                  sm="12"
                                  style={{
                                    fontWeight: "bold",
                                    color: "#3366ff",
                                    fontSize: 18,
                                  }}
                                >
                                  {index + 1})
                                  {`${formatDate(
                                    dateRange.startDate
                                  )} - ${formatDate(dateRange.endDate)}`}
                                </Form.Label>
                                <Form.Label column sm="2">
                                  # Single Rooms
                                </Form.Label>
                                <Col sm="10">
                                  <input
                                    style={{ width: 60 }}
                                    type="number"
                                    value={Number(savedDateRanges[index].rooms.sgl)}
                                    onChange={(e) => updateRoomValue(index, "sgl", Number(e.target.value))}
                                  />
                                  ( SGL )
                                </Col>
                                <Form.Label column sm="2">
                                  # Double Rooms
                                </Form.Label>
                                <Col sm="10">
                                  <input
                                    style={{ width: 60 }}
                                    type="number"
                                    value={Number(
                                      savedDateRanges[index].rooms.dbl
                                    )}
                                    onChange={(e) => updateRoomValue(index, "dbl", Number(e.target.value))}
                                  />
                                  ( DBL )
                                </Col>
                                <Form.Label column sm="2">
                                  # Twin Rooms
                                </Form.Label>
                                <Col sm="10">
                                  <input
                                    style={{ width: 60 }}
                                    type="number"
                                    value={Number(savedDateRanges[index].rooms.twin)}
                                    onChange={(e) => updateRoomValue(index, "twin", Number(e.target.value))}
                                  />
                                  ( TWIN )
                                </Col>
                                <Form.Label column sm="2">
                                  # Triple Rooms
                                </Form.Label>
                                <Col sm="10">
                                  <input
                                    style={{ width: 60 }}
                                    type="number"
                                    value={Number(savedDateRanges[index].rooms.trpl)}
                                    onChange={(e) => updateRoomValue(index, "trpl", Number(e.target.value))}
                                  />
                                  ( TRPL )
                                </Col>
                                <Form.Label column sm="2">
                                  # Quad Rooms
                                </Form.Label>
                                <Col sm="10">
                                  <input
                                    style={{ width: 60 }}
                                    type="number"
                                    value={Number(savedDateRanges[index].rooms.quad)}
                                    onChange={(e) => updateRoomValue(index, "quad", Number(e.target.value))}
                                  />
                                  ( QUAD )
                                </Col>
                              </>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      ""
                    )}

                    <Form.Label
                      column
                      sm="12"
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#000050",
                        fontSize: 20,
                      }}
                    >
                      Additional Information
                    </Form.Label>
                    <Form.Label column sm="2">
                      Release Period :
                    </Form.Label>
                    <Col sm="10">
                      <input
                        style={{ width: 60 }}
                        type="number"
                        value={releasePeriod}
                        onChange={(e) => setReleasePeriod(e.target.value)}
                      />
                      Days
                    </Col>
                    <Form.Label column sm="2">
                      <span style={{ fontSize: 11 }}>Cancellation Limit :</span>
                    </Form.Label>
                    <Col sm="10">
                      <input
                        style={{ width: 60 }}
                        type="number"
                        value={cancellationLimit}
                        onChange={(e) => setCancellationLimit(e.target.value)}
                      />
                      Days
                    </Col>
                    <Form.Label column sm="2">
                      <span style={{ fontSize: 11 }}>
                        Cancellation Charge :
                      </span>
                    </Form.Label>
                    <Col sm="10">
                      <input
                        style={{ width: 60 }}
                        type="number"
                        value={cancellationCharge}
                        onChange={(e) => setCancellationCharge(e.target.value)}
                      />
                      {Currency}
                    </Col>
                    <Form.Label column sm="2">
                      Infant Age :
                    </Form.Label>
                    <Col sm="10">
                      <input
                        style={{ width: 60 }}
                        type="number"
                        value={infantAge}
                        onChange={(e) => setInfantAge(e.target.value)}
                      />
                      ( Free in cot )
                    </Col>
                    <Form.Label column sm="2">
                      Child Age :
                    </Form.Label>
                    <Col sm="10">
                      <input
                        style={{ width: 60 }}
                        type="number"
                        value={childAge}
                        onChange={(e) => setChildAge(e.target.value)}
                      />
                      ( Reduced rate )
                    </Col>
                    <Form.Label column sm="2">
                      Pricing :
                    </Form.Label>
                    <Col sm="10">
                      <select
                        className="form-control"
                        style={{ width: 300 }}
                        onChange={(e) => { setPricing(e.target.value);}}
                      >
                        <option value="PR"> Per Room </option>
                        <option value="PP"> Per Person </option>
                      </select>
                    </Col>
                    <Form.Label column sm="2">
                      Inclusive Board :
                    </Form.Label>

                    <Col sm="10" style={{ marginTop: 10 }}>
                      <select
                        className="form-control"
                        style={{ width: 300 }}
                        onChange={(e) => {setInclusiveBoard(e.target.value);}}
                      >
                        <option value="BB">Bed & Breakfast</option>
                        <option value="HB">Half Board</option>
                        <option value="FB">Full Board</option>
                        <option value="AI">All inclusive</option>
                        <option value="RO">Room Only</option>
                      </select>
                    </Col>

                    <Form.Label column sm="2">
                      City Taxes :
                    </Form.Label>
                    <Form.Check
                      style={{ marginTop: 10 }}
                      checked={cityTaxesIncluded}
                      onChange={() => setCityTaxesIncluded(!cityTaxesIncluded)}
                      label="Included"
                    />
                  </>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
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
            {Name.length < 2 ||
            (Type === "HT" && !Hotel) ||
            savedDateRanges.length === 0 ? (
              <>
                <ul className="mr-auto" style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}>
                  {Name.length < 2 ? (
                    <li>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Name Field.
                    </li>
                  ) : (
                    ""
                  )}

                  {Type === "HT" && !Hotel ? (
                    <li>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Hotel Field.
                    </li>
                  ) : (
                    ""
                  )}

                  {savedDateRanges.length === 0 ? (
                    <li>
                      <AiOutlineWarning style={warningStyle} />
                      Fill The Periods Field.
                    </li>
                  ) : (
                    ""
                  )}
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
            onClick={() => {
              handleClose();
              createNewContract();
            }}
            disabled={Name.length < 2 || (Type === "HT" && !Hotel) || savedDateRanges.length === 0}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddContractModal;
