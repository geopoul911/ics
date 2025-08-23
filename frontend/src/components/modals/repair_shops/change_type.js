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

const CHANGE_TYPE =
  "http://localhost:8000/api/data_management/change_repair_shop_type/";
const GET_REPAIR_SHOP_TYPES =
  "http://localhost:8000/api/view/get_all_repair_shop_types/";

// Modal's content
function ChangeType(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [AllRepairTypes, setAllRepairTypes] = useState([]);
  let [types, setRepairTypes] = useState([]);

  const getRepairTypes = () => {
    axios
    .get(GET_REPAIR_SHOP_TYPES, {
      headers: headers,
    })
    .then((res) => {
      setAllRepairTypes(res.data.all_repair_shop_types);
    });
  };

  const update_Type = () => {
    axios({
      method: "post",
      url: CHANGE_TYPE,
      headers: headers,
      data: {
        repair_shop_id: props.repair_shop_id,
        types: types,
      },
    })
      .then((res) => {
        props.update_state(res.data.repair_shop);
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  AllRepairTypes.forEach(function (element) {
    element.value = element.description;
    element.label = element.description;
  });

  return (
    <>
      <FiEdit2
        title={"edit repair_shop's type"}
        id={"edit_repair_shop_type"}
        onClick={() => {
          handleShow();
          getRepairTypes();

          setRepairTypes([]);
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
                setRepairTypes(e);
              }}
              isMulti
              options={AllRepairTypes}
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
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            disabled={types.length === 0}
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
