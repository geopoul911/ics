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

// API endpoint for creating task categories
const CREATE_TASK_CATEGORY = "https://ultima.icsgr.com/api/administration/all_task_categories/";

// Helpers
const clampLen = (value, max) => value.slice(0, max);

// Validation helpers
const validateTaskCategoryId = (value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const validateOrderIndex = (value) => value.replace(/[^0-9]/g, "");
const validateTitle = (value) => value.replace(/[^a-zA-Z0-9\s\-']/g, "");

export default function AddTaskCategoryModal({ onTaskCategoryCreated }) {
  const [show, setShow] = useState(false);
  const [taskcate_id, setTaskcateId] = useState("");
  const [title, setTitle] = useState("");
  const [orderindex, setOrderIndex] = useState("");
  const [active, setActive] = useState(true);

  const handleClose = () => {
    setShow(false);
    setTaskcateId("");
    setTitle("");
    setOrderIndex("");
    setActive(true);
  };

  const handleShow = () => setShow(true);

  const isTaskcateIdValid = taskcate_id.trim().length >= 2 && taskcate_id.trim().length <= 10;
  const isTitleValid = title.trim().length >= 2 && title.trim().length <= 40;
  const isOrderIndexValid = String(orderindex).trim().length > 0 && !isNaN(orderindex);

  const createTaskCategory = async () => {
    if (!isTaskcateIdValid || !isTitleValid || !isOrderIndexValid) {
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
        taskcate_id: taskcate_id.trim().toUpperCase(),
        title: title.trim(),
        orderindex: Number(orderindex),
        active: active,
      };

      const response = await axios.post(
        CREATE_TASK_CATEGORY,
        payload,
        { headers: currentHeaders }
      );

      const newId = response.data.taskcate_id;

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task Category created successfully!",
      });

      handleClose();
      
      if (onTaskCategoryCreated) {
        onTaskCategoryCreated();
      }

      // Redirect to the new task category's overview page
      window.location.href = `/administration/task_category/${newId}`;
    } catch (e) {
      console.log('Error creating task category:', e);
      
      let apiMsg = "Failed to create task category.";
      
      if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.response?.data?.taskcate_id) {
        apiMsg = e.response.data.taskcate_id[0];
      } else if (e?.response?.data?.title) {
        apiMsg = e.response.data.title[0];
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
      <Button color="green" style={{ margin: 20 }} onClick={handleShow}>
        <BiPlus
          style={{ color: "white", fontSize: "1.3em", marginRight: "0.3em" }}
        />
        Create new Task Category
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Task Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Category ID:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={taskcate_id}
                  onChange={(e) => setTaskcateId(validateTaskCategoryId(clampLen(e.target.value, 10)))}
                  placeholder="Enter category ID (2-10 characters, A-Z, 0-9)"
                  isInvalid={taskcate_id !== "" && !isTaskcateIdValid}
                />
                <Form.Control.Feedback type="invalid">
                  Category ID must be 2-10 characters
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

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Order by *:
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  value={orderindex}
                  onChange={(e) => setOrderIndex(validateOrderIndex(clampLen(e.target.value, 5)))}
                  placeholder="Enter order by (numeric)"
                  isInvalid={!isOrderIndexValid}
                />
              </Col>
            </Form.Group>

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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <small className="mr-auto">
            {!isTaskcateIdValid || !isTitleValid || !isOrderIndexValid ? (
              <ul
                className="mr-auto"
                style={{ margin: 0, padding: 0, color: "red" }}
              >
                {!isTaskcateIdValid && (
                  <li>
                    <AiOutlineWarning style={{ marginRight: 5 }} />
                    Category ID must be 2-10 characters
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
                    Order by must be a valid number when provided
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
            onClick={createTaskCategory}
            disabled={!isTaskcateIdValid || !isTitleValid || !isOrderIndexValid}
          >
            Create Task Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
