// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col, Badge } from "react-bootstrap";
// import { useParams, useHistory } from "react-router-dom";

// Global Variables
import { headers, pageHeader } from "../../global_vars";

// Variables
window.Swal = Swal;

class InsuranceCarrierDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      insurance_carrier: {
        title: "",
        orderindex: 0,
        active: true,
      },
      is_loaded: false,
      is_editing: false,
      is_creating: false,
      errors: {},
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id === "new") {
      this.setState({ is_creating: true, is_loaded: true });
    } else {
      this.fetchInsuranceCarrier(id);
    }
  }

  fetchInsuranceCarrier = async (id) => {
    this.setState({ is_loaded: false });
    try {
      const insurance_carrier = await apiGet(API_ENDPOINTS.INSURANCE_CARRIERS + id + "/");
      this.setState({
        insurance_carrier: insurance_carrier,
        is_loaded: true,
      });
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        this.setState({ forbidden: true });
      } else if (error.message.includes('404')) {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "Insurance carrier not found.",
        });
        this.props.history.push("/data_management/insurance_carriers");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load insurance carrier.",
        });
      }
      this.setState({ is_loaded: true });
    }
  };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      insurance_carrier: {
        ...prevState.insurance_carrier,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  validateForm = () => {
    const { insurance_carrier } = this.state;
    const errors = {};

    if (!insurance_carrier.title.trim()) {
      errors.title = "Title is required";
    }

    if (insurance_carrier.orderindex < 0) {
      errors.orderindex = "Order index must be 0 or greater";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;

    const { insurance_carrier, is_creating } = this.state;
    const { id } = this.props.match.params;

    try {
      if (is_creating) {
        await apiPost(API_ENDPOINTS.INSURANCE_CARRIERS, insurance_carrier);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Insurance carrier created successfully!",
        });
      } else {
        await apiPut(API_ENDPOINTS.INSURANCE_CARRIERS + id + "/", insurance_carrier);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Insurance carrier updated successfully!",
        });
      }
      this.props.history.push("/data_management/insurance_carriers");
    } catch (error) {
      console.log(error);
      if (error.message === 'Authentication required') {
        this.setState({ errors: error.response?.data || {} });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: is_creating
            ? "Failed to create insurance carrier."
            : "Failed to update insurance carrier.",
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
        await apiDelete(API_ENDPOINTS.INSURANCE_CARRIERS + id + "/");
        Swal.fire("Deleted!", "Insurance carrier has been deleted.", "success");
        this.props.history.push("/data_management/insurance_carriers");
      } catch (error) {
        console.log(error);
        Swal.fire("Error!", "Failed to delete insurance carrier.", "error");
      }
    }
  };

  render() {
    const { insurance_carrier, is_loaded, is_editing, is_creating, errors } = this.state;
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

    return (
      <>
        <NavigationBar />
        <div className="mainContainer">
          {pageHeader(
            is_creating
              ? "insurance_carrier_new"
              : is_editing
              ? "insurance_carrier_edit"
              : "insurance_carrier_detail"
          )}
          
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {is_creating
                    ? "New Insurance Carrier"
                    : is_editing
                    ? "Edit Insurance Carrier"
                    : "Insurance Carrier Details"}
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
                    onClick={() => this.props.history.push("/data_management/insurance_carriers")}
                  >
                    Back to List
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={insurance_carrier.title}
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
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Order Index</Form.Label>
                      <Form.Control
                        type="number"
                        name="orderindex"
                        value={insurance_carrier.orderindex}
                        onChange={this.handleInputChange}
                        isInvalid={!!errors.orderindex}
                        disabled={isViewMode}
                        min="0"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.orderindex}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      {isViewMode ? (
                        <div>
                          <Badge bg={insurance_carrier.active ? "success" : "secondary"}>
                            {insurance_carrier.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      ) : (
                        <Form.Check
                          type="switch"
                          name="active"
                          checked={insurance_carrier.active}
                          onChange={this.handleInputChange}
                          label={insurance_carrier.active ? "Active" : "Inactive"}
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
                          this.props.history.push("/data_management/insurance_carriers");
                        } else {
                          this.setState({ is_editing: false });
                          this.fetchInsuranceCarrier(id);
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

export default InsuranceCarrierDetail;
