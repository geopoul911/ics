// Built-ins
import React from "react";

// Modules / Functions
import DatePicker from "react-date-picker";
import { Table, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { Grid } from "semantic-ui-react";

// CSS
import "react-tabs/style/react-tabs.css";

// Icons / Images
import { FaCircle } from "react-icons/fa";
import { BsFlagFill } from "react-icons/bs";
import { GiAirplaneArrival } from "react-icons/gi";
import { GiAirplaneDeparture } from "react-icons/gi";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import ReactCountryFlag from "react-country-flag";

// Custom Made Components
import GoogleMapClustered from "./google_map_clustered";
import GoogleMapUnclustered from "./google_map_unclustered";

import MiniPieChart from "./mini_pie_chart";

// Modules / Functions
import axios from "axios";
import moment from "moment";

// Global Variables
import {
  headers,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Axios URLS
const GET_DAILY_STATUS = "http://localhost:8000/api/maps/daily_status/";

window.Swal = Swal;

const leaderRatingOptions = {
  R: "Red",
  G: "Green",
  Y: "#f0e130", // 'yellow' is way too bright, we used this instead
};

class DailyStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      selected_date: new Date(),
      all_traveldays: [],
      arrivals: 0,
      departures: 0,
      table_data: [],
      pie_chart_data: {
        trl: 0,
        tra: 0,
        trb: 0,
        coa: 0,
        col: 0,
      },
      isLoaded: false,
      showAsClusters: true,
      search_str: "",
      forbidden: false,
    };
    this.ChangeDate = this.ChangeDate.bind(this);
    this.toggleClusters = this.toggleClusters.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_DAILY_STATUS, {
        headers: headers,
        params: {
          selected_date: moment(this.state.selected_date).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          all_traveldays: res.data.all_traveldays,
          arrivals: res.data.arrivals,
          departures: res.data.departures,
          pie_chart_data: res.data.pie_chart_data,
          table_data: res.data.table_data,
          isLoaded: true,
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

  toggleClusters() {
    this.setState({
      showAsClusters: !this.state.showAsClusters,
    });
  }

  ChangeDate(e) {
    this.setState({
      selected_date: e,
    });
    axios
      .get(GET_DAILY_STATUS, {
        headers: headers,
        params: {
          selected_date: moment(e).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          all_traveldays: res.data.all_traveldays,
          arrivals: res.data.arrivals,
          departures: res.data.departures,
          pie_chart_data: res.data.pie_chart_data,
          table_data: res.data.table_data,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  setSearchStr(text) {
    this.setState({
      search_str: text,
    });
  }

  render() {
    const miniPieData = [
      {
        title: "TRL",
        value: this.state.pie_chart_data["trl"],
        color: "#de2110",
      }, // Greek Blue
      {
        title: "TRB",
        value: this.state.pie_chart_data["trb"],
        color: "#aa381e",
      }, // China Red
      {
        title: "TRA",
        value: this.state.pie_chart_data["tra"],
        color: "#1269C7",
      }, // G Britain Red
      {
        title: "COL",
        value: this.state.pie_chart_data["col"],
        color: "#57585B",
      },
      {
        title: "COA",
        value: this.state.pie_chart_data["coa"],
        color: "#F37021",
      },
    ];

    const uniqueAgents = Object.values(
      this.state.all_traveldays
        .map((td) => (td.group_transfer.agent ? td.group_transfer.agent : ""))
        .reduce((acc, curr) => {
          if (!acc[curr.id]) {
            acc[curr.id] = curr;
          }
          return acc;
        }, {})
    );

    const handleSearch = (event) => {
      this.setSearchStr(event.target.value);
    };

    const filteredData = this.state.table_data.filter((item) =>
      Object.values(item)
        .map((value) =>
          String(value)
            .toLowerCase()
            .includes(this.state.search_str.toLowerCase())
        )
        .some((item) => item === true)
    );

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("daily_status")}
          {this.state.forbidden ? (
            <>{forbidden("Daily Status")}</>
          ) : (
            <>
              <Grid style={{ margin: 30 }} stackable>
                <Grid.Row>
                  <Grid.Column width={3}>
                    <label> Select a date : </label>
                    <DatePicker
                      wrapperClassName="datePicker"
                      clearIcon={null}
                      format={"dd/MM/y"}
                      name="date_from"
                      value={this.state.selected_date}
                      onChange={this.ChangeDate}
                    />
                    <hr />
                    <ul>
                      <li>Arrivals: {this.state.arrivals}</li>
                      <li>Departures: {this.state.departures}</li>
                    </ul>
                    <hr />
                    <div id="pie_chart_office">
                      {this.state.isLoaded ? (
                        <MiniPieChart data={miniPieData} animate />
                      ) : null}
                      <ul id="pie_chart_ul">
                        {this.state.pie_chart_data["trl"] > 0 ? (
                          <li>
                            <FaCircle
                              style={{ color: "#de2110", marginRight: 20 }}
                            />
                            Transel London groups:
                            {this.state.pie_chart_data["trl"]}
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {this.state.pie_chart_data["trb"] > 0 ? (
                          <li>
                            <FaCircle
                              style={{ color: "#aa381e", marginRight: 20 }}
                            />
                            Transel Beijing groups:
                            {this.state.pie_chart_data["trb"]}
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {this.state.pie_chart_data["tra"] > 0 ? (
                          <li>
                            <FaCircle
                              style={{ color: "#1269C7", marginRight: 20 }}
                            />
                            Transel Athens groups:
                            {this.state.pie_chart_data["tra"]}
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {this.state.pie_chart_data["coa"] > 0 ? (
                          <li>
                            <FaCircle
                              style={{ color: "#F37021", marginRight: 20 }}
                            />
                            Cosmoplan Athens groups:
                            {this.state.pie_chart_data["coa"]}
                          </li>
                        ) : (
                          <li></li>
                        )}
                        {this.state.pie_chart_data["col"] > 0 ? (
                          <li>
                            <FaCircle
                              style={{ color: "#57585B", marginRight: 20 }}
                            />
                            Cosmoplan London groups:
                            {this.state.pie_chart_data["col"]}
                          </li>
                        ) : (
                          <li></li>
                        )}
                      </ul>
                    </div>
                    <hr />
                  </Grid.Column>
                  <Grid.Column width={11}>
                    {this.state.showAsClusters ? (
                      <GoogleMapClustered
                        selected_date={this.state.selected_date}
                        data={this.state.all_traveldays}
                      />
                    ) : (
                      <GoogleMapUnclustered
                        selected_date={this.state.selected_date}
                        data={this.state.all_traveldays}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <Form.Check
                      type={"checkbox"}
                      label={"Clustered Markers"}
                      checked={this.state.showAsClusters}
                      onChange={this.toggleClusters}
                    />
                    <br />
                    <div
                      style={{
                        border: "1px solid grey",
                        borderRadius: 6,
                        maxHeight: 540,
                        padding: 10,
                        overflow: "scroll",
                      }}
                    >
                      {/* eslint-disable-next-line */}
                      {uniqueAgents.map((agent) => {
                        if (agent !== "") {
                          return (
                            <>
                              <img
                                src={"http://localhost:8000" + agent.icon}
                                alt="group"
                              />
                              <small>{agent.name}</small>
                              <hr />
                            </>
                          );
                        }
                      })}
                    </div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <hr />
              <div>
                {this.state.all_traveldays.length > 0 ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={this.state.search_str}
                      className="form-control"
                      style={{ margin: 20, width: 300 }}
                      onChange={handleSearch}
                    />
                    <Table striped bordered hover id="daily_status_table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Reference</th>
                          <th>Nation</th>
                          <th>Hotel</th>
                          <th>Previous Day</th>
                          <th>Current Day</th>
                          <th>Group Leader</th>
                          <th>Driver</th>
                          <th>Coach Operator</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((e, j) => (
                          <tr>
                            <td>{j + 1}</td>
                            <td>
                              <a
                                href={"/group_management/group/" + e[0]}
                                basic
                                id="cell_link"
                              >
                                {e[0]}
                              </a>
                            </td>
                            <td>
                              {e[1] !== "N/A" ? (
                                <ReactCountryFlag
                                  countryCode={e[1].split("**")[1]}
                                  svg
                                  style={{
                                    width: "1.5em",
                                    height: "2em",
                                    marginRight: 10,
                                  }}
                                  title={e[1].split("**")[0]}
                                />
                              ) : (
                                ""
                              )}
                              {e[1].split("**")[0]}
                            </td>
                            <td>
                              {e[8] !== "N/A" ? (
                                <a
                                  href={"/data_management/hotel/" + e[8]}
                                  basic
                                  id="cell_link"
                                >
                                  {e[2]}
                                </a>
                              ) : (
                                e[2]
                              )}
                            </td>
                            <td>
                              {e[3].startsWith("arrival_") ? (
                                <div>
                                  <span id="arr_dep_span">
                                    <GiAirplaneArrival
                                      id="arr_dep_icon"
                                      title="Arrival"
                                    />
                                    Arrival
                                  </span>
                                  <br />
                                  <span id="arr_dep_text_span">
                                    {e[3].split("arrival_ ")[1].split("**")[0]}
                                  </span>
                                </div>
                              ) : null}
                              {e[3].startsWith("departure_") ? (
                                <div>
                                  <span id="arr_dep_span">
                                    <GiAirplaneDeparture
                                      id="arr_dep_icon"
                                      title="Departure"
                                    />
                                    Departure
                                  </span>
                                  <br />
                                  <span id="arr_dep_text_span">
                                    {
                                      e[3]
                                        .split("departure_ ")[1]
                                        .split("**")[0]
                                    }
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              {!e[3].startsWith("arrival_") &&
                              !e[3].startsWith("departure_")
                                ? e[3]
                                : ""}
                            </td>
                            <td>
                              {e[4].startsWith("arrival_") ? (
                                <div>
                                  <span id="arr_dep_span">
                                    <GiAirplaneArrival
                                      id="arr_dep_icon"
                                      title="Arrival"
                                    />
                                    Arrival
                                  </span>
                                  <br />
                                  <span id="arr_dep_text_span">
                                    {e[4].split("arrival_ ")[1].split("**")[0]}
                                  </span>
                                </div>
                              ) : null}
                              {e[4].startsWith("departure_") ? (
                                <div>
                                  <span id="arr_dep_span">
                                    <GiAirplaneDeparture
                                      id="arr_dep_icon"
                                      title="Departure"
                                    />
                                    Departure
                                  </span>
                                  <br />
                                  <span id="arr_dep_text_span">
                                    {
                                      e[4]
                                        .split("departure_ ")[1]
                                        .split("**")[0]
                                    }
                                  </span>
                                </div>
                              ) : (
                                ""
                              )}
                              {!e[4].startsWith("arrival_") &&
                              !e[4].startsWith("departure_")
                                ? e[4]
                                : ""}
                            </td>

                            <td>
                              <a
                                href={"/data_management/group_leader/" + e[9]}
                                basic
                                id="cell_link"
                              >
                                {e[5].split("**")[0]}
                              </a>
                              {e[5].includes("**") ? (
                                <BsFlagFill
                                  style={{
                                    color:
                                      leaderRatingOptions[e[5].split("**")[1]],
                                    fontSize: "2em",
                                    marginRight: "0.5em",
                                    float: "right",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              <a
                                href={"/data_management/driver/" + e[10]}
                                basic
                                id="cell_link"
                              >
                                {e[6]}
                              </a>
                            </td>
                            <td>
                              <a
                                href={
                                  "/data_management/coach_operator/" + e[11]
                                }
                                basic
                                id="cell_link"
                              >
                                {e[7]}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <h6 style={{ textAlign: "center", marginTop: 20 }}>
                    Nothing to show here
                  </h6>
                )}
              </div>
            </>
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default DailyStatus;
