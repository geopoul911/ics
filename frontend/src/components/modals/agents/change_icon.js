// Built-ins
import React, { useState, useEffect } from "react";

// Icons / Images
import { FiEdit2 } from "react-icons/fi";

// Modules / Functions
import { Modal, Col, Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "semantic-ui-react";
import Swal from "sweetalert2";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

const CHANGE_BUS_ICON = "http://localhost:8000/api/data_management/change_bus_icon/";
const GET_USED_ICONS = "http://localhost:8000/api/data_management/get_used_icons/";

function ChangeAgentIcon(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedIconIndex, setSelectedIconIndex] = React.useState("");
  const [selectedIconFilename, setSelectedIconFilename] = React.useState();
  const [usedIcons, setUsedIcons] = React.useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const importAll = (r) => {
      return r.keys().map((filename) => ({
        filename,
        src: r(filename).default,
      }));
    };

    const images = importAll(
      require.context(
        "../../../images/agent_icons",
        false,
        /\.(png|jpe?g|svg)$/
      )
    );
    setImages(images);

    axios
      .get(GET_USED_ICONS, {
        headers: headers,
      })
      .then((res) => {
        setUsedIcons(res.data.used_icons);
      });
  }, []);

  const updateIcon = () => {
    axios({
      method: "post",
      url: CHANGE_BUS_ICON,
      headers: headers,
      data: {
        filename: selectedIconFilename,
        agent_id: props.object_id,
      },
    })
      .then((res) => {
        props.update_state(res.data.agent);
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
        title={"edit Icon"}
        id={"edit_repair_shop_type"}
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
          <Modal.Title>Edit Icon for {props.object_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col>
            <Form.Group controlId="formFile" className="mb-3">
              {/* eslint-disable-next-line */}
              {images.map((image, index) => {
                if (!usedIcons.includes(image.filename)) {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "inline-block",
                        margin: 4,
                        padding: "2px 2px 2px 0px",
                      }}
                      className={
                        index === selectedIconIndex
                          ? "selected_agent_icon"
                          : "agent_icon"
                      }
                    >
                      <img
                        src={image.src}
                        alt={`${index}`}
                        style={{ margin: "0 auto" }}
                        key={index}
                        onClick={() => {
                          setSelectedIconIndex(index);
                          setSelectedIconFilename(image.filename);
                        }}
                      />
                    </div>
                  );
                }
              })}
            </Form.Group>
          </Col>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Close
          </Button>
          <Button
            color="green"
            disabled={selectedIconIndex === ""}
            onClick={() => {
              handleClose();
              updateIcon();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeAgentIcon;
