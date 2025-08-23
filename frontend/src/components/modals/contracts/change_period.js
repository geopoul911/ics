// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning } from "react-icons/ai";

// Modules / Functions
import { Modal, Col, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_PERIOD =
  "http://localhost:8000/api/data_management/change_period/";

function ChangePeriod(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [differentRoomNumbersPerPeriod, setDifferentRoomNumbersPerPeriod] =
    useState(true);

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
    return disabledDates.some(
      (range) => date >= range.startDate && date <= range.endDate
    );
  };

  const handleDateRangeSubmit = () => {
    if (
      !selectedStartDate ||
      !selectedEndDate ||
      selectedStartDate > selectedEndDate
    ) {
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

  const change_Period = () => {
    axios({
      method: "post",
      url: CHANGE_PERIOD,
      headers: headers,
      data: {
        contract_id: props.object_id,
        period: JSON.stringify(savedDateRanges),
      },
    })
      .then((res) => {
        props.update_state(res.data.contract);
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
        title={"edit contract's period"}
        id={"edit_contract_name"}
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
          <Modal.Title>Change period for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
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

            {props.contract.con_type === "HT" ? (
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
                        onChange={() =>
                          setDifferentRoomNumbersPerPeriod(
                            !differentRoomNumbersPerPeriod
                          )
                        }
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
                            onChange={(e) =>
                              updateAllRoomValues("sgl", Number(e.target.value))
                            }
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
                            onChange={(e) =>
                              updateAllRoomValues("dbl", Number(e.target.value))
                            }
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
                            onChange={(e) =>
                              updateAllRoomValues(
                                "twin",
                                Number(e.target.value)
                              )
                            }
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
                            onChange={(e) =>
                              updateAllRoomValues(
                                "trpl",
                                Number(e.target.value)
                              )
                            }
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
                            onChange={(e) =>
                              updateAllRoomValues(
                                "quad",
                                Number(e.target.value)
                              )
                            }
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
                                onChange={(e) =>
                                  updateRoomValue(
                                    index,
                                    "sgl",
                                    Number(e.target.value)
                                  )
                                }
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
                                value={Number(savedDateRanges[index].rooms.dbl)}
                                onChange={(e) =>
                                  updateRoomValue(
                                    index,
                                    "dbl",
                                    Number(e.target.value)
                                  )
                                }
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
                                value={Number(
                                  savedDateRanges[index].rooms.twin
                                )}
                                onChange={(e) =>
                                  updateRoomValue(
                                    index,
                                    "twin",
                                    Number(e.target.value)
                                  )
                                }
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
                                value={Number(
                                  savedDateRanges[index].rooms.trpl
                                )}
                                onChange={(e) =>
                                  updateRoomValue(
                                    index,
                                    "trpl",
                                    Number(e.target.value)
                                  )
                                }
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
                                value={Number(
                                  savedDateRanges[index].rooms.quad
                                )}
                                onChange={(e) =>
                                  updateRoomValue(
                                    index,
                                    "quad",
                                    Number(e.target.value)
                                  )
                                }
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
              </>
            ) : (
              ""
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <AiOutlineWarning
              style={{
                color: "red",
                fontSize: "2em",
                marginRight: "0.5em",
              }}
            />
            CHANGING THE CONTRACT'S PERIOD WILL ALSO REMOVE PREVIOUS ROOM
            ENTRIES.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={savedDateRanges.length === 0}
            onClick={() => {
              handleClose();
              change_Period();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePeriod;
