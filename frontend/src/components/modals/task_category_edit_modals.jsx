// Built-ins
import React from "react";
import { useState } from "react";

// Icons / Images
import { AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";

// Modules / Functions
import Swal from "sweetalert2";
import { Modal, Col, Form, Row } from "react-bootstrap";
import { Button } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import { headers } from "../global_vars";

// Variables
window.Swal = Swal;

// API endpoint for updating task categories
const UPDATE_TASK_CATEGORY = "http://localhost:8000/api/administration/task_category/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Validation helpers
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");
const validateOrderIndex = (value) => value.replace(/[^0-9]/g, "");

export function EditTaskCategoryTitleModal({ task_category, onTaskCategoryUpdated }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(task_category.title || "");

  const handleClose = () => {
    setShow(false);
    setTitle(task_category.title || "");
  };

  const handleShow = () => setShow(true);

  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;

  const updateTaskCategoryTitle = async () => {
    if (!isTitleValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Data",
        text: "Please check the title field and ensure it is valid.",
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
        `${UPDATE_TASK_CATEGORY}${task_category.taskcate_id}/`,
        payload,
        { headers: currentHeaders }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task Category title updated successfully!",
      });

      handleClose();
      
      if (onTaskCategoryUpdated) {
        onTaskCategoryUpdated(response.data);
      }
    } catch (e) {
      console.log('Error updating task category title:', e);
      
      let apiMsg = "Failed to update task category title.";
      
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task Category Title</Modal.Title>
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
                  placeholder="Enter task category title (2-40 characters)"
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
              <div style={{ color: "red" }}>
                <AiOutlineWarning style={{ marginRight: 5 }} />
                Title must be 2-40 characters
              </div>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateTaskCategoryTitle}
            disabled={!isTitleValid}
          >
            Update Title
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditTaskCategoryOrderIndexModal({ task_category, onTaskCategoryUpdated }) {
  const [show, setShow] = useState(false);
  const [orderindex, setOrderIndex] = useState(task_category.orderindex?.toString() || "");

  const handleClose = () => {
    setShow(false);
    setOrderIndex(task_category.orderindex?.toString() || "");
  };

  const handleShow = () => setShow(true);

  const isOrderIndexValid = orderindex.trim().length > 0 && !isNaN(orderindex);

  const updateTaskCategoryOrderIndex = async () => {
    if (!isOrderIndexValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Data",
        text: "Please check the order index field and ensure it is valid.",
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
        `${UPDATE_TASK_CATEGORY}${task_category.taskcate_id}/`,
        payload,
        { headers: currentHeaders }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task Category order index updated successfully!",
      });

      handleClose();
      
      if (onTaskCategoryUpdated) {
        onTaskCategoryUpdated(response.data);
      }
    } catch (e) {
      console.log('Error updating task category order index:', e);
      
      let apiMsg = "Failed to update task category order index.";
      
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task Category Order by</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Order by:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={orderindex}
                  onChange={(e) => setOrderIndex(validateOrderIndex(clampLen(e.target.value, 5)))}
                  placeholder="Enter order by (numeric)"
                  isInvalid={orderindex !== "" && !isOrderIndexValid}
                />
                <Form.Control.Feedback type="invalid">
                  Order by must be a valid number
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isOrderIndexValid ? (
              <div style={{ color: "red" }}>
                <AiOutlineWarning style={{ marginRight: 5 }} />
                Order by must be a valid number
              </div>
            ) : (
              <div style={{ color: "green" }}>
                <AiOutlineCheckCircle style={{ marginRight: 5 }} />
                Looks good.
              </div>
            )}
          </small>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateTaskCategoryOrderIndex}
            disabled={!isOrderIndexValid}
          >
            Update Order by
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditTaskCategoryActiveModal({ task_category, onTaskCategoryUpdated }) {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(task_category.active || false);

  const handleClose = () => {
    setShow(false);
    setActive(task_category.active || false);
  };

  const handleShow = () => setShow(true);

  const updateTaskCategoryActive = async () => {
    try {
      const currentHeaders = {
        ...headers,
        "Authorization": "Token " + localStorage.getItem("userToken")
      };

      const payload = {
        active: active,
      };

      const response = await axios.put(
        `${UPDATE_TASK_CATEGORY}${task_category.taskcate_id}/`,
        payload,
        { headers: currentHeaders }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Task Category ${active ? 'activated' : 'deactivated'} successfully!`,
      });

      handleClose();
      
      if (onTaskCategoryUpdated) {
        onTaskCategoryUpdated(response.data);
      }
    } catch (e) {
      console.log('Error updating task category active status:', e);
      
      let apiMsg = "Failed to update task category active status.";
      
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
        Edit
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task Category Active Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Active:
              </Form.Label>
              <Col sm={9}>
                <Form.Check
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  label="Task category is active"
                />
              </Col>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={updateTaskCategoryActive}
          >
            Update Active Status
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
