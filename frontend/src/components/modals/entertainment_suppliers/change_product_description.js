// Built-ins
import { useState } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";
import { BsInfoSquare } from "react-icons/bs";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import { Modal } from "react-bootstrap";
import axios from "axios";
import { TextArea } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

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

const CHANGE_PRODUCT_DESCRIPTION = "http://localhost:8000/api/data_management/change_product_description/";


function ProductDescription(props) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const updateDescription = () => {
    axios({
      method: "post",
      url: CHANGE_PRODUCT_DESCRIPTION,
      headers: headers,
      data: {
        entertainment_product_id: props.object_id,
        description: description,
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
        title={"edit description"}
        onClick={() => {
          handleShow();
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
          <Modal.Title>Change Description for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextArea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={7}
            cols={40}
            maxLength={500}
            className="form-control"
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
            Description is a free text field. It has a maximum length of 255 characters.
            {description.length < 2 ? (
              <>
                <ul
                  className="mr-auto"
                  style={{ margin: 0, padding: 0, marginTop: 10, color: "red" }}
                >
                  <li>
                    {description.length < 2 ? (
                      <>
                        <AiOutlineWarning style={warningStyle} />
                        Fill The Description Field.
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
            disabled={description.length < 2}
            onClick={() => {
              handleClose();
              updateDescription();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductDescription;
