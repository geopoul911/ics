// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Modules / Functions
import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../../../utils/api';
import Swal from "sweetalert2";
import { Form, Button, Card, Row, Col, Badge, Tabs, Tab } from "react-bootstrap";

// Global Variables
import { headers, pageHeader } from "../../global_vars";

// Variables
window.Swal = Swal;

class ClientDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {
        surname: "",
        name: "",
        birthdate: "",
        phone: "",
        mobile: "",
        email: "",
        address: "",
        city: "",
        province: "",
        country: "",
        postalcode: "",
        sin: "",
        active: true,
      },
      countries: [],
      provinces: [],
      cities: [],
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
      this.fetchClient(id);
    }
  }

  fetchReferenceData = async () => {
    try {
      // Fetch countries
      const countries = await apiGet(API_ENDPOINTS.COUNTRIES);
      this.setState({ countries: countries });

      // Fetch provinces
      const provinces = await apiGet(API_ENDPOINTS.PROVINCES);
      this.setState({ provinces: provinces });

      // Fetch cities
      const cities = await apiGet(API_ENDPOINTS.CITIES);
      this.setState({ cities: cities });
    } catch (error) {
      console.log("Failed to load reference data:", error);
    }
  };

  fetchClient = async (id) => {
    this.setState({ is_loaded: false });
    try {
      const client = await apiGet(API_ENDPOINTS.CLIENTS + id + "/");
      // Format dates for form inputs
      if (client.birthdate) {
        client.birthdate = client.birthdate.split('T')[0];
      }
      this.setState({
        client: client,
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
          text: "Client not found.",
        });
        this.props.history.push("/data_management/clients");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load client.",
        });
      }
      this.setState({ is_loaded: true });
    }
  };

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      client: {
        ...prevState.client,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  validateForm = () => {
    const { client } = this.state;
    const errors = {};

    if (!client.surname.trim()) {
      errors.surname = "Surname is required";
    }

    if (!client.name.trim()) {
      errors.name = "Name is required";
    }

    if (client.email && !this.isValidEmail(client.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (client.phone && !this.isValidPhone(client.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (client.mobile && !this.isValidPhone(client.mobile)) {
      errors.mobile = "Please enter a valid mobile number";
    }

    if (client.sin && !this.isValidSIN(client.sin)) {
      errors.sin = "Please enter a valid SIN (9 digits)";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  isValidPhone = (phone) => {
    // eslint-disable-next-line
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    // eslint-disable-next-line
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
  };

  isValidSIN = (sin) => {
    const sinRegex = /^\d{9}$/;
    return sinRegex.test(sin.replace(/[\s-]/g, ''));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateForm()) return;

    const { client, is_creating } = this.state;
    const { id } = this.props.match.params;

    try {
      if (is_creating) {
        await apiPost(API_ENDPOINTS.CLIENTS, client);
      } else {
        await apiPut(API_ENDPOINTS.CLIENTS + id + "/", client);
      }
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: is_creating
          ? "Client created successfully!"
          : "Client updated successfully!",
      });
      this.props.history.push("/data_management/clients");
    } catch (error) {
      console.log(error);
      if (error.message.includes('400')) {
        this.setState({ errors: error.data });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: is_creating
            ? "Failed to create client."
            : "Failed to update client.",
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
        await apiDelete(API_ENDPOINTS.CLIENTS + id + "/");
        Swal.fire("Deleted!", "Client has been deleted.", "success");
        this.props.history.push("/data_management/clients");
      } catch (error) {
        console.log(error);
        Swal.fire("Error!", "Failed to delete client.", "error");
      }
    }
  };

  render() {
    const { client, countries, provinces, cities, is_loaded, is_editing, is_creating, errors } = this.state;
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
              ? "client_new"
              : is_editing
              ? "client_edit"
              : "client_detail"
          )}
          
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {is_creating
                    ? "New Client"
                    : is_editing
                    ? "Edit Client"
                    : "Client Details"}
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
                    onClick={() => this.props.history.push("/data_management/clients")}
                  >
                    Back to List
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="basic" className="mb-3">
                <Tab eventKey="basic" title="Basic Information">
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Surname *</Form.Label>
                          <Form.Control
                            type="text"
                            name="surname"
                            value={client.surname}
                            onChange={this.handleInputChange}
                            isInvalid={!!errors.surname}
                            disabled={isViewMode}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.surname}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={client.name}
                            onChange={this.handleInputChange}
                            isInvalid={!!errors.name}
                            disabled={isViewMode}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Birth Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="birthdate"
                            value={client.birthdate}
                            onChange={this.handleInputChange}
                            disabled={isViewMode}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>SIN</Form.Label>
                          <Form.Control
                            type="text"
                            name="sin"
                            value={client.sin}
                            onChange={this.handleInputChange}
                            isInvalid={!!errors.sin}
                            disabled={isViewMode}
                            placeholder="123-456-789"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.sin}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Status</Form.Label>
                          {isViewMode ? (
                            <div>
                              <Badge bg={client.active ? "success" : "secondary"}>
                                {client.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          ) : (
                            <Form.Check
                              type="switch"
                              name="active"
                              checked={client.active}
                              onChange={this.handleInputChange}
                              label={client.active ? "Active" : "Inactive"}
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
                              this.props.history.push("/data_management/clients");
                            } else {
                              this.setState({ is_editing: false });
                              this.fetchClient(id);
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
                </Tab>

                <Tab eventKey="contact" title="Contact Information">
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={client.phone}
                            onChange={this.handleInputChange}
                            isInvalid={!!errors.phone}
                            disabled={isViewMode}
                            placeholder="(123) 456-7890"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mobile</Form.Label>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            value={client.mobile}
                            onChange={this.handleInputChange}
                            isInvalid={!!errors.mobile}
                            disabled={isViewMode}
                            placeholder="(123) 456-7890"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={client.email}
                            onChange={this.handleInputChange}
                            isInvalid={!!errors.email}
                            disabled={isViewMode}
                            placeholder="client@example.com"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    {!isViewMode && (
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (is_creating) {
                              this.props.history.push("/data_management/clients");
                            } else {
                              this.setState({ is_editing: false });
                              this.fetchClient(id);
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
                </Tab>

                <Tab eventKey="address" title="Address Information">
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            value={client.address}
                            onChange={this.handleInputChange}
                            disabled={isViewMode}
                            placeholder="123 Main Street"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          {isViewMode ? (
                            <div className="form-control-plaintext">
                              {client.country_name || 'Not specified'}
                            </div>
                          ) : (
                            <Form.Select
                              name="country"
                              value={client.country}
                              onChange={this.handleInputChange}
                            >
                              <option value="">Select Country</option>
                              {countries.map((country) => (
                                <option key={country.country_id} value={country.country_id}>
                                  {country.title}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Province</Form.Label>
                          {isViewMode ? (
                            <div className="form-control-plaintext">
                              {client.province_name || 'Not specified'}
                            </div>
                          ) : (
                            <Form.Select
                              name="province"
                              value={client.province}
                              onChange={this.handleInputChange}
                            >
                              <option value="">Select Province</option>
                              {provinces.map((province) => (
                                <option key={province.province_id} value={province.province_id}>
                                  {province.title}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          {isViewMode ? (
                            <div className="form-control-plaintext">
                              {client.city_name || 'Not specified'}
                            </div>
                          ) : (
                            <Form.Select
                              name="city"
                              value={client.city}
                              onChange={this.handleInputChange}
                            >
                              <option value="">Select City</option>
                              {cities.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                  {city.title}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="postalcode"
                            value={client.postalcode}
                            onChange={this.handleInputChange}
                            disabled={isViewMode}
                            placeholder="A1A 1A1"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {!isViewMode && (
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (is_creating) {
                              this.props.history.push("/data_management/clients");
                            } else {
                              this.setState({ is_editing: false });
                              this.fetchClient(id);
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
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </div>
        <Footer />
      </>
    );
  }
}

export default ClientDetail;
