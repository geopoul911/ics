// Built-ins
import React from "react";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

// Modules / Functions
import axios from "axios";
import { Grid } from "semantic-ui-react";
import { DateRange } from "react-date-range";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import moment from "moment";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import Swal from "sweetalert2";
import { Button } from "semantic-ui-react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { AiFillFilter } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
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
const TYPES = ["Map", "Rooming List", "Itinerary", "Offer"];

window.Swal = Swal;

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

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

const GET_SENT_EMAILS = "http://localhost:8000/api/reports/sent_emails/";
const GET_USERS = "http://localhost:8000/api/view/get_all_users/";

let cross_style = {
  color: "red",
  fontSize: "1em",
};

let tick_style = {
  color: "green",
  fontSize: "1.4em",
};

const NoDataToShow = () => {
  return <img src={NoDataToShowImage} alt={""} className="fill" />;
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
  },
  {
    dataField: "type",
    text: "Type",
    sort: true,
  },
  {
    dataField: "date_sent",
    text: "Date Sent",
    sort: true,
  },
  {
    dataField: "sender",
    text: "Sender",
    sort: true,
  },
  {
    dataField: "recipients",
    text: "Recipients",
    sort: true,
    formatter: (cell, row) => (
      <>
        {row.recipients
          .replace("[", "")
          .replace("]", "")
          .split(",")
          .map((rec) => rec)}
      </>
    ),
  },
  {
    dataField: "subject",
    text: "Subject",
    sort: true,
  },
  {
    dataField: "body",
    text: "Body",
    sort: true,
  },
  {
    dataField: "attached",
    text: "Attached",
    sort: true,
    formatter: (cell, row) => (
      <>
        {row.attached ? (
          <TiTick style={tick_style} />
        ) : (
          <ImCross style={cross_style} />
        )}
      </>
    ),
  },
];

class SentEmails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_users: [],
      is_loaded: false,
      type_filter: "None",
      user_filter: "None",
      date_from: new Date(),
      date_to: new Date(),
      sent_emails: [],
      forbidden: false,
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.filterByAction = this.filterByAction.bind(this);
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
      .get(GET_SENT_EMAILS, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          type_filter: this.state.type_filter,
          user_filter: this.state.user_filter,
        },
      })
      .then((res) => {
        this.setState({
          sent_emails: res.data.sent_emails,
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

  handleSelect(ranges) {
    this.setState({
      date_from: ranges["selection"]["startDate"],
      date_to: ranges["selection"]["endDate"],
    });
    axios
      .get(GET_SENT_EMAILS, {
        headers: headers,
        params: {
          date_from: moment(ranges["selection"]["startDate"]).format(
            "YYYY-MM-DD"
          ),
          date_to: moment(ranges["selection"]["endDate"]).format("YYYY-MM-DD"),
          type_filter: this.state.type_filter,
          user_filter: this.state.user_filter,
        },
      })
      .then((res) => {
        this.setState({
          sent_emails: res.data.sent_emails,
          is_loaded: true,
        });
      });
  }

  filterByAction(e) {
    this.setState({
      type_filter: e.target.value,
    });
    axios
      .get(GET_SENT_EMAILS, {
        headers: headers,
        params: {
          date_from: this.state.date_from,
          date_to: this.state.date_to,
          type_filter: e.target.value,
          user_filter: this.state.user_filter,
        },
      })
      .then((res) => {
        this.setState({
          sent_emails: res.data.sent_emails,
          is_loaded: true,
        });
      });
  }

  filterByUser(e) {
    this.setState({
      user_filter: e.target.value,
    });
    axios
      .get(GET_SENT_EMAILS, {
        headers: headers,
        params: {
          date_from: this.state.date_from,
          date_to: this.state.date_to,
          type_filter: this.state.type_filter,
          user_filter: e.target.value,
        },
      })
      .then((res) => {
        this.setState({
          sent_emails: res.data.sent_emails,
          is_loaded: true,
        });
      });
  }

  render() {
    const selectionRange = {
      startDate: this.state.date_from,
      endDate: this.state.date_to,
      key: "selection",
    };

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("sent_emails")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Sent Emails")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} divided stackable>
                <Grid.Column width={3}>
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
                  <DateRange
                    ranges={[selectionRange]}
                    onChange={this.handleSelect}
                  />
                  <hr />
                  <label style={{ marginLeft: 20 }}>Filter by Type</label>
                  <select
                    className="form-control"
                    defaultValue={"defaultValue"}
                    style={{ width: 300, marginBottom: 10 }}
                    onChange={(e) => this.filterByAction(e)}
                    value={this.state.selected_model}
                  >
                    <option value="None">No Filter</option>
                    {TYPES.map((action) => (
                      <option value={action}>{action}</option>
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
                    data={this.state.sent_emails}
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
                          id="sent_emails_table"
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

export default SentEmails;
