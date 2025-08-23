// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";

// Modules / Functions
import axios from "axios";
import { Grid, Button, Form, Radio } from "semantic-ui-react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Swal from "sweetalert2";
import moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider from "react-bootstrap-table2-toolkit";

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
  pageHeader,
  loader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

window.Swal = Swal;

const GET_CONFLICTS = "http://localhost:8000/api/site_admin/conflicts/";
const GET_ALL_DRIVERS = "http://localhost:8000/api/view/get_all_drivers/";
const GET_ALL_COACHES = "http://localhost:8000/api/view/get_all_coaches/";
const VALIDATE_CONFLICT = "http://localhost:8000/api/site_admin/validate_conflict/";

class Conflicts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false,
      first_radio_filter: "all", // login_logout, locked,
      all_conflicts: [],
      driver_conflicts: [],
      coach_conflicts: [],
      all_drivers: [],
      all_coaches: [],
      selected_driver: "",
      selected_coach: "",
      forbidden: false,
      columns: [
        {
          // # 1 ID
          dataField: "td_id",
          text: "Travel Day ID",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "refcode",
          text: "Group Refcode",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              <Button href={"/group_management/group/" + row.refcode} basic id="cell_link">
                {row.refcode}
              </Button>
            </>
          ),
        },
        {
          dataField: "date",
          text: "Date",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => <> {moment(cell).format("DD/MM/yyyy")} </>,
        },
        {
          dataField: "driver_coach_name",
          text: "Driver/Coach",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "td_id",
          text: "Invalid",
          sort: true,
          formatter: (cell, row) => (
            <>
              <Button color="red" onClick={() => this.validate_entry(row["td_id"])}>
                Validate
              </Button>
            </>
          ),
        },
      ],
    };
    this.reset_filters = this.reset_filters.bind(this);
    this.change_first_filter = this.change_first_filter.bind(this);
    this.specific_filter = this.specific_filter.bind(this);
    this.validate_entry = this.validate_entry.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(GET_ALL_DRIVERS, {
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
    axios
      .get(GET_ALL_COACHES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_coaches: res.data.all_coaches,
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
      .get(GET_CONFLICTS, {
        headers: headers,
        params: {
          selected_driver: this.state.selected_driver,
          selected_coach: this.state.selected_coach,
        },
      })
      .then((res) => {
        this.setState({
          all_conflicts: res.data.all_conflicts,
          driver_conflicts: res.data.driver_conflicts,
          coach_conflicts: res.data.coach_conflicts,
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

  change_selected_driver = (e) => {
    this.setState({
      selected_driver: e.target.innerText,
      selected_coach: "",
    });
  };

  change_selected_coach = (e) => {
    this.setState({
      selected_driver: "",
      selected_coach: e.target.innerText,
    });
  };

  reset_filters() {
    window.location.reload();
  }

  specific_filter() {
    this.setState({
      is_loaded: false,
    });
    axios.get(GET_CONFLICTS, {
      headers: headers,
      params: {
        selected_driver: this.state.selected_driver,
        selected_coach: this.state.selected_coach,
      },
    })
    .then((res) => {
      this.setState({
        all_conflicts: res.data.all_conflicts,
        driver_conflicts: res.data.driver_conflicts,
        coach_conflicts: res.data.coach_conflicts,
        is_loaded: true,
      });
    });
  }

  change_first_filter = (e, { value }) => {
    this.setState({
      first_radio_filter: value,
    });
  };

  validate_entry(e) {
    axios({
      method: "post",
      url: VALIDATE_CONFLICT,
      headers: headers,
      data: {
        td_id: e,
      },
    });
  axios
    .get(GET_CONFLICTS, {
      headers: headers,
      params: {
        selected_driver: this.state.selected_driver,
        selected_coach: this.state.selected_coach,
      },
    })
    .then((res) => {
      this.setState({
        all_conflicts: res.data.all_conflicts,
        driver_conflicts: res.data.driver_conflicts,
        coach_conflicts: res.data.coach_conflicts,
        is_loaded: true,
      });
      window.location.reload();
    });
  }

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("conflicts")}
          {this.state.forbidden ? (
            <>{forbidden("Conflicts")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column width={3} style={{ marginTop: 10, marginLeft: 20 }}>
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
                  <Form style={{ width: 300 }}>
                    <Form.Field>
                      <Radio
                        label="All"
                        name="radioGroup"
                        value="all"
                        checked={this.state.first_radio_filter === "all"}
                        onChange={this.change_first_filter}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Driver Conflicts"
                        name="radioGroup"
                        value="driver"
                        checked={this.state.first_radio_filter === "driver"}
                        onChange={this.change_first_filter}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Coach Conflicts"
                        name="radioGroup"
                        value="coach"
                        checked={this.state.first_radio_filter === "coach"}
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
                  {this.state.first_radio_filter === "all" ? (
                    <>
                      <Autocomplete
                        style={{ width: 300, marginBottom: 20 }}
                        disabled
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select driver/coach to activate dropdown"
                            variant="outlined"
                          />
                        )}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.state.first_radio_filter === "driver" ? (
                    <>
                      <Autocomplete
                        options={this.state.all_drivers}
                        className={"select_place"}
                        onChange={this.change_selected_driver}
                        getOptionLabel={(option) =>
                          option.id +
                          ") " +
                          option.name +
                          "--" +
                          option.coach_operator
                        }
                        style={{ width: 300, marginBottom: 20 }}
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select driver"
                            variant="outlined"
                          />
                        )}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {this.state.first_radio_filter === "coach" ? (
                    <>
                      <Autocomplete
                        options={this.state.all_coaches}
                        className={"select_place"}
                        onChange={this.change_selected_coach}
                        getOptionLabel={(option) =>
                          option.id +
                          ") " +
                          option.name +
                          "--" +
                          option.coach_operator +
                          "--" +
                          option.plate_number
                        }
                        style={{ width: 300, marginBottom: 20 }}
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select coach"
                            variant="outlined"
                          />
                        )}
                      />
                    </>
                  ) : (
                    <></>
                  )}
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
                  {this.state.first_radio_filter === "all" ? (
                    <>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.all_conflicts}
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
                            <BootstrapTable
                              {...props.baseProps}
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
                    ""
                  )}
                  {this.state.first_radio_filter === "driver" ? (
                    <>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.driver_conflicts}
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
                            <BootstrapTable
                              {...props.baseProps}
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
                    ""
                  )}
                  {this.state.first_radio_filter === "coach" ? (
                    <>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.coach_conflicts}
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
                            <BootstrapTable
                              {...props.baseProps}
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
                    ""
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

export default Conflicts;
