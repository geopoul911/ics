// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_YEAR = "http://localhost:8000/api/data_management/change_aircraft_year/";

const valid_aircraft_years = [
  2024, 2023, 2022, 2021, 2000, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
  2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
];

function ChangeYear(props) {
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(props.year ? props.year : 2024);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const update_Year = () => {
    axios({
      method: "post",
      url: CHANGE_YEAR,
      headers: headers,
      data: {
        aircraft_id: props.aircraft_id,
        year: year,
      },
    })
      .then((res) => {
        props.update_state(res.data.aircraft);
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
        title={"edit aircraft's year"}
        id={"edit_aircraft_name"}
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
          <Modal.Title>Change year for {props.make}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            className="form-control"
            onChange={(e) => {
              setYear(e.target.value);
            }}
            value={year}
          >
            {valid_aircraft_years.map((e) => (
              <option value={e}>{e}</option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              update_Year();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeYear;
