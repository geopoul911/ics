// Built-ins
import React from "react";

// Functions / Modules
import axios from "axios";
import { Grid, Button } from "semantic-ui-react";
import { Card, Table } from "react-bootstrap";
import moment from "moment";
import Swal from "sweetalert2";
import DatePicker from "react-date-picker";
import ReactApexChart from "react-apexcharts";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-daterange-picker/dist/css/react-calendar.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Icons - Images
import {
  MdOutlineAirplanemodeActive,
  MdIncompleteCircle,
} from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { FaMedal } from "react-icons/fa";

// Variables
window.Swal = Swal;

let iconStyle = {
  color: "#F3702D",
  fontSize: "1.3em",
  marginRight: "0.5em",
};

const REPORTS_AIRPORT = "http://localhost:8000/api/reports/airport/";

class ReportsAirport extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    const dateFrom = new Date(currentDate);
    dateFrom.setDate(dateFrom.getDate() - 30);
    this.state = {
      all_airports: 0,
      incomplete_airports: 0,
      last_added_airport: "",
      date_from: dateFrom,
      date_to: new Date(),
      airport_stats: [],
    };
    this.show_airport_report = this.show_airport_report.bind(this);
    this.ChangeDateFrom = this.ChangeDateFrom.bind(this);
    this.ChangeDateTo = this.ChangeDateTo.bind(this);
  }

  componentDidMount() {
    this.setState({
      show_tabs: true,
      is_loaded: false,
    });

    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(REPORTS_AIRPORT, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          all_airports: res.data.all_airports,
          incomplete_airports: res.data.incomplete_airports,
          last_added_airport: res.data.last_added_airport,
          airport_stats: res.data.airport_stats,
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

  show_airport_report() {
    this.setState({
      show_tabs: true,
      is_loaded: false,
    });
    axios
      .get(REPORTS_AIRPORT, {
        headers: headers,
        params: {
          selected_airport: this.state.selected_airport,
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          airport_stats: res.data.airport_stats,
        });
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  }

  ChangeDateFrom = (newDateFrom) => {
    const { date_to } = this.state;

    if (newDateFrom > date_to) {
      // If the new "from" date is greater than the "to" date, adjust it to be equal.
      this.setState({
        date_from: date_to,
      });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Date From cannot be set to a date later than Date To.",
      });
    } else {
      this.setState({
        date_from: newDateFrom,
      });
    }
  };

  ChangeDateTo = (newDateTo) => {
    const { date_from } = this.state;

    if (newDateTo < date_from) {
      // If the new "to" date is less than the "from" date, adjust it to be equal.
      this.setState({
        date_to: date_from,
      });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Date To cannot be set to a date earlier than Date From.",
      });
    } else {
      this.setState({
        date_to: newDateTo,
      });
    }
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_airport")}
          {this.state.forbidden ? (
            <> {forbidden("Reports Airport")} </>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={4} divided="vertically">
                <Grid.Row style={{ marginLeft: 5 }}>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <MdOutlineAirplanemodeActive style={iconStyle} /> Total
                        Airports: {this.state.all_airports.length}
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <MdIncompleteCircle style={iconStyle} /> Airports with
                        Missing Values: {this.state.incomplete_airports}
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <BsCheck style={iconStyle} />
                        Enabled :
                        {
                          this.state.all_airports.filter(
                            (airport) => airport.enabled
                          ).length
                        }
                        / Disabled:
                        {
                          this.state.all_airports.filter(
                            (airport) => !airport.enabled
                          ).length
                        }
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <FaMedal style={iconStyle} /> Last Added Airport:
                        {this.state.last_added_airport}
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginLeft: 1 }}>
                  <Grid.Column width={16}>
                    <h3 className="dox_h3" style={{ textAlign: "center" }}>
                      Please choose dates to filter airport flights:
                    </h3>
                    <div className="reports_datepicker_container">
                      <b>from:</b>
                      <DatePicker
                        wrapperClassName="datePicker"
                        className="reports_datepicker"
                        clearIcon={null}
                        format={"dd/MM/y"}
                        style={{ marginLeft: 20 }}
                        name="date_from"
                        value={this.state.date_from}
                        onChange={this.ChangeDateFrom}
                      />
                      <b>to:</b>
                      <DatePicker
                        wrapperClassName="datePicker"
                        className="reports_datepicker"
                        clearIcon={null}
                        format={"dd/MM/y"}
                        style={{ marginLeft: 20 }}
                        name="date_from"
                        value={this.state.date_to}
                        onChange={this.ChangeDateTo}
                      />
                      <Button color="orange" onClick={this.show_airport_report}>
                        Filter
                      </Button>
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginLeft: 5 }}>
                  <Grid.Column width={8}>
                    <Card>
                      <Card.Body>
                        <Table striped hover id="g_dox_table">
                          <thead>
                            <th>Airport name</th>
                            <th>Location</th>
                            <th>Arrival Flights</th>
                            <th>Departure Flights</th>
                          </thead>
                          <tbody>
                            {this.state.airport_stats.map((airport_row) => (
                              <tr>
                                <td>{airport_row.airport_name}</td>
                                <td>{airport_row.location}</td>
                                <td>{airport_row.arrival_flights}</td>
                                <td>{airport_row.departure_flights}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    {this.state.airport_stats.length > 0 ? (
                      <>
                        <Card>
                          <Card.Body>
                            <ReactApexChart
                              options={{
                                chart: {
                                  type: "bar",
                                  height:
                                    this.state.airport_stats.length < 5
                                      ? 250
                                      : this.state.airport_stats.length * 30,
                                  stacked: true,
                                },
                                plotOptions: {
                                  bar: { borderRadius: 4, horizontal: true },
                                },
                                dataLabels: {
                                  enabled: false,
                                },
                                xaxis: {
                                  categories: this.state.airport_stats.map(
                                    (airport_row) => airport_row.airport_name
                                  ),
                                },
                              }}
                              series={[
                                {
                                  name: "Arrivals",
                                  data: this.state.airport_stats.map(
                                    (airport_row) => airport_row.arrival_flights
                                  ),
                                },
                                {
                                  name: "Departures",
                                  data: this.state.airport_stats.map(
                                    (airport_row) =>
                                      airport_row.departure_flights
                                  ),
                                },
                              ]}
                              type="bar"
                              height={
                                this.state.airport_stats.length < 5
                                  ? 250
                                  : this.state.airport_stats.length * 30
                              }
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      <Card>
                        <Card.Body style={{ textAlign: "center" }}>
                          No results.
                        </Card.Body>
                      </Card>
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <hr />
            </>
          ) : (
            loader()
          )}
        </div>
        <Footer />
      </>
    );
  }
}

export default ReportsAirport;
