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
import { MdIncompleteCircle } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { FaMedal, FaSuitcaseRolling } from "react-icons/fa";

// Variables
window.Swal = Swal;

let iconStyle = {
  color: "#F3702D",
  fontSize: "1.3em",
  marginRight: "0.5em",
};

const REPORTS_CLIENT = "http://localhost:8000/api/reports/client/";

class ReportsClient extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    const dateFrom = new Date(currentDate);
    dateFrom.setDate(dateFrom.getDate() - 30);
    this.state = {
      all_clients: 0,
      incomplete_clients: 0,
      last_added_client: "",
      date_from: dateFrom,
      date_to: new Date(),
      client_stats: [],
      selectedClient: "",
      active_row: 0,
    };
    this.show_client_report = this.show_client_report.bind(this);
    this.ChangeDateFrom = this.ChangeDateFrom.bind(this);
    this.ChangeDateTo = this.ChangeDateTo.bind(this);
    this.setSelectedClient = this.setSelectedClient.bind(this);
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
      .get(REPORTS_CLIENT, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          all_clients: res.data.all_clients,
          incomplete_clients: res.data.incomplete_clients,
          last_added_client: res.data.last_added_client,
          client_stats: res.data.client_stats,
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

  show_client_report() {
    this.setState({
      show_tabs: true,
      is_loaded: false,
    });
    axios
      .get(REPORTS_CLIENT, {
        headers: headers,
        params: {
          selected_client: this.state.selected_client,
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          client_stats: res.data.client_stats,
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

  setSelectedClient(e) {
    console.log(e);
    this.setState({
      selectedClient: e.target.parentElement["children"][1].innerText,
    });
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

    if (e.target.nodeName === "TD") {
      this.setState({
        active_row: Number(e.target.parentElement["children"][0].innerText),
      });
    } else {
      this.setState({
        active_row: -1,
      });
    }
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_client")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Client")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={4} divided="vertically">
                <Grid.Row style={{ marginLeft: 5 }}>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <FaSuitcaseRolling style={iconStyle} /> Total Clients:
                        {this.state.all_clients.length}
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <MdIncompleteCircle style={iconStyle} /> Clients with
                        Missing Values: {this.state.incomplete_clients}
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <BsCheck style={iconStyle} />
                        Enabled :
                        {
                          this.state.all_clients.filter(
                            (client) => client.enabled
                          ).length
                        }
                        / Disabled:
                        {
                          this.state.all_clients.filter(
                            (client) => !client.enabled
                          ).length
                        }
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Card border="info">
                      <Card.Body style={{ textAlign: "center" }}>
                        <FaMedal style={iconStyle} /> Last Added Client:
                        {this.state.last_added_client}
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{ marginLeft: 1 }}>
                  <Grid.Column width={16}>
                    <h3 className="dox_h3" style={{ textAlign: "center" }}>
                      Please choose dates to filter client stats:
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
                      <Button color="orange" onClick={this.show_client_report}>
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
                            <th>#</th>
                            <th>Client name</th>
                            <th>Number Of Groups</th>
                          </thead>
                          <tbody>
                            {this.state.client_stats.map((client_row, j) => {
                              let rowClass = "";
                              if (j + 1 === this.state.active_row) {
                                rowClass = "clicked_row";
                              }
                              return (
                                <tr
                                  onClick={this.setSelectedClient}
                                  className={rowClass}
                                >
                                  <td>{j + 1}</td>
                                  <td>{client_row.client_name}</td>
                                  <td>{client_row.number_of_groups}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    {this.state.client_stats.length > 0 ? (
                      <>
                        <Card>
                          <Card.Body>
                            <ReactApexChart
                              options={{
                                chart: {
                                  type: "bar",
                                  height:
                                    this.state.client_stats.length < 5
                                      ? 250
                                      : this.state.client_stats.length * 30,
                                  stacked: true,
                                },
                                plotOptions: {
                                  bar: {
                                    borderRadius: 4,
                                    horizontal: true,
                                  },
                                },
                                dataLabels: {
                                  enabled: false,
                                },
                                xaxis: {
                                  categories: this.state.client_stats.map(
                                    (client_row) => client_row.client_name
                                  ),
                                },
                              }}
                              series={[
                                {
                                  name: "Number Of Groups",
                                  data: this.state.client_stats.map(
                                    (client_row) => client_row.number_of_groups
                                  ),
                                },
                              ]}
                              type="bar"
                              height={
                                this.state.client_stats.length < 5
                                  ? 250
                                  : this.state.client_stats.length * 30
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
                {this.state.selectedClient !== "" ? (
                  <>
                    <Grid.Row style={{ marginLeft: 5 }}>
                      <Grid.Column width={16}>
                        <Card>
                          <h3
                            className="dox_h3"
                            style={{ textAlign: "center" }}
                          >
                            Selected Client: {this.state.selectedClient}
                          </h3>
                          <Card.Body>
                            <Table striped hover id="g_dox_table">
                              <thead>
                                <th>Period</th>
                                <th>Reference</th>
                                <th>Arrival</th>
                                <th>Departure</th>
                                <th>Group Days</th>
                                <th>PAX</th>
                              </thead>
                              <tbody>
                                {this.state.client_stats
                                  .filter(
                                    (row) =>
                                      row.client_name ===
                                      this.state.selectedClient
                                  )
                                  .map((table_row) =>
                                    table_row.group_details.map((row) => (
                                      <tr>
                                        <td>{row.period}</td>
                                        <td>{row.reference}</td>
                                        <td>{row.arrival}</td>
                                        <td>{row.departure}</td>
                                        <td>{row.group_days}</td>
                                        <td>{row.pax}</td>
                                      </tr>
                                    ))
                                  )}
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Card>
                      </Grid.Column>
                    </Grid.Row>
                  </>
                ) : (
                  <></>
                )}
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

export default ReportsClient;
