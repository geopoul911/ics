// Built-ins
import React, { useState } from "react";

// CSS
import "react-phone-number-input/style.css";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { BsInfoSquare } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Form, Col, Row } from "react-bootstrap";
import { Button, TextArea } from "semantic-ui-react";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const ADD_DOCUMENT =
  "http://localhost:8000/api/data_management/upload_restaurant_menu";

function AddRestaurantMenuModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isText, setIsText] = useState(true);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("EUR");

  const [file, setFile] = React.useState();

  const uploadNewGroupDocument = () => {
    const formData = new FormData();

    // Update the formData object
    formData.append("restaurant_id", props.restaurant_id);
    formData.append("is_text", isText);
    formData.append("file", file);
    formData.append("price_per_person", price);
    formData.append("currency", currency);
    formData.append("description", description);
    axios({
      method: "post",
      url: ADD_DOCUMENT,
      headers: headers,
      data: formData,
    })
      .then((res) => {
        props.update_state(res.data.model);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Restaurant's Menu has been successfully uploaded",
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: e.response.data.errormsg,
        });
      });
  };
  
  const handleBlur = (e) => {
    let value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      value = value.toFixed(2);
      setPrice(value);
    } else {
      setPrice("");
    }
  };


  return (
    <>
      <Button
        color="green"
        style={{ margin: 20 }}
        onClick={() => {
          handleShow();
          setIsText(true);
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Restaurant Menu
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Restaurant Menu </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Text / File:
            </Form.Label>
            <Col sm="10">
              <Form.Check
                name="Text"
                type={"radio"}
                label={"Text"}
                checked={isText}
                style={{ display: "inline-block", margin: 10 }}
                onClick={() => setIsText(true)}
              />
              <Form.Check
                name="Text"
                type={"radio"}
                label={"File"}
                checked={!isText}
                style={{ display: "inline-block", margin: 10 }}
                onClick={() => setIsText(false)}
              />
            </Col>
            <Form.Label column sm="2">
              Currency:
            </Form.Label>
            <Col sm="10">
              <select
                className="form-control"
                onChange={(e) => setCurrency(e.target.value)}
                style={{ marginBottom: 10, width: "40%" }}
                value={currency}
              >
                <option value="EUR"> € Euro (EUR) </option>
                <option value="GBP"> £ Pound Sterling (GBP) </option>
                <option value="USD"> $ US Dollar (USD) </option>
                <option value="CAD"> $ Canadian Dollar (CAD) </option>
                <option value="AUD"> $ Australian Dollar (AUD) </option>
                <option value="CHF"> ₣ Swiss Franc (CHF) </option>
                <option value="JPY"> ¥ Japanese Yen (JPY) </option>
                <option value="NZD"> $ New Zealand Dollar (NZD) </option>
                <option value="CNY"> ¥ Chinese Yuan (CNY) </option>
                <option value="SGD"> $ Singapore Dollar (SGD) </option>
              </select>
            </Col>
            <Form.Label column sm="2">
              Price:
            </Form.Label>
            <Col sm="10">
            <input
              style={{ width: 200, marginBottom: 10 }}
              type="text"
              value={price}
              onBlur={handleBlur}
              onInput={(e) => {
                // Allow only numbers and up to 2 decimal places
                e.target.value = e.target.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                e.target.value = e.target.value.replace(/(\.\d{2}).*$/, "$1"); // Keep only up to 2 decimal places
              }}
              className="form-control"
              onChange={(e) => setPrice(e.currentTarget.value)}
            />
            </Col>
            {isText ? (
              <>
                <Form.Label column sm="2">
                  Description:
                </Form.Label>
                <Col sm="9">
                  <TextArea
                    onChange={(e) =>
                      setDescription(e.currentTarget.value.toUpperCase())
                    }
                    value={description}
                    rows={4}
                    cols={10}
                    maxLength={500}
                    className="form-control"
                  />
                </Col>
              </>
            ) : (
              <>
                <Form.Label column sm="2">
                  Description:
                </Form.Label>
                <Col sm="9">
                  <TextArea
                    onChange={(e) =>
                      setDescription(e.currentTarget.value.toUpperCase())
                    }
                    value={description}
                    rows={4}
                    cols={10}
                    maxLength={500}
                    className="form-control"
                  />
                </Col>
                <Form.Label column sm="2" style={{ marginTop: 10 }}>
                  File:
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    style={{ marginTop: 20 }}
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </Col>
                <small>
                  <hr />
                  <Form.Label column sm="3">
                    <CgDanger
                      style={{
                        color: "red",
                        fontSize: "1.5em",
                        marginRight: "0.5em",
                      }}
                    />
                    Allowed extensions :
                  </Form.Label>
                  <Col sm="12">
                    .PDF .XLSX .XLSM .XLSX .DOCX .DOC .TIF .TIFF .BMP .JPG .JPEG
                    .PNG .CSV .DOT .DOTX .MP3 .MP4 .PPTX .ZIP .RAR .TXT .WAV
                    .FLV
                  </Col>
                  <hr />
                  <Form.Label column sm="3">
                    <CgDanger
                      style={{
                        color: "red",
                        fontSize: "1.5em",
                        marginRight: "0.5em",
                      }}
                    />
                    Max Size:
                  </Form.Label>
                  <Col sm="12">
                    File's size should not exceed 20 megabytes of data
                  </Col>
                </small>
              </>
            )}
          </Form.Group>
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
            Restaurant menus are used in offers and group services.
          </small>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>

          {isText ? (
            <Button
              color="green"
              disabled={
                price === 0 ||
                price === "0" ||
                price < 0 ||
                description.length < 4
              }
              onClick={() => {
                handleClose();
                uploadNewGroupDocument();
              }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              color="green"
              disabled={
                price === 0 || price === "0" || description.length < 4 || !file
              }
              onClick={() => {
                handleClose();
                uploadNewGroupDocument();
              }}
            >
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddRestaurantMenuModal;
