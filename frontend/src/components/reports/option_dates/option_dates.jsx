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
import { Grid, Form, Radio } from "semantic-ui-react";
import moment from "moment";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
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

const REPORTS_EXPIRING_DOCUMENTS = "http://localhost:8000/api/reports/option_dates/";

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
  },
  {
    dataField: "refcode",
    text: "Refcode",
    sort: true,
  },
  {
    dataField: "hotel",
    text: "Hotel",
    sort: true,
  },
  {
    dataField: "option_date",
    text: "Option Date",
    sort: true,
    formatter: (cell, row) => (
      <>
       {moment(row.option_date).format("DD-MM-YYYY")}
      </>
    ),
  },
  {
    dataField: "date",
    text: "Booking Date",
    sort: true,
    formatter: (cell, row) => (
      <>
       {moment(row.date).format("DD-MM-YYYY")}
      </>
    ),
  },
];

const defaultSorted = [
  {
    dataField: "id",
    order: "option_date",
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

const { SearchBar } = Search;

class ReportsExpiringDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_option_dates: [],
      is_loaded: false,
      filter_by_option_date: "Show All",
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
          filter_by_option_date: this.state.filter_by_option_date,
        },
      })
      .then((res) => {
        this.setState({
          all_option_dates: res.data.all_option_dates,
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

  change_filter_by_option_date = (e, { value }) => {
    this.setState({
      filter_by_option_date: value,
    });
    axios
      .get(REPORTS_EXPIRING_DOCUMENTS, {
        headers: headers,
        params: {
          filter_by_option_date: value,
        },
      })
      .then((res) => {
        this.setState({
          all_option_dates: res.data.all_option_dates,
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

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_option_dates")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Option Dates")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={2} stackable divided>
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
                  <label style={{ marginTop: 20, marginLeft: 20 }}>
                    Filter by Option Date
                  </label>
                  <Form style={{ width: 300 }}>
                    <Form.Field>
                      <Radio
                        label=" Show All"
                        name="radioGroup"
                        value="Show All"
                        checked={this.state.filter_by_option_date === "Show All"}
                        onChange={this.change_filter_by_option_date}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Dates Passed"
                        name="radioGroup"
                        value="Dates Passed"
                        checked={
                          this.state.filter_by_option_date === "Dates Passed"
                        }
                        onChange={this.change_filter_by_option_date}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="Ending Soon"
                        name="radioGroup"
                        value="Ending Soon"
                        checked={
                          this.state.filter_by_option_date === "Ending Soon"
                        }
                        onChange={this.change_filter_by_option_date}
                      />
                    </Form.Field>
                  </Form>
                </Grid.Column>
                <Grid.Column width={12} style={{ margin: 20 }}>
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.all_option_dates}
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
