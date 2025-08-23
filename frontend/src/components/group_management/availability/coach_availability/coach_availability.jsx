// Built-ins
import React from "react";

// Custom Made Components
import GetCoachHeatmap from "./modals/get_coach_heatmap";

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
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

const COACH_AVAILABILITY =
  "http://localhost:8000/api/groups/coach_availability/";
const GET_COACHES = "http://localhost:8000/api/view/get_all_coaches/";

class CoachAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_coaches: [],
      all_coaches_data: [],
      current_month_data: [],
      selected_coach: "None",
      forbidden: false,
    };
    this.filter_by_coach = this.filter_by_coach.bind(this);
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
      .get(COACH_AVAILABILITY, {
        headers: headers,
        params: {
          selected_coach: this.state.selected_coach,
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          current_month_data: res.data.current_month_data,
          all_coaches_data: res.data.all_coaches_data,
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
      .get(GET_COACHES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_coaches: res.data.all_coaches,
        });
      });
  }

  filter_by_coach(e) {
    this.setState({
      selected_coach: e.target.innerText,
    });
    axios
      .get(COACH_AVAILABILITY, {
        headers: headers,
        params: {
          selected_coach: e.target.innerText,
        },
      })
      .then((res) => {
        this.setState({
          all_coaches_data: res.data.all_coaches_data,
        });
      });
  }

  reset_filters() {
    axios
      .get(COACH_AVAILABILITY, {
        headers: headers,
        params: {
          selected_coach: "None",
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          all_coaches_data: res.data.all_coaches_data,
        });
      });
  }

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("coach_availability")}
          {this.state.forbidden ? (
            <>{forbidden("Coach Availability")}</>
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
                    Filter by Coach
                  </label>
                  <Autocomplete
                    options={this.state.all_coaches}
                    className={"select_coach"}
                    onChange={this.filter_by_coach}
                    getOptionLabel={(option) =>
                      option.id +
                      ") " +
                      option.name +
                      "--" +
                      option.coach_operator +
                      "--" +
                      option.plate_number
                    }
                    style={{ width: 300, display: "inline-block", margin: 20 }}
                    disabled={!this.state.is_loaded}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select coach"
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
                          <th>Coach</th>
                          <th>Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.all_coaches_data.map((coach) => (
                          <tr>
                            <td>{coach.id}</td>
                            <td>{coach.name}</td>
                            <td>
                              <GetCoachHeatmap
                                coach_id={coach.id}
                                coach={coach.name}
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

export default CoachAvailability;
