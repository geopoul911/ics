// Built-ins
import React from "react";

// Functions / Modules
import axios from "axios";
import { Grid } from "semantic-ui-react";
import { Table, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-daterange-picker/dist/css/react-calendar.css";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";

// Icons / Images
import { BsFlag } from "react-icons/bs";

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

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const rating_colors_to_flag = {
  G: "green",
  Y: "orange",
  R: "red",
};

const ratingFilterOptions = {
  G: "Good",
  Y: "Medium",
  R: "Bad",
};

const rowStyle = (row) => {
  const style = {};
  if (row.enabled === false) {
    style.color = "red";
  }
  return style;
};

const REPORTS_DRIVER = "http://localhost:8000/api/reports/driver/";
const GET_DRIVERS =
  "http://localhost:8000/api/data_management/all_drivers/";

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "name",
    text: "Name",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => <>{row.name}</>,
  },
  {
    dataField: "address",
    text: "Address",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>{row.address === "None" ? "N/A" : <>{row.address}</>}</>
    ),
  },
  {
    dataField: "rating",
    text: "Rating",
    sort: true,
    filter: selectFilter({
      options: ratingFilterOptions,
    }),
    formatter: (cell, row) => (
      <>
        {row.rating === "None" ? (
          "N/A"
        ) : (
          <>
            <BsFlag
              style={{
                color: rating_colors_to_flag[row.rating],
                fontSize: "1.5em",
                marginRight: "0.5em",
              }}
            />
          </>
        )}
      </>
    ),
  },
];

class ReportsLeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLeader: "",
      driverStats: [],
      active_row: -1,
    };
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
      .get(GET_DRIVERS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
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
  }

  setSelectedLeader(e) {
    this.setState({
      selectedLeader: e.target.parentElement["children"][1].innerText,
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

    axios
      .get(REPORTS_DRIVER, {
        headers: headers,
        params: {
          driver_id: e.target.parentElement["children"][0].innerText,
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          driverStats: res.data.driver_stats,
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

  render() {
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.setSelectedLeader(e);
      },
    };

    const getRowClass = (row, rowIndex) => {
      console.log(row.id);
      if (row.id === this.state.active_row) {
        return "clicked_row";
      }
      return "";
    };

    console.log(this.state.driverStats)

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_driver")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Leader")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid stackable columns={2} divided="vertically">
                <Grid.Column>
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.all_drivers}
                    columns={columns}
                    search
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
                          rowStyle={rowStyle}
                          id="reports_driver_table"
                          filter={filterFactory()}
                          rowEvents={rowEvents}
                          rowClasses={getRowClass}
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                </Grid.Column>

                {this.state.selectedLeader === "" ? (
                  <Alert
                    variant="primary"
                    style={{
                      maxHeight: 50,
                      maxWidth: "50%",
                      margin: "0 auto",
                      marginTop: 20,
                    }}
                  >
                    <b>
                      Click On a driver on the left table, to show related groups.
                    </b>
                  </Alert>
                ) : (
                  <Grid.Column>
                    <Table striped hover id="g_dox_table">
                      <thead>
                        <th>Group Reference</th>
                        <th>Number Of Days</th>
                        <th>Agent</th>
                      </thead>
                      <tbody>
                        {this.state.driverStats.map((row) => (
                          <tr>
                            <td>
                              <a href={"/group_management/group/" + row.reference} target="_blank" rel="noreferrer" basic className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}>
                                {row.reference}
                              </a>
                            </td>
                            <td>{row.number_of_days}</td>
                            <td>{row.agent}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Grid.Column>
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

export default ReportsLeader;
