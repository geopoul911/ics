// Built-ins
import React from "react";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import MiniPieChart from "./mini_pie_chart";
import ApexChart from "./apex_chart";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Modules / Functions
import axios from "axios";
import moment from "moment";
import ListGroup from "react-bootstrap/ListGroup";
import DatePicker from "react-date-picker";
import { Grid, Button } from "semantic-ui-react";
import Swal from "sweetalert2";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from "react-bootstrap-table-next";
import ReactCountryFlag from "react-country-flag";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";

// CSS
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "../../print.css"; // Import the print CSS file

// Icons
import { FaCircle } from "react-icons/fa";
import { FaPrint } from "react-icons/fa";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../global_vars";

// Variables
window.Swal = Swal;

// In case group is cancelled, make row's text red
const rowStyle = (row) => {
  const style = {};
  if (row.status !== "Confirmed") {
    style.color = "red";
  }
  return style;
};

const defaultSorted = [
  {
    dataField: "id",
    order: "desc",
  },
];

const NoDataToShow = () => {
  return (
    <img src={NoDataToShowImage} alt={""} className="fill dox_responsive_img" />
  );
};

const statusFilterOptions = {
  Confirmed: "Confirmed",
  Cancelled: "Cancelled",
};

const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "refcode",
    text: "Refcode",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        <a
          href={"/group_management/group/" + row.refcode}
          basic
          className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
        >
          {row.refcode}
        </a>
      </>
    ),
  },
  {
    dataField: "agent_name",
    text: "Agent / Client",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) =>
      row.agent_or_client === "Agent" ? (
        <>
          <a
            href={"/data_management/agent/" + row.agent_id}
            basic
            id="cell_link"
            className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
          >
            {row.agent_name} ( {row.agent_or_client} )
          </a>
        </>
      ) : (
        <>
          <a
            href={"/data_management/client/" + row.client_id}
            basic
            className={row.status === "Cancelled" ? "cnclled" : "cnfrmed"}
            id="cell_link"
          >
            {row.client_name} ( {row.agent_or_client} )
          </a>
        </>
      ),
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    filter: selectFilter({
      options: statusFilterOptions,
    }),
  },
  {
    dataField: "nationality_code",
    text: "Nationality",
    sort: true,
    filter: textFilter(),
    formatter: (cell, row) => (
      <>
        {row.nationality_code ? (
          <>
            <ReactCountryFlag
              countryCode={row.nationality_code}
              svg
              style={{ width: "2em", height: "2em", marginRight: 10 }}
              title={row.nationality.code}
            />
            {row.nationality_code ? row.nationality_code : "N/A"}
          </>
        ) : (
          "N/A"
        )}
      </>
    ),
  },
  {
    dataField: "number_of_people",
    text: "PAX",
    sort: true,
    filter: textFilter(),
  },
];


const VIEW_GROUP_STATS = "http://localhost:8000/api/reports/group_stats/";

