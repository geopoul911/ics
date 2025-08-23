// Built-ins
import React from "react";
import { useState } from "react";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

// Icons / Images
import { AiOutlineWarning } from "react-icons/ai";

// CSS
import "react-daterange-picker/dist/css/react-calendar.css";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

function getOfferID() {
  return window.location.pathname.split("/")[3];
}

const EDIT_NIGHTS = "http://localhost:8000/api/groups/edit_offer_nights/";
const GET_PLACES = "http://localhost:8000/api/view/get_all_places/";

// Modal that gets a date from the user and adds travelday to the group
// the modal's trigger is only visible if there are no traveldays
function EditNights(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let [AllPlaces, setAllPlaces] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const editNights = () => {
    axios({
      method: "post",
      url: EDIT_NIGHTS + getOfferID(window.location.pathname),
      headers: headers,
      data: {
        forms: forms,
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

  const getPlaces = () => {
    axios
      .get(GET_PLACES, {
        headers: headers,
      })
      .then((res) => {
        setAllPlaces(
          res.data.all_places.map((place) => place.country + " - " + place.city)
        );
        setLoaded(true);
      });
  };

  const [forms, setForms] = useState([]);
  const [formCount, setFormCount] = useState(0); // to give unique id to each form

  const handleDropdownChange = (id, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, dropdownValue: value } : form
      )
    );
  };

  const handleNumberInputChange = (id, value) => {
    if (value < 1) return; // prevent updating if the value is less than 1
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, numberValue: value } : form
      )
    );
  };

  const getNextAvailableIndex = () => {
    if (!forms.length) return 1;
    const sortedIndexes = forms.map((form) => form.index).sort((a, b) => a - b);
    for (let i = 0; i < sortedIndexes.length; i++) {
      if (sortedIndexes[i] !== i + 1) {
        return i + 1;
      }
    }
    return sortedIndexes.length + 1;
  };

  const addNewLocationForm = () => {
    setFormCount((prevCount) => prevCount + 1);
    const nextAvailableIndex = getNextAvailableIndex();
    setForms((prevForms) => [
      ...prevForms,
      {
        id: formCount,
        dropdownValue: "",
        numberValue: "",
        index: nextAvailableIndex,
      },
    ]);
  };

  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  const deleteForm = (id) => {
    const deletedFormIndex = forms.find((form) => form.id === id).index;
    setForms((prevForms) =>
      prevForms
        .filter((form) => form.id !== id)
        .map((form) =>
          form.index > deletedFormIndex
            ? { ...form, index: form.index - 1 }
            : form
        )
    );
  };

  return (
    <>
      <Button
        color="green"
        onClick={() => {
          handleShow();
          getPlaces();
        }}
      >
        Edit Nights
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Offer's Nights </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forms
            .sort((a, b) => a.index - b.index)
            .map((form, j) => (
              <div
                key={form.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {form.index})
                <Autocomplete
                  options={AllPlaces}
                  className="select_airport"
                  disabled={!loaded}
                  onChange={(event, newValue) =>
                    handleDropdownChange(form.id, newValue)
                  }
                  disableClearable
                  value={form.dropdownValue}
                  style={{ width: 300, margin: 0 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select place"
                      variant="outlined"
                    />
                  )}
                  filterOptions={filterOptions}
                />
                <label style={{ marginLeft: 20 }}> Number of nights: </label>
                <input
                  type="number"
                  value={form.numberValue}
                  onChange={(e) =>
                    handleNumberInputChange(form.id, e.target.value)
                  }
                  style={{ marginLeft: "10px" }}
                  min="1"
                />
                <Button
                  color="red"
                  onClick={() => deleteForm(form.id)}
                  style={{ marginLeft: 30 }}
                >
                  Delete
                </Button>
                <hr />
              </div>
            ))}
          <Button color="green" onClick={addNewLocationForm}>
            Add New Location
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto" style={{ color: "red" }}>
            <AiOutlineWarning style={{ fontSize: 20 }} /> Previous Nights will
            be deleted.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              editNights();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditNights;
