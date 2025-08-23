// Built-ins
import React from "react";

// Custom Made Components
import ChangeDate from "./modals/change_date";
import ChangeHotel from "./modals/change_hotel";
import ChangeDriver from "./modals/change_driver";
import ChangeOptionDate from "./modals/change_option_date";
import ChangeCoach from "./modals/change_coach";
import ChangeGroupLeader from "./modals/change_leader";
import AddFirstTravelday from "./modals/add_first_travelday";
import DeleteTravelday from "./modals/delete_travelday";
import DeleteSchedule from "./modals/delete_schedule";
import PricePerRoomList from "./modals/price_per_room_list";

// CSS
import "react-tabs/style/react-tabs.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./group_schedule.css";

// Icons / Images
import { CgDanger } from "react-icons/cg";
import { BsFlagFill } from "react-icons/bs";
import { FaHotel } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { GiBus } from "react-icons/gi";
import { TiGroupOutline } from "react-icons/ti";
import { BsTable } from "react-icons/bs";
import { BsTablet } from "react-icons/bs";

// Modules / Functions
import moment from "moment";
import { Table, ListGroup, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { Button, Grid } from "semantic-ui-react";
import axios from "axios";

// Global Variables
import {
  headers,
  pageHeader,
  loader,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

// Variables
const leaderRatingOptions = {
  R: "Red",
  G: "Green",
  Y: "#f0e130",
};

const ADD_TRAVELDAY = "http://localhost:8000/api/groups/add_new_travelday/";
const DOWNLOAD_TRAVELDAY_DOCUMENT =
  "http://localhost:8000/api/groups/download_travelday_document/";
// const CHANGE_PAID_STATUS = "http://localhost:8000/api/financial/change_paid_status/";

function getRefcode() {
  return window.location.pathname.split("/")[3];
}

function areConsecutive(days) {
  for (var i = 0; i < days.length - 1; i++) {
    if (
      moment(days[i]).add(1, "d").format("YYYY/MM/DD") !==
      moment(days[i + 1]).format("YYYY/MM/DD")
    ) {
      return true;
    }
  }
  return false;
}

class GroupSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_row: -1,
      payment_id: -1,
      show_bank_details: false,
      isLoaded: false,
    };
  }

  addTravelday() {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios({
      method: "post",
      url: ADD_TRAVELDAY + getRefcode(),
      headers: headers,
      data: {
        type: "Group",
        selected_date: "",
      },
    })
      .then((res) => {
        this.props.update_state(res.data.model);
      })
      .catch((e) => {
        Swal.fire({ icon: "error", title: "Error", text: e });
      });
  }

  onRowClick = (td) => {
    if (td.target.nodeName === "TD") {
      this.setState({
        active_row: Number(td.target.parentElement["children"][0].innerText),
      });
    } else {
      this.setState({
        active_row: -1,
      });
    }
  };

  onPRowClick = (td) => {
    if (td.target.nodeName === "TD") {
      this.setState({
        payment_id: Number(td.target.parentElement["children"][0].innerText),
      });
    } else {
      this.setState({
        payment_id: -1,
      });
    }
  };

  delete_travelday = (group) => {
    this.setState({
      group: group,
      traveldays: group.group_travelday,
      active_row: -1,
    });
  };

  delete_schedule = (group) => {
    this.setState({
      group: group,
      traveldays: group.group_travelday,
      active_row: -1,
    });
  };

  handleToggleBankDetails = () => {
    this.setState((prevState) => ({
      show_bank_details: !prevState.show_bank_details,
    }));
  };

  downloadTraveldayDocument = (fileName, travelday_id, doc_type) => {
    axios
      .get(
        DOWNLOAD_TRAVELDAY_DOCUMENT +
          travelday_id +
          "?file=" +
          fileName +
          "&doc_type=" +
          doc_type,
        {
          headers: headers,
          params: {
            file: fileName,
          },
        }
      )
      .then(() => {
        window.open(
          DOWNLOAD_TRAVELDAY_DOCUMENT +
            travelday_id +
            "?file=" +
            fileName +
            "&doc_type=" +
            doc_type
        );
      });
  };

  render() {

    const GBPConversionRates = {
      EUR: 1.1753,
      CHF: 1.1123,
      USD: 1.3094,
      GBP: 1.00,
    };
    
    const convertToGBP = (amount, currency) => {
      const rate = GBPConversionRates[currency];
      return rate ? amount / rate : 0;
    };
    
    const EURConversionRates = {
      GBP: 0.8508,
      CHF: 0.9464,
      USD: 1.1138,
      EUR: 1.00,
    };
    
    const convertToEUR = (amount, currency) => {
      const rate = EURConversionRates[currency];
      return rate ? amount / rate : 0;
    };
    
    const parseAmount = (str) => {
      const trimmedStr = str.trim();
      if (trimmedStr === '') {
        return { currency: null, amount: 0 };
      }
    
      const currencyMatch = trimmedStr.match(/[€$₣£]/);
      const amountMatch = trimmedStr.match(/[\d,.]+/);
    
      if (!currencyMatch || !amountMatch) {
        return { currency: null, amount: 0 };
      }
    
      let currency;
      switch (currencyMatch[0]) {
        case '€':
          currency = 'EUR';
          break;
        case '$':
          currency = 'USD';
          break;
        case '₣':
          currency = 'CHF';
          break;
        case '£':
          currency = 'GBP';
          break;
        default:
          currency = null;
      }
    
      const amount = parseFloat(amountMatch[0].replace(',', ''));
      return { currency, amount };
    };
    
    const getTotalInGBP = (amounts) => {
      return amounts.reduce((total, current) => {
        const { currency, amount } = parseAmount(current);
        if (currency) {
          return total + convertToGBP(amount, currency);
        }
        return total;
      }, 0);
    };
    
    const getAverageInGBP = (amounts) => {
      if (amounts.length === 0) return 0;
    
      const validAmounts = amounts.filter(amount => amount.trim() !== '');
    
      if (validAmounts.length === 0) return 0;
    
      const total = validAmounts.reduce((acc, current) => {
        const { currency, amount } = parseAmount(current);
        if (currency) {
          return acc + convertToGBP(amount, currency);
        }
        return acc;
      }, 0);
    
      return total / validAmounts.length;
    };
    
    const getTotalInEUR = (amounts) => {
      return amounts.reduce((total, current) => {
        const { currency, amount } = parseAmount(current);
        if (currency) {
          return total + convertToEUR(amount, currency);
        }
        return total;
      }, 0);
    };
    
    const getAverageInEUR = (amounts) => {
      if (amounts.length === 0) return 0;
    
      const validAmounts = amounts.filter(amount => amount.trim() !== '');
    
      if (validAmounts.length === 0) return 0;
    
      const total = validAmounts.reduce((acc, current) => {
        const { currency, amount } = parseAmount(current);
        if (currency) {
          return acc + convertToEUR(amount, currency);
        }
        return acc;
      }, 0);
    
      return total / validAmounts.length;
    };
    
    return (
      <>
        <div className="rootContainer">
          {pageHeader("group_schedule", this.props.group.refcode)}
          <div
            style={{
              marginLeft: 20,
              width: 80,
              borderRadius: 10,
              display: "inline",
            }}
          >
            <Button
              id="table_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.props.selectedView === "table" ? "#e3e3e3" : "",
              }}
              onClick={() => this.props.setView("table")}
            >
              <BsTable
                style={{
                  color: "#F3702D",
                  fontSize: "1.5em",
                }}
              />
            </Button>
            <Button
              id="tablet_icon"
              style={{
                padding: 6,
                margin: 2,
                backgroundColor:
                  this.props.selectedView === "tablet" ? "#e3e3e3" : "",
              }}
              onClick={() => this.props.setView("tablet")}
            >
              <BsTablet style={{ color: "#F3702D", fontSize: "1.5em" }} />
            </Button>
          </div>
          {this.props.isLoaded ? (
            <>
              {this.props.selectedView === "tablet" ? (
                <>
                  {this.props.group.group_travelday.length > 0 ? (
                    <>
                      <Grid columns={2} stackable style={{ marginLeft: 20 }}>
                        <Grid.Row>
                          <Grid.Column
                            width={
                              this.props.group.group_travelday.length > 12
                                ? 5
                                : 3
                            }
                          >
                            <label>Select Date</label>
                            <ul
                              style={{
                                columns:
                                  this.props.group.group_travelday.length > 12
                                    ? 4
                                    : 2,
                              }}
                            >
                              {this.props.group.group_travelday.map((td) => {
                                return (
                                  <>
                                    <li style={{ marginBottom: 10 }}>
                                      <Button
                                        color={
                                          this.props.selectedDate === td.date
                                            ? "blue"
                                            : "vk"
                                        }
                                        onClick={(e) =>
                                          this.props.setSelectedDate(
                                            e.target.innerText
                                          )
                                        }
                                      >
                                        {td.date}
                                      </Button>
                                    </li>
                                  </>
                                );
                              })}
                            </ul>
                          </Grid.Column>
                          <Grid.Column width={6}>
                            {this.props.selectedDate !== "" ? (
                              <ListGroup>
                                <ListGroup.Item>
                                  <div className={"info_descr"}>
                                    <FaHotel
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                        marginRight: "0.5em",
                                      }}
                                    />
                                    Hotel
                                  </div>
                                  <div
                                    className={
                                      this.props.selectedTD.hotel
                                        ? "info_span"
                                        : "red_info_span"
                                    }
                                  >
                                    {this.props.selectedTD.hotel
                                      ? this.props.selectedTD.hotel.name
                                      : "N/A"}
                                    <ChangeHotel
                                      update_state={this.props.update_state}
                                      td_id={this.props.selectedTD.id}
                                      date={this.props.selectedTD.date}
                                      hotel={this.props.selectedTD.hotel}
                                      group={this.props.group}
                                      updateIsLoaded={this.props.updateIsLoaded}
                                    />
                                  </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <div className={"info_descr"}>
                                    <GiSteeringWheel
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                        marginRight: "0.5em",
                                      }}
                                    />
                                    Driver
                                  </div>
                                  <div
                                    className={
                                      this.props.selectedTD.driver
                                        ? "info_span"
                                        : "red_info_span"
                                    }
                                  >
                                    {this.props.selectedTD.driver ? (
                                      <a
                                        href={
                                          "/data_management/driver/" +
                                          this.props.selectedTD.driver.id
                                        }
                                        basic
                                        id="cell_link"
                                      >
                                        {this.props.selectedTD.driver.name}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                    <ChangeDriver
                                      td_id={this.props.selectedTD.id}
                                      date={this.props.selectedTD.date}
                                      group={this.props.group}
                                      update_state={this.props.update_state}
                                      updateIsLoaded={this.props.updateIsLoaded}
                                    />
                                  </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <div className={"info_descr"}>
                                    <GiBus
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                        marginRight: "0.5em",
                                      }}
                                    />
                                    Coach
                                  </div>
                                  <div className={this.props.selectedTD.coach ? "info_span" : "red_info_span"}>
                                    {this.props.selectedTD.coach ? (
                                      <a href={ "/data_management/coach/" + this.props.selectedTD.coach.id} basic id="cell_link">
                                        {this.props.selectedTD.coach.make + " " + this.props.selectedTD.coach.plate_number}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                    <ChangeCoach
                                      td_id={this.props.selectedTD.id}
                                      date={this.props.selectedTD.date}
                                      group={this.props.group}
                                      update_state={this.props.update_state}
                                      updateIsLoaded={this.props.updateIsLoaded}
                                    />
                                  </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <div className={"info_descr"}>
                                    <TiGroupOutline
                                      style={{
                                        color: "#F3702D",
                                        fontSize: "1.5em",
                                        marginRight: "0.5em",
                                      }}
                                    />
                                    Leader
                                  </div>
                                  <div
                                    className={
                                      this.props.selectedTD.leader
                                        ? "info_span"
                                        : "red_info_span"
                                    }
                                  >
                                    {this.props.selectedTD.leader ? (
                                      <a
                                        href={
                                          "/data_management/group_leader/" +
                                          this.props.selectedTD.leader.id
                                        }
                                        basic
                                        id="cell_link"
                                      >
                                        {this.props.selectedTD.leader.name}
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                    <ChangeGroupLeader
                                      td_id={this.props.selectedTD.id}
                                      date={this.props.selectedTD.date}
                                      group={this.props.group}
                                      update_state={this.props.update_state}
                                      updateIsLoaded={this.props.updateIsLoaded}
                                    />
                                  </div>
                                </ListGroup.Item>
                              </ListGroup>
                            ) : (
                              ""
                            )}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                      {areConsecutive(
                        this.props.group.group_travelday.map((day) => day.date)
                      ) ? (
                        <>
                          <hr />
                          <div id="consecutive_warning_message">
                            <CgDanger
                              style={{ marginRight: 10, fontSize: "1.3em" }}
                            />
                            Days are not consecutive.
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                  <div>
                    <br />
                    {this.props.group.group_travelday.length > 0 ? (
                      <Button
                        color="green"
                        onClick={this.addTravelday.bind(this)}
                        style={{ margin: 10 }}
                      >
                        Add new travelday
                      </Button>
                    ) : (
                      <AddFirstTravelday
                        update_state={this.props.update_state}
                        group={this.props.group}
                        updateIsLoaded={this.props.updateIsLoaded}
                      />
                    )}

                    {this.props.selectedView === "table" ? (
                      <DeleteTravelday
                        group={this.props.group}
                        update_state={this.props.update_state}
                        active_row={this.state.active_row}
                        traveldays={this.props.group.group_travelday}
                        updateIsLoaded={this.props.updateIsLoaded}
                      />
                    ) : (
                      ""
                    )}
                    <DeleteSchedule
                      group={this.props.group}
                      update_state={this.props.update_state}
                      updateIsLoaded={this.props.updateIsLoaded}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Hotel</th>
                        <th>Location</th>
                        <th>Booker</th>
                        <th>Option Date</th>
                        <th>Price Per Room</th>
                        <th>Driver</th>
                        <th>Coach</th>
                        <th>Leader</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.group.group_travelday.length > 0 ? (
                        this.props.group.group_travelday.map((e, j) => {
                          let is_departure = false;
                          if (
                            this.props.group.group_travelday.length ===
                            j + 1
                          ) {
                            is_departure = true;
                          }
                          let rowClass = "";
                          if (j + 1 === this.state.active_row) {
                            rowClass = "clicked_row";
                          }

                          return (
                            <tr onClick={this.onRowClick} className={rowClass}>
                              {/* ID */}
                              <td>{j + 1}</td>
                              {/* Date */}
                              <td>
                                {moment(e.date).format("dddd Do MMMM YYYY")}
                                <ChangeDate
                                  date={e.date}
                                  td_id={e.id}
                                  update_state={this.props.update_state}
                                  group={this.props.group}
                                  updateIsLoaded={this.props.updateIsLoaded}
                                />
                              </td>
                              {/* Hotel */}
                              <td colSpan={is_departure ? 2 : ""}>
                                {/* if day is departure, merge hotel + location cells. /// <td colSpan={is_departure ? 2 : ''}> /// */}
                                {is_departure ? (
                                  this.props.group.departure
                                ) : e.hotel ? (
                                  <>
                                    <a
                                      href={"/data_management/hotel/" + e.hotel.id}
                                      target="_blank"
                                      rel="noreferrer"
                                      basic
                                      id="cell_link"
                                    >
                                      {e.hotel.name}
                                    </a>
                                    <ChangeHotel
                                      td_id={e.id}
                                      date={e.date}
                                      hotel={e.hotel}
                                      group={this.props.group}
                                      update_state={this.props.update_state}
                                      updateIsLoaded={this.props.updateIsLoaded}
                                    />
                                  </>
                                ) : (
                                  <>
                                    N/A
                                    <ChangeHotel
                                      update_state={this.props.update_state}
                                      td_id={e.id}
                                      date={e.date}
                                      hotel={e.hotel}
                                      group={this.props.group}
                                      updateIsLoaded={this.props.updateIsLoaded}
                                    />
                                  </>
                                )}
                              </td>
                              {/* Location */}
                              {/* IF TD IS THE LAST TD, TD = DEPARTURE FLIGHT */}
                              {/* IF TD  = DEPARTURE FLIGHT // SHOW DEPARTURE FLIGHT STR */}
                              {/* if departure = true, location is combined with hotel cell, and departure flight is rendered */}
                              {/* if there is no hotel or departure, we want to show the day's place and the change location modal( if it has one )*/}
                              {is_departure ? (
                                ""
                              ) : (
                                <>
                                  <td>
                                    {/* // create a rendering function for the regions. use it everywhere. */}
                                    {e.hotel ? e.hotel.region ? e.hotel.region.split(" >>> ").slice(1).join(" >>> ") : 'N/A' : "N/A"}
                                  </td>
                                </>
                              )}
                              <td>{e.booker ? e.booker.username : "N/A"}</td>
                              <td>{e.option_date ? moment(e.option_date).format("DD-MM-YYYY") : 'N/A'}
                                <ChangeOptionDate
                                  td_id={e.id}
                                  date={e.date}
                                  group={this.props.group}
                                  update_state={this.props.update_state}
                                  updateIsLoaded={this.props.updateIsLoaded}
                                  option_date={e.option_date}
                                />
                              </td>

                              <td>
                                <PricePerRoomList
                                  td={e}
                                  group={this.props.group}
                                  date={e.date}
                                />
                              </td>

                              {/* Driver */}
                              <td>
                                {e.driver ? (
                                  <a href={"/data_management/driver/" + e.driver.id} basic id="cell_link">
                                    {e.driver.name}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                                <ChangeDriver
                                  td_id={e.id}
                                  date={e.date}
                                  group={this.props.group}
                                  update_state={this.props.update_state}
                                  updateIsLoaded={this.props.updateIsLoaded}
                                  driver={e.driver}
                                />
                              </td>
                              {/* Coach */}
                              <td>
                                {e.coach ? (
                                  <a href={"/data_management/coach/" + e.coach.id} basic id="cell_link">
                                    {e.coach.make + " " + e.coach.plate_number}
                                  </a>
                                ) : (
                                  "N/A"
                                )}
                                <ChangeCoach
                                  td_id={e.id}
                                  date={e.date}
                                  group={this.props.group}
                                  update_state={this.props.update_state}
                                  updateIsLoaded={this.props.updateIsLoaded}
                                  coach={e.coach ? e.coach.id +   ") " + e.coach.make + "--" + e.coach.coach_operator.name + "--" + e.coach.plate_number : ""}
                                />
                              </td>
                              <td>
                                {e.leader ? (
                                  <>
                                    <a href={ "/data_management/group_leader/" + e.leader.id} basic id="cell_link">
                                      {e.leader.name}
                                      {e.leader.name === "" || e.leader.name === "N/A" ? ("") : (
                                        <BsFlagFill style={{ color: leaderRatingOptions[e.leader.rating], fontSize: "1.5em", marginLeft: "0.5em",}}/>
                                      )}
                                    </a>
                                  </>
                                ) : (
                                  "N/A"
                                )}
                                <ChangeGroupLeader
                                  update_state={this.props.update_state}
                                  td_id={e.id}
                                  date={e.date}
                                  group={this.props.group}
                                  updateIsLoaded={this.props.updateIsLoaded}
                                  leader={e.leader ? e.leader.name : ""}
                                />
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <td data-toggle="collapse" colSpan="8" className="react-bs-table-no-data"></td>
                      )}
                    </tbody>
                  </Table>
                  {getRefcode().startsWith('COA') ? 
                    <>
                      <hr/>
                      <Grid columns={2}>
                        <Grid.Column width={4}>
                          <Card>
                            <Card.Header style={{textAlign: 'center'}}> Conversion Rates</Card.Header>
                            <Card.Body>
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <td>From</td>
                                    <td>To</td>
                                    <td>Amount</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>€ EUR</td>
                                    <td>£ GBP</td>
                                    <td>1.18 ( 1 £ = 1.1811 € )</td>
                                  </tr>
                                  <tr>
                                    <td>€ EUR</td>
                                    <td>₣ CHF</td>
                                    <td>1.02 ( 1 ₣ =  1.0262 € )</td>
                                  </tr>
                                  <tr>
                                    <td>€ EUR</td>
                                    <td>$ USD</td>
                                    <td>0.92 ( 1 $ = 0.9266 € )</td>
                                  </tr>
                                </tbody>
                              </Table>
                              </Card.Body>
                              <Card.Footer>
                                Latest update on Currencies: 22-08-2024 @ 10:50 GMT +3
                              </Card.Footer>
                            </Card>
                          </Grid.Column>
                          <Grid.Column width={4}>
                            <Card>
                              <Card.Header style={{textAlign: 'center'}}> Statistics</Card.Header>
                                <Card.Body>
                                  <Table striped bordered hover>
                                    <thead>
                                      <tr>
                                        <td>#</td>
                                        <td>€</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>Total</td>
                                        <td>€ {getTotalInEUR(this.props.group.group_travelday.map((e) => e.price_per_person ? e.price_per_person : '')).toFixed(2)}  </td>
                                      </tr>
                                      <tr>
                                        <td>Average</td>
                                        <td>€ {getAverageInEUR(this.props.group.group_travelday.map((e) => e.price_per_person ? e.price_per_person : '')).toFixed(2)}</td>
                                      </tr>
                                    </tbody>
                                  </Table>
                              </Card.Body>
                              <Card.Footer>
                              </Card.Footer>
                            </Card>
                          </Grid.Column>
                        </Grid>
                    </>
                    :
                    ""
                    }

                  {getRefcode().startsWith('COL') ? 
                    <>
                    <hr/>
                    <Grid columns={2}>
                      <Grid.Column width={4}>
                        <Card>
                          <Card.Header style={{textAlign: 'center'}}> Conversion Rates</Card.Header>
                          <Card.Body>
                            <Table striped bordered hover>
                              <thead>
                                <tr>
                                  <td>From</td>
                                  <td>To</td>
                                  <td>Amount</td>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>£ GBP</td>
                                  <td>€ EUR</td>
                                  <td>0.84 ( 1 € = 0.8466 £ )</td>
                                </tr>
                                <tr>
                                  <td>£ GBP</td>
                                  <td>₣ CHF</td>
                                  <td>0.86 ( 1 ₣ = 0.8690 £ )</td>
                                </tr>
                                <tr>
                                  <td>£ GBP</td>
                                  <td>$ USD</td>
                                  <td>0.7846 ( 1 $ = 0.7846 £ )</td>
                                </tr>
                              </tbody>
                              </Table>
                              </Card.Body>
                            <Card.Footer>
                              Latest update on Currencies: 03-07-2024 @ 16:31 GMT +3
                            </Card.Footer>
                          </Card>
                        </Grid.Column>
                        <Grid.Column width={4}>
                          <Card>
                            <Card.Header style={{textAlign: 'center'}}> Statistics</Card.Header>
                            <Card.Body>
                            <Table striped bordered hover>
                            <thead>
                              <tr>
                                <td>#</td>
                                <td>£</td>
                              </tr>
                            </thead>
                              <tbody>
                                <tr>
                                  <td>Total</td>
                                  <td>£ {getTotalInGBP(this.props.group.group_travelday.map((e) => e.price_per_person ? e.price_per_person : '')).toFixed(2)}  </td>
                                </tr>
                                <tr>
                                  <td>Average</td>
                                  <td>£ {getAverageInGBP(this.props.group.group_travelday.map((e) => e.price_per_person ? e.price_per_person : '')).toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </Table>
                            </Card.Body>
                            <Card.Footer>
                            </Card.Footer>
                          </Card>
                        </Grid.Column>
                      </Grid>
                    </>
                    :
                    ""
                    }
                  {areConsecutive(
                    this.props.group.group_travelday.map((day) => day.date)
                  ) ? (
                    <>
                      <hr />
                      <div id="consecutive_warning_message">
                        <CgDanger style={{ marginRight: 10, fontSize: "1.3em" }}/> Days are not consecutive.
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <div>
                    {this.props.group.group_travelday.length > 0 ? (
                      <Button
                        color="green"
                        onClick={this.addTravelday.bind(this)}
                        style={{ margin: 10 }}
                      >
                        Add new travelday
                      </Button>
                    ) : (
                      <AddFirstTravelday
                        update_state={this.props.update_state}
                        group={this.props.group}
                        updateIsLoaded={this.props.updateIsLoaded}
                      />
                    )}
                    {this.props.selectedView === "table" ? (
                      <DeleteTravelday
                        group={this.props.group}
                        update_state={this.props.update_state}
                        active_row={this.state.active_row}
                        traveldays={this.props.group.group_travelday}
                        updateIsLoaded={this.props.updateIsLoaded}
                      />
                    ) : (
                      ""
                    )}
                    <DeleteSchedule
                      group={this.props.group}
                      update_state={this.props.update_state}
                      updateIsLoaded={this.props.updateIsLoaded}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default GroupSchedule;
