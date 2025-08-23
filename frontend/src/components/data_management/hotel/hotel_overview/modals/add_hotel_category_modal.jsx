// Built-ins
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";

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

const ADD_HOTEL_CATEGORY = "http://localhost:8000/api/view/add_htl_category/";

let formControlStyle = {
  marginBottom: 10,
  width: "93%",
  display: "inline-block",
};

function AddHotelMarketModal(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [hotelMarket, setHotelMarket] = useState("");

  const createNewHotelMarket = () => {
    axios({
      method: "post",
      url: ADD_HOTEL_CATEGORY,
      headers: headers,
      data: {
        hotel_category: hotelMarket,
      },
    })
      .then(() => {
        props.get_hotel_categories();
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
      <Button
        color="green"
        style={{ margin: 10 }}
        onClick={() => {
          handleShow();
          setHotelMarket("");
        }}
      >
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Hotel Market
      </Button>
      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Create new Hotel Market </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
              Hotel Market:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                maxLength="63"
                onChange={(e) => {
                  setHotelMarket(e.target.value);
                }}
                style={formControlStyle}
                value={hotelMarket}
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {hotelMarket.length < 2 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {hotelMarket.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Hotel Market Field.
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
            onClick={() => {
              handleClose();
              createNewHotelMarket();
            }}
            disabled={hotelMarket.length < 2}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddHotelMarketModal;
