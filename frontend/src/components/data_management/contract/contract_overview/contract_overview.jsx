// Built-ins
import React from "react";

// Icons / Images
import { BsInfoSquare } from "react-icons/bs";
import { FaFileContract, FaHotel } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { BsCloudDownload } from "react-icons/bs";
import { BiHotel } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";

// Functions / modules
import axios from "axios";
import { Card } from "react-bootstrap";
import { Grid } from "semantic-ui-react";
import Swal from "sweetalert2";

// Custom Made Components
import ChangeName from "../../../modals/change_name";
import ChangeCurrency from "../../../modals/contracts/change_currency";
import ChangePeriod from "../../../modals/contracts/change_period";
import ChangeStatus from "../../../modals/contracts/change_status";
import ChangeReleasePeriod from "../../../modals/contracts/change_release_period";
import ChangeCancellationLimit from "../../../modals/contracts/change_cancellation_limit";
import ChangeCancellationCharge from "../../../modals/contracts/change_cancellation_charge";
import ChangeChildAge from "../../../modals/contracts/change_child_age";
import ChangeInfantAge from "../../../modals/contracts/change_infant_age";
import ChangePricing from "../../../modals/contracts/change_pricing";
import ChangeInclusiveBoard from "../../../modals/contracts/change_inclusive_board";
import ChangeCityTaxesIncluded from "../../../modals/contracts/change_city_taxes_included";
import ChangeNumberOfRooms from "../../../modals/contracts/change_number_of_rooms";
import StopSales from "../../../modals/contracts/stop_sales";
import AddContractDocument from "../../../modals/contracts/add_doc";
import DeleteContractDocument from "../../../modals/contracts/delete_doc";
import DeleteObjectModal from "../../../modals/delete_object";

// Global Variables
import {
  headers,
  loader,
  pageHeader,
  forbidden,
  restrictedUsers,
} from "../../../global_vars";

// Variables
window.Swal = Swal;

let starStyle = {
  color: "orange",
  fontSize: "1.5em",
  display: "inline-block",
};

// Variables
const VIEW_CONTRACT = "http://localhost:8000/api/data_management/contract/";
const DOWNLOAD_CONTRACT_DOCUMENT =
  "http://localhost:8000/api/data_management/download_contract_document/";

function getContractId() {
  return window.location.pathname.split("/")[3];
}

const con_types = {
  AG: "Agent",
  AL: "Airline",
  CO: "Coach Operator",
  CC: "Cruising Company",
  DM: "DMC",
  FT: "Ferry Ticket Agency",
  HT: "Hotel",
  SE: "Sport Event Supplier",
  TH: "Theater",
  TT: "Train Ticket Agency",
};

const incl_board_types = {
  BB: "Bed & Breakfast",
  HB: "Half Board",
  FB: "Full Board",
  AI: "All Inclusive",
  RO: "Room Only",
};

