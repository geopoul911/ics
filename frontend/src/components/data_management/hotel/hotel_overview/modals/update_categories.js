// Built-ins
import React, { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";
import Swal from "sweetalert2";

// Custom Made Components
import AddHotelCategoryModal from "./add_hotel_category_modal";

// Global Variables
import { headers } from "../../../../global_vars";

// Variables
window.Swal = Swal;

const UPDATE_HOTEL_CATEGORIES =
  "http://localhost:8000/api/data_management/update_hotel_categories/";
const GET_HOTEL_CATEGORIES =
  "http://localhost:8000/api/view/get_all_hotel_categories/";
const DELETE_HOTEL_CATEGORY =
  "http://localhost:8000/api/data_management/delete_hotel_category/";

let delIconStyle = {
  color: "red",
  fontSize: "1.7em",
  marginRight: 10,
  marginTop: 5,
};

function UpdateCategories(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [AllHotelCategories, setAllHotelCategories] = useState([]);
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

  const updateHotelCategory = () => {
    axios({
      method: "post",
      url: UPDATE_HOTEL_CATEGORIES,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        hotel_categories: checkedCategories,
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

  const deleteHotelCategory = (hc_id) => {
    axios({
      method: "post",
      url: DELETE_HOTEL_CATEGORY + hc_id,
      headers: headers,
      data: {
        object_id: props.object_id,
        object_type: props.object_type,
        object_name: props.object_name,
        hc_id: hc_id,
      },
    })
      .then((res) => {
        props.update_state(res.data.object);
        getHotelCategories();
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };

  const getHotelCategories = () => {
    axios
      .get(GET_HOTEL_CATEGORIES, {
        headers: headers,
      })
      .then((res) => {
        setAllHotelCategories(res.data.all_hotel_categories);
      });
  };

  return (
    <>
      <FiEdit2
        title={"edit markets"}
        id={"edit_place"}
        className={"edit_icon"}
        onClick={() => {
          handleShow();
          getHotelCategories();
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
          <Modal.Title> Change Markets for {props.object_name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {AllHotelCategories.map((hc) => (
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
              {/* <DeleteCategoryModal  /> */}
              <AiFillDelete
                title="Delete Hotel Category"
                style={delIconStyle}
                hc_id={hc.id}
                className="icon-hover"
                onClick={() => deleteHotelCategory(hc.id)}
              />
              <br />
            </React.Fragment>
          ))}
          <div style={{ float: "right" }}>
            <AddHotelCategoryModal
              get_hotel_categories={() => getHotelCategories()}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              handleClose();
              updateHotelCategory();
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
