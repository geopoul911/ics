// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";

// Custom Made Components
import AddPlaceModal from "../modals/create/add_place_modal";

// Global Variables
import { headers } from "../global_vars";

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

const CHANGE_PLACE = "http://localhost:8000/api/data_management/change_plc/";
const GET_PLACES = "http://localhost:8000/api/view/get_all_places/";

function ChangePlace(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Place, setPlace] = useState(props.place ? props.place : "");
  let [AllPlaces, setAllPlaces] = useState([]);
  let [loaded, setLoaded] = useState(false);

  const updatePlace = () => {
    axios({
      method: "post",
      url: CHANGE_PLACE,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        place: Place,
      },
    })
      .then((res) => {
        props.update_state(res.data.object);
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

  const handlePlaceChange = (event, value) => {
    setPlace(value || "");
  };

  const filterOptions = (options, { inputValue }) => {
    if (inputValue.length >= 2) {
      return options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
    return [];
  };

  return (
    <>
      <FiEdit2
        title={"edit place"}
        id={"edit_place"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getPlaces();
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
          <Modal.Title>Change Place for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            options={AllPlaces}
            className="select_airport"
            disabled={!loaded}
            onChange={handlePlaceChange}
            disableClearable
            value={Place}
            style={{ width: 300, margin: 0 }}
            renderInput={(params) => (
              <TextField {...params} label="Select place" variant="outlined" />
            )}
            filterOptions={filterOptions}
          />
          {loaded ? (
            ""
          ) : (
            <Spinner
              animation="border"
              variant="info"
              size="sm"
              style={{ position: "fixed", margin: 20 }}
            />
          )}
          <div style={{ float: "right" }}>
            <AddPlaceModal redir={false} set_place={(e) => setPlace(e)} />
          </div>
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
            Type at least 3 characters to fetch results.
            {Place.length === 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Place.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Place Field
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
            disabled={Place.length === 0}
            onClick={() => {
              handleClose();
              updatePlace();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePlace;
