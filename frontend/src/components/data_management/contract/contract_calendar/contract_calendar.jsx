// Built-ins
import React from "react";

// Icons - Images
import { BsCalendar3 } from "react-icons/bs";
import { BsFillSquareFill } from "react-icons/bs";
import { BiStats } from "react-icons/bi";

// Functions - Modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import Calendar from "./calendar";

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

const VIEW_CONTRACT = "http://localhost:8000/api/data_management/contract/";

function getContractId() {
  return window.location.pathname.split("/")[3];
}

const liStyle = {
  listStyle: "circle",
  marginLeft: 20,
};

const labelStyle = {
  fontWeight: "bold",
  color: "#3366ff",
  fontSize: 16,
  marginBottom: 10,
  marginLeft: 10,
};

function calculatePercentage(n1, n2) {
  return (n1 / n2) * 100;
}

class ContractOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: {},
      is_loaded: false,
      forbidden: false,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_CONTRACT + getContractId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          contract: res.data.contract,
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

  update_state = (update_state) => {
    this.setState({ contract: update_state });
  };

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_CONTRACT + getContractId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          contract: res.data.contract,
          is_loaded: true,
        });
      });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("contract_calendar", this.state.contract.name)}
          {this.state.forbidden ? (
            <>{forbidden("Contract Calendar")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid divided stackable columns={2}>
                <Grid.Column width={12}>
                  <Card>
                    <Card.Header>
                      <BsCalendar3
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Contract Calendar
                    </Card.Header>
                    <Card.Body>
                      <Calendar
                        year={new Date().getFullYear()}
                        month={new Date().getMonth()}
                        contract={this.state.contract}
                      />
                    </Card.Body>
                  </Card>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Card>
                    <Card.Header>
                      <BsCalendar3
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Helper
                    </Card.Header>
                    <Card.Body>
                      <ul id="allotment_helper">
                        <li>
                          <BsFillSquareFill
                            style={{
                              color: "red",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                          No Allocation
                        </li>
                        <li>
                          <BsFillSquareFill
                            style={{
                              color: "#ff7700",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                          Release Date Passed
                        </li>
                        <li>
                          <BsFillSquareFill
                            style={{
                              color: "ffae00",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                          Sold Out
                        </li>
                        <li>
                          <BsFillSquareFill
                            style={{
                              color: "#004d00",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                          Allocation Remaining
                        </li>
                        <li>
                          <BsFillSquareFill
                            style={{
                              color: "#00b300",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                          Limited Availability
                        </li>
                        <li>
                          <BsFillSquareFill
                            style={{
                              color: "#9E9E9E",
                              fontSize: "1.5em",
                              marginRight: "0.5em",
                            }}
                          />
                          Out of Month's Scope
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Header>
                      <BiStats
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Statistics
                    </Card.Header>
                    <Card.Body>
                      <ul>
                        <label style={labelStyle}>Total</label>
                        <li style={liStyle}>
                          Single Rooms
                          {
                            this.state.contract.room_contract.filter(
                              (room) => room.room_type === "SGL"
                            ).length
                          }
                        </li>
                        <li style={liStyle}>
                          Double Rooms
                          {
                            this.state.contract.room_contract.filter(
                              (room) => room.room_type === "DBL"
                            ).length
                          }
                        </li>
                        <li style={liStyle}>
                          Twin Rooms
                          {
                            this.state.contract.room_contract.filter(
                              (room) => room.room_type === "TWIN"
                            ).length
                          }
                        </li>
                        <li style={liStyle}>
                          Triple Rooms
                          {
                            this.state.contract.room_contract.filter(
                              (room) => room.room_type === "TRPL"
                            ).length
                          }
                        </li>
                        <li style={liStyle}>
                          Quad Rooms
                          {
                            this.state.contract.room_contract.filter(
                              (room) => room.room_type === "QUAD"
                            ).length
                          }
                        </li>
                      </ul>
                      {this.state.contract.room_contract.length > 0 ? (
                        <ul>
                          <label style={labelStyle}>
                            Availability Percentage
                          </label>
                          {this.state.contract.room_contract.filter(
                            (room) => room.room_type === "SGL" && room.available
                          ).length > 0 ? (
                            <li style={liStyle}>
                              Single Rooms
                              {calculatePercentage(
                                this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "SGL" && room.available
                                ).length,
                                this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "SGL"
                                ).length
                              )}
                              %
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.contract.room_contract.filter(
                            (room) => room.room_type === "DBL" && room.available
                          ).length > 0 ? (
                            <li style={liStyle}>
                              Double Rooms
                              {calculatePercentage(
                                this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "DBL" && room.available
                                ).length,
                                this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "DBL"
                                ).length
                              )}
                              %
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.contract.room_contract.filter(
                            (room) =>
                              room.room_type === "TWIN" && room.available
                          ).length > 0 ? (
                            <li style={liStyle}>
                              Twin Rooms
                              {calculatePercentage(
                                this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "TWIN" && room.available
                                ).length,
                                this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "TWIN"
                                ).length
                              )}
                              %
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.contract.room_contract.filter(
                            (room) =>
                              room.room_type === "TRPL" && room.available
                          ).length > 0 ? (
                            <li style={liStyle}>
                              Triple Rooms
                              {calculatePercentage(
                                this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "TRPL" && room.available
                                ).length,
                                this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "TRPL"
                                ).length
                              )}
                              %
                            </li>
                          ) : (
                            ""
                          )}
                          {this.state.contract.room_contract.filter(
                            (room) =>
                              room.room_type === "QUAD" && room.available
                          ).length > 0 ? (
                            <li style={liStyle}>
                              Quad Rooms
                              {calculatePercentage(
                                this.state.contract.room_contract.filter(
                                  (room) =>
                                    room.room_type === "QUAD" && room.available
                                ).length,
                                this.state.contract.room_contract.filter(
                                  (room) => room.room_type === "QUAD"
                                ).length
                              )}
                              %
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      ) : (
                        ""
                      )}
                    </Card.Body>
                  </Card>
                </Grid.Column>
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

export default ContractOverView;
