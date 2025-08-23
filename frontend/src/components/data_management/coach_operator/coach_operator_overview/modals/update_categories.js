// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const UPDATE_COACH_OPERATOR_CATEGORIES =
  "http://localhost:8000/api/data_management/update_coach_operator_categories/";
const GET_COACH_OPERATOR_CATEGORIES =
  "http://localhost:8000/api/view/get_all_coach_operator_categories/";

function UpdateCategories(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [AllCoachOperatorCategories, setAllCoachOperatorCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState(props.categories);

  const handleCategoryChange = (category) => {
    setCheckedCategories((prevChecked) => {
      if (prevChecked.includes(category)) {
        return prevChecked.filter((c) => c !== category);
      } else {
        return [...prevChecked, category];
      }
    });
  };

  const updateCoachOperatorCategory = () => {
    axios({
      method: "post",
      url: UPDATE_COACH_OPERATOR_CATEGORIES,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        coach_operator_categories: checkedCategories,
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

  const getCoachOperatorCategories = () => {
    axios
      .get(GET_COACH_OPERATOR_CATEGORIES, {
        headers: headers,
      })
      .then((res) => {
        setAllCoachOperatorCategories(res.data.all_coach_operator_categories);
      });
  };

  return (
    <>
      <FiEdit2
        title={"edit place"}
        id={"edit_place"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getCoachOperatorCategories();
          setCheckedCategories([]);
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
          <Modal.Title> Change Categories for {props.object_name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {AllCoachOperatorCategories.map((hc) => (
            <React.Fragment key={hc} style={{ display: "inline" }}>
              <Form.Check
                label={hc.name}
                checked={checkedCategories.includes(hc)}
                onChange={() => handleCategoryChange(hc)}
                style={{
                  display: "inline-block",
                  borderBottom: "1px solid grey",
                }}
              />
              <br/>
            </React.Fragment>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateCoachOperatorCategory();
              setCheckedCategories([]);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateCategories;
