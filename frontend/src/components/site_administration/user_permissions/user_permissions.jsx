// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Modules / Functions
import axios from "axios";
import { Table } from "react-bootstrap";
import { Grid, Form, Button } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { BsCircleFill, BsCircle } from "react-icons/bs";

// Global Variables
import {
  headers,
  helpStyle,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
const CHANGE_PERMISSION = "http://localhost:8000/api/site_admin/change_permission/";
const CHANGE_ALL_PERMISSIONS = "http://localhost:8000/api/site_admin/handle_all_permissions/";


const fillCircle = {
  color: "#3f8bd2",
  fontSize: 16,
  cursor: "pointer",
};

const Circle = {
  color: "#3f8bd2",
  fontSize: 16,
  cursor: "pointer",
};

window.Swal = Swal;

const MODEL_NAMES = [
  "GroupTransfer",
  "COA",
  "COL",
  "Advertisement Company",
  "Agent",
  "Aircrafts",
  "Airline",
  "Offer",
  "Airport",
  "Attraction",
  "Car Hire Company",
  "Charter Brokers",
  "Client",
  "Coach Operator",
  "Coach",
  "Contract",
  "Cruising Company",
  "Driver",
  "DMC",
  "Group Leader",
  "Guide",
  "Hotel",
  "Parking Lot",
  "Place",
  "Port",
  "Repair Shop",
  "Repair Type",
  "Restaurant",
  "Railway Station",
  "Service",
  "Ferry Ticket Agency",
  "Teleferik Company",
  "Theater",
  "Train Ticket Agency",
  "Text Template",
  "Sport Event Supplier",
  "Authentication",
  "User",
  "History",
  "Proforma Invoice",
  "Entertainment Supplier",
  "NAS Folders",
];

const labelStyle = {
  textAlign: "center",
  color: "#3f8bd2",
  marginRight: 20,
  fontSize: 30,
  fontWeight: 500,
  width: "100%",
};

const GET_USER_PERMISSIONS = "http://localhost:8000/api/site_admin/permissions/";

const GET_USERS = "http://localhost:8000/api/view/get_all_users/";


function hasAllPermissions(permissions, type) {
  // Filter permissions to get only create permissions
  const Permissions = permissions.filter(permission => permission.permission_type === type);
  
  // Check if all create permissions have a value of true
  const hasAllPermissions = Permissions.every(permission => permission.value === true);
  
  return hasAllPermissions;
}

class UserPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: [],
      permissions: [],
      active_model: "All",
      selected_user: "",
      selected_type: "",
      user_details: "",
      is_loaded: false,
      forbidden: false,
      columns: [
        { dataField: "id", text: "ID", sort: true },
        { dataField: "user", text: "Read", sort: true },
        { dataField: "permission_type", text: "Create", sort: true },
        { dataField: "user", text: "Read", sort: true },
        { dataField: "model", text: "Update", sort: true },
        { dataField: "description", text: "Delete", sort: true },
        { dataField: "value", text: "Value", sort: true },
      ],
    };
    this.modify_selected_user = this.modify_selected_user.bind(this);
    this.modify_selected_type = this.modify_selected_type.bind(this);
    this.update_state = this.update_state.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_USERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_users: res.data.all_users,
        });
      });

    axios
      .get(GET_USER_PERMISSIONS, {
        headers: headers,
        params: {
          selected_user: this.state.selected_user,
          selected_type: this.state.selected_type,
        },
      })
      .then((res) => {
        this.setState({
          permissions: res.data.permissions,
          is_loaded: true,
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          this.setState({
            forbidden: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unknown error has occured.",
          });
        }
      });
  }

  update_state() {
    axios
      .get(GET_USER_PERMISSIONS, {
        headers: headers,
        params: {
          selected_user: this.state.selected_user,
          selected_type: this.state.selected_type,
        },
      })
      .then((res) => {
        this.setState({
          permissions: res.data.permissions,
          user_details: res.data.user_details,
          is_loaded: true,
        });
      });
  }

  modify_selected_user(e) {
    this.setState({
      selected_user: e.target.innerText,
      is_loaded: false,
    });
    axios
      .get(GET_USER_PERMISSIONS, {
        headers: headers,
        params: {
          selected_user: e.target.innerText,
          selected_type: this.state.selected_type,
        },
      })
      .then((res) => {
        this.setState({
          permissions: res.data.permissions,
          user_details: res.data.user_details,
          is_loaded: true,
        });
      });
  }

  modify_selected_type(e) {
    this.setState({
      selected_type: e.target.innerText,
      is_loaded: false,
    });
    axios
      .get(GET_USER_PERMISSIONS, {
        headers: headers,
        params: {
          selected_user: this.state.selected_user,
          selected_type: e.target.innerText,
        },
      })
      .then((res) => {
        this.setState({
          permissions: res.data.permissions,
          user_details: res.data.user_details,
          is_loaded: true,
        });
      });
  }

  render() {
    const updatePermissionBackEnd = (value, object, user, permission_type) => {
      axios({
        method: "post",
        url: CHANGE_PERMISSION,
        headers: headers,
        data: {
          value: value,
          object: object,
          user: user,
          permission_type: permission_type,
        },
      })
        .then((res) => {
          this.update_state(res.data.permissions);
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: e.response.data.errormsg,
          });
        });
    };


    const updateAllPermissions = (value, user, permission_type) => {
      axios({
        method: "post",
        url: CHANGE_ALL_PERMISSIONS,
        headers: headers,
        data: {
          perm_value: value,
          user: user,
          permission_type: permission_type,
        },
      })
        .then((res) => {
          this.update_state(res.data.permissions);
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
      <div>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("user_permissions")}
          {this.state.forbidden ? (
            <>{forbidden("User Permissions")}</>
          ) : this.state.is_loaded ? (
            <>
              <div>
                <Autocomplete
                  options={this.state.all_users}
                  onChange={this.modify_selected_user}
                  value={this.state.selected_user}
                  disableClearable
                  getOptionLabel={(option) => option.username}
                  style={{ width: 300, margin: "0 auto" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select user"
                      variant="outlined"
                    />
                  )}
                />
                <hr />
                <label style={labelStyle}> User Details </label>
                <hr />
                <ul className="user_details_ul">
                  <li>
                    <Form.Input
                      fluid
                      label="First name"
                      disabled
                      value={this.state.user_details.first_name}
                    />
                  </li>
                  <li>
                    <Form.Input
                      fluid
                      disabled
                      label="Username"
                      value={this.state.user_details.username}
                    />
                  </li>
                  <li>
                    <Form.Input
                      fluid
                      disabled
                      label="Last name"
                      value={this.state.user_details.last_name}
                    />
                  </li>
                  <label style={{ padding: 10, paddingTop: 0 }}>
                    <br />
                  </label>
                  <li>
                    <Form.Checkbox
                      fluid
                      disabled
                      label="Staff ?"
                      checked={this.state.user_details.is_staff}
                    />
                  </li>
                  <li>
                    <Form.Input
                      fluid
                      disabled
                      label="Email"
                      value={this.state.user_details.email}
                    />
                  </li>
                  <label style={{ padding: 10, paddingTop: 0 }}>
                    <br />
                  </label>
                  <li>
                    <Form.Checkbox
                      label="Superuser ?"
                      fluid
                      disabled
                      checked={this.state.user_details.is_superuser}
                    />
                  </li>
                </ul>
              </div>
              <hr />
              {this.state.selected_user !== "" ? (
                <>
                  <label style={labelStyle}> User Permissions</label>
                  <div style={labelStyle}>
                    {hasAllPermissions(this.state.permissions, 'Create') ? 
                      <Button color='red' onClick={() => updateAllPermissions(false, this.state.user_details.username,'Create')}>
                        Remove All Create Permissions
                      </Button>
                      :
                      <Button color='green' onClick={() => updateAllPermissions(true, this.state.user_details.username,'Create')}>
                        Pass All Create Permissions
                      </Button>
                    }

                    {hasAllPermissions(this.state.permissions, 'View') ? 
                      <Button color='red' onClick={() => updateAllPermissions(false, this.state.user_details.username,'View')}>
                        Remove All View Permissions
                      </Button>
                      :
                      <Button color='green' onClick={() => updateAllPermissions(true, this.state.user_details.username,'View')}>
                        Pass All View Permissions
                      </Button>
                    }

                    {hasAllPermissions(this.state.permissions, 'Update') ? 
                      <Button color='red' onClick={() => updateAllPermissions(false, this.state.user_details.username,'Update')}>
                        Remove All Update Permissions
                      </Button>
                      :
                      <Button color='green' onClick={() => updateAllPermissions(true, this.state.user_details.username,'Update')}>
                        Pass All Update Permissions
                      </Button>
                    }

                    {hasAllPermissions(this.state.permissions, 'Delete') ? 
                      <Button color='red' onClick={() => updateAllPermissions(false, this.state.user_details.username,'Delete')}>
                        Remove All Delete Permissions
                      </Button>
                      :
                      <Button color='green' onClick={() => updateAllPermissions(true, this.state.user_details.username,'Delete')}>
                        Pass All Delete Permissions
                        </Button>
                    }
                  </div>
                  <hr />
                  <Grid stackable divided>
                    <Grid.Column>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            {/* We need this because all tables 1st column have 6% width cause of IDs */}
                            <th style={{ display: "none" }}></th>
                            <th>Model</th>
                            <th>Create</th>
                            <th>Read</th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MODEL_NAMES.map((model) => (
                            <tr
                              style={{
                                maxHeight: "10 !important",
                                fontSize: 10,
                                padding: 0,
                              }}
                            >
                              <td>{model}</td>
                              {/* Create */}
                              <td>
                                {this.state.permissions
                                  .filter(
                                    (permission) =>
                                      permission.model === model &&
                                      permission.permission_type === "Create"
                                  )
                                  .map((results, index) => {
                                    const circleStyle = {
                                      ...fillCircle,
                                      color: results.description === 'Can Edit User' ? 'red' : fillCircle.color,
                                    };

                                    return results.value ? (
                                      <BsCircleFill
                                        key={index}
                                        title={`${results.description} : Yes`}
                                        style={circleStyle}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            true,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    ) : (
                                      <BsCircle
                                        key={index}
                                        style={Circle}
                                        title={`${results.description} : No`}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            false,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    );
                                  })}
                              </td>
                              {/* Read */}
                              <td>
                                {this.state.permissions
                                  .filter(
                                    (permission) =>
                                      permission.model === model &&
                                      permission.permission_type === "View"
                                  )
                                  .map((results) =>
                                    results.value ? (
                                      <BsCircleFill
                                        title={results.description + " : Yes"}
                                        style={fillCircle}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            true,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    ) : (
                                      <BsCircle
                                        style={Circle}
                                        title={results.description + " : No"}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            false,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    )
                                  )}
                              </td>
                              {/* Update */}
                              <td>
                                {this.state.permissions
                                  .filter(
                                    (permission) =>
                                      permission.model === model &&
                                      permission.permission_type === "Update"
                                  )
                                  .map((results, index) => {

                                    console.log(results.description)
                                    const circleStyle = {
                                      ...fillCircle,
                                      color: results.description === 'Can Update User' ? 'red' : fillCircle.color,
                                    };

                                    return results.value ? (
                                      <BsCircleFill
                                        key={index}
                                        title={`${results.description} : Yes`}
                                        style={circleStyle}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            true,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    ) : (
                                      <BsCircle
                                        key={index}
                                        style={Circle}
                                        title={`${results.description} : No`}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            false,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    );
                                  })}
                              </td>
                              {/* Delete */}
                              <td>
                                {this.state.permissions
                                  .filter((permission) => permission.model === model && permission.permission_type === "Delete")
                                  .map((results) =>
                                    results.value ? (
                                      <BsCircleFill
                                        title={results.description + " : Yes"}
                                        style={fillCircle}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            true,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    ) : (
                                      <BsCircle
                                        style={Circle}
                                        title={results.description + " : No"}
                                        onClick={() =>
                                          updatePermissionBackEnd(
                                            false,
                                            results.model,
                                            results.user,
                                            results.permission_type
                                          )
                                        }
                                      />
                                    )
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <h6 style={helpStyle}>
                        Find more about permissions at
                        <a href="/help"> User Documentation </a>
                      </h6>
                    </Grid.Column>
                  </Grid>
                </>
              ) : (
                <label
                  style={{
                    color: "red",
                    fontSize: 20,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  Please Select a user to view their permissions
                </label>
              )}
              <hr />
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

export default UserPermissions;
