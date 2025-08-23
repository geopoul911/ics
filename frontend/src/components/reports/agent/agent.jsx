// Built-ins
import React from "react";

// Functions / Modules
import axios from "axios";
import { Grid } from "semantic-ui-react";
import { Card } from "react-bootstrap";
import Swal from "sweetalert2";
import DatePicker from "react-date-picker";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-daterange-picker/dist/css/react-calendar.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import GroupsPerYearLineChart from "../charts/groups_per_year_line_chart";
import GroupsPerNationalityPieChart from "../charts/groups_per_nationality_pie_chart";
import OtherAgentsColumnChart from "../charts/other_column_chart";
import ConfirmedCancelledPieChart from "../charts/confirmed_cancelled";

// Icons-Images
import { FaFilter, FaFlag, FaChartLine } from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { BsInfoSquare } from "react-icons/bs";
import { MdIncompleteCircle } from "react-icons/md";
import { BiBriefcase } from "react-icons/bi";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  iconStyle,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const NoDataToShow = () => {
  return (
    <img src={NoDataToShowImage} alt={""} className="fill dox_responsive_img" />
  );
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();

const REPORTS_AGENT = "http://localhost:8000/api/reports/agent/";
const GET_AGENTS = "http://localhost:8000/api/data_management/all_agents/";
const GET_AGENT = "http://localhost:8000/api/view/get_agent/";

class ReportsAgent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agent: "",
      date_from: new Date(year, month, day - 30),
      date_to: new Date(),
      all_agents: [],

      agent_statistics_card: {
        total_groups: 0,
        total_number_of_people: 0,
        people_per_group: 0,
      },

      agent_information_card: {
        abbreviation: "N/A",
        email: "N/A",
        address: "N/A",
        created_by: "N/A",
        created_at: "N/A",
      },

      other_agents_at_period: [],
      confirmed_cancelled: {
        confirmed: 0,
        cancelled: 0,
      },

      groups_per_year: [],
      table_data: [],

      columns: [
        {
          dataField: "period",
          text: "Period",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "reference",
          text: "Refcode",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              <a
                href={"/group_management/group/" + row.reference}
                basic
                target="_blank"
                rel="noreferrer"
                className={row.status === "4" ? "cnclled" : "cnfrmed"}
              >
                {row.reference}
              </a>
            </>
          ),
        },
        {
          dataField: "arrival",
          text: "Arrival",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "departure",
          text: "Departure",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "PAX",
          text: "PAX",
          sort: true,
          filter: textFilter(),
        },
      ],
    };
    this.ChangeDateFrom = this.ChangeDateFrom.bind(this);
    this.ChangeDateTo = this.ChangeDateTo.bind(this);
  }

  componentDidMount() {
    this.setState({
      is_loaded: false,
    });

    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }

    axios
      .get(GET_AGENTS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          all_agents: res.data.all_agents,
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

  ChangeDateFrom = (newDateFrom) => {
    const { date_to } = this.state;
    if (newDateFrom > date_to) {
      this.setState({
        date_from: date_to,
      });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Date From cannot be set to a date later than 'To'.",
      });
    } else {
      this.setState({
        date_from: newDateFrom,
      });
    }

    if (this.state.agent !== "") {
      axios
        .get(REPORTS_AGENT, {
          headers: headers,
          params: {
            agent_name: this.state.agent.name,
            date_from: moment(newDateFrom).format("YYYY-MM-DD"),
            date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          this.setState({
            is_loaded: true,
            agent_statistics_card: res.data.agent_statistics_card,
            agent_information_card: res.data.agent_information_card,
            other_agents_at_period: res.data.other_agents_at_period,
            groups_by_nationality: res.data.groups_by_nationality,
            confirmed_cancelled: res.data.confirmed_cancelled,
            groups_per_year: res.data.groups_per_year,
            table_data: res.data.table_data,
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
  };

  ChangeDateTo = (newDateTo) => {
    const { date_from } = this.state;
    if (newDateTo < date_from) {
      this.setState({
        date_to: date_from,
      });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Date To cannot be set to a date earlier than 'From'.",
      });
    } else {
      this.setState({
        date_to: newDateTo,
      });
    }

    if (this.state.agent !== "") {
      axios
        .get(REPORTS_AGENT, {
          headers: headers,
          params: {
            agent_name: this.state.agent.name,
            date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
            date_to: moment(newDateTo).format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          this.setState({
            is_loaded: true,
            agent_statistics_card: res.data.agent_statistics_card,
            agent_information_card: res.data.agent_information_card,
            other_agents_at_period: res.data.other_agents_at_period,
            groups_by_nationality: res.data.groups_by_nationality,
            confirmed_cancelled: res.data.confirmed_cancelled,
            groups_per_year: res.data.groups_per_year,
            table_data: res.data.table_data,
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
  };

  setSelectedAgent = (agent) => {
    axios
      .get(GET_AGENT + agent, {
        headers: headers,
        params: {
          agent_name: agent,
        },
      })
      .then((res) => {
        this.setState({
          agent: res.data.agent,
        });
      });

    axios
      .get(REPORTS_AGENT, {
        headers: headers,
        params: {
          agent_name: agent,
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          agent_statistics_card: res.data.agent_statistics_card,
          agent_information_card: res.data.agent_information_card,
          other_agents_at_period: res.data.other_agents_at_period,
          groups_by_nationality: res.data.groups_by_nationality,
          confirmed_cancelled: res.data.confirmed_cancelled,
          groups_per_year: res.data.groups_per_year,
          table_data: res.data.table_data,
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
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_agent")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Agent")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid celled={this.state.agent !== ""}>
                <Grid.Row style={{ marginLeft: 10 }}>
                  <Grid.Column width={6}>
                    <Card>
                      <Card.Header>
                        <FaFilter style={iconStyle} /> Filters
                      </Card.Header>
                      <Card.Body>
                        <b style={{ marginTop: 8 }}>from:</b>
                        <DatePicker
                          wrapperClassName="datePicker"
                          className="reports_datepicker"
                          clearIcon={null}
                          format={"dd/MM/y"}
                          name="date_from"
                          value={this.state.date_from}
                          onChange={this.ChangeDateFrom}
                        />
                        <b style={{ marginTop: 8 }}>to:</b>
                        <DatePicker
                          wrapperClassName="datePicker"
                          className="reports_datepicker"
                          clearIcon={null}
                          format={"dd/MM/y"}
                          style={{ marginLeft: "30 !important" }}
                          name="date_from"
                          value={this.state.date_to}
                          onChange={this.ChangeDateTo}
                        />
                        <Autocomplete
                          options={this.state.all_agents}
                          className={"select_airport"}
                          onChange={(e) => {
                            this.setSelectedAgent(e.target.innerText);
                          }}
                          style={{ width: 320, marginTop: 10 }}
                          value={this.state.agent}
                          getOptionLabel={(e) => e.name}
                          getOptionSelected={(e) => e.name}
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select agent"
                              variant="outlined"
                            />
                          )}
                        />
                        {this.state.agent !== "" ? (
                          <img
                            src={"http://localhost:8000" + this.state.agent.icon}
                            style={{
                              maxHeight: 35,
                              maxWidth: 35,
                              marginTop: 30,
                              marginLeft: 20,
                            }}
                            alt="Caption"
                          />
                        ) : (
                          ""
                        )}
                      </Card.Body>
                    </Card>
                  </Grid.Column>

                  <Grid.Column width={5}>
                    {this.state.agent !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <ImStatsDots style={iconStyle} /> Agent's Statistics
                          </Card.Header>
                          <Card.Body>
                            <ul style={{ marginBottom: 0 }}>
                              <li>
                                Total Groups:
                                {
                                  this.state.agent_statistics_card[
                                    "total_groups"
                                  ]
                                }
                              </li>
                              <li>
                                Total Number Of People:
                                {this.state.agent_statistics_card[
                                  "total_number_of_people"
                                ]
                                  ? this.state.agent_statistics_card[
                                      "total_number_of_people"
                                    ]
                                  : 0}
                              </li>
                              <li>
                                People Per Group:
                                {
                                  this.state.agent_statistics_card[
                                    "people_per_group"
                                  ]
                                }
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={5}>
                    {this.state.agent !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <BsInfoSquare style={iconStyle} /> Agent's
                            Information
                          </Card.Header>
                          <Card.Body>
                            <ul style={{ marginBottom: 0 }}>
                              <li>
                                Abbreviation:
                                {
                                  this.state.agent_information_card[
                                    "abbreviation"
                                  ]
                                }
                              </li>
                              <li>
                                Email:
                                {this.state.agent_information_card["email"]
                                  ? this.state.agent_information_card["email"]
                                  : "N/A"}
                              </li>
                              <li>
                                Address:
                                {this.state.agent_information_card["address"]}
                              </li>
                              <li>
                                Created by:
                                {
                                  this.state.agent_information_card[
                                    "created_by"
                                  ]
                                }
                              </li>
                              <li>
                                Created at:
                                {
                                  this.state.agent_information_card[
                                    "created_at"
                                  ]
                                }
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    {this.state.agent !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <BiBriefcase style={iconStyle} /> Top 10 Most Used
                            Agents at this Period
                          </Card.Header>
                          <Card.Body>
                            <OtherAgentsColumnChart
                              animate
                              data={this.state.other_agents_at_period}
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.agent !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <FaFlag style={iconStyle} /> Agent's Groups Per
                            Nationality
                          </Card.Header>
                          <Card.Body>
                            <GroupsPerNationalityPieChart
                              data={this.state.groups_by_nationality}
                              animate
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.agent !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <MdIncompleteCircle style={iconStyle} /> Confirmed /
                            Cancelled Groups
                          </Card.Header>
                          <Card.Body>
                            <ConfirmedCancelledPieChart
                              animate
                              data={this.state.confirmed_cancelled}
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.agent !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <FaChartLine style={iconStyle} /> Groups Per Year
                            Line Chart
                          </Card.Header>
                          <Card.Body>
                            <GroupsPerYearLineChart
                              groups_per_year={this.state.groups_per_year}
                              animate
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                </Grid.Row>
                {this.state.agent !== "" ? (
                  <Grid.Row>
                    <Grid.Column>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.table_data}
                        columns={this.state.columns}
                        search
                        noDataIndication={<NoDataToShow />}
                        bootstrap4
                        condensed
                        defaultSorted={defaultSorted}
                        exportCSV
                      >
                        {(props) => (
                          <div>
                            <div style={{ overflow: "x:auto" }}>
                              <BootstrapTable
                                id="agent_reports_table"
                                {...props.baseProps}
                                pagination={paginationFactory(
                                  paginationOptions
                                )}
                                hover
                                bordered={false}
                                striped
                                rowStyle={rowStyle}
                                filter={filterFactory()}
                              />
                            </div>
                          </div>
                        )}
                      </ToolkitProvider>
                    </Grid.Column>
                  </Grid.Row>
                ) : (
                  ""
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

export default ReportsAgent;
