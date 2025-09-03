// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { FiEdit } from "react-icons/fi";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for profession updates
const UPDATE_PROFESSION = "http://localhost:8000/api/administration/profession/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Validation helpers
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");

export function EditProfessionTitleModal({ profession, onProfessionUpdated }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleClose = () => {
    setShow(false);
    setTitle("");
  };

  const handleShow = () => {
    setTitle(profession.title || "");
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;

  const updateProfessionTitle = async () => {
    if (!isTitleValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Title",
        text: "Title must be 2-40 characters long.",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        title: title.trim(),
      };

      const response = await axios.put(
        UPDATE_PROFESSION + profession.profession_id + "/",
        payload,
        { headers: currentHeaders }
      );

      const updatedProfession = response.data;
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profession title updated successfully!",
      });

      handleClose();
      
      if (onProfessionUpdated) {
        onProfessionUpdated(updatedProfession);
      }
    } catch (e) {
      console.log('Error updating profession title:', e);
      
      let apiMsg = "Failed to update profession title.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.title) {
        apiMsg = e.response.data.title[0];
      } else if (e?.response?.data?.detail) {
        apiMsg = e.response.data.detail;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: apiMsg,
      });
    }
  };

  return (
    <>
      <Button size="tiny" basic onClick={handleShow}>
        <FiEdit style={{ marginRight: 6 }} />
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profession Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Title:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(validateTitle(clampLen(e.target.value, 40)))}
                  placeholder="Enter profession title (2-40 characters)"
                  isInvalid={title !== "" && !isTitleValid}
                />
                <Form.Control.Feedback type="invalid">
                  Title must be 2-40 characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isTitleValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {title.trim().length < 2 && (
                  <li>
                    Title must be at least 2 characters long.
                  </li>
                )}
                {title.trim().length > 40 && (
                  <li>
                    Title must be at most 40 characters long.
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateProfessionTitle}
            disabled={!isTitleValid}
          >
            Update Title
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
