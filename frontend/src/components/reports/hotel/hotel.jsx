// Built-ins
import React from "react";

// Functions / Modules
import axios from "axios";
import Swal from "sweetalert2";
import { Grid } from "semantic-ui-react";
import { Card } from "react-bootstrap";
import DatePicker from "react-date-picker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-daterange-picker/dist/css/react-calendar.css";

// Icons - Images
import { FaChartLine, FaFlag } from "react-icons/fa";
import { BsInfoSquare } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { FaHotel, FaFilter } from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import NoDataToShowImage from "../../../images/generic/no_results_found.png";

// Custom Made Components
import NavigationBar from "../../core/navigation_bar/navigation_bar";
import Footer from "../../core/footer/footer";
import GoogleMap from "../../core/map/map";
import GroupsPerYearLineChart from "../charts/groups_per_year_line_chart";
import GroupsPerNationalityPieChart from "../charts/groups_per_nationality_pie_chart";
import OtherHotelsColumnChart from "../charts/other_column_chart";
import ConfirmedCancelledPieChart from "../charts/confirmed_cancelled";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
  iconStyle,
  paginationOptions,
} from "../../global_vars";

// Variables
window.Swal = Swal;

let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

const rowStyle = (row) => {
  const style = {};
  if (row.status === "4") {
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

const REPORTS_HOTEL = "http://localhost:8000/api/reports/hotel/";
const GET_HOTELS = "http://localhost:8000/api/data_management/all_hotels/";
const GET_HOTEL = "http://localhost:8000/api/view/get_hotel/";

const date = new Date();

const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();

const calculateHotelStars = (rating) => {
  if (rating !== "" && rating !== null) {
    let results = [];
    let string_rating = rating.toString();
    let fullStars = string_rating[0];
    let halfStars = string_rating[1];
    let emptyStars = 5 - parseInt(rating / 10);
    // full stars loop
    for (var i = 0; i < Number(fullStars); i++) {
      results.push(<AiFillStar style={starStyle} />);
    }
    // half star
    if (halfStars === 5) {
      results.push(
        <BsStarHalf
          style={{
            color: "orange",
            fontSize: "1.3em",
            display: "inline-block",
          }}
        />
      );
    }
    // empty star
    for (var l = 0; l < Number(emptyStars); l++) {
      if (fullStars === "4" && halfStars !== "0") {
      } else {
        results.push(<AiOutlineStar style={starStyle} />);
      }
    }
    return results;
  }
};

class ReportsHotel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date_from: new Date(year, month, day - 30),
      date_to: new Date(),
      all_hotels: [],
      hotel: "",
      hotel_statistics_card: {
        total_groups: 0,
        total_number_of_people: 0,
        people_per_group: 0,
        total_overnights: 0,
      },
      hotel_information_card: {
        rating: "N/A",
        email: "N/A",
        address: "N/A",
        created_by: "N/A",
        created_at: "N/A",
      },
      other_hotels_at_period: {
        "": "",
      },
      confirmed_cancelled: {
        confirmed: 0,
        cancelled: 0,
      },
      groups_by_nationality: [],
      groups_per_year: [],
      table_data: [],

      columns: [
        {
          dataField: "period",
          text: "Period",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "reference",
          text: "Refcode",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              <a
                href={"/group_management/group/" + row.reference}
                basic
                target="_blank"
                rel="noreferrer"
                className={row.status === "4" ? "cnclled" : "cnfrmed"}
              >
                {row.reference}
              </a>
            </>
          ),
        },
        {
          dataField: "booked_dates",
          text: "Booked Dates",
          sort: true,
          filter: textFilter(),
          formatter: (cell, row) => (
            <>
              {row.booked_dates.map((item, index) => (
                <span key={index}>
                  {item} {index !== row.booked_dates.length - 1 && ", "}
                </span>
              ))}
            </>
          ),
        },
        {
          dataField: "booked_dates_count",
          text: "Booked Dates Count",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "PAX",
          text: "PAX",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "overnights",
          text: "Overnights",
          sort: true,
          filter: textFilter(),
        },
      ],
    };
    this.ChangeDateFrom = this.ChangeDateFrom.bind(this);
    this.ChangeDateTo = this.ChangeDateTo.bind(this);
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
      .get(GET_HOTELS, {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          all_hotels: res.data.all_hotels,
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

  ChangeDateFrom = (newDateFrom) => {
    const { date_to } = this.state;
    if (newDateFrom > date_to) {
      this.setState({
        date_from: date_to,
      });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Date From cannot be set to a date later than 'To'.",
      });
    } else {
      this.setState({
        date_from: newDateFrom,
      });
    }

    if (this.state.hotel !== "") {
      axios
        .get(REPORTS_HOTEL, {
          headers: headers,
          params: {
            hotel_name: this.state.hotel.name,
            date_from: moment(newDateFrom).format("YYYY-MM-DD"),
            date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          this.setState({
            is_loaded: true,
            hotel_statistics_card: res.data.hotel_statistics_card,
            hotel_information_card: res.data.hotel_information_card,
            other_hotels_at_period: res.data.other_hotels_at_period,
            groups_by_nationality: res.data.groups_by_nationality,
            confirmed_cancelled: res.data.confirmed_cancelled,
            groups_per_year: res.data.groups_per_year,
            table_data: res.data.table_data,
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
  };

  ChangeDateTo = (newDateTo) => {
    const { date_from } = this.state;
    if (newDateTo < date_from) {
      this.setState({
        date_to: date_from,
      });
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Date To cannot be set to a date earlier than 'From'.",
      });
    } else {
      this.setState({
        date_to: newDateTo,
      });
    }

    if (this.state.hotel !== "") {
      axios
        .get(REPORTS_HOTEL, {
          headers: headers,
          params: {
            hotel_name: this.state.hotel.name,
            date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
            date_to: moment(newDateTo).format("YYYY-MM-DD"),
          },
        })
        .then((res) => {
          this.setState({
            is_loaded: true,
            hotel_statistics_card: res.data.hotel_statistics_card,
            hotel_information_card: res.data.hotel_information_card,
            other_hotels_at_period: res.data.other_hotels_at_period,
            groups_by_nationality: res.data.groups_by_nationality,
            confirmed_cancelled: res.data.confirmed_cancelled,
            groups_per_year: res.data.groups_per_year,
            table_data: res.data.table_data,
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
  };

  setSelectedHotel = (hotel) => {
    axios
      .get(GET_HOTEL + hotel, {
        headers: headers,
        params: {
          hotel_name: hotel,
        },
      })
      .then((res) => {
        this.setState({
          hotel: res.data.hotel,
        });
      });

    axios
      .get(REPORTS_HOTEL, {
        headers: headers,
        params: {
          hotel_name: hotel,
          date_from: moment(this.state.date_from).format("YYYY-MM-DD"),
          date_to: moment(this.state.date_to).format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.setState({
          is_loaded: true,
          hotel_statistics_card: res.data.hotel_statistics_card,
          hotel_information_card: res.data.hotel_information_card,
          other_hotels_at_period: res.data.other_hotels_at_period,
          groups_by_nationality: res.data.groups_by_nationality,
          confirmed_cancelled: res.data.confirmed_cancelled,
          groups_per_year: res.data.groups_per_year,
          table_data: res.data.table_data,
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
  };

  render() {
    return (
      <>
        <NavigationBar />
        <div className="rootContainer">
          {pageHeader("reports_hotel")}
          {this.state.forbidden ? (
            <>{forbidden("Reports Hotel")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid celled={this.state.hotel !== ""}>
                <Grid.Row style={{ marginLeft: 10 }}>
                  <Grid.Column width={4}>
                    <Card>
                      <Card.Header>
                        <FaFilter style={iconStyle} /> Filters
                      </Card.Header>
                      <Card.Body>
                        <b style={{ marginTop: 8 }}>from:</b>
                        <DatePicker
                          wrapperClassName="datePicker"
                          className="reports_datepicker"
                          clearIcon={null}
                          format={"dd/MM/y"}
                          name="date_from"
                          value={this.state.date_from}
                          onChange={this.ChangeDateFrom}
                        />
                        <b style={{ marginTop: 8 }}>to:</b>
                        <DatePicker
                          wrapperClassName="datePicker"
                          className="reports_datepicker"
                          clearIcon={null}
                          format={"dd/MM/y"}
                          style={{ marginLeft: "30 !important" }}
                          name="date_from"
                          value={this.state.date_to}
                          onChange={this.ChangeDateTo}
                        />
                        <Autocomplete
                          options={this.state.all_hotels}
                          className={"select_airport"}
                          onChange={(e) => {
                            this.setSelectedHotel(e.target.innerText);
                          }}
                          style={{ width: 320, marginTop: 10 }}
                          value={this.state.hotel}
                          getOptionLabel={(e) => e.name}
                          getOptionSelected={(e) => e.name}
                          disableClearable
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select hotel"
                              variant="outlined"
                            />
                          )}
                        />
                      </Card.Body>
                    </Card>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    {this.state.hotel !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <ImStatsDots style={iconStyle} /> Hotel's Statistics
                          </Card.Header>
                          <Card.Body>
                            <ul style={{ marginBottom: 0 }}>
                              <li>
                                Total Groups:
                                {
                                  this.state.hotel_statistics_card[
                                    "total_groups"
                                  ]
                                }
                              </li>
                              <li>
                                Total Number Of People:
                                {this.state.hotel_statistics_card[
                                  "total_number_of_people"
                                ]
                                  ? this.state.hotel_statistics_card[
                                      "total_number_of_people"
                                    ]
                                  : 0}
                              </li>
                              <li>
                                People Per Group:
                                {
                                  this.state.hotel_statistics_card[
                                    "people_per_group"
                                  ]
                                }
                              </li>
                              <li>
                                Total Overnights:
                                {
                                  this.state.hotel_statistics_card[
                                    "total_overnights"
                                  ]
                                }
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.hotel !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <BsInfoSquare style={iconStyle} /> Hotel's
                            Information
                          </Card.Header>
                          <Card.Body>
                            <ul style={{ marginBottom: 0 }}>
                              <li>
                                Rating:
                                {calculateHotelStars(
                                  this.state.hotel_information_card["rating"]
                                )}
                              </li>
                              <li>
                                Email:
                                {this.state.hotel_information_card["email"]}
                              </li>
                              <li>
                                Address:
                                {this.state.hotel_information_card["address"]}
                              </li>
                              <li>
                                Created by:
                                {
                                  this.state.hotel_information_card[
                                    "created_by"
                                  ]
                                }
                              </li>
                              <li>
                                Created at:
                                {
                                  this.state.hotel_information_card[
                                    "created_at"
                                  ]
                                }
                              </li>
                            </ul>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={5}>
                    {this.state.hotel !== "" &&
                      (this.state.hotel.lat || this.state.hotel.lng) && (
                        <GoogleMap object={this.state.hotel} />
                      )}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    {this.state.hotel !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <FaHotel style={iconStyle} /> Top 10 Most Used
                            Hotels at this Period
                          </Card.Header>
                          <Card.Body>
                            <OtherHotelsColumnChart
                              animate
                              data={this.state.other_hotels_at_period}
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.hotel !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <FaFlag style={iconStyle} /> Hotel's Groups Per
                            Nationality
                          </Card.Header>
                          <Card.Body>
                            <GroupsPerNationalityPieChart
                              data={this.state.groups_by_nationality}
                              animate
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.hotel !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <MdIncompleteCircle style={iconStyle} /> Confirmed /
                            Cancelled Groups
                          </Card.Header>
                          <Card.Body>
                            <ConfirmedCancelledPieChart
                              animate
                              data={this.state.confirmed_cancelled}
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                  <Grid.Column width={4}>
                    {this.state.hotel !== "" ? (
                      <>
                        <Card>
                          <Card.Header>
                            <FaChartLine style={iconStyle} /> Groups Per Year
                            Line Chart
                          </Card.Header>
                          <Card.Body>
                            <GroupsPerYearLineChart
                              groups_per_year={this.state.groups_per_year}
                              animate
                            />
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid.Column>
                </Grid.Row>
                {this.state.hotel !== "" ? (
                  <Grid.Row>
                    <Grid.Column>
                      <ToolkitProvider
                        keyField="id"
                        data={this.state.table_data}
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
                            <div style={{ overflow: "x:auto" }}>
                              <BootstrapTable
                                id="hotel_reports_table"
                                {...props.baseProps}
                                pagination={paginationFactory(
                                  paginationOptions
                                )}
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
                    </Grid.Column>
                  </Grid.Row>
                ) : (
                  ""
                )}
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

export default ReportsHotel;
