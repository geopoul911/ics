// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Modules / Functions
import axios from "axios";
import { Grid } from "semantic-ui-react";
import DatePicker from "react-date-picker";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import moment from "moment";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import { Button } from "semantic-ui-react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { AiFillFilter } from "react-icons/ai";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

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
const ACTIONS = ["View", "Create", "Update", "Delete"];

const MODELS = [
  "GroupTransfer",
  "Agent",
  "Airline",
  "Airport",
  "Offer",
  "Attraction",
  "Client",
  "Coach",
  "Coach Operator",
  "Contract",
  "Cruising Company",
  "Driver",
  "Ground H. Company",
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
  "Text Template",
  "Theater",
  "Train Ticket Agency",
  "User",
  "History",
  "Transfers",
  "Sport Event Supplier",
  "Authentication",
  "Car Hire Company",
  "Charter Broker",
  "Aircraft",
  "Advertisement Company",
];

window.Swal = Swal;

const rowStyle = (row, rowIndex) => {
  const style = {};
  style.backgroundColor = action_style[row.action];
  return style;
};

let action_style = {
  Create: "#d1e7dd",
  View: "#cfe2ff",
  Update: "#fff3cd",
  Delete: "#f8d7da",
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const GET_LOGS = "http://localhost:8000/api/site_admin/logs/";
const GET_USERS = "http://localhost:8000/api/view/get_all_users/";

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

const columns = [
  {
    dataField: "id", // dataField is linked to the backend, if it doesnt match the data, nothing will be rendered
    text: "ID", // TH text
    sort: true, // shorting method
    filter: textFilter(),
  },
  {
    dataField: "model_name",
    text: "Model",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "action",
    text: "Action",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "description",
    text: "Description",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "timestamp",
    text: "Time stamp",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "user",
    text: "User",
    sort: true,
    filter: textFilter(),
  },
];

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locked_entries: [],
      all_users: [],
      is_loaded: false,
      action_filter: "None",
      model_filter: "None",
      user_filter: "None",
      date_from: new Date(),
      date_to: new Date(),
      logs: [],
      forbidden: false,
    };
    this.filterByAction = this.filterByAction.bind(this);
    this.filterByModel = this.filterByModel.bind(this);
    this.filterByUser = this.filterByUser.bind(this);
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
          all_users: res.data.all_users.map((user) => user.username),
        });
      });
    axios
      .get(GET_LOGS, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          action_filter: this.state.action_filter,
          model_filter: this.state.model_filter,
          user_filter: this.state.user_filter,
        },
      })
      .then((res) => {
        this.setState({
          logs: res.data.logs,
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

  filterByAction(e) {
    this.setState({
      action_filter: e.target.value,
      is_loaded: false,
    });
    axios
      .get(GET_LOGS, {
        headers: headers,
        params: {
          date_from: this.state.date_from,
          date_to: this.state.date_to,
          action_filter: e.target.value,
          model_filter: this.state.model_filter,
          user_filter: this.state.user_filter,
        },
      })
      .then((res) => {
        this.setState({
          logs: res.data.logs,
          is_loaded: true,
        });
      });
  }

  filterByModel(e) {
    this.setState({
      model_filter: e.target.value,
      is_loaded: false,
    });
    axios
      .get(GET_LOGS, {
        headers: headers,
        params: {
          date_from: this.state.date_from,
          date_to: this.state.date_to,
          action_filter: this.state.action_filter,
          model_filter: e.target.value,
          user_filter: this.state.user_filter,
        },
      })
      .then((res) => {
        this.setState({
          logs: res.data.logs,
          is_loaded: true,
        });
      });
  }

  filterByUser(e) {
    this.setState({
      user_filter: e.target.value,
      is_loaded: false,
    });
    axios
      .get(GET_LOGS, {
        headers: headers,
        params: {
          date_from: this.state.date_from,
          date_to: this.state.date_to,
          action_filter: this.state.action_filter,
          model_filter: this.state.model_filter,
          user_filter: e.target.value,
        },
      })
      .then((res) => {
        this.setState({
          logs: res.data.logs,
          is_loaded: true,
        });
      });
  }

  showResults() {
    this.setState({
      is_loaded: false,
    });
    axios
    .get(GET_LOGS, {
      headers: headers,
      params: {
        date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
        date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        action_filter: this.state.action_filter,
        model_filter: this.state.model_filter,
        user_filter: this.state.user_filter,
      },
    })
    .then((res) => {
      this.setState({
        logs: res.data.logs,
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

  setDateFrom(date) {
    this.setState({
      date_from: date,
    });
  }

  setDateTo(date) {
    this.setState({
      date_to: date,
    });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("logs")}
          {this.state.forbidden ? (
            <>{forbidden("Logs")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column
                  width={3}
                  style={{ marginTop: 10, marginLeft: 20 }}
                >
                  <h2>
                    <AiFillFilter
                      style={{
                        color: "orange",
                        fontSize: "1.4em",
                        marginRight: "0.5em",
                      }}
                    />
                    Filters
                  </h2>
                  <hr />
                  <label style={{ marginLeft: 20 }}>
                    Filter by a range of dates
                  </label>
                  <br/>
                  Date From:
                  <DatePicker
                    clearIcon={null}
                    value={this.state.date_from}
                    format="dd/MM/yyyy"
                    onChange={(e) => {this.setDateFrom(e);}}
                  />
                  <hr/>
                  Date To: 
                  <DatePicker
                    clearIcon={null}
                    value={this.state.date_to}
                    format="dd/MM/yyyy"
                    onChange={(e) => {this.setDateTo(e);}}
                  />
                  <hr/>
                  <Button style={{marginTop: 20}} color='blue' onClick={this.showResults.bind(this)}> Show Results </Button>

                  <hr />
                  <label style={{ marginLeft: 20 }}>Filter by Action</label>
                  <select
                    className="form-control"
                    defaultValue={"defaultValue"}
                    style={{ width: 300, marginBottom: 10 }}
                    onChange={(e) => this.filterByAction(e)}
                    value={this.state.selected_model}
                  >
                    <option value="None">No Filter</option>
                    {ACTIONS.map((action) => (
                      <option value={action}>{action}</option>
                    ))}
                  </select>
                  <hr />
                  <label style={{ marginLeft: 20 }}>Filter by Model</label>
                  <select
                    className="form-control"
                    defaultValue={"defaultValue"}
                    style={{ width: 300, marginBottom: 10 }}
                    onChange={(e) => this.filterByModel(e)}
                    value={this.state.selected_model}
                  >
                    <option value="None">No Filter</option>
                    {MODELS.map((model) => (
                      <option value={model}>{model}</option>
                    ))}
                  </select>
                  <hr />
                  <label style={{ marginLeft: 20 }}>Filter by User</label>
                  <select
                    className="form-control"
                    defaultValue={"defaultValue"}
                    style={{ width: 300, marginBottom: 10 }}
                    onChange={(e) => this.filterByUser(e)}
                    value={this.state.selected_model}
                  >
                    <option value="None">No Filter</option>
                    {this.state.all_users.map((action) => (
                      <option value={action}>{action}</option>
                    ))}
                  </select>
                  <Button
                    color="orange"
                    onClick={() => window.location.reload()}
                    style={{ margin: 20 }}
                  >
                    Reset Filters
                  </Button>
                </Grid.Column>
                <Grid.Column width={12} style={{ margin: 20 }}>
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
                        <BootstrapTable
                          {...props.baseProps}
                          id="logs_table"
                          pagination={paginationFactory(paginationOptions)}
                          hover
                          striped
                          rowStyle={rowStyle}
                          filter={filterFactory()}
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                </Grid.Column>
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

export default Logs;
