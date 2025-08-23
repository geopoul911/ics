// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Modules / Functions
import axios from "axios";
import { Grid, Button, Form, Radio } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import RemoveLock from "./modals/remove_lock";

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

window.Swal = Swal;

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const GET_ACCESS_HISTORY =
  "http://localhost:8000/api/site_admin/access_history/";
const GET_ALL_USERS = "http://localhost:8000/api/view/get_all_users/";

class AccessHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locked_entries: [],
      all_users: [],
      is_loaded: true,
      first_radio_filter: "locked", // login_logout, locked,
      selected_user: "",
      forbidden: false,
      login_logout_columns: [
        { dataField: "id", text: "#", sort: true, filter: textFilter() },
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
          dataField: "ip_address",
          text: "IP Address",
          sort: true,
          filter: textFilter(),
        },
      ],
      locked_columns: [
        { dataField: "ID", text: "#", sort: true, filter: textFilter() },
        {
          dataField: "IP_address",
          text: "IP Address",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "username",
          text: "Username",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "time_stamp",
          text: "Time stamp",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "locked",
          text: "Locked",
          sort: true,

          formatter: (cell, row) => (
            <>
              {row["locked"] ? (
                <RemoveLock
                  reset_filters={this.reset_filters}
                  username={row["username"]}
                />
              ) : (
                ""
              )}
            </>
          ),
        },
      ],
    };
    this.reset_filters = this.reset_filters.bind(this);
    this.change_first_filter = this.change_first_filter.bind(this);
    this.change_selected_user = this.change_selected_user.bind(this);
    this.specific_filter = this.specific_filter.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_ACCESS_HISTORY, {
        headers: headers,
        params: {
          selected_user: this.state.selected_user,
        },
      })
      .then((res) => {
        this.setState({
          locked_entries: res.data.locked_entries,
          login_logout_history: res.data.login_logout_history,
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
      .get(GET_ALL_USERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_users: res.data.all_users,
        });
      });
  }

  reset_filters() {
    window.location.reload();
  }

  specific_filter() {
    this.setState({
      is_loaded: false,
    });
    axios
      .get(GET_ACCESS_HISTORY, {
        headers: headers,
        params: {
          selected_user: this.state.selected_user,
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          locked_entries: res.data.locked_entries,
          login_logout_history: res.data.login_logout_history,
        });
      });
  }

  change_first_filter = (e, { value }) => {
    this.setState({
      first_radio_filter: value,
    });
  };

  change_selected_user = (e) => {
    this.setState({
      selected_user: e.target.innerText,
    });
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("access_history")}
          {this.state.forbidden ? (
            <>{forbidden("Access History")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} stackable divided>
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
                    Filter by Locked / Login-Logout
                  </label>
                  <Form style={{ width: 300 }}>
                    <Form.Field>
                      <Radio
                        label="Locked"
                        name="radioGroup"
                        value="locked"
                        checked={this.state.first_radio_filter === "locked"}
                        onChange={this.change_first_filter}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Login / Logout"
                        name="radioGroup"
                        value="login_logout"
                        checked={
                          this.state.first_radio_filter === "login_logout"
                        }
                        onChange={this.change_first_filter}
                      />
                    </Form.Field>
                  </Form>
                  <div
                    style={{
                      textAlign: "center",
                      width: 300,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  >
                    <span> OR </span>
                  </div>
                  <Autocomplete
                    options={this.state.all_users}
                    onChange={this.change_selected_user}
                    getOptionLabel={(option) => option.username}
                    style={{ width: 300, marginBottom: 20 }}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select user"
                        variant="outlined"
                      />
                    )}
                  />
                  <Button
                    color="orange"
                    disabled={this.state.specific_user === ""}
                    onClick={this.specific_filter}
                  >
                    Filter
                  </Button>
                  <Button onClick={this.reset_filters}> Clear Filters </Button>
                </Grid.Column>
                <Grid.Column width={12} style={{ margin: 20 }}>
                  {this.state.first_radio_filter === "locked" ? (
                    <>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.locked_entries}
                        columns={this.state.locked_columns}
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
                              id="locked_table"
                              pagination={paginationFactory(paginationOptions)}
                              hover
                              bordered={false}
                              striped
                              filter={filterFactory()}
                            />
                          </div>
                        )}
                      </ToolkitProvider>
                    </>
                  ) : (
                    <>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.login_logout_history}
                        columns={this.state.login_logout_columns}
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
                              pagination={paginationFactory(paginationOptions)}
                              hover
                              id="login_logout_table"
                              bordered={false}
                              striped
                              filter={filterFactory()}
                            />
                          </div>
                        )}
                      </ToolkitProvider>
                    </>
                  )}
                </Grid.Column>
              </Grid>
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

export default AccessHistory;
