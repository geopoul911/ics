// Built-ins
import React from "react";

// Functions / Modules
import { DateRangePicker } from "react-date-range";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Accordion, Icon } from "semantic-ui-react";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
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
import ChangeAirportDistance from "../../modals/change_airport_distance";
import ApexChart from "./apex_chart";

// Icons / Images
import { FaCircle } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { HiOutlineDocumentReport } from "react-icons/hi";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
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

const REPORTS_COACH_OPERATOR = "http://localhost:8000/api/reports/coach_operator/";
const GET_ALL_AGENTS = "http://localhost:8000/api/view/get_all_coach_operators/";

const columns = [
  { dataField: "period", text: "Period", sort: true },
  {
    dataField: "reference",
    text: "Refcode",
    sort: true,
    formatter: (cell, row) => (
      <>
        <Button href={"/group_management/group/" + row.reference} basic id="cell_link">
          {row.reference}
        </Button>
      </>
    ),
  },
  { dataField: "arrival", text: "Arrival", sort: true },
  { dataField: "departure", text: "Departure", sort: true },
  { dataField: "group_days", text: "Group days", sort: true },
  { dataField: "working_days", text: "Working days", sort: true },
  { dataField: "PAX", text: "PAX", sort: true },
];

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

class ReportsCoachOperator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_coach_operators: [],
      selected_coach_operator: "",
      is_loaded: false,
      date_from: new Date() - 1000 * 60 * 60 * 24 * 30,
      date_to: new Date(),
      total_groups: 0,
      total_number_of_people: 0,
      people_per_group: 0,
      days_of_work: 0,
      selected_period_groups: [],
      show_tabs: false,
      pie_chart_data: {
        london_based_groups: 0,
        beijing_based_groups: 0,
        athens_based_groups: 0,
        coa_based_groups: 0,
        col_based_groups: 0,
      },
      confirmed_cancelled_chart_data: {
        confirmed: 0,
        cancelled: 0,
      },
      empty_km_table_data: [],
      show_empty_km_table: false,
      activeAccordionIndex: 100,
      total_empty_km: 0,
      total_groups_all: 0,
      total_people_all: 0,
      people_per_group_all: 0,
      top_100_coach_operators: [],
      all_coach_reports: [],
      forbidden: false,
    };
    this.modify_selected_coach_operator = this.modify_selected_coach_operator.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.show_report = this.show_report.bind(this);
    this.handle_empty_km_accordion = this.handle_empty_km_accordion.bind(this);
    this.handleAccordionCoach = this.handleAccordionCoach.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    axios.get(GET_ALL_AGENTS, {
      headers: headers,
    })
    .then((res) => {
      this.setState({
        all_coach_operators: res.data.all_coach_operators,
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

  modify_selected_coach_operator(e) {
    this.setState({
      selected_coach_operator: e.target.innerText,
    });
  }

  handleSelect(ranges) {
    this.setState({
      date_from: ranges["selection"]["startDate"],
      date_to: ranges["selection"]["endDate"],
    });
  }

  handle_empty_km_accordion() {
    this.setState((prevState) => ({
      show_empty_km_table: !prevState.show_empty_km_table,
    }));
  }

  handleAccordionCoach = (e, titleProps) => {
    const { index } = titleProps;
    const { activeAccordionIndex } = this.state;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    this.setState({ activeAccordionIndex: newIndex });
  };

  show_report() {
    this.setState({
      show_tabs: true,
      is_loaded: false,
    });
    axios
      .get(REPORTS_COACH_OPERATOR, {
        headers: headers,
        params: {
          selected_coach_operator: this.state.selected_coach_operator,
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          total_groups: res.data.total_groups,
          total_number_of_people: res.data.total_number_of_people,
          people_per_group: res.data.people_per_group,
          days_of_work: res.data.days_of_work,
          selected_period_groups: res.data.selected_period_groups,
          all_coach_operators_groups: res.data.all_coach_operators_groups,
          all_coach_operators_people: res.data.all_coach_operators_people,
          all_coach_operators_people_per_group: res.data.all_coach_operators_people_per_group,
          pie_chart_data: res.data.pie_chart_data,
          confirmed_cancelled_chart_data: res.data.confirmed_cancelled_chart_data,
          empty_km_table_data: res.data.empty_km_table_data,
          total_empty_km: res.data.total_empty_km,
          total_groups_all: res.data.total_groups_all,
          total_people_all: res.data.total_people_all,
          people_per_group_all: res.data.people_per_group_all,
          all_coach_reports: res.data.all_coach_reports,
          top_100_coach_operators: [...res.data.top_100_coach_operators],
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

    const officeBasedData = [
      {
        title: "TRL",
        value: this.state.pie_chart_data["london_based_groups"],
        color: "#de2110",
      },
      {
        title: "TRB",
        value: this.state.pie_chart_data["beijing_based_groups"],
        color: "#aa381e",
      },
      {
        title: "TRA",
        value: this.state.pie_chart_data["athens_based_groups"],
        color: "#1269C7",
      },
      {
        title: "COA",
        value: this.state.pie_chart_data["coa_based_groups"],
        color: "#D76E2B",
      },
      {
        title: "COL",
        value: this.state.pie_chart_data["col_based_groups"],
        color: "#58595C",
      },
    ];

    const confirmedCancelledData = [
      {
        title: "Confirmed",
        value: this.state.confirmed_cancelled_chart_data["confirmed"],
        color: "#006600",
      }, // Greek Blue
      {
        title: "Cancelled",
        value: this.state.confirmed_cancelled_chart_data["cancelled"],
        color: "red",
      }, // China Red
    ];

    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_coach_operator")}
          {this.state.forbidden ? (<>{forbidden("Reports Coach Operator")}</>) : this.state.is_loaded ? (
            <>
              <Grid columns={12} stackable divided>
                <Grid.Column width={6}>
                  <DateRangePicker ranges={[selectionRange]} onChange={this.handleSelect}/>
                </Grid.Column>
                <Grid.Column width={4}>
                  <div id="select_coach_operator_report">
                    <Alert variant={"primary"} style={{ textAlign: "center" }}>
                      Please select an coach operator to view his report
                    </Alert>
                    <Autocomplete
                      options={this.state.all_coach_operators}
                      onChange={this.modify_selected_coach_operator}
                      getOptionLabel={(option) => option.id + ") " + option.name}
                      style={{ width: "100%" }}
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select coach operator"
                          variant="outlined"
                        />
                      )}
                    />
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                      {this.state.selected_coach_operator &&
                      this.state.show_tabs ? (
                        <>
                          <b>Currently showing results for:</b>
                          <hr />
                          Coach Operator: {this.state.selected_coach_operator}
                          <hr />
                          Date from:
                          {moment(this.state.date_from).format("DD-MM-YYYY")}
                          <hr />
                          Date to:
                          {moment(this.state.date_to).format("DD-MM-YYYY")}
                        </>
                      ) : (
                        <>
                          <b>No selected coach operator.</b>
                        </>
                      )}
                    </div>
                    <Button
                      color="blue"
                      id="show_results_button"
                      style={{ marginTop: this.state.show_tabs ? 30 : 150, textAlign: "center", width: "100%" }}
                      disabled={!this.state.selected_coach_operator}
                      onClick={this.show_report}
                    >
                      Show results
                    </Button>
                  </div>
                </Grid.Column>
                <Grid.Column width={3} style={{ maxHeight: 200 }}>
                  <Alert variant={"info"} style={{ textAlign: "center" }}>
                    Office based groups
                  </Alert>
                  {this.state.selected_coach_operator && this.state.show_tabs ? (
                    <>
                      <ul>
                        <li>
                          <FaCircle style={{ color: "#de2110", marginRight: 20 }}/> TRL:
                          {this.state.pie_chart_data["london_based_groups"] > 0 ? this.state.pie_chart_data["london_based_groups"] : 0}
                        </li>
                        <li>
                          <FaCircle style={{ color: "#aa381e", marginRight: 20 }} /> TRB:
                          {this.state.pie_chart_data["beijing_based_groups"] > 0 ? this.state.pie_chart_data["beijing_based_groups"] : 0}
                        </li>
                        <li>
                          <FaCircle style={{ color: "#1269C7", marginRight: 20 }} /> TRA:
                          {this.state.pie_chart_data["athens_based_groups"] > 0 ? this.state.pie_chart_data["athens_based_groups"] : 0}
                        </li>
                        <li>
                          <FaCircle style={{ color: "#D76E2B", marginRight: 20 }} /> COA:
                          {this.state.pie_chart_data["coa_based_groups"] > 0 ? this.state.pie_chart_data["coa_based_groups"] : 0}
                        </li>
                        <li>
                          <FaCircle style={{ color: "#58595C", marginRight: 20 }}/>
                          COL: {this.state.pie_chart_data["col_based_groups"] > 0 ? this.state.pie_chart_data["col_based_groups"] : 0}
                        </li>
                      </ul>
                      <MiniPieChart data={officeBasedData} animate />
                    </>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <b>No data to show</b>
                    </div>
                  )}
                </Grid.Column>
                <Grid.Column width={3} style={{ maxHeight: 200 }}>
                  <Alert variant={"info"} style={{ textAlign: "center", maxWidth: 300 }}>
                    Confirmed / Cancelled groups
                  </Alert>
                  {this.state.selected_coach_operator &&
                  this.state.show_tabs ? (
                    <>
                      <ul>
                        <li>
                          <FaCircle style={{ color: "green", marginRight: 20 }}/>
                          Confirmed : {this.state.confirmed_cancelled_chart_data["confirmed"]}
                        </li>
                        <li>
                          <FaCircle style={{ color: "red", marginRight: 20 }} />
                          Cancelled : {this.state.confirmed_cancelled_chart_data["cancelled"]}
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
              </Grid>
              <hr />
              <Tabs>
                <TabList>
                  <Tab> Information </Tab>
                  <Tab> All coach operators statistics </Tab>
                  <Tab> Comparison to other coach operators for this period</Tab>
                </TabList>
                {this.state.show_tabs ? (
                  <>
                    <TabPanel>
                      <Grid columns={2} style={{ width: "80%", marginLeft: 30 }} stackable>
                        <Grid.Row>
                          <Grid.Column>
                            <b>Statistics of selected coach operator(s)</b>
                            <ul>
                              <li> Total groups: {this.state.total_groups}</li>
                              <li> Total number of people: {this.state.total_number_of_people}</li>
                              <li> People per group: {this.state.people_per_group} </li>
                              <li> Days of work: {this.state.days_of_work}</li>
                            </ul>
                          </Grid.Column>
                          <Grid.Column>
                            <Accordion styled style={{ margin: 20, textAlign: "center", width: "100%"}}>
                              <Accordion.Title
                                active={this.state.show_empty_km_table}
                                index={0}
                                onClick={this.handle_empty_km_accordion}
                              >
                                <Icon name="dropdown" />
                                Show empty KM table
                              </Accordion.Title>
                              <Accordion.Content active={this.state.show_empty_km_table}>
                                <b>Empty KM</b>
                                <table cellpadding="0" cellspacing="0" border="0" className="table table-bordered dataTable">
                                  <thead>
                                    <tr role="row">
                                      <th>#</th>
                                      <th>Coach</th>
                                      <th>Date</th>
                                      <th>Source</th>
                                      <th>Dest</th>
                                      <th>Distance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.empty_km_table_data.map(
                                      (e, j) => (
                                        <>
                                          <tr style={{color: e[4][0] === null ? "red" : ""}}>
                                            <td>{j + 1}</td>
                                            <td>{e[1]}</td>
                                            <td>{e[0]}</td>
                                            <td>{e[2]}</td>
                                            <td>{e[3]}</td>
                                            <td>
                                              {e[4]}
                                              <ChangeAirportDistance
                                                src_id={e[2][0]}
                                                dst_id={e[3][0]}
                                                show_report={this.show_report}
                                              />
                                            </td>
                                          </tr>
                                        </>
                                      )
                                    )}
                                  </tbody>
                                </table>
                                <b> Total empty km: {this.state.total_empty_km} </b>
                              </Accordion.Content>
                            </Accordion>
                            <div style={{ margin: 20, textAlign: "center" }}>
                              <CgDanger
                                style={{
                                  color: "orange",
                                  fontSize: "1.7em",
                                  marginRight: "0.5em",
                                }}
                              />
                              <strong>
                                Empty km for drivers with 90+ days period off work will not be calculated
                              </strong>
                            </div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      <hr />
                      {this.state.total_groups > 0 ? (
                        <div>
                          {this.state.selected_period_groups.map((e, j) => (
                            <>
                              <Accordion
                                styled
                                style={{ margin: 20, width: "97%" }}
                              >
                                <Accordion.Title
                                  active={this.state.activeAccordionIndex === j}
                                  index={j}
                                  onClick={this.handleAccordionCoach}
                                >
                                  <Icon name="dropdown" />
                                  <b>
                                    <HiOutlineDocumentReport
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                        marginRight: "0.5em",
                                      }}
                                    />
                                    Report for coach {e[0]}
                                  </b>
                                </Accordion.Title>
                                <Accordion.Content
                                  active={this.state.activeAccordionIndex === j}
                                >
                                  <div>
                                    <h4>Groups for selected period</h4>
                                    <ToolkitProvider
                                      keyField="id"
                                      data={e[1]}
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
                                          <ExportCSVButton className="ui green button" {...props.csvProps}>
                                            Export to CSV
                                          </ExportCSVButton>
                                          <hr />
                                          <BootstrapTable
                                            {...props.baseProps}
                                            id="all_group_leaders_table"
                                            pagination={paginationFactory( paginationOptions)}
                                            hover
                                            bordered={false}
                                            striped
                                          />
                                        </div>
                                      )}
                                    </ToolkitProvider>
                                  </div>
                                </Accordion.Content>
                              </Accordion>
                            </>
                          ))}
                        </div>
                      ) : (
                        <b>No groups for this period</b>
                      )}
                    </TabPanel>
                    <TabPanel>
                      <div style={{ width: "80%", marginLeft: 30 }}>
                        <b>Total numbers for all coach operators </b>
                        <hr />
                        <ul>
                          <li> Groups: {this.state.total_groups_all} </li>
                          <li> People: {this.state.total_people_all} </li>
                          <li> People per group: {this.state.people_per_group_all} </li>
                        </ul>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <ApexChart
                        coach_operator_names={this.state.top_100_coach_operators.map((coach_operator_name) => coach_operator_name[0])}
                        coach_operator_values={this.state.top_100_coach_operators.map((coach_operator_name) => coach_operator_name[1])}
                      />
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

export default ReportsCoachOperator;
