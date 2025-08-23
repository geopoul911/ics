// Built-ins
import React from "react";

// Functions / Modules
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DateRangePicker } from "react-date-range";
import axios from "axios";
import { Alert, Table } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import MiniPieChart from "./mini_pie_chart";

// Icons / Images
import { FaCircle } from "react-icons/fa";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

// Global Variables
import {
  paginationOptions,
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const columns = [
  {
    dataField: "id",
    text: "#",
    sort: true,
  },
  {
    dataField: "action",
    text: "Action",
    sort: true,
  },
  {
    dataField: "description",
    text: "Description",
    sort: true,
  },
  {
    dataField: "timestamp",
    text: "Timestamp",
    sort: true,
    formatter: (cell, row) => (
      <>{moment(row["timestamp"]).format("DD-MM-YYYY hh:mm")}</>
    ),
  },
];

const rowStyle = (row, rowIndex) => {
  const style = {};
  style.backgroundColor = action_style[row["action"]];
  return style;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

let action_style = {
  CRE: "#d1e7dd",
  VIE: "#cfe2ff",
  UPD: "#fff3cd",
  DEL: "#f8d7da",
};

const MODEL_NAMES = [
  "GroupTransfer",
  "Agent",
  "Airline",
  "Offer",
  "Airport",
  "Attraction",
  "Client",
  "Coach Operator",
  "Coach",
  "Cruising Company",
  "Driver",
  "Destination Management Company",
  "Group Leader",
  "Guide",
  "Hotel",
  "Place",
  "Port",
  "Repair Shop",
  "Repair Type",
  "Restaurant",
  "Service",
  "Ferry Ticket Agency",
  "Teleferik Company",
  "Theater",
  "Train Ticket Agency",
  "Authentication",
  "User",
  "History",
];

const REPORTS_USER = "http://localhost:8000/api/reports/user/";
const GET_ALL_USERS = "http://localhost:8000/api/view/get_all_users/";

class ReportsUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: [],
      selected_user: "",
      is_loaded: false,
      showing: "all",
      filter_logs: "all",
      user_data: "",
      permission_showing: "",
      forbidden: false,
    };
    this.modify_selected_user = this.modify_selected_user.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.show_user_report = this.show_user_report.bind(this);
    this.change_showing = this.change_showing.bind(this);
    this.filter_logs = this.filter_logs.bind(this);
    this.handle_permission_showing = this.handle_permission_showing.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_ALL_USERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_users: res.data.all_users,
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

  modify_selected_user(e) {
    this.setState({
      selected_user: e.target.innerText,
    });
  }

  handle_permission_showing(e) {
    this.setState({
      permission_showing: e.target.innerText,
    });
  }

  change_showing = (e) => {
    this.setState({
      showing: e.target.value,
    });
  };

  filter_logs = (e) => {
    this.setState({
      filter_logs: e.target.value,
    });
  };

  handleSelect(ranges) {
    this.setState({
      date_from: ranges["selection"]["startDate"],
      date_to: ranges["selection"]["endDate"],
    });
  }

  show_user_report() {
    this.setState({
      show_tabs: true,
      is_loaded: false,
    });
    axios
      .get(REPORTS_USER, {
        headers: headers,
        params: {
          selected_user: this.state.selected_user,
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          user_data: res.data.user_data,
          is_loaded: true,
          enabled_users: res.data.enabled_users,
          disabled_users: res.data.disabled_users,
          logs: res.data.logs,
        });
      });
  }

  render() {
    const selectionRange = {
      startDate: this.state.date_from,
      endDate: this.state.date_to,
      key: "selection",
    };

    const confirmedCancelledData = [
      { title: "Confirmed", value: this.state.enabled_users, color: "green" }, // Greek Blue
      { title: "Cancelled", value: this.state.disabled_users, color: "red" }, // China Red
    ];

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_user")}
          {this.state.forbidden ? (
            <>{forbidden("Reports User")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={12} divided stackable>
                <Grid.Row style={{ marginLeft: 2 }}>
                  <Grid.Column width={6}>
                    <DateRangePicker
                      ranges={[selectionRange]}
                      onChange={this.handleSelect}
                    />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <div id="select_user_report">
                      <Alert
                        variant={"primary"}
                        style={{ textAlign: "center" }}
                      >
                        Please select an user to view his report
                      </Alert>
                      <Autocomplete
                        options={this.state.all_users}
                        onChange={this.modify_selected_user}
                        getOptionLabel={(option) => option.username}
                        style={{ width: "100%" }}
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select user"
                            variant="outlined"
                          />
                        )}
                      />
                      <div style={{ textAlign: "center", marginTop: 20 }}>
                        {this.state.selected_user && this.state.show_tabs ? (
                          <>
                            <b>Currently showing results for:</b>
                            <hr />
                            User: {this.state.selected_user}
                            <hr />
                            Date from:
                            {moment(this.state.date_from).format("DD-MM-YYYY")}
                            <hr />
                            Date to:
                            {moment(this.state.date_to).format("DD-MM-YYYY")}
                          </>
                        ) : (
                          <>
                            <b>No selected user.</b>
                          </>
                        )}
                      </div>
                      <Button
                        color="blue"
                        id="show_results_button"
                        style={{
                          marginTop: this.state.show_tabs ? 30 : 150,
                          textAlign: "center",
                          width: "100%",
                        }}
                        disabled={!this.state.selected_user}
                        onClick={this.show_user_report}
                      >
                        Show results
                      </Button>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={3} style={{ maxHeight: 200 }}>
                    <Alert
                      variant={"info"}
                      style={{ textAlign: "center", maxWidth: 300 }}
                    >
                      Enabled / Disabled users
                    </Alert>
                    {this.state.selected_user && this.state.show_tabs ? (
                      <>
                        <ul>
                          <li>
                            <FaCircle
                              style={{ color: "green", marginRight: 20 }}
                            />
                            Enabled : {this.state.enabled_users}
                          </li>
                          <li>
                            <FaCircle
                              style={{ color: "red", marginRight: 20 }}
                            />
                            Disabled : {this.state.disabled_users}
                          </li>
                        </ul>
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <b>No data to show</b>
                      </div>
                    )}
                    <MiniPieChart data={confirmedCancelledData} animate />
                  </Grid.Column>
                  <Grid.Column width={4}></Grid.Column>
                </Grid.Row>
              </Grid>
              <hr />
              <Tabs>
                <TabList>
                  <Tab> Information </Tab>
                  <Tab> Actions / Logs </Tab>
                  <Tab> Object Based Permissions </Tab>
                </TabList>
                {this.state.show_tabs ? (
                  <>
                    <TabPanel>
                      <div>
                        <b></b>
                        <ul>
                          <li>
                            ID: <span>{this.state.user_data["id"]}</span>
                          </li>
                          <li>
                            First Name:
                            <span>{this.state.user_data["first_name"]}</span>
                          </li>
                          <li>
                            Last Name:
                            <span>{this.state.user_data["last_name"]}</span>
                          </li>
                          <li>
                            Username:
                            <span>{this.state.user_data["username"]}</span>
                          </li>
                          <li>
                            Email: <span>{this.state.user_data["email"]}</span>
                          </li>
                          <li>
                            Active:
                            <span>
                              {this.state.user_data["is_active"] ? (
                                <TiTick style={tick_style} />
                              ) : (
                                <ImCross style={cross_style} />
                              )}
                            </span>
                          </li>
                          <li>
                            Staff:
                            <span>
                              {this.state.user_data["is_staff"] ? (
                                <TiTick style={tick_style} />
                              ) : (
                                <ImCross style={cross_style} />
                              )}
                            </span>
                          </li>
                          <li>
                            Superuser:
                            <span>
                              {this.state.user_data["is_superuser"] ? (
                                <TiTick style={tick_style} />
                              ) : (
                                <ImCross style={cross_style} />
                              )}
                            </span>
                          </li>
                          <li>
                            Date joined:
                            <span>
                              {moment(
                                this.state.user_data["date_joined"]
                              ).format("DD-MM-YYYY")}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.logs}
                        columns={columns}
                        search
                        noDataIndication={<NoDataToShow />}
                        bootstrap4
                        condensed
                        defaultSorted={defaultSorted}
                        exportCSV
                      >
                        {(props) => (
                          <div>
                            <SearchBar {...props.searchProps} />
                            <ExportCSVButton
                              className="ui green button"
                              {...props.csvProps}
                            >
                              Export to CSV
                            </ExportCSVButton>
                            <hr />
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory(paginationOptions)}
                              hover
                              bordered={false}
                              striped
                              rowStyle={rowStyle}
                            />
                          </div>
                        )}
                      </ToolkitProvider>
                    </TabPanel>
                    <TabPanel>
                      <Grid stackable>
                        <Grid.Column>
                          <ul>
                            {MODEL_NAMES.map((e) =>
                              e.length > 0 ? (
                                <li style={{ display: "inline-block" }}>
                                  <Button
                                    color={
                                      this.state.permission_showing === e
                                        ? "blue"
                                        : "lightgrey"
                                    }
                                    style={{ marginBottom: 5 }}
                                    onClick={this.handle_permission_showing}
                                    value={e}
                                  >
                                    {e}
                                  </Button>
                                </li>
                              ) : (
                                ""
                              )
                            )}
                          </ul>
                          {this.state.permission_showing !== "" ? (
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Value</th>
                                  <th>Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.user_data.permissions.map(
                                  // eslint-disable-next-line
                                  (model) => {
                                    if (
                                      model["model"] ===
                                      this.state.permission_showing
                                    ) {
                                      return (
                                        <>
                                          <tr>
                                            <td>{model["permission_type"]}</td>
                                            <td>
                                              {model["value"] ? (
                                                <TiTick style={tick_style} />
                                              ) : (
                                                <ImCross style={cross_style} />
                                              )}
                                            </td>
                                            <td>
                                              {model["description"].replaceAll(
                                                "_",
                                                " "
                                              )}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    }
                                  }
                                )}
                              </tbody>
                            </Table>
                          ) : (
                            ""
                          )}
                        </Grid.Column>
                      </Grid>
                    </TabPanel>
                  </>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <b>No data to show</b>
                  </div>
                )}
              </Tabs>
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

export default ReportsUser;
