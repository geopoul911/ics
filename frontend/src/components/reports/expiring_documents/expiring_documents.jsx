// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Icons / Images
import { AiFillFilter } from "react-icons/ai";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Modules / Functions
import axios from "axios";
import { Grid, Button, Form, Radio } from "semantic-ui-react";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

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

const GET_ALL_DRIVERS = "http://localhost:8000/api/view/get_all_drivers/";
const GET_ALL_COACHES = "http://localhost:8000/api/view/get_all_coaches/";

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
  },
  {
    dataField: "file_name",
    text: "File Name",
    sort: true,
  },
  {
    dataField: "type",
    text: "Type",
    sort: true,
  },
  {
    dataField: "expiry_date",
    text: "Exp. Date",
    sort: true,
  },
  {
    dataField: "driver_coach",
    text: "Driver / Coach",
    sort: true,
  },
  {
    dataField: "driver_coach",
    text: "Name",
    sort: true,
    formatter: (cell, row) => (
      <>
        {row["driver_coach"] === "Coach" ? (
          <a href={"/data_management/coach/" + row["coach_id"]}>
            {row["coach"]}
          </a>
        ) : (
          <a href={"/data_management/driver/" + row["driver_id"]}>
            {row["driver"]}
          </a>
        )}
      </>
    ),
  },
  {
    dataField: "time_stamp",
    text: "Last updated",
    sort: true,
  },
  {
    dataField: "size",
    text: "File Size",
    sort: true,
    formatter: (cell, row) => <>{renderSize(row["size"])}</>,
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

let action_style = {
  green: "#d1e7dd",
  orange: "#fff3cd",
  red: "#f8d7da",
};

const rowStyle = (row, rowIndex) => {
  const style = {};
  style.backgroundColor = action_style[row.color];
  return style;
};

const REPORTS_EXPIRING_DOCUMENTS =
  "http://localhost:8000/api/reports/expiring_documents/";

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

function renderSize(size) {
  if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + " KB";
  } else {
    return size + " B";
  }
}

class ReportsExpiringDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_expiring_documents: [],
      all_drivers: [],
      all_coaches: [],
      selected_object: "",
      is_loaded: false,
      filter_by_object: "Show All",
      filter_by_exp_date: "Show All",
      forbidden: false,
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(REPORTS_EXPIRING_DOCUMENTS, {
        headers: headers,
        params: {
          filter_by_object: this.state.filter_by_object,
          filter_by_exp_date: this.state.filter_by_exp_date,
          selected_object: this.state.selected_object,
        },
      })
      .then((res) => {
        this.setState({
          all_expiring_documents: res.data.documents,
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
    axios
      .get(GET_ALL_DRIVERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_drivers: res.data.all_drivers,
        });
      });
    axios
      .get(GET_ALL_COACHES, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          all_coaches: res.data.all_coaches,
        });
      });
  }

  change_filter_by_object = (e, { value }) => {
    this.setState({
      filter_by_object: value,
    });
    axios
      .get(REPORTS_EXPIRING_DOCUMENTS, {
        headers: headers,
        params: {
          filter_by_object: value,
          filter_by_exp_date: this.state.filter_by_exp_date,
          selected_object: this.state.selected_object,
        },
      })
      .then((res) => {
        this.setState({
          all_expiring_documents: res.data.documents,
          is_loaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  };

  change_filter_by_exp_date = (e, { value }) => {
    this.setState({
      filter_by_exp_date: value,
    });
    axios
      .get(REPORTS_EXPIRING_DOCUMENTS, {
        headers: headers,
        params: {
          filter_by_object: this.state.filter_by_object,
          filter_by_exp_date: value,
          selected_object: this.state.selected_object,
        },
      })
      .then((res) => {
        this.setState({
          all_expiring_documents: res.data.documents,
          is_loaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  };

  filter_by_specific_object = (e, { value }) => {
    this.setState({
      specific_object: value,
    });
    axios
      .get(REPORTS_EXPIRING_DOCUMENTS, {
        headers: headers,
        params: {
          filter_by_object: this.state.filter_by_object,
          filter_by_exp_date: this.state.filter_by_exp_date,
          selected_object: this.state.selected_object,
        },
      })
      .then((res) => {
        this.setState({
          all_expiring_documents: res.data.documents,
          is_loaded: true,
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error status 401",
          text: e.response.data.errormsg,
        });
      });
  };

  change_selected_object = (e) => {
    this.setState({
      selected_object: e.target.innerText,
    });
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_expiring_documents")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Expiring Documents")}</>
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
                    Filter by Driver / Coach
                  </label>
                  <Form style={{ width: 300 }}>
                    <Form.Field>
                      <Radio
                        label="Show All"
                        name="radioGroup"
                        value="Show All"
                        checked={this.state.filter_by_object === "Show All"}
                        onChange={this.change_filter_by_object}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Driver"
                        name="radioGroup"
                        value="Driver"
                        checked={this.state.filter_by_object === "Driver"}
                        onChange={this.change_filter_by_object}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Coach"
                        name="radioGroup"
                        value="Coach"
                        checked={this.state.filter_by_object === "Coach"}
                        onChange={this.change_filter_by_object}
                      />
                    </Form.Field>
                  </Form>

                  <label style={{ marginTop: 20, marginLeft: 20 }}>
                    Filter by Expiration Date
                  </label>
                  <Form style={{ width: 300 }}>
                    <Form.Field>
                      <Radio
                        label=" Show All"
                        name="radioGroup"
                        value="Show All"
                        checked={this.state.filter_by_exp_date === "Show All"}
                        onChange={this.change_filter_by_exp_date}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Expired Documents"
                        name="radioGroup"
                        value="Expired Documents"
                        checked={
                          this.state.filter_by_exp_date === "Expired Documents"
                        }
                        onChange={this.change_filter_by_exp_date}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Expiring Soon"
                        name="radioGroup"
                        value="Expiring Soon"
                        checked={
                          this.state.filter_by_exp_date === "Expiring Soon"
                        }
                        onChange={this.change_filter_by_exp_date}
                      />
                    </Form.Field>
                  </Form>

                  <label style={{ marginTop: 20, marginLeft: 20 }}>
                    Filter By Specific Driver / Coach
                  </label>

                  <Autocomplete
                    disabled={this.state.filter_by_object === "Show All"}
                    options={
                      this.state.filter_by_object === "Driver"
                        ? this.state.all_drivers
                        : this.state.all_coaches
                    }
                    onChange={this.change_selected_object}
                    getOptionLabel={
                      this.state.filter_by_object === "Driver"
                        ? (option) => option.id + ") " + option.name
                        : (option) =>
                            option.id +
                            ") " +
                            option.name +
                            " - " +
                            option.plate_number
                    }
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
                    onClick={this.filter_by_specific_object}
                    id="filter_btn_exp_docs"
                  >
                    Filter
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Clear Filters
                  </Button>
                </Grid.Column>
                <Grid.Column width={12} style={{ margin: 20 }}>
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.all_expiring_documents}
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

export default ReportsExpiringDocuments;
