// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col, Badge, ProgressBar } from "react-bootstrap";
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from "../../../utils/api";

// Global Variables
import { pageHeader } from "../../global_vars";

// Variables
window.Swal = Swal;

const GET_PROJECT = API_ENDPOINTS.PROJECTS;
const CREATE_PROJECT = API_ENDPOINTS.PROJECTS;
const UPDATE_PROJECT = API_ENDPOINTS.PROJECTS;
const DELETE_PROJECT = API_ENDPOINTS.PROJECTS;
const GET_CONSULTANTS = API_ENDPOINTS.REFERENCE_CONSULTANTS;
const GET_PROJECT_CATEGORIES = API_ENDPOINTS.PROJECT_CATEGORIES;

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {
        title: "",
        registrationdate: "",
        consultant: "",
        filecode: "",
        status: "active",
        deadline: "",
        progress: 0,
        taxation: false,
        active: true,
      },
      consultants: [],
      project_categories: [],
      is_loaded: false,
      is_editing: false,
      is_creating: false,
      errors: {},
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetchReferenceData();
    if (id === "new") {
      this.setState({ is_creating: true, is_loaded: true });
    } else {
      this.fetchProject(id);
    }
  }

  fetchReferenceData = async () => {
    try {
      // Fetch consultants
      const consultantsResponse = await apiGet(GET_CONSULTANTS);
      this.setState({ consultants: consultantsResponse });

      // Fetch project categories
      const categoriesResponse = await apiGet(GET_PROJECT_CATEGORIES);
      this.setState({ project_categories: categoriesResponse });
    } catch (error) {
      console.error("Failed to load reference data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load reference data.",
      });
    }
  };

  fetchProject = async (id) => {
    this.setState({ is_loaded: false });
    try {
      const project = await apiGet(`${GET_PROJECT}${id}/`);
      // Format dates for form inputs
      if (project.registrationdate) {
        project.registrationdate = project.registrationdate.split('T')[0];
      }
      if (project.deadline) {
        project.deadline = project.deadline.split('T')[0];
      }
      this.setState({
        project: project,
        is_loaded: true,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      if (error.message === 'Authentication required') {
        this.setState({ forbidden: true });
      } else if (error.message.includes('404')) {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "Project not found.",
        });
        this.props.history.push("/data_management/projects");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load project.",
        });
      }
      this.setState({ is_loaded: true });
    }
  };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      project: {
        ...prevState.project,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  validateForm = () => {
    const { project } = this.state;
    const errors = {};

    if (!project.title.trim()) {
      errors.title = "Title is required";
    }

    if (!project.registrationdate) {
      errors.registrationdate = "Registration date is required";
    }

    if (!project.consultant) {
      errors.consultant = "Consultant is required";
    }

    if (project.progress < 0 || project.progress > 100) {
      errors.progress = "Progress must be between 0 and 100";
    }

    if (project.deadline && project.registrationdate) {
      const deadline = new Date(project.deadline);
      const registration = new Date(project.registrationdate);
      if (deadline < registration) {
        errors.deadline = "Deadline cannot be before registration date";
      }
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;

    const { project, is_creating } = this.state;
    const { id } = this.props.match.params;

    // Prepare data for submission
    const submitData = {
      ...project,
      progress: parseInt(project.progress) || 0,
    };

    try {
      if (is_creating) {
        await apiPost(CREATE_PROJECT, submitData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Project created successfully!",
        });
      } else {
        await apiPut(`${UPDATE_PROJECT}${id}/`, submitData);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Project updated successfully!",
        });
      }
      this.props.history.push("/data_management/projects");
    } catch (error) {
      console.error('Error saving project:', error);
      if (error.message.includes('400')) {
        // Handle validation errors
        try {
          const errorData = JSON.parse(error.message.split(':')[1]);
          this.setState({ errors: errorData });
        } catch {
          this.setState({ errors: { general: error.message } });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || (is_creating
            ? "Failed to create project."
            : "Failed to update project."),
        });
      }
    }
  };

  handleDelete = async () => {
    const { id } = this.props.match.params;
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await apiDelete(`${DELETE_PROJECT}${id}/`);
        Swal.fire("Deleted!", "Project has been deleted.", "success");
        this.props.history.push("/data_management/projects");
      } catch (error) {
        console.error('Error deleting project:', error);
        Swal.fire("Error!", error.message || "Failed to delete project.", "error");
      }
    }
  };

  getProjectStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return { status: 'Active', color: 'success' };
      case 'completed': return { status: 'Completed', color: 'primary' };
      case 'on_hold': return { status: 'On Hold', color: 'warning' };
      case 'cancelled': return { status: 'Cancelled', color: 'danger' };
      default: return { status: 'Unknown', color: 'secondary' };
    }
  };

  render() {
    const { project, consultants, is_loaded, is_editing, is_creating, errors } = this.state;
    const { id } = this.props.match.params;

    if (!is_loaded) {
      return (
        <>
          <NavigationBar />
          <div className="mainContainer">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    const isViewMode = !is_editing && !is_creating;
    const statusInfo = this.getProjectStatus(project.status);

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader(
            is_creating
              ? "project_new"
              : is_editing
              ? "project_edit"
              : "project_detail"
          )}
          
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {is_creating
                    ? "New Project"
                    : is_editing
                    ? "Edit Project"
                    : "Project Details"}
                </h5>
                <div>
                  {isViewMode && (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => this.setState({ is_editing: true })}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={this.handleDelete}
                        className="me-2"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => this.props.history.push("/data_management/projects")}
                  >
                    Back to List
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={this.handleInputChange}
                        isInvalid={!!errors.title}
                        disabled={isViewMode}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>File Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="filecode"
                        value={project.filecode}
                        onChange={this.handleInputChange}
                        disabled={isViewMode}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Registration Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="registrationdate"
                        value={project.registrationdate}
                        onChange={this.handleInputChange}
                        isInvalid={!!errors.registrationdate}
                        disabled={isViewMode}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.registrationdate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Deadline</Form.Label>
                      <Form.Control
                        type="date"
                        name="deadline"
                        value={project.deadline}
                        onChange={this.handleInputChange}
                        isInvalid={!!errors.deadline}
                        disabled={isViewMode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.deadline}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      {isViewMode ? (
                        <div>
                          <Badge bg={statusInfo.color}>
                            {statusInfo.status}
                          </Badge>
                        </div>
                      ) : (
                        <Form.Select
                          name="status"
                          value={project.status}
                          onChange={this.handleInputChange}
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="on_hold">On Hold</option>
                          <option value="cancelled">Cancelled</option>
                        </Form.Select>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Consultant *</Form.Label>
                      {isViewMode ? (
                        <div className="form-control-plaintext">
                          {project.consultant_name || 'Not assigned'}
                        </div>
                      ) : (
                        <Form.Select
                          name="consultant"
                          value={project.consultant}
                          onChange={this.handleInputChange}
                          isInvalid={!!errors.consultant}
                          required
                        >
                          <option value="">Select Consultant</option>
                          {consultants.map((consultant) => (
                            <option key={consultant.consultant_id} value={consultant.consultant_id}>
                              {consultant.fullname}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {errors.consultant}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Progress (%)</Form.Label>
                      {isViewMode ? (
                        <div>
                          <ProgressBar 
                            now={project.progress} 
                            label={`${project.progress}%`}
                            variant={project.progress >= 100 ? 'success' : 'primary'}
                          />
                        </div>
                      ) : (
                        <Form.Control
                          type="number"
                          name="progress"
                          value={project.progress}
                          onChange={this.handleInputChange}
                          isInvalid={!!errors.progress}
                          min="0"
                          max="100"
                        />
                      )}
                      <Form.Control.Feedback type="invalid">
                        {errors.progress}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Taxation</Form.Label>
                      {isViewMode ? (
                        <div>
                          <Badge bg={project.taxation ? "success" : "secondary"}>
                            {project.taxation ? "Yes" : "No"}
                          </Badge>
                        </div>
                      ) : (
                        <Form.Check
                          type="switch"
                          name="taxation"
                          checked={project.taxation}
                          onChange={this.handleInputChange}
                          label={project.taxation ? "Yes" : "No"}
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Active</Form.Label>
                      {isViewMode ? (
                        <div>
                          <Badge bg={project.active ? "success" : "secondary"}>
                            {project.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ) : (
                        <Form.Check
                          type="switch"
                          name="active"
                          checked={project.active}
                          onChange={this.handleInputChange}
                          label={project.active ? "Active" : "Inactive"}
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {!isViewMode && (
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (is_creating) {
                          this.props.history.push("/data_management/projects");
                        } else {
                          this.setState({ is_editing: false });
                          this.fetchProject(id);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      {is_creating ? "Create" : "Update"}
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </div>
        <Footer />
      </>
    );
  }
}

export default ProjectDetail;
