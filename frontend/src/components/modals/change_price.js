// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
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

const CHANGE_PRICE = "http://localhost:8000/api/data_management/change_price/";

function ChangePrice(props) {
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const update_Price = () => {
    axios({
      method: "post",
      url: CHANGE_PRICE,
      headers: headers,
      data: {
        hotel_id: props.object_id,
        object_type: props.object_type,
        price: price,
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

  return (
    <>
      <FiEdit2
        title={"edit price"}
        onClick={() => {
          handleShow();
          setPrice("");
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
          <Modal.Title>Change price for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label column sm="2">
            Price:
          </Form.Label>
          <input
            type="number"
            value={price}
            style={{ width: 240, display: "inline", marginLeft: 10 }}
            required
            className="form-control flight_input"
            onInput={(e) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 4);
            }}
            onChange={(e) => {
              setPrice(e.currentTarget.value);
            }}
            maxLength="5"
          ></input>
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
            Price is a field depending on currency and a number. Example : USD
            50
            {price === 0 || price === "0" || price === "" ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {price.length < 4 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Price Field.
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
            disabled={price === 0 || price === "0" || price === ""}
            onClick={() => {
              handleClose();
              update_Price();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePrice;
