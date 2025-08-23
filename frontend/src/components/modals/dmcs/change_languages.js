// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import { Modal, Form, Col } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import Select from "react-select";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_COUNTRY = "http://localhost:8000/api/data_management/change_dmc_languages/";
const GET_COUNTRIES = "http://localhost:8000/api/view/get_all_countries/";

function ChangeLanguages(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [AllCountries, setAllCountries] = useState([]);
  let [countries, setCountries] = useState([]);

  const getCountries = () => {
    axios.get(GET_COUNTRIES, {headers: headers})
    .then((res) => {setAllCountries(res.data.all_countries);});
  };

  const update_Countries = () => {
    axios({
      method: "post",
      url: CHANGE_COUNTRY,
      headers: headers,
      data: {
        dmc_id: props.dmc_id,
        countries: countries,
      },
    })
      .then((res) => {
        props.update_state(res.data.dmc);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  AllCountries.forEach(function (element) {
    element.value = element.name;
    element.label = element.name;
  });

  return (
    <>
      <FiEdit2
        title={"edit DMC's Languages"}
        id={"edit_repair_shop_type"}
        onClick={() => {
          handleShow();
          getCountries();
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
          <Modal.Title>Edit Countries for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Countries
          </Form.Label>
          <Col sm="10">
            <Select
              closeMenuOnSelect={false}
              onChange={(e) => {
                setCountries(e);
              }}
              isMulti
              options={AllCountries}
            />
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            Previous Countries will be removed. Include them in the selection in
            order to keep them
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            disabled={!countries.length > 0}
            color="green"
            onClick={() => {
              handleClose();
              update_Countries();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeLanguages;
