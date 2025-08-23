// Built-ins
import React from "react";

// Custom Made Components
import GetDriverHeatmap from "./modals/get_driver_heatmap";

// Modules / Functions
import { Table } from "react-bootstrap";
import { Grid, Button } from "semantic-ui-react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Swal from "sweetalert2";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { AiFillFilter } from "react-icons/ai";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const DRIVER_AVAILABILITY =
  "http://localhost:8000/api/groups/driver_availability/";
const GET_DRIVERS = "http://localhost:8000/api/view/get_all_drivers/";

class DriverAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_drivers: [],
      all_drivers_data: [],
      current_month_data: [],
      selected_driver: "None",
      forbidden: false,
    };
    this.filter_by_driver = this.filter_by_driver.bind(this);
    this.reset_filters = this.reset_filters.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(DRIVER_AVAILABILITY, {
        headers: headers,
        params: {
          selected_driver: this.state.selected_driver,
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          current_month_data: res.data.current_month_data,
          all_drivers_data: res.data.all_drivers_data,
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
    axios
      .get(GET_DRIVERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_drivers: res.data.all_drivers,
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

  filter_by_driver(e) {
    this.setState({
      selected_driver: e.target.innerText,
    });
    axios
      .get(DRIVER_AVAILABILITY, {
        headers: headers,
        params: {
          selected_driver: e.target.innerText,
        },
      })
      .then((res) => {
        this.setState({
          all_drivers_data: res.data.all_drivers_data,
        });
      });
  }

  reset_filters() {
    axios
      .get(DRIVER_AVAILABILITY, {
        headers: headers,
        params: {
          selected_driver: "None",
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          all_drivers_data: res.data.all_drivers_data,
        });
      });
  }

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("driver_availability")}
          {this.state.forbidden ? (
            <>{forbidden("Driver Availability")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={1} stackable divided>
                <div
                  style={{
                    display: "flex",
                    height: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "normal",
                      verticalAlign: "middle",
                      margin: "0 auto",
                    }}
                  >
                    <AiFillFilter
                      style={{
                        color: "orange",
                        fontSize: "1.4em",
                        marginRight: "0.5em",
                      }}
                    />
                    Filter by Driver
                  </label>
                  <Autocomplete
                    options={this.state.all_drivers}
                    className={"select_driver"}
                    onChange={this.filter_by_driver}
                    getOptionLabel={(option) =>
                      option.id +
                      ") " +
                      option.name +
                      "--" +
                      option.coach_operator
                    }
                    style={{ width: 300, display: "inline-block", margin: 20 }}
                    disabled={!this.state.is_loaded}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select driver"
                        variant="outlined"
                      />
                    )}
                  />
                  <hr />
                  <Button
                    color="orange"
                    onClick={this.reset_filters}
                    style={{ verticalAlign: "middle", margin: "0 auto" }}
                  >
                    Reset Filters
                  </Button>
                </div>
                <>
                  <Grid.Column>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Driver</th>
                          <th>Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.all_drivers_data.map((driver) => (
                          <tr>
                            <td>{driver.id}</td>
                            <td>{driver.name}</td>
                            <td>
                              <GetDriverHeatmap
                                driver_id={driver.id}
                                driver={driver.name}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Grid.Column>
                </>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default DriverAvailability;
