// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Spinner } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";

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

const CHANGE_PLACE =
  "http://localhost:8000/api/data_management/change_country/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";

function ChangeCountry(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Country, setCountry] = useState(
    props.country ? props.country.name : ""
  );
  let [AllCountries, setAllCountries] = useState([]);
  let [loaded, setLoaded] = useState(false);

  const updateCountry = () => {
    axios({
      method: "post",
      url: CHANGE_PLACE,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        country: Country,
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

  const getCountries = () => {
    axios
      .get(GET_COUNTRIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCountries(res.data.all_countries.map((country) => country.name));
        setLoaded(true);
      });
  };

  return (
    <>
      <FiEdit2
        title={"edit country"}
        id={"edit_place"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getCountries();
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
          <Modal.Title>Change country for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            options={AllCountries}
            className={"select_airport"}
            onChange={(e) => {
              setCountry(e.target.innerText);
            }}
            style={{ width: 300, margin: 0 }}
            disabled={!loaded}
            value={Country}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select country"
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
              style={{ position: "fixed", margin: 20 }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {Country.length === 0 ? (
              <>
                <ul
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Country.length === 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Country Field.
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
            disabled={Country.length === 0}
            onClick={() => {
              handleClose();
              updateCountry();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeCountry;
