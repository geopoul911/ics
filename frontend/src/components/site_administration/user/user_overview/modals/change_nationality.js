// Built-ins
import { useState } from "react";

// Modules / Functions
import { Modal } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

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

const CHANGE_NATIONALITY = "http://localhost:8000/api/site_admin/change_user_nationality/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";

function ChangeUserNationality(props) {
  const [Nationality, setNationality] = useState("");
  const [show, setShow] = useState(false);
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
    });
  };

  const updateUserNationality = () => {
    setNationality("");
    axios({
      method: "post",
      url: CHANGE_NATIONALITY,
      headers: headers,
      data: {
        nationality: Nationality,
        user_id: props.user_id,
      },
    })
      .then((res) => {
        props.update_state(res.data.user);
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
        title={"edit user nationality"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getAllCountries();
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
            Change User nationality For {props.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            options={AllCountries}
            onChange={(e) => setNationality(e.target.innerText)}
            getOptionLabel={(Nationality) => Nationality.name}
            style={{ width: "50%" }}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select nationality"
                variant="outlined"
              />
            )}
          />
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
            User's nationality is not a required filed
            {!Nationality || Nationality === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!Nationality || Nationality === "" ? (
                      <>
                        <AiOutlineWarning style={warningStyle} /> Fill The
                        Nationality Field.
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
            disabled={!Nationality}
            onClick={() => {
              handleClose();
              updateUserNationality();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeUserNationality;