const pricing_types = {
  PR: "Per Room",
  PP: "Per Person",
};

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
    if (halfStars !== "0") {
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

class ContractOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: {},
      is_loaded: false,
      accordionIndex: 0,
    };
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (restrictedUsers().includes(localStorage.getItem("user"))) {
      this.setState({
        forbidden: true,
      });
    }
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_CONTRACT + getContractId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          contract: res.data.contract,
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
    this.handleAccordion = this.handleAccordion.bind(this);
  }

  refresh = () => {
    headers["Authorization"] = "Token " + localStorage.getItem("userToken");
    axios
      .get(VIEW_CONTRACT + getContractId(), {
        headers: headers,
      })
      .then((res) => {
        this.setState({
          contract: res.data.contract,
          is_loaded: true,
        });
      });
  };

  update_state = (update_state) => {
    this.setState({ contract: update_state });
  };

  downloadContractDocument = (fileName) => {
    axios
      .get(VIEW_CONTRACT + getContractId(), {
        headers: headers,
        params: {
          file: fileName,
        },
      })
      .then((res) => {
        window.open(
          DOWNLOAD_CONTRACT_DOCUMENT + getContractId() + "?file=" + fileName
        );
      });
  };

  handleAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const { activeAccordionIndex } = this.state;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    this.setState({ accordionIndex: newIndex });
  };

  render() {
    return (
      <>
        <div className="mainContainer">
          {pageHeader("contract_overview", this.state.contract.name)}

          {this.state.forbidden ? (
            <>{forbidden("Contract Overview")}</>
          ) : this.state.is_loaded ? (
            <>
              <Grid columns={4} divided stackable>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaFileContract
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Contract Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}> Name</div>
                      <div className={"info_span"}>
                        {this.state.contract.name
                          ? this.state.contract.name
                          : "N/A"}
                      </div>
                      <ChangeName
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}> Type </div>
                      <div className={"info_span"}>
                        {this.state.contract.con_type
                          ? con_types[this.state.contract.con_type]
                          : "N/A"}
                      </div>
                      <MdBlock
                        title={"Contract's Type Cannot be changed"}
                        style={{
                          color: "red",
                          fontSize: 16,
                          float: "right",
                          marginTop: 5,
                          cursor: "unset",
                        }}
                        className={"edit_icon"}
                      />
                      <div className={"info_descr"}> Currency</div>
                      <div className={"info_span"}>
                        {this.state.contract.currency
                          ? this.state.contract.currency
                          : "N/A"}
                      </div>
                      <ChangeCurrency
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}> Period(s) </div>
                      <div className={"info_span"}>
                        {this.state.contract.period
                          ? this.state.contract.period
                              .split(", ")
                              .map((per, index) => (
                                <>
                                  {index + 1}) {per}
                                  <br />
                                </>
                              ))
                          : "N/A"}
                      </div>

                      <ChangePeriod
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                        contract={this.state.contract}
                      />
                      <div className={"info_descr"}> Status </div>
                      <div className={"info_span"}>
                        {this.state.contract.status ? "Enabled" : "Disabled"}
                      </div>
                      <ChangeStatus
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}> File </div>
                      <div className={"info_span"}>
                        {this.state.contract.document ? (
                          <>{this.state.contract.document.name}</>
                        ) : (
                          <>Upload the contract.</>
                        )}
                      </div>
                      {this.state.contract.document ? (
                        <>
                          <DeleteContractDocument
                            contract_id={this.state.contract.id}
                            document_id={this.state.contract.document.id}
                            document_name={this.state.contract.document.name}
                            refresh={this.refresh}
                          />
                          <BsCloudDownload
                            className="download_driver_doc_icon"
                            onClick={() => {
                              this.downloadContractDocument(
                                this.state.contract.document.name
                              );
                            }}
                            style={{
                              color: "#F3702D",
                              fontSize: "1.5em",
                              marginRight: 10,
                              marginTop: 5,
                              float: "right",
                            }}
                          />
                        </>
                      ) : (
                        <AddContractDocument
                          contract_id={this.state.contract.id}
                          refresh={this.refresh}
                        />
                      )}
                    </Card.Body>
                    <Card.Footer>
                      <DeleteObjectModal
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BiHotel
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Rooms Description
                    </Card.Header>
                    <Card.Body>
                      {this.state.contract.period
                        .split(", ")
                        .map((period, index) => {
                          return (
                            <>
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: "#3366ff",
                                  fontSize: 16,
                                  marginBottom: 10,
                                  marginLeft: 10,
                                }}
                              >
                                {index + 1}) {period}
                              </span>
                              {this.state.contract.room_contract.filter(
                                (room) =>
                                  room.room_type === "SGL" &&
                                  room.date ===
                                    period
                                      .split(" - ")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                              ).length === 0 ? (
                                ""
                              ) : (
                                <>
                                  Number of Single Rooms :
                                  {
                                    this.state.contract.room_contract.filter(
                                      (room) =>
                                        room.room_type === "SGL" &&
                                        room.date ===
                                          period
                                            .split(" - ")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    ).length
                                  }
                                  <ChangeNumberOfRooms
                                    object_id={this.state.contract.id}
                                    object_name={this.state.contract.name}
                                    object_type={"Contract"}
                                    update_state={this.update_state}
                                    period={period}
                                    room_type={"SGL"}
                                  />
                                </>
                              )}

                              {this.state.contract.room_contract.filter(
                                (room) =>
                                  room.room_type === "DBL" &&
                                  room.date ===
                                    period
                                      .split(" - ")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                              ).length === 0 ? (
                                ""
                              ) : (
                                <>
                                  Number of Double Rooms :
                                  {
                                    this.state.contract.room_contract.filter(
                                      (room) =>
                                        room.room_type === "DBL" &&
                                        room.date ===
                                          period
                                            .split(" - ")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    ).length
                                  }
                                  <ChangeNumberOfRooms
                                    object_id={this.state.contract.id}
                                    object_name={this.state.contract.name}
                                    object_type={"Contract"}
                                    update_state={this.update_state}
                                    period={period}
                                    room_type={"DBL"}
                                  />
                                </>
                              )}
                              {this.state.contract.room_contract.filter(
                                (room) =>
                                  room.room_type === "TWIN" &&
                                  room.date ===
                                    period
                                      .split(" - ")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                              ).length === 0 ? (
                                ""
                              ) : (
                                <>
                                  Number of Twin Rooms :
                                  {
                                    this.state.contract.room_contract.filter(
                                      (room) =>
                                        room.room_type === "TWIN" &&
                                        room.date ===
                                          period
                                            .split(" - ")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    ).length
                                  }
                                  <ChangeNumberOfRooms
                                    object_id={this.state.contract.id}
                                    object_name={this.state.contract.name}
                                    object_type={"Contract"}
                                    update_state={this.update_state}
                                    period={period}
                                    room_type={"TWIN"}
                                  />
                                </>
                              )}
                              {this.state.contract.room_contract.filter(
                                (room) =>
                                  room.room_type === "TRPL" &&
                                  room.date ===
                                    period
                                      .split(" - ")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                              ).length === 0 ? (
                                ""
                              ) : (
                                <>
                                  Number of Triple Rooms :
                                  {
                                    this.state.contract.room_contract.filter(
                                      (room) =>
                                        room.room_type === "TRPL" &&
                                        room.date ===
                                          period
                                            .split(" - ")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    ).length
                                  }
                                  <ChangeNumberOfRooms
                                    object_id={this.state.contract.id}
                                    object_name={this.state.contract.name}
                                    object_type={"Contract"}
                                    update_state={this.update_state}
                                    period={period}
                                    room_type={"TRPL"}
                                  />
                                </>
                              )}
                              {this.state.contract.room_contract.filter(
                                (room) =>
                                  room.room_type === "QUAD" &&
                                  room.date ===
                                    period
                                      .split(" - ")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")
                              ).length === 0 ? (
                                ""
                              ) : (
                                <>
                                  Number of Quad Rooms :
                                  {
                                    this.state.contract.room_contract.filter(
                                      (room) =>
                                        room.room_type === "QUAD" &&
                                        room.date ===
                                          period
                                            .split(" - ")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-")
                                    ).length
                                  }
                                  <ChangeNumberOfRooms
                                    object_id={this.state.contract.id}
                                    object_name={this.state.contract.name}
                                    object_type={"Contract"}
                                    update_state={this.update_state}
                                    period={period}
                                    room_type={"QUAD"}
                                  />
                                </>
                              )}
                              <hr />
                            </>
                          );
                        })}
                    </Card.Body>
                    <Card.Footer>
                      <StopSales
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                        contract={this.state.contract}
                      />
                    </Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <BsInfoSquare
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Additional Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}> Release Period </div>
                      <div className={"info_span"}>
                        {this.state.contract.release_period ? (
                          <> {this.state.contract.release_period} Days</>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeReleasePeriod
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>Cancellation Limit</div>
                      <div className={"info_span"}>
                        {this.state.contract.cancellation_limit ? (
                          <>{this.state.contract.cancellation_limit} Days</>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeCancellationLimit
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>Cancellation Charge</div>
                      <div className={"info_span"}>
                        {this.state.contract.cancellation_charge ? (
                          <>
                            {this.state.contract.cancellation_charge}
                            {this.state.contract.currency}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeCancellationCharge
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        currency={this.state.contract.currency}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}> Infant Age </div>
                      <div className={"info_span"}>
                        {this.state.contract.infant_age ? (
                          <> {this.state.contract.infant_age} Years</>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeInfantAge
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}> Child Age </div>
                      <div className={"info_span"}>
                        {this.state.contract.child_age ? (
                          <> {this.state.contract.child_age} Years</>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeChildAge
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}> Pricing </div>
                      <div className={"info_span"}>
                        {this.state.contract.pricing ? (
                          <>{pricing_types[this.state.contract.pricing]}</>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangePricing
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>Inclusive Board</div>
                      <div className={"info_span"}>
                        {this.state.contract.inclusive_board ? (
                          <>
                            {
                              incl_board_types[
                                this.state.contract.inclusive_board
                              ]
                            }
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                      <ChangeInclusiveBoard
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                      <div className={"info_descr"}>City Taxes Included</div>
                      <div className={"info_span"}>
                        {this.state.contract.city_taxes_included
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                      <ChangeCityTaxesIncluded
                        object_id={this.state.contract.id}
                        object_name={this.state.contract.name}
                        object_type={"Contract"}
                        update_state={this.update_state}
                      />
                    </Card.Body>
                    <Card.Footer></Card.Footer>
                  </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header>
                      <FaHotel
                        style={{
                          color: "#F3702D",
                          fontSize: "1.5em",
                          marginRight: "0.5em",
                        }}
                      />
                      Hotel Information
                    </Card.Header>
                    <Card.Body>
                      <div className={"info_descr"}> Name </div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.name
                          ? this.state.contract.hotel.name
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Rating </div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.rating
                          ? calculateHotelStars(
                              this.state.contract.hotel.rating
                            )
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Place </div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.place
                          ? this.state.contract.hotel.place.country +
                            " - " +
                            this.state.contract.hotel.place.city
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Address </div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.contact.address
                          ? this.state.contract.hotel.contact.address
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Tel</div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.contact.tel
                          ? this.state.contract.hotel.contact.tel
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Email </div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.contact.email
                          ? this.state.contract.hotel.contact.email
                          : "N/A"}
                      </div>
                      <div className={"info_descr"}> Enabled </div>
                      <div className={"info_span"}>
                        {this.state.contract.hotel.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      {/* Card's Footer */}
                      <small className="mr-auto">
                        To Edit Hotel Information, head over to
                        <br />
                        {/* eslint-disable-next-line */}
                        <a
                          href={
                            "/data_management/hotel/" +
                            this.state.contract.hotel.id
                          }
                          ref="noreferrer"
                          target="_blank"
                        >
                          Data Management / Hotels /
                          {this.state.contract.hotel.name}
                        </a>
                      </small>
                    </Card.Footer>
                  </Card>
                </Grid.Column>
              </Grid>
            </>
          ) : (
            loader()
          )}
        </div>
      </>
    );
  }
}

export default ContractOverView;
