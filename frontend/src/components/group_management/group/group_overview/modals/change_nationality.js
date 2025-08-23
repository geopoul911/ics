// Built-ins
import { useState } from "react";
import { Modal, Spinner, ListGroup } from "react-bootstrap";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Button } from "semantic-ui-react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

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

const CHANGE_NATIONALITY =
  "http://localhost:8000/api/groups/change_group_nationality/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";

function ChangeGroupNationality(props) {
  const [Nationality, setNationality] = useState("");
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handleClose = () => {
    setShow(false);
    setNationality("");
  };
  const handleShow = () => setShow(true);
  let [AllCountries, setAllCountries] = useState([]);

  const getAllCountries = () => {
    axios
      .get(GET_COUNTRIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCountries(res.data.all_countries);
        setLoaded(true);
      });
  };

  const updateGroupNationality = () => {
    setNationality("");
    axios({
      method: "post",
      url: CHANGE_NATIONALITY + props.group.refcode,
      headers: headers,
      data: { nationality: Nationality },
    })
      .then((res) => {
        props.update_state(res.data.model);
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
        title={"edit group nationality"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getAllCountries();
          setNationality("");
        }}
      />
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change Group nationality For {props.group.refcode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            <ListGroup.Item>
              <Autocomplete
                options={AllCountries}
                onChange={(e) => setNationality(e.target.innerText)}
                getOptionLabel={(Nationality) => Nationality.name}
                style={{ width: "70%", margin: 10 }}
                className={"select_airport"}
                disabled={!loaded}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select nationality"
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
                  style={{ position: "fixed", marginTop: 30 }}
                />
              )}
            </ListGroup.Item>
          </ListGroup>
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
            Group's nationality is not a required filed
            {Nationality === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {Nationality === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select a Country
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
            disabled={Nationality === ""}
            onClick={() => {
              handleClose();
              updateGroupNationality();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeGroupNationality;
