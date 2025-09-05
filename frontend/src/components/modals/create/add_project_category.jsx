// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { BiPlus } from "react-icons/bi";
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Form } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers } from "../../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for creating project categories
const CREATE_PROJECT_CATEGORY = "http://localhost:8000/api/administration/all_project_categories/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Validation helpers
const validateProjectCategoryId = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const validateOrderIndex = (value) => value.replace(/[^0-9]/g, "");
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");

export default function AddProjectCategoryModal({ onProjectCategoryCreated }) {
  const [show, setShow] = useState(false);
  const [projcate_id, setProjcateId] = useState("");
  const [title, setTitle] = useState("");
  const [orderindex, setOrderIndex] = useState("");
  const [active, setActive] = useState(true);

  const handleClose = () => {
    setShow(false);
    setProjcateId("");
    setTitle("");
    setOrderIndex("");
    setActive(true);
  };

  const handleShow = () => setShow(true);

  const isProjcateIdValid = projcate_id.trim().length === 1;
  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isOrderIndexValid = orderindex.trim().length > 0 && !isNaN(orderindex);

  const createProjectCategory = async () => {
    if (!isProjcateIdValid || !isTitleValid || !isOrderIndexValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Data",
        text: "Please check all fields and ensure they are valid.",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        projcate_id: projcate_id.trim().toUpperCase(),
        title: title.trim(),
        orderindex: Number(orderindex),
        active: active,
      };

      const response = await axios.post(
        CREATE_PROJECT_CATEGORY,
        payload,
        { headers: currentHeaders }
      );

      const newId = response.data.projcate_id;

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project Category created successfully!",
      });

      handleClose();
      
      if (onProjectCategoryCreated) {
        onProjectCategoryCreated();
      }

      // Redirect to the new project category's overview page
      window.location.href = `/administration/project_category/${newId}`;
    } catch (e) {
      console.log('Error creating project category:', e);
      
      let apiMsg = "Failed to create project category.";
      const data = e?.response?.data;
      
      if (data?.error) {
        apiMsg = data.error;
      } else if (data?.projcate_id) {
        apiMsg = data.projcate_id[0];
      } else if (data?.title) {
        apiMsg = data.title[0];
      } else if (data?.orderindex) {
        apiMsg = data.orderindex[0];
      } else if (typeof data === 'object' && data) {
        try {
          const all = Object.values(data).flat().join(' ');
          if (all) apiMsg = all;
        } catch (_ignored) {}
      } else if (data?.detail) {
        apiMsg = data.detail;
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
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Project Category
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Project Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category ID:</Form.Label>
              <Form.Control
                type="text"
                value={projcate_id}
                onChange={(e) => setProjcateId(validateProjectCategoryId(clampLen(e.target.value, 1)))}
                placeholder="e.g., A"
                isInvalid={projcate_id !== "" && !isProjcateIdValid}
              />
              <Form.Control.Feedback type="invalid">
                Category ID must be exactly 1 character
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(validateTitle(clampLen(e.target.value, 40)))}
                placeholder="e.g., Real Estate"
                isInvalid={title !== "" && !isTitleValid}
              />
              <Form.Control.Feedback type="invalid">
                Title must be 2-40 characters
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Order by *</Form.Label>
              <Form.Control
                type="text"
                value={orderindex}
                onChange={(e) => setOrderIndex(validateOrderIndex(clampLen(e.target.value, 5)))}
                placeholder="Enter order by (numeric)"
                isInvalid={!isOrderIndexValid}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                label="Project category is active"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isProjcateIdValid || !isTitleValid || !isOrderIndexValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isProjcateIdValid && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Category ID must be exactly 1 character
                  </li>
                )}
                {!isTitleValid && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Title must be 2-40 characters
                  </li>
                )}
                {!isOrderIndexValid && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Order by is required and must be a valid number
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                All fields are valid!
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={createProjectCategory}
            disabled={!isProjcateIdValid || !isTitleValid || !isOrderIndexValid}
          >
            Create Project Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
