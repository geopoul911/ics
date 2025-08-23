// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { CgDanger } from "react-icons/cg";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

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

let warningStyle = {
  fontSize: 18,
  marginRight: 6,
};

let checkStyle = {
  fontSize: 18,
  marginRight: 6,
};

const CHANGE_TYPE =
  "http://localhost:8000/api/data_management/change_restaurant_type/";
const GET_REPAIR_SHOP_TYPES =
  "http://localhost:8000/api/view/get_all_restaurant_types/";

function ChangeType(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [AllRestaurantTypes, setAllRestaurantTypes] = useState([]);
  let [types, setRestaurantTypes] = useState([]);

  const getRestaurantTypes = () => {
    axios
      .get(GET_REPAIR_SHOP_TYPES, {
        headers: headers,
      })
      .then((res) => {
        setAllRestaurantTypes(res.data.all_restaurant_types);
      });
  };

  const update_Type = () => {
    axios({
      method: "post",
      url: CHANGE_TYPE,
      headers: headers,
      data: {
        restaurant_id: props.restaurant_id,
        types: types,
      },
    })
      .then((res) => {
        props.update_state(res.data.restaurant);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  AllRestaurantTypes.forEach(function (element) {
    element.value = element.description;
    element.label = element.description;
  });

  return (
    <>
      <FiEdit2
        title={"edit restaurant's type"}
        id={"edit_restaurant_type"}
        onClick={() => {
          handleShow();
          getRestaurantTypes();
          setRestaurantTypes([]);
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
          <Modal.Title>Edit types for {props.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Types
          </Form.Label>
          <Col sm="10">
            <Select
              closeMenuOnSelect={false}
              onChange={(e) => {
                setRestaurantTypes(e);
              }}
              isMulti
              options={AllRestaurantTypes}
            />
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            <CgDanger
              style={{ color: "red", fontSize: "1.5em", marginRight: "0.5em" }}
            />
            Previous types will be removed. Include them in the selection if
            they are not false
            {!types.length > 0 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {!types.length > 0 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Select at least one type.
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
            disabled={!types.length > 0}
            color="green"
            onClick={() => {
              handleClose();
              update_Type();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeType;
