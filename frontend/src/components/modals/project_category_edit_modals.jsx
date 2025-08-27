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

// API endpoint for project category updates
const UPDATE_PROJECT_CATEGORY = "http://localhost:8000/api/administration/project_category/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Validation helpers
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");
const validateOrderIndex = (value) => value.replace(/[^0-9]/g, "");

export function EditProjectCategoryTitleModal({ project_category, onProjectCategoryUpdated }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");

  const handleClose = () => {
    setShow(false);
    setTitle("");
  };

  const handleShow = () => {
    setTitle(project_category.title || "");
    setShow(true);
  };

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;

  const updateProjectCategoryTitle = async () => {
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
        UPDATE_PROJECT_CATEGORY + project_category.projcate_id + "/",
        payload,
        { headers: currentHeaders }
      );

      const updatedProjectCategory = response.data;
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project Category title updated successfully!",
      });

      handleClose();
      
      if (onProjectCategoryUpdated) {
        onProjectCategoryUpdated(updatedProjectCategory);
      }
    } catch (e) {
      console.log('Error updating project category title:', e);
      
      let apiMsg = "Failed to update project category title.";
      
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
          <Modal.Title>Edit Project Category Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Title:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(validateTitle(clampLen(e.target.value, 40)))}
                  placeholder="Enter project category title (2-40 characters)"
                  isInvalid={title !== "" && !isTitleValid}
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
                Title is valid!
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateProjectCategoryTitle}
            disabled={!isTitleValid}
          >
            Update Title
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProjectCategoryOrderIndexModal({ project_category, onProjectCategoryUpdated }) {
  const [show, setShow] = useState(false);
  const [orderindex, setOrderIndex] = useState("");

  const handleClose = () => {
    setShow(false);
    setOrderIndex("");
  };

  const handleShow = () => {
    setOrderIndex(project_category.orderindex?.toString() || "");
    setShow(true);
  };

  const isOrderIndexValid = orderindex.trim().length > 0 && !isNaN(orderindex);

  const updateProjectCategoryOrderIndex = async () => {
    if (!isOrderIndexValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Order Index",
        text: "Order index must be a valid number.",
      });
      return;
    }

    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        orderindex: parseInt(orderindex),
      };

      const response = await axios.put(
        UPDATE_PROJECT_CATEGORY + project_category.projcate_id + "/",
        payload,
        { headers: currentHeaders }
      );

      const updatedProjectCategory = response.data;
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project Category order index updated successfully!",
      });

      handleClose();
      
      if (onProjectCategoryUpdated) {
        onProjectCategoryUpdated(updatedProjectCategory);
      }
    } catch (e) {
      console.log('Error updating project category order index:', e);
      
      let apiMsg = "Failed to update project category order index.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.orderindex) {
        apiMsg = e.response.data.orderindex[0];
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
          <Modal.Title>Edit Project Category Order Index</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Order Index:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={orderindex}
                  onChange={(e) => setOrderIndex(validateOrderIndex(clampLen(e.target.value, 5)))}
                  placeholder="Enter order index (numeric)"
                  isInvalid={orderindex !== "" && !isOrderIndexValid}
                />
                <Form.Control.Feedback type="invalid">
                  Order index must be a valid number
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isOrderIndexValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {orderindex.trim().length === 0 && (
                  <li>
                    Order index is required.
                  </li>
                )}
                {orderindex.trim().length > 0 && isNaN(orderindex) && (
                  <li>
                    Order index must be a valid number.
                  </li>
                )}
              </ul>
            ) : (
              <div style={{ color: "green" }}>
                Order index is valid!
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateProjectCategoryOrderIndex}
            disabled={!isOrderIndexValid}
          >
            Update Order Index
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditProjectCategoryActiveModal({ project_category, onProjectCategoryUpdated }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  const handleClose = () => {
    setShow(false);
    setActive(false);
  };

  const handleShow = () => {
    setActive(project_category.active || false);
    setShow(true);
  };

  const updateProjectCategoryActive = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        active: active,
      };

      const response = await axios.put(
        UPDATE_PROJECT_CATEGORY + project_category.projcate_id + "/",
        payload,
        { headers: currentHeaders }
      );

      const updatedProjectCategory = response.data;
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Project Category ${active ? 'activated' : 'deactivated'} successfully!`,
      });

      handleClose();
      
      if (onProjectCategoryUpdated) {
        onProjectCategoryUpdated(updatedProjectCategory);
      }
    } catch (e) {
      console.log('Error updating project category active status:', e);
      
      let apiMsg = "Failed to update project category active status.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.active) {
        apiMsg = e.response.data.active[0];
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
          <Modal.Title>Edit Project Category Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Active:
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  label="Project category is active"
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateProjectCategoryActive}
          >
            Update Active Status
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
