// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for creating professions
const CREATE_PROFESSION = "http://localhost:8000/api/administration/all_professions/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Validation helpers
const validateProfessionId = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");

export default function AddProfessionModal({ onProfessionCreated }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    profession_id: "",
    title: "",
  });

  const handleClose = () => {
    setShow(false);
    setFormData({
      profession_id: "",
      title: "",
    });
  };

  const handleShow = () => setShow(true);

  const isFormValid = () => {
    return (
      formData.profession_id.trim().length >= 1 &&
      formData.profession_id.trim().length <= 10 &&
      formData.title.trim().length >= 2 &&
      formData.title.trim().length <= 40
    );
  };

  const createNewProfession = async () => {
    if (!isFormValid()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Form",
        text: "Please fill in all required fields correctly.",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        profession_id: formData.profession_id.trim().toUpperCase(),
        title: formData.title.trim(),
      };

      const res = await axios.post(CREATE_PROFESSION, payload, { headers: currentHeaders });
      
      const newId = res.data.profession_id;
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profession created successfully!",
      });

      handleClose();
      
      // Redirect to the new profession's overview page
      window.location.href = `/administration/profession/${newId}`;
      
    } catch (e) {
      console.log('Error creating profession:', e);
      
      let apiMsg = "Failed to create profession.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.profession_id) {
        apiMsg = e.response.data.profession_id[0];
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
      <Button onClick={handleShow} color="green" style={{ margin: 20 }}>
        <BiPlus style={{ marginRight: 6 }} />
        New Profession
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Profession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Profession ID:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="profession_id"
                  value={formData.profession_id}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    profession_id: validateProfessionId(clampLen(e.target.value, 10))
                  }))}
                  placeholder="Enter profession ID (1-10 alphanumeric characters)"
                  isInvalid={
                    formData.profession_id !== "" &&
                    (formData.profession_id.trim().length < 1 || formData.profession_id.trim().length > 10)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Profession ID must be 1-10 alphanumeric characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Title:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: validateTitle(clampLen(e.target.value, 40))
                  }))}
                  placeholder="Enter profession title (2-40 characters)"
                  isInvalid={
                    formData.title !== "" &&
                    (formData.title.trim().length < 2 || formData.title.trim().length > 40)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Title must be 2-40 characters
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isFormValid() ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {formData.profession_id.trim().length < 1 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Profession ID is required (1–10 chars).
                  </li>
                )}
                {formData.profession_id.trim().length > 10 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Profession ID must be 1–10 chars.
                  </li>
                )}
                {formData.title.trim().length < 2 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title is required (2–40 chars).
                  </li>
                )}
                {formData.title.trim().length > 40 && (
                  <li>
                    <AiOutlineWarning style={{ fontSize: 18, marginRight: 6 }} />
                    Title must be 2–40 chars.
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ fontSize: 18, marginRight: 6 }} />
                All fields are valid!
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={createNewProfession}
            disabled={!isFormValid()}
          >
            Create Profession
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