// url path = '/group_stats'
class GroupStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bar_graph_dates: {},
      chart_data: [],
      confirmed_cancelled_per_year_data: [],
      groups_data: "",
      all_groups: [],
      days_data: "",
      services_data: "",
      other_stats_data: "",
      countries_data: [],
      isLoaded: false,
      forbidden: false,
      date_from: new Date(), // show 30 days back
      date_to: new Date(),
      showing: "All",
      statusFilter: "All",
      pie_chart_data: {
        trl: 0,
        trb: 0,
        tra: 0,
      },
      confirmed_cancelled_chart_data: {
        confirmed: 0,
        cancelled: 0,
      },
      five_most_used_countries: {},
    };
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios
      .get(VIEW_GROUP_STATS, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          showing: this.state.showing,
          isLoaded: false,
        },
      })
      .then((res) => {
        this.setState({
          bar_graph_dates: res.data.bar_graph_dates,
          groups_data: res.data.groups_data,
          days_data: res.data.days_data,
          other_stats_data: res.data.other_stats_data,
          services_data: res.data.services_data,
          isLoaded: true,
          pie_chart_data: res.data.pie_chart_data,
          confirmed_cancelled_chart_data:
            res.data.confirmed_cancelled_chart_data,
          most_used_countries_data: res.data.most_used_countries_data,
          five_most_used_countries: res.data.five_most_used_countries,
          all_groups: res.data.all_groups,
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

  setShowing(office) {
    this.setState({
      showing: office,
    });
    axios
      .get(VIEW_GROUP_STATS, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          showing: office,
        },
      })
      .then((res) => {
        this.setState({
          bar_graph_dates: res.data.bar_graph_dates,
          groups_data: res.data.groups_data,
          all_groups: res.data.all_groups,
          days_data: res.data.days_data,
          other_stats_data: res.data.other_stats_data,
          pie_chart_data: res.data.pie_chart_data,
          confirmed_cancelled_chart_data:
            res.data.confirmed_cancelled_chart_data,
          most_used_countries_data: res.data.most_used_countries_data,
          five_most_used_countries: res.data.five_most_used_countries,
          isLoaded: true,
        });
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

  setStatusFilter(status) {
    this.setState({
      statusFilter: status,
      isLoaded: false
    });
    
    axios
      .get(VIEW_GROUP_STATS, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          showing: this.state.showing,
          status_filter: status // Add status filter parameter
        },
      })
      .then((res) => {
        this.setState({
          bar_graph_dates: res.data.bar_graph_dates,
          groups_data: res.data.groups_data,
          days_data: res.data.days_data,
          other_stats_data: res.data.other_stats_data,
          services_data: res.data.services_data,
          isLoaded: true,
          pie_chart_data: res.data.pie_chart_data,
          confirmed_cancelled_chart_data: res.data.confirmed_cancelled_chart_data,
          most_used_countries_data: res.data.most_used_countries_data,
          five_most_used_countries: res.data.five_most_used_countries,
          all_groups: res.data.all_groups,
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

  handlePrint = () => {
    window.print();
  };

  showResults() {
    this.setState({
      isLoaded: false,
    });
    axios
      .get(VIEW_GROUP_STATS, {
        headers: headers,
        params: {
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          showing: this.state.showing,
        },
      })
      .then((res) => {
        this.setState({
          bar_graph_dates: res.data.bar_graph_dates,
          groups_data: res.data.groups_data,
          days_data: res.data.days_data,
          other_stats_data: res.data.other_stats_data,
          services_data: res.data.services_data,
          isLoaded: true,
          pie_chart_data: res.data.pie_chart_data,
          confirmed_cancelled_chart_data: res.data.confirmed_cancelled_chart_data,
          most_used_countries_data: res.data.most_used_countries_data,
          five_most_used_countries: res.data.five_most_used_countries,
          all_groups: res.data.all_groups,
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
    let bar_dates = [];
    let bar_groups = [];

    Object.values(this.state.bar_graph_dates).map((date) =>
      bar_dates.push(Object.values(date)[0])
    );
    Object.values(this.state.bar_graph_dates).map((date) =>
      bar_groups.push(Object.keys(date)[0])
    );

    const officeBasedData = [
      {
        title: "TRL",
        value: this.state.pie_chart_data["trl"],
        color: "#de2110",
      },
      {
        title: "TRB",
        value: this.state.pie_chart_data["trb"],
        color: "#aa381e",
      },
      {
        title: "TRA",
        value: this.state.pie_chart_data["tra"],
        color: "#1269C7",
      },
      {
        title: "COA",
        value: this.state.pie_chart_data["coa"],
        color: "#4a433e",
      },
      {
        title: "COL",
        value: this.state.pie_chart_data["col"],
        color: "#d95c09",
      },
    ];

    const confirmedCancelledData = [
      {
        title: "Confirmed",
        value: this.state.confirmed_cancelled_chart_data["confirmed"],
        color: "green",
      },
      {
        title: "Cancelled",
        value: this.state.confirmed_cancelled_chart_data["cancelled"],
        color: "red",
      },
    ];

    const mostUsedCountriesData = this.state.isLoaded
      ? [
          {
            title: Object.keys(this.state.most_used_countries_data)[0],
            value:
              this.state.most_used_countries_data[
                Object.keys(this.state.most_used_countries_data)[0]
              ],
            color: "#0082FF",
          },
          {
            title: Object.keys(this.state.most_used_countries_data)[1],
            value:
              this.state.most_used_countries_data[
                Object.keys(this.state.most_used_countries_data)[1]
              ],
            color: "#6F0070",
          },
          {
            title: Object.keys(this.state.most_used_countries_data)[2],
            value:
              this.state.most_used_countries_data[
                Object.keys(this.state.most_used_countries_data)[2]
              ],
            color: "#FF8000",
          },
          {
            title: Object.keys(this.state.most_used_countries_data)[3],
            value:
              this.state.most_used_countries_data[
                Object.keys(this.state.most_used_countries_data)[3]
              ],
            color: "#700001",
          },
          {
            title: Object.keys(this.state.most_used_countries_data)[4],
            value:
              this.state.most_used_countries_data[
                Object.keys(this.state.most_used_countries_data)[4]
              ],
            color: "#003970",
          },
        ]
      : [];


    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("group_stats")}
          {this.state.forbidden ? (
            <>{forbidden("Updates")}</>
          ) : this.state.isLoaded ? (
            <>
              <Grid columns={2}>
                <Grid.Column width={3} style={{marginLeft: 20}}>
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
                </Grid.Column>
                <Grid.Column width={12} style={{margin: 0, padding: 0, display: 'flex'}}>
                  <ApexChart
                    bar_dates={bar_dates}
                    bar_groups={bar_groups}
                    key={bar_dates}
                  />
                </Grid.Column>
              </Grid>
              <hr />
              <div style={{ margin: 20, padding: 20 }}>
                <div style={{ marginBottom: 20 }}>
                  <Button
                    color={this.state.statusFilter === "All" ? "green" : ""}
                    onClick={() => this.setStatusFilter("All")}
                  >
                    All
                  </Button>
                  <Button
                    color={this.state.statusFilter === "Confirmed" ? "green" : ""}
                    onClick={() => this.setStatusFilter("Confirmed")}
                  >
                    Confirmed
                  </Button>
                  <Button
                    color={this.state.statusFilter === "Cancelled" ? "green" : ""}
                    onClick={() => this.setStatusFilter("Cancelled")}
                  >
                    Cancelled
                  </Button>
                </div>
                <Grid columns={4} stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <ListGroup>
                        <label className="group_stats_tab_label">Groups</label>
                        <ListGroup.Item>
                          Total amount of Groups :
                          {this.state.groups_data["total_amount_of_groups"]}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Confirmed / Cancelled :
                          {this.state.groups_data["total_confirmed_groups"]} /
                          {this.state.groups_data["total_cancelled_groups"]}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Last group created :
                          {this.state.groups_data["last_group_created"]}
                        </ListGroup.Item>
                      </ListGroup>
                    </Grid.Column>
                    <Grid.Column>
                      <ListGroup>
                        <label className="group_stats_tab_label">Days</label>
                        <ListGroup.Item>
                          Total amount of travel days :
                          {this.state.days_data["total_amount_of_days"]}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Average Travel days :
                          {this.state.days_data["avg_traveldays_per_group"]}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Latest Travel day added :
                          {this.state.days_data["last_travelday_added"]}
                        </ListGroup.Item>
                      </ListGroup>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
              <br />
              <hr />
              <div style={{ marginLeft: 20 }}>
                <Grid columns={6} divided id="group_stats_grid" stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <label className="pie_chart_label"> Office based</label>
                      {this.state.pie_chart_data["trl"] > 0 ||
                      this.state.pie_chart_data["trb"] > 0 ||
                      this.state.pie_chart_data["tra"] > 0 ||
                      this.state.pie_chart_data["coa"] > 0 ||
                      this.state.pie_chart_data["col"] > 0 ? (
                        <MiniPieChart
                          id="office_based_pie_chart"
                          data={officeBasedData}
                          animate
                        />
                      ) : (
                        <img src={NoDataToShowImage} alt={""} />
                      )}
                    </Grid.Column>

                    <Grid.Column>
                      <ul className="pie_chart_ul">
                        {this.state.pie_chart_data["trl"] > 0 ?
                          <li>
                            <FaCircle style={{ color: "#de2110", marginRight: 20 }} />
                            TRL: {this.state.pie_chart_data["trl"]}
                            <hr />
                          </li>
                          :
                          ''
                        }
                        {this.state.pie_chart_data["trb"] > 0 ?
                          <li>
                            <FaCircle style={{ color: "#aa381e", marginRight: 20 }} />
                            TRB: {this.state.pie_chart_data["trb"]}
                            <hr />
                          </li>
                          :
                          ''
                        }
                        {this.state.pie_chart_data["tra"] > 0 ?
                          <li>
                            <FaCircle style={{ color: "#1269C7", marginRight: 20 }} />
                            TRA: {this.state.pie_chart_data["tra"]}
                            <hr />
                          </li>
                          :
                          ''
                        }
                        {this.state.pie_chart_data["coa"] > 0 ?
                          <li>
                            <FaCircle style={{ color: "#4a433e", marginRight: 20 }} />
                            COA: {this.state.pie_chart_data["coa"]}
                            <hr />
                          </li>
                          :
                          ''
                        }
                        {this.state.pie_chart_data["col"] > 0 ?
                          <li>
                            <FaCircle style={{ color: "#d95c09", marginRight: 20 }} />
                            COL: {this.state.pie_chart_data["col"]}
                            <hr />
                          </li>
                          :
                          ''
                        }
                      </ul>
                    </Grid.Column>

                    <Grid.Column>
                      <label className="pie_chart_label">
                        Confirmed / Cancelled
                      </label>
                      {this.state.confirmed_cancelled_chart_data[
                        "confirmed"
                      ] !== 0 ||
                      this.state.confirmed_cancelled_chart_data["cancelled"] !==
                        0 ? (
                        <MiniPieChart
                          id="country_based_pie_chart"
                          data={confirmedCancelledData}
                          animate
                        />
                      ) : (
                        <img src={NoDataToShowImage} alt={""} />
                      )}
                    </Grid.Column>
                    <Grid.Column>
                      <ul className="pie_chart_ul">
                        <li>
                          <FaCircle
                            style={{ color: "green", marginRight: 20 }}
                          />
                          Confirmed :
                          {
                            this.state.confirmed_cancelled_chart_data[
                              "confirmed"
                            ]
                          }
                          <hr />
                        </li>
                        <li>
                          <FaCircle style={{ color: "red", marginRight: 20 }} />
                          Cancelled :
                          {
                            this.state.confirmed_cancelled_chart_data[
                              "cancelled"
                            ]
                          }
                        </li>
                      </ul>
                    </Grid.Column>
                    <Grid.Column>
                      <label className="pie_chart_label">
                        Most used Countries
                      </label>
                      {Object.values(mostUsedCountriesData).every(
                        (item) => item["value"] === 0
                      ) ? (
                        <img src={NoDataToShowImage} alt={""} />
                      ) : (
                        <MiniPieChart
                          id="confirmed_cancelled_pie_chart"
                          data={mostUsedCountriesData}
                          animate
                        />
                      )}
                    </Grid.Column>
                    <Grid.Column>


                      <ul className="pie_chart_ul">
                        {Object.values(mostUsedCountriesData).every(
                          (item) => item["value"] === 0
                        ) ? (
                          <></>
                        ) : (
                          <>
                            {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[4]] > 0 ? 
                              <li>
                                <FaCircle style={{ color: "#003970", marginRight: 20 }}/>
                                {Object.keys(this.state.most_used_countries_data)[4]}
                                :
                                {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[4]]}
                                <hr />
                              </li>
                              :
                              ''
                            }

                            {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[3]] > 0 ? 
                              <li>
                                <FaCircle style={{ color: "#700001", marginRight: 20 }}/>
                                {Object.keys(this.state.most_used_countries_data)[3]}
                                :
                                {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[3]]}
                                <hr />
                              </li>
                              :
                              ''
                            }


                            {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[2]] > 0 ? 
                              <li>
                                <FaCircle style={{ color: "#FF8000", marginRight: 20 }}/>
                                {Object.keys(this.state.most_used_countries_data)[2]}
                                :
                                {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[2]]}
                                <hr />
                              </li>
                              :
                              ''
                            }

                            {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[1]] > 0 ? 
                              <li>
                                <FaCircle style={{ color: "#6F0070", marginRight: 20 }}/>
                                {Object.keys(this.state.most_used_countries_data)[1]}
                                :
                                {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[1]]}
                                <hr />
                              </li>
                              :
                              ''
                            }

                            {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[0]] > 0 ? 
                              <li>
                                <FaCircle style={{ color: "#0082FF", marginRight: 20 }}/>
                                {Object.keys(this.state.most_used_countries_data)[0]}
                                :
                                {this.state.most_used_countries_data[Object.keys(this.state.most_used_countries_data)[0]]}
                                <hr />
                              </li>
                              :
                              ''
                            }
                          </>
                        )}
                      </ul>


                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <div style={{ margin: 20 }}>
                  <Button
                    color={this.state.showing === "All" ? "green" : ""}
                    onClick={() => this.setShowing("All")}
                  >
                    All
                  </Button>
                  <Button
                    color={this.state.showing === "COA" ? "green" : ""}
                    onClick={() => this.setShowing("COA")}
                  >
                    COA
                  </Button>
                  <Button
                    color={this.state.showing === "COL" ? "green" : ""}
                    onClick={() => this.setShowing("COL")}
                  >
                    COL
                  </Button>
                </div>

                <ToolkitProvider
                  keyField="id"
                  data={this.state.all_groups.filter((group) => {
                    // First filter by refcode prefix
                    const refcodeMatch = this.state.showing === "All" || group.refcode.startsWith(this.state.showing);
                    // Then filter by status
                    const statusMatch = this.state.statusFilter === "All" || group.status === this.state.statusFilter;
                    return refcodeMatch && statusMatch;
                  })}
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
                      <div style={{ overflow: "x:auto" }}>
                        <BootstrapTable
                          id="all_groups_table"
                          {...props.baseProps}
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
                <Button style={{ margin: 20 }} onClick={this.handlePrint}>
                  <FaPrint style={{ color: "red" }} /> Print
                </Button>
              </div>
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

export default GroupStats;
